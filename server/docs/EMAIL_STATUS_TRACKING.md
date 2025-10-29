# Email Status Tracking

## Overview

The Email Status Tracking system provides comprehensive monitoring and management of email delivery for CV analysis results. It tracks the entire lifecycle of each email from queuing to delivery, including retry attempts and failures.

## Database Schema

### Email Status Fields

The following fields have been added to the `cv_submissions` table:

```sql
-- Email scheduling and delivery tracking
email_scheduled_at TIMESTAMP NULL      -- When the email is scheduled to be sent
email_sent_at TIMESTAMP NULL           -- When the email was successfully sent
email_status ENUM(...)                 -- Current status of email delivery
email_attempts INT DEFAULT 0           -- Number of email send attempts
email_last_attempt_at TIMESTAMP NULL   -- Timestamp of last email send attempt
email_error TEXT NULL                  -- Last error message if email failed
email_opened_at TIMESTAMP NULL         -- When the recipient opened the email
converted_to_premium BOOLEAN           -- Whether user converted to premium
conversion_date TIMESTAMP NULL         -- Date when user converted
```

### Email Status Values

- **pending**: Initial state, email not yet queued
- **queued**: Email scheduled for delivery (24-48 hours after submission)
- **retrying**: Email failed but will be retried automatically
- **sent**: Email successfully delivered
- **failed**: Email failed after maximum retry attempts

## Admin API Endpoints

### 1. Get Email Queue Statistics

**Endpoint**: `GET /api/admin/cv-submissions/email-queue/stats`

**Authentication**: Required (super_admin, admin, hr_manager)

**Response**:
```json
{
  "success": true,
  "stats": {
    "pending": 5,
    "queued": 10,
    "sent": 150,
    "failed": 3,
    "retrying": 2
  },
  "metrics": {
    "sentLast24Hours": 25,
    "totalFailed": 3,
    "currentlyRetrying": 2,
    "dueNow": 5,
    "avgAttemptsForSuccess": "1.23"
  }
}
```

**Description**: Returns comprehensive statistics about the email queue, including status counts and key metrics.

### 2. Get Failed Emails

**Endpoint**: `GET /api/admin/cv-submissions/email-queue/failed?limit=50`

**Authentication**: Required (super_admin, admin, hr_manager)

**Query Parameters**:
- `limit` (optional): Maximum number of results (default: 50)

**Response**:
```json
{
  "success": true,
  "failedEmails": [
    {
      "id": 123,
      "uuid": "abc-123-def",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "emailAttempts": 3,
      "emailError": "SMTP connection timeout",
      "emailLastAttemptAt": "2024-12-25T10:30:00Z",
      "emailScheduledAt": "2024-12-24T10:00:00Z",
      "submittedAt": "2024-12-23T10:00:00Z",
      "analysisScore": 75
    }
  ],
  "total": 1
}
```

**Description**: Returns a list of all failed email deliveries with error details.

### 3. Retry Failed Email

**Endpoint**: `POST /api/admin/cv-submissions/:id/retry-email`

**Authentication**: Required (super_admin, admin, hr_manager)

**Parameters**:
- `id`: CV submission ID

**Response**:
```json
{
  "success": true,
  "message": "Email retry successful"
}
```

**Description**: Manually retries a failed email delivery. Resets the attempt counter and immediately attempts to send the email.

### 4. Process Email Queue

**Endpoint**: `POST /api/admin/cv-submissions/email-queue/process`

**Authentication**: Required (super_admin, admin)

**Response**:
```json
{
  "success": true,
  "message": "Email queue processed",
  "result": {
    "sent": 6,
    "failed": 1
  }
}
```

**Description**: Manually triggers email queue processing. Useful for testing or immediate processing of queued emails.

## Admin UI Component

### EmailQueueMonitor Component

**Location**: `src/components/admin/EmailQueueMonitor.tsx`

**Features**:

1. **Real-time Statistics**
   - Displays counts for each email status
   - Shows key metrics (sent last 24h, due now, success rate)
   - Auto-refreshes every 30 seconds

2. **Failed Email Management**
   - Lists all failed email deliveries
   - Shows error messages and attempt counts
   - Provides one-click retry functionality

3. **Queue Control**
   - Manual queue processing button
   - Refresh data on demand
   - Visual feedback for all actions

**Usage**:

The component is integrated into the Admin CV Management page as a separate tab:

```typescript
import EmailQueueMonitor from '@/components/admin/EmailQueueMonitor';

// In your admin page
<EmailQueueMonitor />
```

## Email Lifecycle

### 1. Submission

When a CV is submitted:

```typescript
// Initial state
email_status = 'pending'
email_attempts = 0
```

### 2. Queuing

After successful CV analysis:

```typescript
// Queue for delivery (24 hours later)
await emailQueueService.queueEmail(submissionId, 24);

// Database updated
email_status = 'queued'
email_scheduled_at = NOW() + 24 hours
```

### 3. Processing

Background job runs periodically:

```typescript
// Job processes queue
const result = await emailQueueService.processQueue();

// For each email due to be sent:
email_attempts += 1
email_last_attempt_at = NOW()
email_status = 'retrying' (during attempt)
```

### 4. Success

Email sent successfully:

```typescript
email_status = 'sent'
email_sent_at = NOW()
email_error = NULL
```

### 5. Failure

Email fails after max retries:

```typescript
email_status = 'failed'
email_error = 'Error message'
// Requires manual intervention
```

## Monitoring and Alerts

### Key Metrics to Monitor

