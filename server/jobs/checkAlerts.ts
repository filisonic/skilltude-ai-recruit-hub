/**
 * Alert Checking Job
 * Periodically checks system metrics and sends alerts for critical issues
 * 
 * Run this job via cron or scheduler:
 * - Every 5 minutes: (star)/5 (star) (star) (star) (star) node server/dist/jobs/checkAlerts.js
 * - Every 15 minutes: (star)/15 (star) (star) (star) (star) node server/dist/jobs/checkAlerts.js
 * 
 * Replace (star) with * in the actual cron command
 */

import alertingService from '../services/AlertingService';
import logger from '../utils/logger';

async function checkAlerts() {
  logger.info('Starting alert check', {
    category: 'alerting',
  });

  try {
    const alerts = await alertingService.checkAndAlert();

    if (alerts.length > 0) {
      logger.warn(`Generated ${alerts.length} alerts`, {
        alerts: alerts.map(a => ({
          type: a.type,
          severity: a.severity,
          message: a.message,
        })),
        category: 'alerting',
      });
    } else {
      logger.info('No alerts generated - system healthy', {
        category: 'alerting',
      });
    }

    process.exit(0);
  } catch (error) {
    logger.error('Alert check failed', {
      error,
      category: 'alerting',
    });
    process.exit(1);
  }
}

// Run the job
checkAlerts();
