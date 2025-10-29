# Email Queue Implementation

## Overview

The Email Queue System manages delayed email delivery for CV analysis results. Instead of sending emails immediately after CV submission, emails are queued and sent 24-48 hours later, giving the system time to process and allowing for better email deliverability.

## Architecture

### Components

1. **EmailQueueService** (`server/services/EmailQueueService.ts`)
   - Manages email queue operations
   - Handles retry logic with exponential backoff
   - Tracks email delivery status
   - Provides queue statistics and monitoring

2. **Background Job** (`server/jobs/processEmailQueue.ts`)
   - Standalone script that processes the queue
   - Should be run periodically via cron or task scheduler
   - Sends scheduled emails and handles retries

3. **Database Fields** (added to `cv_submissions` table)
   - `email_scheduled_at`: When the email should be sent
   - `email_sent_at`: When the email was successfully sent
   - `email_status`: Current status (pending, queued, sent, failed, retrying)
   - `email_attempts`: Number of send attempts
   - `email_last_attempt_at`: Timestamp of last attempt
   - `email_error`: Last error message if failed

## Email Status Flow

```
pending → queued → sent
                ↓
              retrying → sent
                ↓
              failed
```

### Status Definitions

- **pending**: Initial state, email not yet queued
- **queued**: Email scheduled for delivery
- **retrying**: Email failed but will be retried
- **sent**: Email successfully delivered
- **failed**: Email failed after max retries

## Features

### 1. Delayed Delivery

Emails are scheduled for delivery 24-48 hours after CV submission:

```typescript
// Queue email with 24-hour delay
await emailQueueService.queueEmail(submissionId, 24);

// Queue email with 48-hour delay
await emailQueueService.queueEmail(submissionId, 48);
```

### 2. Retry Logic

Failed emails are automatically retried with exponential backoff:

- **Max Retries**: 3 attempts
- **Retry Delay**: 30 minutes between attempts
- **Backoff**: Exponential (1s, 2s, 4s for immediate retries within the same job run)

### 3. Status Tracking

All email attempts are tracked in the database:

```typescript
// Get queue statistics
const stats = await emailQueueService.getQueueStats();
// Returns: { pending, queued, sent, failed, retrying }

// Get failed emails for review
const failedEmails = await emailQueueService.getFailedEmails(50);
```

### 4. Manual Retry

Failed emails can be manually retried:

```typescript
// Retry a specific failed email
await emailQueueService.retryFailedEmail(submissionId);
```

## Database Migration

### Apply Migration

```bash
# Using the migration script
cd database_migrations
node apply_migration.js add_email_queue_fields.sql

# Or manually via MySQL client
mysql -u username -p database_name < add_email_queue_fields.sql
```

### Rollback Migration

```bash
# Using the rollback script
cd database_migrations
node rollback_migration.js rollback_email_queue_fields.sql

# Or manually via MySQL client
mysql -u username -p database_name < rollback_email_queue_fields.sql
```

## Running the Background Job

### Development

```bash
# Run once
npm run job:email-queue

# Or with ts-node directly
npx ts-node server/jobs/processEmailQueue.ts
```

### Production

```bash
# Build first
npm run server:build

# Run the compiled job
npm run job:email-queue:prod

# Or directly
node server/dist/jobs/processEmailQueue.js
```

## Scheduling

### Option 1: Cron (Linux/Mac)

```bash
# Edit crontab
crontab -e

# Add entry to run every 15 minutes
*/15 * * * * cd /path/to/project && npm run job:email-queue:prod >> logs/email-queue.log 2>&1
```

### Option 2: Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily, repeat every 15 minutes
4. Set action: Start a program
   - Program: `node`
   - Arguments: `server/dist/jobs/processEmailQueue.js`
   - Start in: `C:\path\to\project`

### Option 3: PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start cron job
pm2 start server/jobs/processEmailQueue.ts --cron "*/15 * * * *" --no-autorestart --name email-queue

# Monitor
pm2 logs email-queue
pm2 monit

# Manage
pm2 stop email-queue
pm2 restart email-queue
pm2 delete email-queue
```

### Option 4: Node-Cron (In-Process)

Add to your `server/index.ts`:

```typescript
import cron from 'node-cron';
import { EmailQueueService } from './services/EmailQueueService';

// Run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('Processing email queue...');
  const queueService = new EmailQueueService();
  try {
    const result = await queueService.processQueue();
    console.log(`Queue processed: ${result.sent} sent, ${result.failed} failed`);
  } catch (error) {
    console.error('Queue processing error:', error);
  }
});
```

## Monitoring

### Queue Statistics

```typescript
const stats = await emailQueueService.getQueueStats();
console.log('Queue Stats:', stats);
// Output:
// {
//   pending: 5,
//   queued: 10,
//   sent: 150,
//   failed: 3,
//   retrying: 2
// }
```

### Failed Emails

```typescript
const failedEmails = await emailQueueService.getFailedEmails(50);
failedEmails.forEach(email => {
  console.log(`Failed: ${email.email}`);
  console.log(`  Attempts: ${email.emailAttempts}`);
  console.log(`  Error: ${email.emailError}`);
  console.log(`  Last Attempt: ${email.emailLastAttemptAt}`);
});
```

### Job Output

The background job provides detailed output:

```
================================================================================
Email Queue Processor Started
Timestamp: 2024-12-25T10:00:00.000Z
================================================================================
✓ Email service connection verified