1. **Success Rate**
   - Target: >95%
   - Alert if: <90%

2. **Failed Emails**
   - Target: <5% of total
   - Alert if: >10%

3. **Queue Size**
   - Target: Processed within 1 hour
   - Alert if: Growing continuously

4. **Due Now**
   - Target: <10 emails
   - Alert if: >50 emails

### Monitoring Dashboard

The Email Queue Monitor provides real-time visibility into:

- Current queue status
- Recent delivery performance
- Failed email details
- System health indicators

### Setting Up Alerts

Example alert configuration (using monitoring service):

```javascript
// Alert if failure rate exceeds 10%
if (stats.failed / totalEmails > 0.10) {
  sendAlert('High email failure rate detected');
}

// Alert if queue is backing up
if (metrics.dueNow > 50) {
  sendAlert('Email queue backing up - check background job');
}

// Alert if no emails sent in 24 hours
if (metrics.sentLast24Hours === 0) {
  sendAlert('No emails sent in 24 hours - check email service');
}
```

## Troubleshooting

### High Failure Rate

**Symptoms**: Many emails in 'failed' status

**Possible Causes**:
1. SMTP server issues
2. Invalid email credentials
3. Rate limiting from email provider
4. Network connectivity problems

**Solutions**:
1. Check email service status
2. Verify SMTP credentials in `.env`
3. Review error messages in failed emails
4. Test email service connection:
   ```typescript
   const emailService = new EmailService();
   await emailService.verifyConnection();
   ```

### Emails Not Being Sent

**Symptoms**: Emails stuck in 'queued' status

**Possible Causes**:
1. Background job not running
2. Job execution errors
3. Database connectivity issues

**Solutions**:
1. Check if background job is running:
   ```bash
   pm2 status email-queue
   # or
   ps aux | grep processEmailQueue
   ```
2. Check job logs for errors
3. Manually trigger queue processing via admin UI
4. Verify database connection

### Queue Growing Too Large

**Symptoms**: Many emails in 'queued' or 'retrying' status

**Possible Causes**:
1. Job not running frequently enough
2. Email service rate limiting
3. Slow email delivery

**Solutions**:
1. Increase job frequency (run every 15 minutes instead of 30)
2. Check email service rate limits
3. Consider upgrading email service plan
4. Process queue manually to catch up

## Best Practices

### 1. Regular Monitoring

- Check email queue dashboard daily
- Review failed emails weekly
- Monitor success rate trends
- Set up automated alerts

### 2. Failed Email Management

- Review failed emails within 24 hours
- Investigate patterns in failures
- Retry failed emails after fixing issues
- Document recurring problems

### 3. Performance Optimization

- Keep queue size manageable (<100 queued)
- Process queue every 15-30 minutes
- Use reliable email service provider
- Monitor email service rate limits

### 4. Data Retention

- Keep email logs for at least 30 days
- Archive old failed emails after resolution
- Track long-term delivery metrics
- Regular database maintenance

### 5. Testing

- Test email delivery in staging first
- Verify retry logic works correctly
- Test manual retry functionality
- Monitor initial deployment closely

## Integration Examples

### Check Email Status

```typescript
// Get submission with email status
const submission = await query(
  `SELECT email_status, email_sent_at, email_error
   FROM cv_submissions
   WHERE id = ?`,
  [submissionId]
);

console.log('Email Status:', submission[0].email_status);
```

### Update Email Status Manually

```typescript
// Mark email as sent (for testing)
await query(
  `UPDATE cv_submissions
   SET email_status = 'sent',
       email_sent_at = NOW()
   WHERE id = ?`,
  [submissionId]
);
```

### Get Queue Statistics

```typescript
import { EmailQueueService } from './services/EmailQueueService';

const queueService = new EmailQueueService();
const stats = await queueService.getQueueStats();

console.log('Queue Stats:', stats);
// { pending: 5, queued: 10, sent: 150, failed: 3, retrying: 2 }
```

## Security Considerations

### Access Control

- Email queue endpoints require authentication
- Only admin roles can access queue management
- File download access is logged and audited
- Failed email details are protected

### Data Privacy

- Email errors don't expose sensitive data
- Personal information is sanitized in logs
- Failed emails are only visible to admins
- Email content is not stored in database

### Rate Limiting

- Admin endpoints have rate limiting
- Prevents abuse of retry functionality
- Protects against DoS attacks
- Monitors suspicious activity

## Future Enhancements

### Planned Features

1. **Email Open Tracking**
   - Track when recipients open emails
   - Update `email_opened_at` field
   - Measure engagement rates

2. **Click Tracking**
   - Track CTA clicks in emails
   - Measure conversion funnel
   - A/B test email content

3. **Advanced Analytics**
   - Delivery time analysis
   - Success rate by time of day
   - Geographic delivery patterns
   - Provider performance comparison

4. **Automated Alerts**
   - Email/SMS alerts for failures
   - Slack/Discord notifications
   - Webhook integrations
   - Custom alert rules

5. **Bulk Operations**
   - Retry all failed emails
   - Bulk status updates
   - Export failed email list
   - Batch processing controls

## Related Documentation

- [Email Queue Implementation](./EMAIL_QUEUE_IMPLEMENTATION.md)
- [Email Service Implementation](./EMAIL_SERVICE_IMPLEMENTATION.md)
- [Email Setup Guide](./EMAIL_SETUP_GUIDE.md)
- [Background Jobs README](../jobs/README.md)
- [Admin API Guide](./ADMIN_API_GUIDE.md)
