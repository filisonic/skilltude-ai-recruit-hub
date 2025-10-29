/**
 * CV Analysis System - Email Queue Service
 * 
 * Manages delayed email delivery (24-48 hours) with retry logic and status tracking
 */

import { PoolConnection } from 'mysql2/promise';
import { EmailService } from './EmailService';
import { CVAnalysisResult, UserData } from '../types/cv.types';
import { getPool } from '../utils/database';
import logger, { logEmailDelivery } from '../utils/logger';

interface QueuedEmail {
  id: number;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  analysisResults: CVAnalysisResult;
  emailScheduledAt: Date;
  emailAttempts: number;
  emailLastAttemptAt: Date | null;
}

/**
 * Email Queue Service for managing delayed email delivery
 */
export class EmailQueueService {
  private emailService: EmailService;
  private maxRetries = 3;
  private retryDelayMinutes = 30; // Wait 30 minutes between retries
  private defaultDelayHours = 24; // Default delay: 24 hours

  constructor(emailService?: EmailService) {
    this.emailService = emailService || new EmailService();
  }

  /**
   * Queue an email for delayed delivery
   * 
   * @param submissionId - Database ID of the CV submission
   * @param delayHours - Hours to delay email (default: 24)
   * @returns Promise<void>
   */
  async queueEmail(submissionId: number, delayHours: number = this.defaultDelayHours): Promise<void> {
    const connection = await getPool().getConnection();
    
    try {
      const scheduledAt = new Date();
      scheduledAt.setHours(scheduledAt.getHours() + delayHours);

      await connection.execute(
        `UPDATE cv_submissions 
         SET email_status = 'queued',
             email_scheduled_at = ?
         WHERE id = ?`,
        [scheduledAt, submissionId]
      );

      logger.info(`Email queued for submission ${submissionId}`, {
        submissionId,
        scheduledAt: scheduledAt.toISOString(),
        category: 'email_queue',
      });
    } finally {
      connection.release();
    }
  }

  /**
   * Process email queue - send all emails that are due
   * This should be called by a background job/cron
   * 
   * @returns Promise<{ sent: number, failed: number }>
   */
  async processQueue(): Promise<{ sent: number; failed: number }> {
    const connection = await getPool().getConnection();
    let sent = 0;
    let failed = 0;

    try {
      // Get all emails that are due to be sent
      const [rows] = await connection.execute<any[]>(
        `SELECT 
          id, uuid, email, first_name, last_name, phone, 
          analysis_results, email_scheduled_at, email_attempts, email_last_attempt_at
         FROM cv_submissions
         WHERE email_status IN ('queued', 'retrying')
           AND email_scheduled_at <= NOW()
           AND email_attempts < ?
         ORDER BY email_scheduled_at ASC
         LIMIT 100`,
        [this.maxRetries]
      );

      logger.info(`Processing ${rows.length} queued emails`, {
        count: rows.length,
        category: 'email_queue',
      });

      for (const row of rows) {
        const queuedEmail: QueuedEmail = {
          id: row.id,
          uuid: row.uuid,
          email: row.email,
          firstName: row.first_name,
          lastName: row.last_name,
          phone: row.phone,
          analysisResults: typeof row.analysis_results === 'string' 
            ? JSON.parse(row.analysis_results) 
            : row.analysis_results,
          emailScheduledAt: row.email_scheduled_at,
          emailAttempts: row.email_attempts,
          emailLastAttemptAt: row.email_last_attempt_at,
        };

        const success = await this.sendQueuedEmail(queuedEmail, connection);
        
        if (success) {
          sent++;
        } else {
          failed++;
        }
      }

      logger.info(`Email queue processing complete`, {
        sent,
        failed,
        total: rows.length,
        category: 'email_queue',
      });
    } catch (error) {
      logger.error('Error processing email queue', {
        error,
        category: 'email_queue',
      });
    } finally {
      connection.release();
    }

    return { sent, failed };
  }

  /**
   * Send a single queued email
   * 
   * @param queuedEmail - Email data from queue
   * @param connection - Database connection
   * @returns Promise<boolean> - True if sent successfully
   */
  private async sendQueuedEmail(
    queuedEmail: QueuedEmail,
    connection: PoolConnection
  ): Promise<boolean> {
    const attemptNumber = queuedEmail.emailAttempts + 1;
    
    try {
      logger.info(`Attempting to send email`, {
        email: queuedEmail.email,
        attemptNumber,
        maxRetries: this.maxRetries,
        submissionId: queuedEmail.uuid,
        category: 'email_delivery',
      });

      // Update attempt tracking
      await connection.execute(
        `UPDATE cv_submissions 
         SET email_attempts = email_attempts + 1,
             email_last_attempt_at = NOW(),
             email_status = 'retrying'
         WHERE id = ?`,
        [queuedEmail.id]
      );

      // Prepare user data
      const userData: UserData = {
        firstName: queuedEmail.firstName,
        lastName: queuedEmail.lastName,
        email: queuedEmail.email,
        phone: queuedEmail.phone,
      };

      // Send the email
      await this.emailService.sendCVAnalysis(
        queuedEmail.email,
        queuedEmail.analysisResults,
        userData
      );

      // Mark as sent successfully
      await connection.execute(
        `UPDATE cv_submissions 
         SET email_status = 'sent',
             email_sent_at = NOW(),
             email_error = NULL
         WHERE id = ?`,
        [queuedEmail.id]
      );

      logEmailDelivery({
        submissionId: queuedEmail.uuid,
        email: queuedEmail.email,
        success: true,
        attemptNumber,
      });
      
      // Log the successful email attempt
      await this.logEmailAttempt(
        queuedEmail.id,
        attemptNumber,
        'success',
        null,
        connection
      );

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logEmailDelivery({
        submissionId: queuedEmail.uuid,
        email: queuedEmail.email,
        success: false,
        attemptNumber,
        error: errorMessage,
      });

      // Check if we've exhausted retries
      if (attemptNumber >= this.maxRetries) {
        await connection.execute(
          `UPDATE cv_submissions 
           SET email_status = 'failed',
               email_error = ?
           WHERE id = ?`,
          [errorMessage, queuedEmail.id]
        );
        logger.error(`Email marked as failed after max retries`, {
          email: queuedEmail.email,
          submissionId: queuedEmail.uuid,
          attempts: this.maxRetries,
          error: errorMessage,
          category: 'email_delivery',
        });
      } else {
        // Schedule retry
        const nextRetry = new Date();
        nextRetry.setMinutes(nextRetry.getMinutes() + this.retryDelayMinutes);
        
        await connection.execute(
          `UPDATE cv_submissions 
           SET email_status = 'retrying',
               email_scheduled_at = ?,
               email_error = ?
           WHERE id = ?`,
          [nextRetry, errorMessage, queuedEmail.id]
        );
        logger.info(`Email scheduled for retry`, {
          email: queuedEmail.email,
          submissionId: queuedEmail.uuid,
          nextRetry: nextRetry.toISOString(),
          attemptNumber,
          category: 'email_delivery',
        });
      }

      // Log the failed email attempt
      await this.logEmailAttempt(
        queuedEmail.id,
        attemptNumber,
        'failed',
        errorMessage,
        connection
      );

      return false;
    }
  }

