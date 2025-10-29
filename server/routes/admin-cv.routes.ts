/**
 * Admin CV Management Routes
 */

import express, { Request, Response, NextFunction } from 'express';
import { body, query as validateQuery, param, validationResult } from 'express-validator';
import { authenticate, requireRole } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';
import { query } from '../utils/database.js';
import { CVUploadException, ErrorCodes, logError } from '../utils/errors.js';
import { FileStorageService } from '../services/FileStorageService.js';
import logger, { logFileOperation } from '../utils/logger.js';
import {
  CVSubmission,
  CVSubmissionDetail,
  CVSubmissionsQuery,
  CVSubmissionsResponse,
  CVSubmissionUpdate,
  CVAnalysisResult,
} from '../types/cv.types.js';
import path from 'path';
import fs from 'fs/promises';
import { sanitizeSearchQuery, sanitizeNotes } from '../utils/sanitization.js';
import { logFileDownload, logAdminAction, validateFileAccess } from '../utils/accessControl.js';

const router = express.Router();
const fileStorage = new FileStorageService();

// ============================================================================
// Validation Rules
// ============================================================================

const listValidationRules = [
  validateQuery('status')
    .optional()
    .isIn(['new', 'reviewed', 'contacted', 'hired', 'rejected'])
    .withMessage('Invalid status value'),
  
  validateQuery('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Search query too long'),
  
  validateQuery('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  validateQuery('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  validateQuery('sortBy')
    .optional()
    .isIn(['submitted_at', 'updated_at', 'status'])
    .withMessage('Invalid sortBy value'),
  
  validateQuery('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sortOrder value'),
];

const updateValidationRules = [
  body('status')
    .optional()
    .isIn(['new', 'reviewed', 'contacted', 'hired', 'rejected'])
    .withMessage('Invalid status value'),
  
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Admin notes too long (max 5000 characters)'),
  
  body('convertedToPremium')
    .optional()
    .isBoolean()
    .withMessage('convertedToPremium must be a boolean'),
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse analysis results from JSON
 */
function parseAnalysisResults(analysisJson: string | null): CVAnalysisResult | undefined {
  if (!analysisJson) return undefined;
  
  try {
    return JSON.parse(analysisJson);
  } catch (error) {
    console.error('Failed to parse analysis results:', error);
    return undefined;
  }
}

/**
 * Format submission for response
 */
function formatSubmission(row: any): CVSubmission {
  return {
    id: row.id,
    uuid: row.uuid,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    cvFilename: row.cv_filename,
    cvFilePath: row.cv_file_path,
    status: row.status,
    analysisScore: row.analysis_score,
    analysisResults: parseAnalysisResults(row.analysis_results),
    emailSentAt: row.email_sent_at,
    emailOpenedAt: row.email_opened_at,
    convertedToPremium: row.converted_to_premium === 1,
    conversionDate: row.conversion_date,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    reviewedBy: row.reviewed_by,
    adminNotes: row.admin_notes,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/admin/cv-submissions
 * Retrieve list of CV submissions with filtering, search, pagination, and sorting
 */
router.get(
  '/cv-submissions',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),
  adminLimiter,
  listValidationRules,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }
      
      // Extract query parameters
      const queryParams: CVSubmissionsQuery = {
        status: req.query.status as any,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        sortBy: (req.query.sortBy as any) || 'submitted_at',
        sortOrder: (req.query.sortOrder as any) || 'desc',
      };
      
      // Build WHERE clause
      const whereClauses: string[] = [];
      const queryValues: any[] = [];
      
      if (queryParams.status) {
        whereClauses.push('status = ?');
        queryValues.push(queryParams.status);
      }
      
      if (queryParams.search) {
        // Sanitize search query to prevent SQL injection
        const sanitizedSearch = sanitizeSearchQuery(queryParams.search);
        whereClauses.push(
          '(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)'
        );
        const searchPattern = `%${sanitizedSearch}%`;
        queryValues.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }
      
      const whereClause = whereClauses.length > 0 
        ? `WHERE ${whereClauses.join(' AND ')}` 
        : '';
      
      // Get total count
      const countResult = await query(
        `SELECT COUNT(*) as total FROM cv_submissions ${whereClause}`,
        queryValues
      );
      const total = countResult[0].total;
      
      // Calculate pagination
      const totalPages = Math.ceil(total / queryParams.limit!);
      const offset = (queryParams.page! - 1) * queryParams.limit!;
      
      // Build ORDER BY clause
      const orderByClause = `ORDER BY ${queryParams.sortBy} ${queryParams.sortOrder}`;
      
      // Get submissions
      const submissions = await query(
        `SELECT 
          id, uuid, first_name, last_name, email, phone,
          cv_filename, cv_file_path, cv_file_size, cv_mime_type,
          status, analysis_score, analysis_results,
          email_sent_at, email_opened_at,
          converted_to_premium, conversion_date,
          submitted_at, reviewed_at, reviewed_by, admin_notes,
          ip_address, user_agent, created_at, updated_at
         FROM cv_submissions
         ${whereClause}
         ${orderByClause}
         LIMIT ? OFFSET ?`,
        [...queryValues, queryParams.limit, offset]
      );
      
      // Format response
      const response: CVSubmissionsResponse = {
        submissions: submissions.map(formatSubmission),
        total,
        page: queryParams.page!,
        totalPages,
      };
      
      res.json(response);
      
    } catch (error) {
      logError(error, {
        endpoint: 'GET /api/admin/cv-submissions',
        userId: req.user?.id?.toString(),
        query: req.query,
      });
      next(error);
    }
  }
);

