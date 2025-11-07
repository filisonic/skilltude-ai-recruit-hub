# Set Up Cron Job on Render for Email Queue Processing

## What This Does

This cron job will automatically process the email queue every hour and send scheduled CV analysis emails to candidates.

## Step-by-Step Instructions

### 1. Go to Render Dashboard

Visit: https://dashboard.render.com

### 2. Create a New Cron Job

1. Click the **"New +"** button in the top right
2. Select **"Cron Job"**

### 3. Connect Your Repository

1. Select your GitHub repository: **skilltude-ai-recruit-hub**
2. Click **"Connect"**

### 4. Configure the Cron Job

Fill in these details:

**Name:**
```
email-queue-processor
```

**Region:**
```
Singapore (Southeast Asia)
```
(Choose the same region as your web service)

**Branch:**
```
main
```

**Build Command:**
```
npm install && npm run server:build
```

**Command:**
```
node server/dist/jobs/processEmailQueue.js
```

**Schedule:**
```
0 * * * *
```
(This runs every hour at minute 0)

**Alternative Schedules:**
- Every 30 minutes: `*/30 * * * *`
- Every 15 minutes: `*/15 * * * *`
- Every 6 hours: `0 */6 * * *`

### 5. Add Environment Variables

Click **"Advanced"** and add the same environment variables as your web service:

**Required Variables:**
```
NODE_ENV=production
DB_HOST=srv878.hstgr.io
DB_PORT=3306
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=careers@skilltude.com
SMTP_PASS=gsqu obzl levs mhbj
EMAIL_FROM_ADDRESS=careers@skilltude.com
EMAIL_FROM_NAME=SkillTude Careers Team
```

**Tip:** You can copy all environment variables from your existing web service:
1. Go to your web service
2. Click "Environment" tab
3. Copy each variable
4. Paste into the cron job

### 6. Create the Cron Job

Click **"Create Cron Job"**

Render will:
- Build your code
- Schedule the job to run every hour
- Process pending emails automatically

## Verify It's Working

### Check Cron Job Logs

1. Go to your cron job in Render dashboard
2. Click on it
3. View the **"Logs"** tab
4. You'll see output like:
```
================================================================================
Email Queue Processor Started
Timestamp: 2025-10-29T21:00:00.000Z
================================================================================
✓ Email service connection verified

Queue Statistics (Before):
  Pending:  0
  Queued:   1
  Retrying: 0
  Sent:     0
  Failed:   0

--------------------------------------------------------------------------------
Processing Email Queue...
--------------------------------------------------------------------------------

✓ Emails sent successfully: 1
✗ Emails failed: 0
```

### Check Your Database

Run this SQL in phpMyAdmin to see queued emails:

```sql
SELECT 
    id,
    first_name,
    last_name,
    email,
    email_status,
    email_scheduled_at,
    email_sent_at,
    submitted_at
FROM cv_submissions
ORDER BY submitted_at DESC
LIMIT 10;
```

## Manual Trigger (For Testing)

To manually trigger the cron job immediately:

1. Go to your cron job in Render
2. Click **"Trigger Run"** button
3. Watch the logs to see it process

This is useful for testing without waiting for the scheduled time.

## Cost

Render's free tier includes:
- 400 hours/month of cron job runtime
- Running every hour = ~720 hours/month (exceeds free tier)

**Recommendation:** 
- Start with every hour: `0 * * * *`
- If you exceed free tier, change to every 6 hours: `0 */6 * * *`

## Troubleshooting

### Cron Job Fails to Build

- Make sure the build command is correct
- Check that all environment variables are set
- View logs for specific error messages

### Emails Not Sending

- Check that `email_scheduled_at` is in the past
- Verify SMTP credentials are correct
- Check cron job logs for email errors
- Make sure database connection is working

### Database Connection Fails

- Verify Render's IP is whitelisted in Hostinger Remote MySQL
- Check database credentials are correct
- Ensure database exists and has the `cv_submissions` table

## Next Steps

After setting up the cron job:

1. ✅ Cron job will run automatically every hour
2. ✅ Emails scheduled for delivery will be sent
3. ✅ You can monitor progress in the logs
4. ✅ Failed emails will be retried automatically

## For Immediate Testing

If you want to test email sending right now:

1. Set up the cron job as described above
2. Click **"Trigger Run"** to run it immediately
3. Check the logs to see if emails were sent
4. Check your email inbox for the CV analysis

The system is designed to send emails 24 hours after CV submission, so if you just uploaded a CV, you'll need to wait or manually update the `email_scheduled_at` field in the database to a past date for testing.