  /**
   * Log email attempt for auditing
   * 
   * @param submissionId - CV submission ID
   * @param attemptNumber - Attempt number
   * @param status - Status of attempt
   * @param error - Error message if failed
   * @param connection - Database connection
   */
  private async logEmailAttempt(
    submissionId: number,
    attemptNumber: number,
    status: 'success' | 'failed',
    error: string | null,
    connection: PoolConnection
  ): Promise<void> {
    logger.info(`Email attempt logged`, {
      submissionId,
      attemptNumber,
      status,
      error,
      category: 'email_delivery',
    });
    
    // In production, you might want to store these logs in a separate table
    // For now, we're logging with Winston and updating the main table
  }

  /**
   * Retry a specific failed email immediately
   * 
   * @param submissionId - Database ID of the CV submission
   * @returns Promise<boolean> - True if sent successfully
   */
  async retryFailedEmail(submissionId: number): Promise<boolean> {
    const connection = await getPool().getConnection();
    
    try {
      // Get the submission details
      const [rows] = await connection.execute<any[]>(
        `SELECT 
          id, uuid, email, first_name, last_name, phone, 
          analysis_results, email_attempts
         FROM cv_submissions
         WHERE id = ?
           AND email_status = 'failed'`,
        [submissionId]
      );

      if (rows.length === 0) {
        logger.warn(`No failed email found for retry`, {
          submissionId,
          category: 'email_delivery',
        });
        return false;
      }

      const row = rows[0];
      const queuedEmail: QueuedEmail = {
        id: row.id,
        uuid: row.uuid,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone,
        analysisResults: typeof row.analysis_results === 'string' 
          ? JSON.parse(row.analysis_results) 
          : row.analysis_results,
        emailScheduledAt: new Date(),
        emailAttempts: row.email_attempts,
        emailLastAttemptAt: null,
      };

      // Reset attempts for manual retry
      await connection.execute(
        `UPDATE cv_submissions 
         SET email_attempts = 0,
             email_status = 'retrying'
         WHERE id = ?`,
        [submissionId]
      );

      return await this.sendQueuedEmail(queuedEmail, connection);
    } finally {
      connection.release();
    }
  }

  /**
   * Get queue statistics
   * 
   * @returns Promise<QueueStats>
   */
  async getQueueStats(): Promise<{
    pending: number;
    queued: number;
    sent: number;
    failed: number;
    retrying: number;
  }> {
    const connection = await getPool().getConnection();
    
    try {
      const [rows] = await connection.execute<any[]>(
        `SELECT 
          email_status,
          COUNT(*) as count
         FROM cv_submissions
         GROUP BY email_status`
      );

      const stats = {
        pending: 0,
        queued: 0,
        sent: 0,
        failed: 0,
        retrying: 0,
      };

      for (const row of rows as any[]) {
        const status = row.email_status as keyof typeof stats;
        if (status in stats) {
          stats[status] = row.count;
        }
      }

      return stats;
    } finally {
      connection.release();
    }
  }

  /**
   * Get failed emails for admin review
   * 
   * @param limit - Maximum number of results
   * @returns Promise<FailedEmail[]>
   */
  async getFailedEmails(limit: number = 50): Promise<Array<{
    id: number;
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    emailAttempts: number;
    emailError: string;
    emailLastAttemptAt: Date;
    submittedAt: Date;
  }>> {
    const connection = await getPool().getConnection();
    
    try {
      const [rows] = await connection.execute<any[]>(
        `SELECT 
          id, uuid, email, first_name, last_name,
          email_attempts, email_error, email_last_attempt_at, submitted_at
         FROM cv_submissions
         WHERE email_status = 'failed'
         ORDER BY email_last_attempt_at DESC
         LIMIT ?`,
        [limit]
      );

      return rows.map(row => ({
        id: row.id,
        uuid: row.uuid,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        emailAttempts: row.email_attempts,
        emailError: row.email_error,
        emailLastAttemptAt: row.email_last_attempt_at,
        submittedAt: row.submitted_at,
      }));
    } finally {
      connection.release();
    }
  }
}

export default EmailQueueService;