/**
 * GET /api/admin/cv-submissions/analytics
 * Get analytics data for CV submissions and conversions
 */
router.get(
  '/cv-submissions/analytics',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),
  adminLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get overall statistics
      const overallStats = await query(`
        SELECT 
          COUNT(*) as totalSubmissions,
          COUNT(CASE WHEN status = 'new' THEN 1 END) as newSubmissions,
          COUNT(CASE WHEN status = 'reviewed' THEN 1 END) as reviewedSubmissions,
          COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contactedSubmissions,
          COUNT(CASE WHEN status = 'hired' THEN 1 END) as hiredSubmissions,
          COUNT(CASE WHEN converted_to_premium = 1 THEN 1 END) as totalConversions,
          ROUND(AVG(analysis_score), 2) as averageScore,
          ROUND(
            (COUNT(CASE WHEN converted_to_premium = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)),
            2
          ) as conversionRate
        FROM cv_submissions
      `);

      // Get monthly statistics for the last 12 months
      const monthlyStats = await query(`
        SELECT 
          DATE_FORMAT(submitted_at, '%Y-%m') as month,
          COUNT(*) as submissions,
          COUNT(CASE WHEN converted_to_premium = 1 THEN 1 END) as conversions,
          ROUND(
            (COUNT(CASE WHEN converted_to_premium = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)),
            2
          ) as conversionRate,
          ROUND(AVG(analysis_score), 2) as averageScore
        FROM cv_submissions
        WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(submitted_at, '%Y-%m')
        ORDER BY month DESC
      `);

      // Get conversion timeline (last 30 days)
      const conversionTimeline = await query(`
        SELECT 
          DATE(conversion_date) as date,
          COUNT(*) as conversions
        FROM cv_submissions
        WHERE converted_to_premium = 1
          AND conversion_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(conversion_date)
        ORDER BY date DESC
      `);

      // Get score distribution
      const scoreDistribution = await query(`
        SELECT 
          CASE 
            WHEN analysis_score >= 90 THEN '90-100'
            WHEN analysis_score >= 80 THEN '80-89'
            WHEN analysis_score >= 70 THEN '70-79'
            WHEN analysis_score >= 60 THEN '60-69'
            WHEN analysis_score >= 50 THEN '50-59'
            ELSE '0-49'
          END as scoreRange,
          COUNT(*) as count,
          COUNT(CASE WHEN converted_to_premium = 1 THEN 1 END) as conversions
        FROM cv_submissions
        WHERE analysis_score IS NOT NULL
        GROUP BY scoreRange
        ORDER BY scoreRange DESC
      `);

      // Get recent conversions
      const recentConversions = await query(`
        SELECT 
          id, uuid, first_name, last_name, email,
          analysis_score, conversion_date, submitted_at
        FROM cv_submissions
        WHERE converted_to_premium = 1
        ORDER BY conversion_date DESC
        LIMIT 10
      `);

      res.json({
        overall: overallStats[0],
        monthly: monthlyStats,
        conversionTimeline,
        scoreDistribution,
        recentConversions: recentConversions.map((row: any) => ({
          id: row.id,
          uuid: row.uuid,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          analysisScore: row.analysis_score,
          conversionDate: row.conversion_date,
          submittedAt: row.submitted_at,
        })),
      });

    } catch (error) {
      logError(error, {
        endpoint: 'GET /api/admin/cv-submissions/analytics',
        userId: req.user?.id?.toString(),
      });
      next(error);
    }
  }
);

