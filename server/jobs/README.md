# Background Jobs

This directory contains background jobs for the CV Analysis System.

## Email Queue Processor

The `processEmailQueue.ts` job processes the email queue and sends scheduled CV analysis emails.

### Features

- Processes emails scheduled for delivery (24-48 hours after submission)
- Implements retry logic with exponential backoff
- Tracks email delivery status and attempts
- Logs all email attempts for auditing
- Provides queue statistics and failed email reports

### Running the Job

#### Development (with ts-node)

```bash
cd server
npx ts-node jobs/processEmailQueue.ts
```

#### Production (compiled)

```bash
# First, compile TypeScript
npm run build

# Then run the compiled job
node dist/jobs/processEmailQueue.js
```

### Scheduling with Cron

The email queue processor should run periodically to check for and send scheduled emails.

#### Linux/Mac Cron Setup

Edit your crontab:

```bash
crontab -e
```

Add one of these entries:

```bash
# Run every 15 minutes
*/15 * * * * cd /path/to/project && node dist/jobs/processEmailQueue.js >> logs/email-queue.log 2>&1

# Run every 30 minutes
*/30 * * * * cd /path/to/project && node dist/jobs/processEmailQueue.js >> logs/email-queue.log 2>&1

# Run every hour
0 * * * * cd /path/to/project && node dist/jobs/processEmailQueue.js >> logs/email-queue.log 2>&1
```

#### Windows Task Scheduler

1. Open Task Scheduler
2. Create a new task
3. Set trigger to run every 15-30 minutes
4. Set action to run:
   ```
   Program: node
   Arguments: dist/jobs/processEmailQueue.js
   Start in: C:\path\to\project
   ```

#### Using PM2 (Recommended for Production)

PM2 can manage cron jobs and keep them running:

```bash
# Install PM2 globally
npm install -g pm2

# Start the cron job
pm2 start jobs/processEmailQueue.ts --cron "*/15 * * * *" --no-autorestart --name email-queue-processor

# View logs
pm2 logs email-queue-processor

# Stop the job
pm2 stop email-queue-processor

# Remove the job
pm2 delete email-queue-processor
```

#### Using Node-Cron (In-Process Scheduler)

You can also run the job as part of your main application using node-cron:

```typescript
// In your server/index.ts or a separate scheduler file
import cron from 'node-cron';
import { EmailQueueService } from './services/EmailQueueService';

// Run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('Running email queue processor...');
  const queueService = new EmailQueueService();
  await queueService.processQueue();
});
```

### Monitoring

The job outputs detailed logs including:

- Queue statistics before and after processing
- Number of emails sent successfully
- Number of emails that failed
- Details of failed emails for manual review

Example output:

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
...

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

### Troubleshooting

#### Job Not Running

1. Check cron logs: `grep CRON /var/log/syslog` (Linux)
2. Verify file permissions: `chmod +x dist/jobs/processEmailQueue.js`
3. Check Node.js path: `which node`
4. Test manually: `node dist/jobs/processEmailQueue.js`

#### Emails Not Sending

1. Check email service configuration in `.env`
2. Verify SMTP credentials
3. Check email service connection: The job will fail if connection verification fails
4. Review failed email logs in the job output

#### High Failure Rate

1. Check SMTP server status
2. Verify email templates are valid
3. Check for rate limiting from email provider
4. Review error messages in failed email logs

### Best Practices

1. **Frequency**: Run every 15-30 minutes for timely delivery
2. **Logging**: Redirect output to log files for monitoring
3. **Monitoring**: Set up alerts for high failure rates
4. **Backup**: Keep failed emails for manual retry
5. **Testing**: Test in development before deploying to production

### Manual Retry

To manually retry a failed email:

```typescript
import { EmailQueueService } from './services/EmailQueueService';

const queueService = new EmailQueueService();
await queueService.retryFailedEmail(submissionId);
```

Or via API endpoint (see admin routes).
