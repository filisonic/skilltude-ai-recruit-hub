/**
 * Alerting Service
 * Monitors system metrics and sends alerts for critical issues
 */

import monitoringService from './MonitoringService';
import logger from '../utils/logger';
import nodemailer from 'nodemailer';
import { config } from '../config';

export interface AlertConfig {
  uploadFailureRateThreshold: number; // percentage
  emailDeliveryRateThreshold: number; // percentage
  storageUsageThreshold: number; // percentage
  alertRecipients: string[]; // email addresses
  alertCooldownMinutes: number; // minimum time between same alert type
}

export interface Alert {
  type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: any;
  timestamp: Date;
}

export enum AlertType {
  HIGH_UPLOAD_FAILURE_RATE = 'HIGH_UPLOAD_FAILURE_RATE',
  LOW_EMAIL_DELIVERY_RATE = 'LOW_EMAIL_DELIVERY_RATE',
  HIGH_STORAGE_USAGE = 'HIGH_STORAGE_USAGE',
  DATABASE_CONNECTION_FAILED = 'DATABASE_CONNECTION_FAILED',
  STORAGE_INACCESSIBLE = 'STORAGE_INACCESSIBLE',
  EMAIL_SERVICE_DOWN = 'EMAIL_SERVICE_DOWN',
  SYSTEM_UNHEALTHY = 'SYSTEM_UNHEALTHY',
}

export class AlertingService {
  private config: AlertConfig;
  private lastAlertTimes: Map<AlertType, Date>;
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.config = {
      uploadFailureRateThreshold: 10, // Alert if > 10% failure rate
      emailDeliveryRateThreshold: 90, // Alert if < 90% delivery rate
      storageUsageThreshold: 80, // Alert if > 80% storage used
      alertRecipients: process.env.ALERT_RECIPIENTS?.split(',') || [],
      alertCooldownMinutes: 60, // Don't send same alert more than once per hour
    };

    this.lastAlertTimes = new Map();

    // Initialize email transporter if configured
    if (process.env.SMTP_HOST && this.config.alertRecipients.length > 0) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  /**
   * Check all metrics and send alerts if thresholds are exceeded
   */
  async checkAndAlert(): Promise<Alert[]> {
    const alerts: Alert[] = [];

    try {
      // Get current metrics
      const metrics = await monitoringService.getSystemMetrics();
      const health = await monitoringService.getHealthStatus();

      // Check upload failure rate
      const uploadFailureRate = 100 - metrics.uploadMetrics.successRate;
      if (uploadFailureRate > this.config.uploadFailureRateThreshold) {
        const alert: Alert = {
          type: AlertType.HIGH_UPLOAD_FAILURE_RATE,
          severity: uploadFailureRate > 20 ? 'critical' : 'high',
          message: `Upload failure rate is ${uploadFailureRate.toFixed(1)}%`,
          details: {
            failureRate: uploadFailureRate,
            threshold: this.config.uploadFailureRateThreshold,
            totalUploads: metrics.uploadMetrics.total,
            failedUploads: metrics.uploadMetrics.failed,
          },
          timestamp: new Date(),
        };
        alerts.push(alert);
      }

      // Check email delivery rate
      if (
        metrics.emailMetrics.deliveryRate < this.config.emailDeliveryRateThreshold &&
        metrics.emailMetrics.sent > 10 // Only alert if we have meaningful data
      ) {
        const alert: Alert = {
          type: AlertType.LOW_EMAIL_DELIVERY_RATE,
          severity: metrics.emailMetrics.deliveryRate < 80 ? 'critical' : 'high',
          message: `Email delivery rate is ${metrics.emailMetrics.deliveryRate.toFixed(1)}%`,
          details: {
            deliveryRate: metrics.emailMetrics.deliveryRate,
            threshold: this.config.emailDeliveryRateThreshold,
            sent: metrics.emailMetrics.sent,
            failed: metrics.emailMetrics.failed,
            retrying: metrics.emailMetrics.retrying,
          },
          timestamp: new Date(),
        };
        alerts.push(alert);
      }

      // Check storage usage
      if (metrics.storageMetrics.usagePercentage > this.config.storageUsageThreshold) {
        const alert: Alert = {
          type: AlertType.HIGH_STORAGE_USAGE,
          severity: metrics.storageMetrics.usagePercentage > 95 ? 'critical' : 'medium',
          message: `Storage usage is ${metrics.storageMetrics.usagePercentage.toFixed(1)}%`,
          details: {
            usagePercentage: metrics.storageMetrics.usagePercentage,
            threshold: this.config.storageUsageThreshold,
            totalSize: metrics.storageMetrics.totalSize,
            totalFiles: metrics.storageMetrics.totalFiles,
          },
          timestamp: new Date(),
        };
        alerts.push(alert);
      }

      // Check health status
      if (health.status === 'unhealthy') {
        const alert: Alert = {
          type: AlertType.SYSTEM_UNHEALTHY,
          severity: 'critical',
          message: 'System health check failed',
          details: {
            status: health.status,
            checks: health.checks,
            issues: health.issues,
          },
          timestamp: new Date(),
        };
        alerts.push(alert);
      }

      // Check individual health components
      if (!health.checks.database) {
        const alert: Alert = {
          type: AlertType.DATABASE_CONNECTION_FAILED,
          severity: 'critical',
          message: 'Database connection failed',
          details: health.checks,
          timestamp: new Date(),
        };
        alerts.push(alert);
      }

      if (!health.checks.storage) {
        const alert: Alert = {
          type: AlertType.STORAGE_INACCESSIBLE,
          severity: 'critical',
          message: 'Storage directory is inaccessible',
          details: health.checks,
          timestamp: new Date(),
        };
        alerts.push(alert);
      }

      if (!health.checks.email) {
        const alert: Alert = {
          type: AlertType.EMAIL_SERVICE_DOWN,
          severity: 'high',
          message: 'Email service is experiencing issues',
          details: health.checks,
          timestamp: new Date(),
        };
        alerts.push(alert);
      }

      // Send alerts
      for (const alert of alerts) {
        await this.sendAlert(alert);
      }

      return alerts;
    } catch (error) {
      logger.error('Failed to check and alert', {
        error,
        category: 'alerting',
      });
      return alerts;
    }
  }

