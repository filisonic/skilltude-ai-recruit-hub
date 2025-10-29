# Task 15: Email Delivery Scheduling - Quick Start Guide

## Overview

This guide will help you quickly set up and test the email delivery scheduling system.

## Prerequisites

- Database is running and accessible
- Email service is configured (SMTP credentials in `.env`)
- Server is running

## Step 1: Apply Database Migration

```bash
cd database_migrations

# Apply the migration
node apply_migration.js add_email_queue_fields.sql

# Verify migration
mysql -u your_user -p your_database -e "DESCRIBE cv_submissions;"
# You should see the new email_* columns
```

## Step 2: Test Email Queue Service

### Option A: Manual Test (Development)

```bash
# Run the background job once
npm run job:email-queue

# You should see output like:
# ================================================================================
# Email Queue Processor Started
# Timestamp: 2024-12-25T10:00:00.000Z
# ================================================================================
# ✓ Email service connection verified
# ...
```

### Option B: Submit a Test CV

1. Go to your website's CV upload page
2. Submit a test CV with your email
3. Check the database:

```sql
SELECT 
  id, email, email_status, email_scheduled_at, email_attempts
FROM cv_submissions
ORDER BY id DESC
LIMIT 1;

-- You should see:
-- email_status = 'queued'
-- email_scheduled_at = NOW() + 24 hours
-- email_attempts = 0
```

## Step 3: Set Up Background Job

### Option 1: PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Build the project
npm run server:build

# Start the cron job (runs every 15 minutes)
pm2 start server/jobs/processEmailQueue.ts \
  --cron "*/15 * * * *" \
  --no-autorestart \
  --name email-queue-processor

# Check status
pm2 status

# View logs
pm2 logs email-queue-processor

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
```

### Option 2: Cron (Linux/Mac)

```bash
# Edit crontab
crontab -e

# Add this line (runs every 15 minutes)
*/15 * * * * cd /path/to/your/project && npm run job:email-queue:prod >> /path/to/logs/email-queue.log 2>&1

# Save and exit
# Verify cron job is scheduled
crontab -l
```

### Option 3: Windows Task Scheduler

1. Open Task Scheduler
2. Click "Create Basic Task"
3. Name: "Email Queue Processor"
4. Trigger: Daily
5. Check "Repeat task every: 15 minutes"
6. Action: Start a program
   - Program/script: `node`
   - Add arguments: `server/dist/jobs/processEmailQueue.js`
   - Start in: `C:\path\to\your\project`
7. Finish

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

## Step 4: Access Admin Dashboard

1. Log in to admin dashboard
2. Navigate to: **CV Management → Email Queue** tab
3. You should see:
   - Queue statistics (pending, queued, sent, failed, retrying)
   - Key metrics (sent last 24h, due now, success rate)
   - Failed emails list (if any)

## Step 5: Test the System

### Test 1: Submit a CV

```bash
# Submit a test CV via the website
# Then check the database:

mysql -u your_user -p your_database

SELECT 
  id, email, email_status, email_scheduled_at, 
  DATE_ADD(submitted_at, INTERVAL 24 HOUR) as expected_send_time
FROM cv_submissions
WHERE email = 'your-test-email@example.com'
ORDER BY id DESC
LIMIT 1;
```

### Test 2: Process Queue Manually

```bash
# Run the job manually
npm run job:email-queue

# Or via admin UI:
# Go to Email Queue tab → Click "Process Queue" button
```

### Test 3: Test Immediate Delivery (for testing)

```sql
-- Update scheduled time to now (for testing)
UPDATE cv_submissions
SET email_scheduled_at = NOW()
WHERE email = 'your-test-email@example.com'
AND email_status = 'queued';

-- Run the job
npm run job:email-queue

-- Check if email was sent
SELECT email_status, email_sent_at, email_attempts
FROM cv_submissions
WHERE email = 'your-test-email@example.com';
```

### Test 4: Test Retry Logic

```sql
-- Simulate a failed email
UPDATE cv_submissions
SET 
  email_status = 'failed',
  email_attempts = 3,
  email_error = 'Test error - manual simulation'
WHERE email = 'your-test-email@example.com';

-- Go to admin UI → Email Queue tab
-- You should see the failed email
-- Click "Retry" button
-- Email should be sent successfully
```

## Step 6: Monitor the System

### Check Queue Statistics

```bash
# Via API (requires authentication)
curl -X GET http://localhost:5000/api/admin/cv-submissions/email-queue/stats \
  -H "Cookie: your-session-cookie"

# Or via admin UI:
# Go to Email Queue tab to see real-time statistics
```

### Check Failed Emails

```bash
# Via API
curl -X GET http://localhost:5000/api/admin/cv-submissions/email-queue/failed \
  -H "Cookie: your-session-cookie"

