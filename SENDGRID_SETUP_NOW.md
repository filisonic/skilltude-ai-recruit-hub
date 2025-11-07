# SendGrid Setup - Step by Step

## 🚀 Step 1: Sign Up for SendGrid (2 minutes)

1. **Go to SendGrid:**
   - Visit: https://sendgrid.com
   - Click "Start for Free" or "Sign Up"

2. **Fill in the form:**
   - Email: (use your email)
   - Password: (create a strong password)
   - Click "Create Account"

3. **Verify your email:**
   - Check your inbox
   - Click the verification link
   - Complete any additional setup steps

## 🔑 Step 2: Create API Key (2 minutes)

1. **Login to SendGrid Dashboard**
   - Go to: https://app.sendgrid.com

2. **Navigate to API Keys:**
   - Click "Settings" (left sidebar)
   - Click "API Keys"
   - Or go directly to: https://app.sendgrid.com/settings/api_keys

3. **Create New API Key:**
   - Click "Create API Key" button (top right)
   - Name: `Render CV System`
   - API Key Permissions: Select "Full Access"
   - Click "Create & View"

4. **COPY THE KEY!**
   - You'll see a key starting with `SG.`
   - **COPY IT NOW** - you won't see it again!
   - Example: `SG.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

## ⚙️ Step 3: Update Render Web Service (2 minutes)

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Click on your **web service**: `skilltude-ai-recruit-hub`

2. **Go to Environment tab:**
   - Click "Environment" in the left sidebar

3. **Update these variables:**

   **Change:**
   ```
   EMAIL_PROVIDER=smtp
   ```
   **To:**
   ```
   EMAIL_PROVIDER=sendgrid
   ```

   **Add new variable:**
   ```
   Key: SENDGRID_API_KEY
   Value: SG.paste_your_key_here
   ```

4. **Click "Save Changes"**
   - Service will automatically redeploy (takes 2-3 minutes)

## ⚙️ Step 4: Update Render Cron Job (2 minutes)

1. **Go to Render Dashboard:**
   - Click on your **cron job** (email queue processor)

2. **Go to Environment tab:**
   - Click "Environment" in the left sidebar

3. **Add these variables:**
   ```
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.paste_your_key_here
   EMAIL_FROM_ADDRESS=careers@skilltude.com
   EMAIL_FROM_NAME=SkillTude Careers Team
   ```

4. **Click "Save Changes"**

## ✅ Step 5: Verify It's Working (5 minutes)

### Wait for Redeploy
- Wait 2-3 minutes for both services to redeploy
- Check the "Events" tab to see when deployment is complete

### Check Cron Job Logs
1. Go to your cron job on Render
2. Click "Logs" tab
3. Wait for next run (every 15 minutes) or click "Trigger Run"
4. Look for:
   ```
   ✓ Email service connection verified
   ✓ Emails sent successfully
   ```

### Test Email Sending

**Option A: Wait for scheduled email** (24 hours from CV upload)

**Option B: Send test email now:**

1. Go to Hostinger phpMyAdmin
2. Run this SQL:
   ```sql
   UPDATE cv_submissions
   SET email_scheduled_for = NOW()
   WHERE id = 17;
   ```
3. Wait 15 minutes for cron to run
4. Check your email!

## 📊 What You Should See

### In Cron Job Logs (Success):
```
================================================================================
Email Queue Processor Started
Timestamp: 2025-01-07T...
================================================================================
Email service initialized with provider: sendgrid
✓ Email service connection verified

Queue Statistics (Before):
  Pending:  1
  Queued:   0
  Retrying: 0
  Sent:     16
  Failed:   0

--------------------------------------------------------------------------------
Processing Email Queue...
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
Queue Processing Complete
--------------------------------------------------------------------------------
✓ Emails sent successfully: 1
✗ Emails failed: 0

Queue Statistics (After):
  Pending:  0
  Queued:   0
  Retrying: 0
  Sent:     17
  Failed:   0

================================================================================
Email Queue Processor Finished Successfully
================================================================================
```

### In Your Email Inbox:
You should receive an email with:
- Subject: "Your CV Analysis Results - SkillTude"
- From: SkillTude Careers Team <careers@skilltude.com>
- Content: CV analysis with score, strengths, improvements

## 🆘 Troubleshooting

### Issue: "API key not found"

**Check:**
1. Did you copy the full key including `SG.`?
2. Did you add it to BOTH web service AND cron job?
3. Did you save changes?

**Fix:**
- Go back to SendGrid
- Create a new API key
- Update both Render services

### Issue: "Sender email not verified"

**Problem:** SendGrid requires sender verification

**Fix:**
1. Go to SendGrid Dashboard
2. Settings → Sender Authentication
3. Verify Single Sender: `careers@skilltude.com`
4. Check your email and click verification link

### Issue: Still seeing SMTP errors

**Check:**
- Make sure `EMAIL_PROVIDER=sendgrid` (not `smtp`)
- Check for typos in variable names
- Verify both services have the variables

## 📝 Environment Variables Summary

**Both Web Service AND Cron Job need:**
```
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_actual_key_here
EMAIL_FROM_ADDRESS=careers@skilltude.com
EMAIL_FROM_NAME=SkillTude Careers Team
```

**You can remove (but don't have to):**
```
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
```

## ✅ Success Checklist

- [ ] Signed up for SendGrid
- [ ] Verified email
- [ ] Created API key
- [ ] Copied API key (starts with SG.)
- [ ] Updated web service environment
- [ ] Updated cron job environment
- [ ] Waited for redeploy (2-3 min)
- [ ] Checked cron job logs
- [ ] Saw "Email service connection verified"
- [ ] Tested email sending
- [ ] Received test email

## 🎉 You're Done!

Once you see "Email service connection verified" in the cron job logs, you're all set! Emails will now send automatically 24 hours after CV upload.

---

**Time:** 10 minutes total
**Cost:** Free (100 emails/day)
**Reliability:** ✅ Excellent

**Need help?** Check the logs or let me know!