/**
 * GET /api/admin/cv-submissions/:id
 * Retrieve detailed information for a specific CV submission
 */
router.get(
  '/cv-submissions/:id',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),
  adminLimiter,
  param('id').isInt({ min: 1 }).withMessage('Invalid submission ID'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }
      
      const submissionId = parseInt(req.params.id);
      
      // Get submission details
      const submissions = await query(
        `SELECT 
          id, uuid, first_name, last_name, email, phone,
          cv_filename, cv_file_path, cv_file_size, cv_mime_type,
          status, analysis_score, analysis_results,
          email_sent_at, email_opened_at,
          converted_to_premium, conversion_date,
          submitted_at, reviewed_at, reviewed_by, admin_notes,
          ip_address, user_agent, created_at, updated_at
         FROM cv_submissions
         WHERE id = ?`,
        [submissionId]
      );
      
      if (!submissions || submissions.length === 0) {
        throw new CVUploadException(
          ErrorCodes.NOT_FOUND,
          'CV submission not found',
          404
        );
      }
      
      const submission = formatSubmission(submissions[0]);
      
      // Ensure analysis results are included
      const detailSubmission: CVSubmissionDetail = {
        ...submission,
        analysisResults: submission.analysisResults || {
          overallScore: 0,
          strengths: [],
          improvements: [],
          atsCompatibility: 0,
          sectionCompleteness: {
            contactInfo: false,
            summary: false,
            experience: false,
            education: false,
            skills: false,
          },
          detailedFeedback: 'Analysis not available',
          analyzedAt: new Date(),
        },
      };
      
      res.json(detailSubmission);
      
    } catch (error) {
      logError(error, {
        endpoint: 'GET /api/admin/cv-submissions/:id',
        userId: req.user?.id?.toString(),
        submissionId: req.params.id,
      });
      next(error);
    }
  }
);

/**
 * PUT /api/admin/cv-submissions/:id
 * Update CV submission status and admin notes
 */
router.put(
  '/cv-submissions/:id',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),
  adminLimiter,
  param('id').isInt({ min: 1 }).withMessage('Invalid submission ID'),
  updateValidationRules,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }
      
      const submissionId = parseInt(req.params.id);
      const updateData: CVSubmissionUpdate = {
        status: req.body.status,
        adminNotes: req.body.adminNotes,
        convertedToPremium: req.body.convertedToPremium,
      };
      
      // Check if submission exists
      const existing = await query(
        'SELECT id FROM cv_submissions WHERE id = ?',
        [submissionId]
      );
      
      if (!existing || existing.length === 0) {
        throw new CVUploadException(
          ErrorCodes.NOT_FOUND,
          'CV submission not found',
          404
        );
      }
      
      // Build update query
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      
      if (updateData.status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(updateData.status);
      }
      
      if (updateData.adminNotes !== undefined) {
        // Sanitize admin notes to prevent XSS
        const sanitizedNotes = sanitizeNotes(updateData.adminNotes);
        updateFields.push('admin_notes = ?');
        updateValues.push(sanitizedNotes);
      }
      
      if (updateData.convertedToPremium !== undefined) {
        updateFields.push('converted_to_premium = ?');
        updateValues.push(updateData.convertedToPremium);
        
        // If marking as converted, set conversion date
        if (updateData.convertedToPremium) {
          updateFields.push('conversion_date = NOW()');
        }
      }
      
      // Always update reviewed_at, reviewed_by, and updated_at
      updateFields.push('reviewed_at = NOW()');
      updateFields.push('reviewed_by = ?');
      updateValues.push(req.user!.username);
      
      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid fields to update',
        });
      }
      
      // Perform update
      updateValues.push(submissionId);
      await query(
        `UPDATE cv_submissions 
         SET ${updateFields.join(', ')}
         WHERE id = ?`,
        updateValues
      );
      
      // Log admin action for audit trail
      logAdminAction(
        req,
        'UPDATE_CV_SUBMISSION',
        'cv_submission',
        submissionId,
        {
          updates: updateData,
          previousStatus: existing[0].status,
        }
      );
      
      // Get updated submission
      const updated = await query(
        `SELECT 
          id, uuid, first_name, last_name, email, phone,
          cv_filename, cv_file_path, cv_file_size, cv_mime_type,
          status, analysis_score, analysis_results,
          email_sent_at, email_opened_at,
          converted_to_premium, conversion_date,
          submitted_at, reviewed_at, reviewed_by, admin_notes,
          ip_address, user_agent, created_at, updated_at
         FROM cv_submissions
         WHERE id = ?`,
        [submissionId]
      );
      
      res.json({
        success: true,
        message: 'CV submission updated successfully',
        submission: formatSubmission(updated[0]),
      });
      
    } catch (error) {
      logError(error, {
        endpoint: 'PUT /api/admin/cv-submissions/:id',
        userId: req.user?.id?.toString(),
        submissionId: req.params.id,
        updateData: req.body,
      });
      next(error);
    }
  }
);