# Or via admin UI:
# Go to Email Queue tab → Scroll to "Failed Email Deliveries" section
```

### Check Logs

```bash
# If using PM2
pm2 logs email-queue-processor

# If using cron
tail -f /path/to/logs/email-queue.log

# If using Windows Task Scheduler
# Check Task Scheduler History
```

## Troubleshooting

### Issue: Emails not being sent

**Check 1: Is the background job running?**

```bash
# PM2
pm2 status

# Cron
ps aux | grep processEmailQueue

# Windows
# Open Task Scheduler and check if task is running
```

**Check 2: Are there emails in the queue?**

```sql
SELECT COUNT(*) as queued_count
FROM cv_submissions
WHERE email_status = 'queued'
AND email_scheduled_at <= NOW();
```

**Check 3: Is email service configured?**

```bash
# Check .env file
cat .env | grep EMAIL

# Test email service
npm run job:email-queue
# Look for "✓ Email service connection verified"
```

### Issue: High failure rate

**Check error messages:**

```sql
SELECT 
  email, email_error, email_attempts, email_last_attempt_at
FROM cv_submissions
WHERE email_status = 'failed'
ORDER BY email_last_attempt_at DESC
LIMIT 10;
```

**Common errors and solutions:**

1. **"SMTP connection timeout"**
   - Check SMTP server is accessible
   - Verify firewall settings
   - Check SMTP credentials

2. **"Authentication failed"**
   - Verify SMTP username/password
   - Check if 2FA is enabled (use app password)
   - Verify SMTP port (587 for TLS, 465 for SSL)

3. **"Rate limit exceeded"**
   - Reduce job frequency
   - Upgrade email service plan
   - Use different email provider

### Issue: Queue growing too large

**Check queue size:**

```sql
SELECT 
  email_status,
  COUNT(*) as count
FROM cv_submissions
GROUP BY email_status;
```

**Solutions:**

1. Increase job frequency (run every 5-10 minutes)
2. Process queue manually via admin UI
3. Check for email service issues
4. Review failed emails and fix issues

## Verification Checklist

- [ ] Database migration applied successfully
- [ ] New email_* columns exist in cv_submissions table
- [ ] Background job is scheduled and running
- [ ] Email service connection verified
- [ ] Test CV submission creates queued email
- [ ] Background job processes queue successfully
- [ ] Admin UI displays queue statistics
- [ ] Failed emails appear in admin UI
- [ ] Manual retry functionality works
- [ ] Logs are being generated

## Next Steps

1. **Monitor for 24-48 hours**
   - Check queue statistics daily
   - Review failed emails
   - Monitor success rate

2. **Set up alerts** (optional)
   - High failure rate (>10%)
   - Queue backing up (>50 due now)
   - No emails sent in 24 hours

3. **Optimize settings**
   - Adjust job frequency based on volume
   - Fine-tune retry delays
   - Configure email service rate limits

4. **Document your setup**
   - Note which scheduling method you used
   - Document any custom configurations
   - Keep track of email service limits

## Support

If you encounter issues:

1. Check the logs first
2. Review the troubleshooting section
3. Consult the full documentation:
   - [Email Queue Implementation](./EMAIL_QUEUE_IMPLEMENTATION.md)
   - [Email Status Tracking](./EMAIL_STATUS_TRACKING.md)
   - [Task 15 Summary](./TASK_15_EMAIL_SCHEDULING_SUMMARY.md)

## Quick Reference

### Useful Commands

```bash
# Run job manually
npm run job:email-queue

# Check PM2 status
pm2 status

# View PM2 logs
pm2 logs email-queue-processor

# Restart PM2 job
pm2 restart email-queue-processor

# Check cron jobs
crontab -l

# View cron logs
grep CRON /var/log/syslog
```

### Useful SQL Queries

```sql
-- Check queue status
SELECT email_status, COUNT(*) as count
FROM cv_submissions
GROUP BY email_status;

-- Check emails due now
SELECT COUNT(*) as due_now
FROM cv_submissions
WHERE email_status IN ('queued', 'retrying')
AND email_scheduled_at <= NOW();

-- Check recent failures
SELECT email, email_error, email_last_attempt_at
FROM cv_submissions
WHERE email_status = 'failed'
ORDER BY email_last_attempt_at DESC
LIMIT 10;

-- Check success rate
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN email_status = 'sent' THEN 1 ELSE 0 END) as sent,
  ROUND(SUM(CASE WHEN email_status = 'sent' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
FROM cv_submissions
WHERE email_status IN ('sent', 'failed');
```

## Congratulations!

You've successfully set up the email delivery scheduling system. The system will now:

- ✅ Queue emails for delayed delivery (24-48 hours)
- ✅ Automatically retry failed emails
- ✅ Track all email delivery attempts
- ✅ Provide admin visibility and control
- ✅ Log all activities for monitoring

Happy emailing! 📧
