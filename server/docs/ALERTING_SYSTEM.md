# Alerting System Documentation

## Overview

The Alerting System monitors critical system metrics and automatically sends notifications when thresholds are exceeded or issues are detected. It helps administrators respond quickly to problems before they impact users.

## Features

- **Automated Monitoring**: Checks system health every 15 minutes
- **Email Notifications**: Sends detailed alerts to configured recipients
- **Cooldown Period**: Prevents alert spam (60-minute cooldown by default)
- **Severity Levels**: Low, Medium, High, Critical
- **Actionable Recommendations**: Each alert includes specific troubleshooting steps

## Alert Types

### 1. High Upload Failure Rate
**Trigger**: Upload failure rate > 10%  
**Severity**: High (>10%), Critical (>20%)

**Causes**:
- File storage service issues
- Invalid file validation logic
- Rate limiting too aggressive
- Disk space issues

**Actions**:
- Check file storage service availability
- Review recent error logs
- Verify file validation logic
- Check rate limiting configuration

### 2. Low Email Delivery Rate
**Trigger**: Email delivery rate < 90%  
**Severity**: High (<90%), Critical (<80%)

**Causes**:
- SMTP server issues
- Invalid email addresses
- Email queue processing failures
- Rate limiting by email provider

**Actions**:
- Verify SMTP server configuration
- Check email queue processing job
- Review email service logs
- Validate email addresses

### 3. High Storage Usage
**Trigger**: Storage usage > 80%  
**Severity**: Medium (>80%), Critical (>95%)

**Causes**:
- Accumulation of old files
- No retention policy
- Unexpected file growth
- Disk quota reached

**Actions**:
- Archive or delete old CV files
- Increase storage capacity
- Implement file retention policy
- Check for duplicate files

### 4. Database Connection Failed
**Trigger**: Database health check fails  
**Severity**: Critical

**Causes**:
- MySQL server down
- Invalid credentials
- Network connectivity issues
- Connection pool exhausted

**Actions**:
- Check MySQL server status
- Verify database credentials
- Check network connectivity
- Review database server logs

### 5. Storage Inaccessible
**Trigger**: Storage directory health check fails  
**Severity**: Critical

**Causes**:
- Directory permissions issues
- Disk unmounted
- File system errors
- Disk full

**Actions**:
- Check directory permissions
- Verify disk is mounted
- Check available disk space
- Review file system errors

### 6. Email Service Down
**Trigger**: Email service health check fails  
**Severity**: High

**Causes**:
- SMTP server unavailable
- Authentication failures
- Network issues
- Service rate limits

**Actions**:
- Check SMTP server status
- Verify email service credentials
- Review email queue
- Check service rate limits

### 7. System Unhealthy
**Trigger**: Overall system health status is "unhealthy"  
**Severity**: Critical

**Causes**:
- Multiple component failures
- Cascading failures
- Resource exhaustion
- Configuration errors

**Actions**:
- Review all health check failures
- Check system logs
- Verify all services are running
- Consider service restart

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Alert Recipients (comma-separated email addresses)
ALERT_RECIPIENTS=admin@example.com,ops@example.com

# SMTP Configuration (for sending alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=alerts@skilltude.com
```

### Alert Thresholds

Modify thresholds in `server/services/AlertingService.ts`:

```typescript
this.config = {
  uploadFailureRateThreshold: 10, // Alert if > 10% failure rate
  emailDeliveryRateThreshold: 90, // Alert if < 90% delivery rate
  storageUsageThreshold: 80, // Alert if > 80% storage used
  alertRecipients: process.env.ALERT_RECIPIENTS?.split(',') || [],
  alertCooldownMinutes: 60, // Don't send same alert more than once per hour
};
```

### Cooldown Period

The cooldown period prevents alert spam. Once an alert is sent, the same alert type won't be sent again for the configured duration (default: 60 minutes).

To adjust:
```typescript
alertingService.updateConfig({
  alertCooldownMinutes: 30, // 30 minutes
});
```

## Running the Alert Checker

### Development

Run once:
```bash
npm run job:alerts
```

Run continuously (checks every 15 minutes):
```bash
npm run job:alerts:scheduler
```

### Production

Build first:
```bash
npm run server:build
```

Run once:
```bash
npm run job:alerts:prod
```

Run continuously:
```bash
npm run job:alerts:scheduler
```

### Using Cron

Add to crontab for production deployment:

```bash
# Check alerts every 15 minutes
*/15 * * * * cd /path/to/app && npm run job:alerts:prod >> /var/log/cv-alerts.log 2>&1