/**
 * GET /api/admin/cv-submissions/:id/download
 * Download the original CV file
 */
router.get(
  '/cv-submissions/:id/download',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),
  adminLimiter,
  param('id').isInt({ min: 1 }).withMessage('Invalid submission ID'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }
      
      const submissionId = parseInt(req.params.id);
      
      // Get submission details
      const submissions = await query(
        `SELECT id, cv_filename, cv_file_path, cv_mime_type, first_name, last_name
         FROM cv_submissions
         WHERE id = ?`,
        [submissionId]
      );
      
      if (!submissions || submissions.length === 0) {
        throw new CVUploadException(
          ErrorCodes.NOT_FOUND,
          'CV submission not found',
          404
        );
      }
      
      const submission = submissions[0];
      const filePath = submission.cv_file_path;
      
      // Verify file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        console.error(`File not found: ${filePath}`);
        throw new CVUploadException(
          ErrorCodes.NOT_FOUND,
          'CV file not found on server',
          404
        );
      }
      
      // Validate file access permissions
      const accessValidation = validateFileAccess(req);
      if (!accessValidation.allowed) {
        logFileDownload(
          req,
          {
            submissionId,
            filename: submission.cv_filename,
            candidateName: `${submission.first_name} ${submission.last_name}`,
            candidateEmail: submission.email,
          },
          false,
          accessValidation.reason
        );
        
        throw new CVUploadException(
          ErrorCodes.UNAUTHORIZED,
          'Access denied: ' + accessValidation.reason,
          403
        );
      }
      
      // Log successful file access for security audit trail
      logFileDownload(req, {
        submissionId,
        filename: submission.cv_filename,
        candidateName: `${submission.first_name} ${submission.last_name}`,
        candidateEmail: submission.email,
      });
      
      // Set appropriate headers for file download
      const originalFilename = submission.cv_filename;
      const downloadFilename = `${submission.first_name}_${submission.last_name}_CV${path.extname(originalFilename)}`;
      
      res.setHeader('Content-Type', submission.cv_mime_type);
      res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      
      // Stream file to response
      const fileBuffer = await fs.readFile(filePath);
      res.send(fileBuffer);
      
    } catch (error) {
      logError(error, {
        endpoint: 'GET /api/admin/cv-submissions/:id/download',
        userId: req.user?.id?.toString(),
        submissionId: req.params.id,
      });
      next(error);
    }
  }
);

/**
 * GET /api/admin/cv-submissions/email-queue/stats
 * Get email queue statistics
 */
router.get(
  '/cv-submissions/email-queue/stats',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),
  adminLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get email status statistics
      const stats = await query(`
        SELECT 
          email_status,
          COUNT(*) as count
        FROM cv_submissions
        GROUP BY email_status
      `);

      // Format statistics
      const formattedStats = {
        pending: 0,
        queued: 0,
        sent: 0,
        failed: 0,
        retrying: 0,
      };

      stats.forEach((row: any) => {
        const status = row.email_status as keyof typeof formattedStats;
        if (status in formattedStats) {
          formattedStats[status] = row.count;
        }
      });

      // Get additional metrics
      const metrics = await query(`
        SELECT 
          COUNT(CASE WHEN email_status = 'sent' AND email_sent_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as sentLast24Hours,
          COUNT(CASE WHEN email_status = 'failed' THEN 1 END) as totalFailed,
          COUNT(CASE WHEN email_status = 'retrying' THEN 1 END) as currentlyRetrying,
          COUNT(CASE WHEN email_scheduled_at <= NOW() AND email_status IN ('queued', 'retrying') THEN 1 END) as dueNow,
          AVG(CASE WHEN email_status = 'sent' THEN email_attempts END) as avgAttemptsForSuccess
        FROM cv_submissions
      `);

      res.json({
        success: true,
        stats: formattedStats,
        metrics: {
          sentLast24Hours: metrics[0].sentLast24Hours || 0,
          totalFailed: metrics[0].totalFailed || 0,
          currentlyRetrying: metrics[0].currentlyRetrying || 0,
          dueNow: metrics[0].dueNow || 0,
          avgAttemptsForSuccess: parseFloat(metrics[0].avgAttemptsForSuccess || 0).toFixed(2),
        },
      });
    } catch (error) {
      logError(error, {
        endpoint: 'GET /api/admin/cv-submissions/email-queue/stats',
        userId: req.user?.id?.toString(),
      });
      next(error);
    }
  }
);

