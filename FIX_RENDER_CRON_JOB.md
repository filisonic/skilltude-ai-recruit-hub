# Fix Render Cron Job - Email Queue Processing

## 🚨 Problem

The cron job on Render is failing because it can't connect to the database (same issue we just fixed for the main app).

## ✅ Solution

The cron job needs the same environment variables as your main service.

### Step 1: Go to Render Dashboard

1. Visit: https://dashboard.render.com
2. Look for your **Cron Job** (not the web service)
3. It might be named something like "process-email-queue" or "email-queue-processor"

### Step 2: Check if Cron Job Exists

**If you see a cron job:**
- Click on it
- Go to "Environment" tab
- Make sure it has ALL the same variables as your web service

**If you DON'T see a cron job:**
- You need to create one (see Step 3)

### Step 3: Create Cron Job on Render

1. **Click "New +" button** (top right)
2. **Select "Cron Job"**
3. **Connect your repository** (same as web service)
4. **Configure:**

```
Name: email-queue-processor
Branch: main (or your default branch)
Build Command: npm run server:build
Start Command: node server/dist/jobs/processEmailQueue.js
Schedule: */15 * * * * (every 15 minutes)
```

5. **Add Environment Variables** (copy ALL from your web service):

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

6. **Click "Create Cron Job"**

### Step 4: Test the Cron Job

After creating:

1. Go to the cron job page
2. Click "Trigger Run" (manual test)
3. Check the logs
4. Should see:
   ```
   ✓ Email service connection verified
   ✓ Emails sent successfully: X
   ```

## 📊 How It Works

```
Every 15 minutes:
    ↓
Cron job runs
    ↓
Checks database for emails scheduled to send
    ↓
Sends emails that are due
    ↓
Updates database with sent status
```

## 🧪 Verify It's Working

### Check Database

Run this in phpMyAdmin:

```sql
-- Check pending emails
SELECT 
    uuid,
    email,
    email_status,
    email_scheduled_for,
    email_attempts,
    submitted_at
FROM cv_submissions
WHERE email_status = 'pending'
ORDER BY email_scheduled_for ASC;
```

### Check Render Logs

1. Go to cron job page
2. Click "Logs" tab
3. Should see runs every 15 minutes
4. Look for "Emails sent successfully"

## ⏰ Schedule Options

**Current: Every 15 minutes**
```
*/15 * * * *
```

**Every 5 minutes (more frequent):**
```
*/5 * * * *
```

**Every hour:**
```
0 * * * *
```

**Every 30 minutes:**
```
*/30 * * * *
```

## 🆘 Troubleshooting

### Cron Job Fails with Database Error

**Problem:** Same as before - database access denied

**Solution:** The cron job needs the same database credentials as your web service. Make sure ALL environment variables are copied.

### Cron Job Doesn't Run

**Check:**
1. Is it enabled? (should show "Active")
2. Is the schedule correct?
3. Check logs for errors

### Emails Not Sending

**Check:**
1. Are there pending emails in database?
2. Is `email_scheduled_for` in the past?
3. Check SMTP credentials are correct
4. Look at cron job logs for errors

## 📝 Quick Checklist

- [ ] Cron job exists on Render
- [ ] Has all environment variables
- [ ] Schedule is set (*/15 * * * *)
- [ ] Build command: `npm run server:build`
- [ ] Start command: `node server/dist/jobs/processEmailQueue.js`
- [ ] Manually triggered and works
- [ ] Logs show successful runs
- [ ] Emails are being sent

## 🎯 Expected Behavior

**After CV Upload:**
1. CV uploaded → saved to database
2. Email queued with `email_scheduled_for` = 24 hours from now
3. Status = 'pending'

**24 Hours Later:**
1. Cron job runs
2. Finds email that's due
3. Sends email with CV analysis
4. Updates status to 'sent'
5. Sets `email_sent_at` timestamp

## 📧 Test Email Sending

To test immediately (without waiting 24 hours):

```sql
-- Update a submission to send email now
UPDATE cv_submissions
SET email_scheduled_for = NOW()
WHERE uuid = 'YOUR_SUBMISSION_UUID';
```

Then wait for next cron run (max 15 minutes) or trigger manually.

---

**Time to fix:** 5-10 minutes

**Once done, emails will send automatically!** 📧