# Or use the scheduler (recommended)
@reboot cd /path/to/app && npm run job:alerts:scheduler >> /var/log/cv-alerts-scheduler.log 2>&1
```

### Using PM2

```bash
# Start the alert scheduler with PM2
pm2 start server/jobs/alertScheduler.js --name cv-alerts

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

## Alert Email Format

### Subject Line
```
[SEVERITY] CV Analysis System Alert: ALERT_TYPE
```

Example:
```
[CRITICAL] CV Analysis System Alert: HIGH_UPLOAD_FAILURE_RATE
```

### Email Content

The email includes:
- **Severity Badge**: Visual indicator of alert severity
- **Alert Message**: Clear description of the issue
- **Alert Type**: Technical identifier
- **Timestamp**: When the alert was generated
- **Details**: Relevant metrics and data
- **Recommended Actions**: Specific troubleshooting steps

### Example Email

```
⚠️ System Alert

[CRITICAL]

Upload failure rate is 25.5%

Alert Type: HIGH_UPLOAD_FAILURE_RATE
Timestamp: 12/25/2024, 10:30:00 AM

Details:
{
  "failureRate": 25.5,
  "threshold": 10,
  "totalUploads": 1000,
  "failedUploads": 255
}

Recommended Actions:
- Check file storage service availability
- Review recent error logs for upload failures
- Verify file validation logic is working correctly
- Check rate limiting configuration
```

## Programmatic Usage

### Check and Send Alerts

```typescript
import alertingService from './services/AlertingService';

// Check metrics and send alerts if needed
const alerts = await alertingService.checkAndAlert();

console.log(`Generated ${alerts.length} alerts`);
```

### Update Configuration

```typescript
// Update alert thresholds
alertingService.updateConfig({
  uploadFailureRateThreshold: 15,
  emailDeliveryRateThreshold: 85,
  storageUsageThreshold: 90,
  alertCooldownMinutes: 30,
});
```

### Clear Cooldowns (Testing)

```typescript
// Clear cooldown for specific alert type
alertingService.clearCooldown(AlertType.HIGH_UPLOAD_FAILURE_RATE);

// Clear all cooldowns
alertingService.clearAllCooldowns();
```

## Integration with Monitoring Dashboard

The alerting system works alongside the monitoring dashboard:

1. **Dashboard**: Real-time visualization of metrics
2. **Alerting**: Proactive notifications when issues occur

Administrators can:
- View current metrics in the dashboard
- Receive email alerts for critical issues
- Click through from alerts to dashboard for details

## Testing Alerts

### Manual Test

```typescript
// In development, you can manually trigger alerts
import alertingService from './services/AlertingService';

// Lower thresholds to trigger alerts
alertingService.updateConfig({
  uploadFailureRateThreshold: 0,
  emailDeliveryRateThreshold: 100,
  storageUsageThreshold: 0,
});

// Clear cooldowns
alertingService.clearAllCooldowns();

// Run check
const alerts = await alertingService.checkAndAlert();
console.log('Alerts generated:', alerts);
```

### Test Email Configuration

```bash
# Run the alert checker once to test email sending
npm run job:alerts
```

Check logs for:
```
Alert email sent { type: 'HIGH_UPLOAD_FAILURE_RATE', recipients: 2, category: 'alerting' }
```

## Troubleshooting

### Alerts Not Being Sent