/**
 * GET /api/admin/cv-submissions/email-queue/failed
 * Get list of failed email deliveries
 */
router.get(
  '/cv-submissions/email-queue/failed',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),
  adminLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;

      const failedEmails = await query(
        `SELECT 
          id, uuid, email, first_name, last_name,
          email_attempts, email_error, email_last_attempt_at,
          email_scheduled_at, submitted_at, analysis_score
         FROM cv_submissions
         WHERE email_status = 'failed'
         ORDER BY email_last_attempt_at DESC
         LIMIT ?`,
        [limit]
      );

      res.json({
        success: true,
        failedEmails: failedEmails.map((row: any) => ({
          id: row.id,
          uuid: row.uuid,
          email: row.email,
          firstName: row.first_name,
          lastName: row.last_name,
          emailAttempts: row.email_attempts,
          emailError: row.email_error,
          emailLastAttemptAt: row.email_last_attempt_at,
          emailScheduledAt: row.email_scheduled_at,
          submittedAt: row.submitted_at,
          analysisScore: row.analysis_score,
        })),
        total: failedEmails.length,
      });
    } catch (error) {
      logError(error, {
        endpoint: 'GET /api/admin/cv-submissions/email-queue/failed',
        userId: req.user?.id?.toString(),
      });
      next(error);
    }
  }
);

/**
 * POST /api/admin/cv-submissions/:id/retry-email
 * Manually retry a failed email delivery
 */
router.post(
  '/cv-submissions/:id/retry-email',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),
  adminLimiter,
  param('id').isInt().withMessage('Invalid submission ID'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const submissionId = parseInt(req.params.id);

      // Import EmailQueueService dynamically to avoid circular dependencies
      const { EmailQueueService } = await import('../services/EmailQueueService');
      const emailQueueService = new EmailQueueService();

      // Retry the failed email
      const success = await emailQueueService.retryFailedEmail(submissionId);

      if (success) {
        // Log admin action
        logAdminAction(
          req,
          'retry_email',
          'cv_submission',
          submissionId,
          { result: 'success' },
          true
        );

        res.json({
          success: true,
          message: 'Email retry successful',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'No failed email found for this submission or retry failed',
        });
      }
    } catch (error) {
      logError(error, {
        endpoint: 'POST /api/admin/cv-submissions/:id/retry-email',
        userId: req.user?.id?.toString(),
        submissionId: req.params.id,
      });
      next(error);
    }
  }
);

/**
 * POST /api/admin/cv-submissions/email-queue/process
 * Manually trigger email queue processing
 */
router.post(
  '/cv-submissions/email-queue/process',
  authenticate,
  requireRole('super_admin', 'admin'),
  adminLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Import EmailQueueService dynamically
      const { EmailQueueService } = await import('../services/EmailQueueService');
      const emailQueueService = new EmailQueueService();

      // Process the queue
      const result = await emailQueueService.processQueue();

      // Log admin action
      logAdminAction(
        req,
        'process_email_queue',
        'email_queue',
        0,
        { sent: result.sent, failed: result.failed },
        true
      );

      res.json({
        success: true,
        message: 'Email queue processed',
        result: {
          sent: result.sent,
          failed: result.failed,
        },
      });
    } catch (error) {
      logError(error, {
        endpoint: 'POST /api/admin/cv-submissions/email-queue/process',
        userId: req.user?.id?.toString(),
      });
      next(error);
    }
  }
);

export default router;