  /**
   * Send an alert via configured channels
   */
  private async sendAlert(alert: Alert): Promise<void> {
    // Check cooldown period
    if (this.isInCooldown(alert.type)) {
      logger.debug(`Alert ${alert.type} is in cooldown period, skipping`, {
        category: 'alerting',
      });
      return;
    }

    // Log the alert
    logger.warn(`ALERT: ${alert.message}`, {
      type: alert.type,
      severity: alert.severity,
      details: alert.details,
      category: 'alerting',
    });

    // Send email alert if configured
    if (this.transporter && this.config.alertRecipients.length > 0) {
      await this.sendEmailAlert(alert);
    }

    // Update last alert time
    this.lastAlertTimes.set(alert.type, new Date());
  }

  /**
   * Send alert via email
   */
  private async sendEmailAlert(alert: Alert): Promise<void> {
    if (!this.transporter) {
      return;
    }

    try {
      const subject = `[${alert.severity.toUpperCase()}] CV Analysis System Alert: ${alert.type}`;
      const html = this.generateAlertEmailHTML(alert);
      const text = this.generateAlertEmailText(alert);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'alerts@skilltude.com',
        to: this.config.alertRecipients.join(','),
        subject,
        text,
        html,
      });

      logger.info(`Alert email sent`, {
        type: alert.type,
        recipients: this.config.alertRecipients.length,
        category: 'alerting',
      });
    } catch (error) {
      logger.error('Failed to send alert email', {
        error,
        alert: alert.type,
        category: 'alerting',
      });
    }
  }

  /**
   * Generate HTML email for alert
   */
  private generateAlertEmailHTML(alert: Alert): string {
    const severityColor = {
      low: '#3b82f6',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626',
    }[alert.severity];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: ${severityColor}; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .severity { display: inline-block; padding: 5px 10px; background-color: ${severityColor}; color: white; border-radius: 3px; font-weight: bold; }
          .details { background-color: white; padding: 15px; margin-top: 15px; border-left: 4px solid ${severityColor}; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ System Alert</h1>
          </div>
          <div class="content">
            <p><span class="severity">${alert.severity.toUpperCase()}</span></p>
            <h2>${alert.message}</h2>
            <p><strong>Alert Type:</strong> ${alert.type}</p>
            <p><strong>Timestamp:</strong> ${alert.timestamp.toLocaleString()}</p>
            
            <div class="details">
              <h3>Details:</h3>
              <pre>${JSON.stringify(alert.details, null, 2)}</pre>
            </div>
            
            <div style="margin-top: 20px;">
              <h3>Recommended Actions:</h3>
              ${this.getRecommendedActions(alert.type)}
            </div>
          </div>
          <div class="footer">
            <p>This is an automated alert from the CV Analysis System.</p>
            <p>To view the monitoring dashboard, log in to the admin panel.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate plain text email for alert
   */
  private generateAlertEmailText(alert: Alert): string {
    return `
SYSTEM ALERT [${alert.severity.toUpperCase()}]

${alert.message}

Alert Type: ${alert.type}
Timestamp: ${alert.timestamp.toLocaleString()}

Details:
${JSON.stringify(alert.details, null, 2)}

Recommended Actions:
${this.getRecommendedActionsText(alert.type)}

---
This is an automated alert from the CV Analysis System.
To view the monitoring dashboard, log in to the admin panel.
    `.trim();
  }

  /**
   * Get recommended actions HTML for alert type
   */
  private getRecommendedActions(type: AlertType): string {
    const actions: Record<AlertType, string> = {
      [AlertType.HIGH_UPLOAD_FAILURE_RATE]: `
        <ul>
          <li>Check file storage service availability</li>
          <li>Review recent error logs for upload failures</li>
          <li>Verify file validation logic is working correctly</li>
          <li>Check rate limiting configuration</li>
        </ul>
      `,
      [AlertType.LOW_EMAIL_DELIVERY_RATE]: `
        <ul>
          <li>Verify SMTP server configuration</li>
          <li>Check email queue processing job status</li>
          <li>Review email service logs for errors</li>
          <li>Verify email addresses are valid</li>
        </ul>
      `,
      [AlertType.HIGH_STORAGE_USAGE]: `
        <ul>
          <li>Archive or delete old CV files</li>
          <li>Increase storage capacity</li>
          <li>Implement file retention policy</li>
          <li>Check for duplicate files</li>
        </ul>
      `,
      [AlertType.DATABASE_CONNECTION_FAILED]: `
        <ul>
          <li>Check MySQL server status</li>
          <li>Verify database credentials</li>
          <li>Check network connectivity</li>
          <li>Review database server logs</li>
        </ul>
      `,
      [AlertType.STORAGE_INACCESSIBLE]: `
        <ul>
          <li>Check directory permissions</li>
          <li>Verify disk is mounted</li>
          <li>Check available disk space</li>
          <li>Review file system errors</li>
        </ul>
      `,
      [AlertType.EMAIL_SERVICE_DOWN]: `
        <ul>
          <li>Check SMTP server status</li>
          <li>Verify email service credentials</li>
          <li>Review email queue for stuck jobs</li>
          <li>Check email service rate limits</li>
        </ul>
      `,
      [AlertType.SYSTEM_UNHEALTHY]: `
        <ul>
          <li>Review all health check failures</li>
          <li>Check system logs for errors</li>
          <li>Verify all services are running</li>
          <li>Consider restarting affected services</li>
        </ul>
      `,
    };

    return actions[type] || '<p>No specific recommendations available.</p>';
  }

  /**
   * Get recommended actions text for alert type
   */
  private getRecommendedActionsText(type: AlertType): string {
    return this.getRecommendedActions(type)
      .replace(/<\/?ul>/g, '')
      .replace(/<li>/g, '- ')
      .replace(/<\/li>/g, '\n')
      .trim();
  }

  /**
   * Check if alert type is in cooldown period
   */
  private isInCooldown(type: AlertType): boolean {
    const lastAlertTime = this.lastAlertTimes.get(type);
    if (!lastAlertTime) {
      return false;
    }

    const cooldownMs = this.config.alertCooldownMinutes * 60 * 1000;
    const timeSinceLastAlert = Date.now() - lastAlertTime.getTime();
    return timeSinceLastAlert < cooldownMs;
  }

  /**
   * Update alert configuration
   */
  updateConfig(config: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info('Alert configuration updated', {
      config: this.config,
      category: 'alerting',
    });
  }

  /**
   * Get current alert configuration
   */
  getConfig(): AlertConfig {
    return { ...this.config };
  }

  /**
   * Clear cooldown for specific alert type (for testing)
   */
  clearCooldown(type: AlertType): void {
    this.lastAlertTimes.delete(type);
  }

  /**
   * Clear all cooldowns (for testing)
   */
  clearAllCooldowns(): void {
    this.lastAlertTimes.clear();
  }
}

export default new AlertingService();
