/**
 * Monitoring Service
 * Tracks system metrics and performance indicators
 */

import { query } from '../utils/database';
import logger from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';

export interface SystemMetrics {
  uploadMetrics: UploadMetrics;
  analysisMetrics: AnalysisMetrics;
  emailMetrics: EmailMetrics;
  storageMetrics: StorageMetrics;
  apiMetrics: APIMetrics;
  timestamp: Date;
}

export interface UploadMetrics {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  averageProcessingTime: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
}

export interface AnalysisMetrics {
  total: number;
  averageScore: number;
  averageProcessingTime: number;
  scoreDistribution: {
    excellent: number; // 85-100
    good: number; // 70-84
    average: number; // 50-69
    poor: number; // 0-49
  };
}

export interface EmailMetrics {
  queued: number;
  sent: number;
  failed: number;
  retrying: number;
  deliveryRate: number;
  averageDeliveryTime: number;
}

export interface StorageMetrics {
  totalFiles: number;
  totalSize: number; // bytes
  averageFileSize: number;
  availableSpace: number;
  usagePercentage: number;
}

export interface APIMetrics {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  rateLimitHits: number;
}

export interface TimeSeriesData {
  date: string;
  uploads: number;
  analyses: number;
  emailsSent: number;
}

export class MonitoringService {
  /**
   * Get comprehensive system metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const [
        uploadMetrics,
        analysisMetrics,
        emailMetrics,
        storageMetrics,
        apiMetrics,
      ] = await Promise.all([
        this.getUploadMetrics(),
        this.getAnalysisMetrics(),
        this.getEmailMetrics(),
        this.getStorageMetrics(),
        this.getAPIMetrics(),
      ]);

      return {
        uploadMetrics,
        analysisMetrics,
        emailMetrics,
        storageMetrics,
        apiMetrics,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Failed to get system metrics', {
        error,
        category: 'monitoring',
      });
      throw error;
    }
  }

  /**
   * Get upload metrics
   */
  private async getUploadMetrics(): Promise<UploadMetrics> {
    const [totalResult] = await query(
      'SELECT COUNT(*) as total FROM cv_submissions'
    );

    const [successResult] = await query(
      `SELECT COUNT(*) as successful FROM cv_submissions 
       WHERE status != 'failed'`
    );

    const [last24Result] = await query(
      `SELECT COUNT(*) as count FROM cv_submissions 
       WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`
    );

    const [last7Result] = await query(
      `SELECT COUNT(*) as count FROM cv_submissions 
       WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
    );

    const [last30Result] = await query(
      `SELECT COUNT(*) as count FROM cv_submissions 
       WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    const total = totalResult[0]?.total || 0;
    const successful = successResult[0]?.successful || 0;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    return {
      total,
      successful,
      failed,
      successRate: Math.round(successRate * 100) / 100,
      averageProcessingTime: 0, // Would need to track this in logs
      last24Hours: last24Result[0]?.count || 0,
      last7Days: last7Result[0]?.count || 0,
      last30Days: last30Result[0]?.count || 0,
    };
  }

  /**
   * Get analysis metrics
   */
  private async getAnalysisMetrics(): Promise<AnalysisMetrics> {
    const [totalResult] = await query(
      `SELECT COUNT(*) as total FROM cv_submissions 
       WHERE analysis_score IS NOT NULL`
    );

    const [avgScoreResult] = await query(
      `SELECT AVG(analysis_score) as avgScore FROM cv_submissions 
       WHERE analysis_score IS NOT NULL`
    );

    const [distributionResult] = await query(
      `SELECT 
        SUM(CASE WHEN analysis_score >= 85 THEN 1 ELSE 0 END) as excellent,
        SUM(CASE WHEN analysis_score >= 70 AND analysis_score < 85 THEN 1 ELSE 0 END) as good,
        SUM(CASE WHEN analysis_score >= 50 AND analysis_score < 70 THEN 1 ELSE 0 END) as average,
        SUM(CASE WHEN analysis_score < 50 THEN 1 ELSE 0 END) as poor
       FROM cv_submissions 
       WHERE analysis_score IS NOT NULL`
    );

    return {
      total: totalResult[0]?.total || 0,
      averageScore: Math.round((avgScoreResult[0]?.avgScore || 0) * 100) / 100,
      averageProcessingTime: 0, // Would need to track this in logs
      scoreDistribution: {
        excellent: distributionResult[0]?.excellent || 0,
        good: distributionResult[0]?.good || 0,
        average: distributionResult[0]?.average || 0,
        poor: distributionResult[0]?.poor || 0,
      },
    };
  }

  /**
   * Get email metrics
   */
  private async getEmailMetrics(): Promise<EmailMetrics> {
    const [statusCounts] = await query(
      `SELECT 
        SUM(CASE WHEN email_status = 'queued' THEN 1 ELSE 0 END) as queued,
        SUM(CASE WHEN email_status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN email_status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN email_status = 'retrying' THEN 1 ELSE 0 END) as retrying
       FROM cv_submissions`
    );

    const queued = statusCounts[0]?.queued || 0;
    const sent = statusCounts[0]?.sent || 0;
    const failed = statusCounts[0]?.failed || 0;
    const retrying = statusCounts[0]?.retrying || 0;
    const total = sent + failed;
    const deliveryRate = total > 0 ? (sent / total) * 100 : 0;

    return {
      queued,
      sent,
      failed,
      retrying,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      averageDeliveryTime: 0, // Would need to calculate from timestamps
    };
  }

  /**
   * Get storage metrics
   */
  private async getStorageMetrics(): Promise<StorageMetrics> {
    const [fileStats] = await query(
      `SELECT 
        COUNT(*) as totalFiles,
        SUM(cv_file_size) as totalSize,
        AVG(cv_file_size) as avgSize
       FROM cv_submissions 
       WHERE cv_file_size IS NOT NULL`
    );

    const totalFiles = fileStats[0]?.totalFiles || 0;
    const totalSize = fileStats[0]?.totalSize || 0;
    const averageFileSize = fileStats[0]?.avgSize || 0;

    // Try to get available disk space (this is platform-specific)
    let availableSpace = 0;
    let usagePercentage = 0;

    try {
      // This would need platform-specific implementation
      // For now, return placeholder values
      availableSpace = 10 * 1024 * 1024 * 1024; // 10GB placeholder
      usagePercentage = (totalSize / availableSpace) * 100;
    } catch (error) {
      logger.warn('Could not determine available disk space', {
        error,
        category: 'monitoring',
      });
    }

    return {
      totalFiles,
      totalSize,
      averageFileSize: Math.round(averageFileSize),
      availableSpace,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
    };
  }

  /**
   * Get API metrics
   */
  private async getAPIMetrics(): Promise<APIMetrics> {
    // These metrics would typically come from log analysis
    // For now, return placeholder values
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
      rateLimitHits: 0,
    };
  }