1. **Check Configuration**
   ```bash
   # Verify environment variables are set
   echo $ALERT_RECIPIENTS
   echo $SMTP_HOST
   ```

2. **Check Logs**
   ```bash
   # Look for alerting errors
   grep "alerting" logs/error.log
   ```

3. **Test SMTP Connection**
   ```typescript
   // Test SMTP configuration
   const transporter = nodemailer.createTransporter({
     host: process.env.SMTP_HOST,
     port: parseInt(process.env.SMTP_PORT || '587'),
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   });
   
   await transporter.verify();
   ```

4. **Check Cooldown**
   - Alerts may be in cooldown period
   - Check `lastAlertTimes` in AlertingService
   - Wait for cooldown to expire or clear manually

### Too Many Alerts

1. **Adjust Thresholds**
   - Increase thresholds to reduce sensitivity
   - Example: Change upload failure threshold from 10% to 15%

2. **Increase Cooldown**
   - Extend cooldown period from 60 to 120 minutes
   - Reduces alert frequency

3. **Fix Root Cause**
   - Address underlying issues causing alerts
   - Improve system reliability

### Missing Alerts

1. **Check Scheduler**
   ```bash
   # Verify scheduler is running
   ps aux | grep alertScheduler
   
   # Check PM2 status
   pm2 status
   ```

2. **Verify Thresholds**
   - Ensure thresholds are not too high
   - Check if metrics actually exceed thresholds

3. **Check Email Delivery**
   - Verify emails aren't going to spam
   - Check email server logs

## Best Practices

### 1. Configure Multiple Recipients
```bash
ALERT_RECIPIENTS=admin@example.com,ops@example.com,oncall@example.com
```

### 2. Use Dedicated Alert Email
```bash
SMTP_FROM=alerts@skilltude.com
```

### 3. Set Up Email Filters
- Create email rules to highlight critical alerts
- Use labels/folders for different severity levels

### 4. Monitor Alert Volume
- Track how many alerts are sent
- Adjust thresholds if too many false positives

### 5. Document Response Procedures
- Create runbooks for each alert type
- Define escalation procedures
- Assign on-call responsibilities

### 6. Test Regularly
- Run manual alert checks monthly
- Verify email delivery works
- Update contact information

### 7. Review and Tune
- Analyze alert patterns
- Adjust thresholds based on experience
- Remove alerts that aren't actionable

## Integration with External Services

### PagerDuty

```typescript
import axios from 'axios';

async function sendToPagerDuty(alert: Alert) {
  await axios.post('https://events.pagerduty.com/v2/enqueue', {
    routing_key: process.env.PAGERDUTY_ROUTING_KEY,
    event_action: 'trigger',
    payload: {
      summary: alert.message,
      severity: alert.severity,
      source: 'cv-analysis-system',
      custom_details: alert.details,
    },
  });
}
```

### Slack

```typescript
import axios from 'axios';

async function sendToSlack(alert: Alert) {
  const color = {
    low: '#3b82f6',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626',
  }[alert.severity];

  await axios.post(process.env.SLACK_WEBHOOK_URL!, {
    attachments: [{
      color,
      title: `[${alert.severity.toUpperCase()}] ${alert.type}`,
      text: alert.message,
      fields: [
        {
          title: 'Details',
          value: JSON.stringify(alert.details, null, 2),
        },
      ],
      ts: Math.floor(alert.timestamp.getTime() / 1000),
    }],
  });
}
```

### SMS (Twilio)

```typescript
import twilio from 'twilio';

async function sendSMS(alert: Alert) {
  if (alert.severity !== 'critical') {
    return; // Only send SMS for critical alerts
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await client.messages.create({
    body: `[CRITICAL] ${alert.message}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: process.env.ONCALL_PHONE_NUMBER,
  });
}
```

## Conclusion

The Alerting System is a critical component for maintaining system reliability. By proactively notifying administrators of issues, it enables quick response and minimizes downtime. Regular monitoring, testing, and tuning ensure the alerting system remains effective and actionable.