Queue Statistics (Before):
  Pending:  0
  Queued:   5
  Retrying: 2
  Sent:     150
  Failed:   3

--------------------------------------------------------------------------------
Processing Email Queue...
--------------------------------------------------------------------------------

Attempting to send email to john@example.com (attempt 1/3)
✓ Email sent successfully to john@example.com

Attempting to send email to jane@example.com (attempt 2/3)
✗ Failed to send email to jane@example.com: SMTP connection timeout
Email to jane@example.com scheduled for retry at 2024-12-25T10:30:00.000Z

--------------------------------------------------------------------------------
Queue Processing Complete
--------------------------------------------------------------------------------
✓ Emails sent successfully: 6
✗ Emails failed: 1

Queue Statistics (After):
  Pending:  0
  Queued:   0
  Retrying: 1
  Sent:     156
  Failed:   3

================================================================================
Email Queue Processor Finished Successfully
================================================================================
```

## Integration with CV Upload

The CV upload route automatically queues emails:

```typescript
// In server/routes/cv.routes.ts
import { EmailQueueService } from '../services/EmailQueueService';

const emailQueueService = new EmailQueueService();

// After successful CV submission
await emailQueueService.queueEmail(submissionId, 24); // 24-hour delay
```

## Error Handling

### Email Send Failures

1. **Temporary Failures** (network issues, SMTP timeout)
   - Status: `retrying`
   - Action: Automatic retry after 30 minutes
   - Max retries: 3

2. **Permanent Failures** (invalid email, rejected by server)
   - Status: `failed`
   - Action: Manual review required
   - Available via admin dashboard

### Job Failures

If the background job fails:

1. Check email service connection
2. Review error logs
3. Verify database connectivity
4. Check SMTP credentials

## Best Practices

### 1. Scheduling Frequency

- **Recommended**: Every 15-30 minutes
- **Minimum**: Every 5 minutes (for time-sensitive emails)
- **Maximum**: Every hour (may delay email delivery)

### 2. Monitoring

- Set up alerts for high failure rates (>10%)
- Monitor queue size (should not grow indefinitely)
- Review failed emails daily
- Track email delivery metrics

### 3. Email Service

- Use a reliable transactional email service (SendGrid, AWS SES, Mailgun)
- Configure proper SPF, DKIM, and DMARC records
- Monitor sender reputation
- Respect rate limits

### 4. Logging

- Redirect job output to log files
- Rotate logs regularly
- Keep logs for at least 30 days
- Monitor log file size

### 5. Testing

- Test in development before production
- Verify email templates render correctly
- Test retry logic with mock failures
- Monitor initial deployment closely

## Troubleshooting

### Emails Not Being Sent

1. **Check queue status**
   ```typescript
   const stats = await emailQueueService.getQueueStats();
   console.log(stats);
   ```

2. **Verify job is running**
   ```bash
   # Check cron logs
   grep CRON /var/log/syslog
   
   # Or PM2 status
   pm2 status
   ```

3. **Test email service**
   ```typescript
   const emailService = new EmailService();
   const isConnected = await emailService.verifyConnection();
   console.log('Email service connected:', isConnected);
   ```

### High Failure Rate

1. Check SMTP credentials in `.env`
2. Verify email service is not rate limiting
3. Check email templates for errors
4. Review error messages in failed emails
5. Test with a different email provider

### Queue Growing Too Large

1. Increase job frequency
2. Check for email service issues
3. Review failed emails for patterns
4. Consider scaling email service

## API Integration

### Admin Endpoints (Future Enhancement)

```typescript
// Get queue statistics
GET /api/admin/email-queue/stats

// Get failed emails
GET /api/admin/email-queue/failed

// Retry failed email
POST /api/admin/email-queue/retry/:id

// Process queue manually
POST /api/admin/email-queue/process
```

## Performance Considerations

### Database Indexes

The migration adds indexes for efficient querying:

```sql
CREATE INDEX idx_email_status ON cv_submissions(email_status);
CREATE INDEX idx_email_scheduled_at ON cv_submissions(email_scheduled_at);
CREATE INDEX idx_email_sent_at ON cv_submissions(email_sent_at);
```

### Batch Processing

The queue processor handles up to 100 emails per run:

```typescript
// In EmailQueueService.processQueue()
LIMIT 100
```

Adjust this limit based on:
- Email service rate limits
- Job execution time
- Server resources

## Security Considerations

1. **Email Content**: Sanitize all user data in emails
2. **Rate Limiting**: Respect email provider limits
3. **Authentication**: Secure SMTP credentials
4. **Logging**: Don't log sensitive information
5. **Access Control**: Restrict admin endpoints

## Future Enhancements

1. **Priority Queue**: High-priority emails sent first
2. **Email Templates**: Multiple template versions for A/B testing
3. **Tracking**: Open and click tracking
4. **Webhooks**: Real-time delivery notifications
5. **Analytics**: Detailed email performance metrics
6. **Bulk Operations**: Batch retry for failed emails
7. **Admin UI**: Dashboard for queue management

## Related Documentation

- [Email Service Implementation](./EMAIL_SERVICE_IMPLEMENTATION.md)
- [Email Setup Guide](./EMAIL_SETUP_GUIDE.md)
- [Background Jobs README](../jobs/README.md)
- [API Endpoints](./API_ENDPOINTS.md)