  /**
   * Get time series data for charts
   */
  async getTimeSeriesData(days: number = 30): Promise<TimeSeriesData[]> {
    const result = await query(
      `SELECT 
        DATE(submitted_at) as date,
        COUNT(*) as uploads,
        SUM(CASE WHEN analysis_score IS NOT NULL THEN 1 ELSE 0 END) as analyses,
        SUM(CASE WHEN email_status = 'sent' THEN 1 ELSE 0 END) as emailsSent
       FROM cv_submissions
       WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(submitted_at)
       ORDER BY date ASC`,
      [days]
    );

    return result.map((row: any) => ({
      date: row.date,
      uploads: row.uploads || 0,
      analyses: row.analyses || 0,
      emailsSent: row.emailsSent || 0,
    }));
  }

  /**
   * Get recent errors from logs
   */
  async getRecentErrors(limit: number = 50): Promise<any[]> {
    try {
      const errorLogPath = path.join(process.cwd(), 'logs', 'error.log');
      const content = await fs.readFile(errorLogPath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      // Parse last N lines
      const recentLines = lines.slice(-limit);
      const errors = recentLines.map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return { message: line };
        }
      });

      return errors.reverse(); // Most recent first
    } catch (error) {
      logger.warn('Could not read error log', {
        error,
        category: 'monitoring',
      });
      return [];
    }
  }

  /**
   * Get system health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: {
      database: boolean;
      storage: boolean;
      email: boolean;
    };
    issues: string[];
  }> {
    const issues: string[] = [];
    const checks = {
      database: false,
      storage: false,
      email: false,
    };

    // Check database
    try {
      await query('SELECT 1');
      checks.database = true;
    } catch (error) {
      issues.push('Database connection failed');
    }

    // Check storage
    try {
      const uploadDir = config.storage.uploadDir;
      await fs.access(uploadDir);
      checks.storage = true;
    } catch (error) {
      issues.push('Storage directory not accessible');
    }

    // Check email queue
    try {
      const emailMetrics = await this.getEmailMetrics();
      if (emailMetrics.deliveryRate < 80 && emailMetrics.sent > 10) {
        issues.push('Email delivery rate below 80%');
      }
      checks.email = emailMetrics.deliveryRate > 0 || emailMetrics.sent === 0;
    } catch (error) {
      issues.push('Email metrics unavailable');
    }

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (issues.length === 0) {
      status = 'healthy';
    } else if (issues.length <= 1) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      checks,
      issues,
    };
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(): Promise<{
    avgUploadTime: number;
    avgAnalysisTime: number;
    avgEmailDeliveryTime: number;
    slowestOperations: Array<{
      operation: string;
      duration: number;
      timestamp: Date;
    }>;
  }> {
    // These would typically come from log analysis
    // For now, return placeholder values
    return {
      avgUploadTime: 0,
      avgAnalysisTime: 0,
      avgEmailDeliveryTime: 0,
      slowestOperations: [],
    };
  }
}

export default new MonitoringService();
