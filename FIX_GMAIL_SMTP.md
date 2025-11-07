# Fix Gmail SMTP Authentication

## 🚨 Problem

Gmail is rejecting the login:
```
535-5.7.8 Username and Password not accepted
```

## ✅ Solutions (Pick One)

### Option 1: Generate New Gmail App Password (Recommended)

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already)
   - Security → 2-Step Verification → Turn On

3. **Generate App Password**
   - Security → 2-Step Verification → App passwords
   - Select app: "Mail"
   - Select device: "Other" → Type "Render CV System"
   - Click "Generate"
   - Copy the 16-character password (like: `abcd efgh ijkl mnop`)

4. **Update Render Environment Variables**
   - Go to Render Dashboard
   - Both Web Service AND Cron Job
   - Update: `SMTP_PASS=abcdefghijklmnop` (no spaces!)

### Option 2: Use a Different Email Service (Easier)

Instead of Gmail, use a service designed for transactional emails:

#### A. SendGrid (Free tier: 100 emails/day)

1. **Sign up:** https://sendgrid.com
2. **Verify your email**
3. **Create API Key:**
   - Settings → API Keys → Create API Key
   - Name: "Render CV System"
   - Permissions: "Full Access" or "Mail Send"
   - Copy the key (starts with `SG.`)

4. **Update Render Environment:**
   ```
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.your_key_here
   EMAIL_FROM_ADDRESS=careers@skilltude.com
   ```

5. **Remove SMTP variables** (or leave them, they won't be used)

#### B. Mailgun (Free tier: 5,000 emails/month)

1. **Sign up:** https://mailgun.com
2. **Verify domain** (or use sandbox for testing)
3. **Get API Key:**
   - Settings → API Keys
   - Copy "Private API key"

4. **Update Render Environment:**
   ```
   EMAIL_PROVIDER=mailgun
   MAILGUN_API_KEY=your_key_here
   MAILGUN_DOMAIN=mg.skilltude.com
   EMAIL_FROM_ADDRESS=careers@skilltude.com
   ```

#### C. AWS SES (Very cheap, but more setup)

1. **Sign up for AWS**
2. **Verify email in SES**
3. **Get credentials**
4. **Update Render Environment:**
   ```
   EMAIL_PROVIDER=ses
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   EMAIL_FROM_ADDRESS=careers@skilltude.com
   ```

### Option 3: Use Different SMTP Provider

#### Hostinger Email (If you have email hosting)

```
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=careers@skilltude.com
SMTP_PASS=your_hostinger_email_password
EMAIL_FROM_ADDRESS=careers@skilltude.com
```

## 🎯 Recommended: SendGrid

**Why SendGrid:**
- ✅ Free tier (100 emails/day)
- ✅ Easy setup (just API key)
- ✅ No SMTP issues
- ✅ Better deliverability
- ✅ Email tracking
- ✅ No 2FA hassles

**Setup time:** 5 minutes

## 📝 Steps for SendGrid (Detailed)

### 1. Sign Up

1. Go to https://sendgrid.com
2. Click "Start for Free"
3. Fill in details
4. Verify your email

### 2. Create API Key

1. Login to SendGrid
2. Go to Settings → API Keys
3. Click "Create API Key"
4. Name: "Render CV System"
5. Permissions: "Full Access"
6. Click "Create & View"
7. **Copy the key** (you won't see it again!)

### 3. Update Render (Both Services!)

**Web Service:**
1. Go to Render Dashboard
2. Click your web service
3. Environment tab
4. Update these:
   ```
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.paste_your_key_here
   ```
5. Save

**Cron Job:**
1. Go to Render Dashboard
2. Click your cron job
3. Environment tab
4. Add the SAME variables:
   ```
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.paste_your_key_here
   EMAIL_FROM_ADDRESS=careers@skilltude.com
   EMAIL_FROM_NAME=SkillTude Careers Team
   ```
5. Save

### 4. Test

Wait for services to redeploy, then check cron job logs.

Should see:
```
✓ Email service connection verified
✓ Emails sent successfully
```

## 🔍 Why Gmail is Problematic

1. **Security restrictions** - Google blocks "less secure" apps
2. **App passwords** - Require 2FA, can expire
3. **Rate limits** - Gmail limits sending
4. **Deliverability** - Transactional emails from Gmail often go to spam

## ✅ After Fixing

Once you update the email provider:

1. **Check cron job logs** - Should see success
2. **Test email** - Update a submission to send now:
   ```sql
   UPDATE cv_submissions
   SET email_scheduled_for = NOW()
   WHERE id = 17;
   ```
3. **Wait 15 minutes** - Cron runs every 15 min
4. **Check your email** - Should receive CV analysis

## 📊 Comparison

| Provider | Free Tier | Setup | Reliability |
|----------|-----------|-------|-------------|
| Gmail SMTP | Unlimited | Hard | ⚠️ Issues |
| SendGrid | 100/day | Easy | ✅ Great |
| Mailgun | 5000/month | Easy | ✅ Great |
| AWS SES | 62,000/month | Medium | ✅ Great |
| Hostinger | Depends | Easy | ✅ Good |

## 🆘 Still Having Issues?

If you stick with Gmail:

1. **Check 2FA is enabled**
2. **Generate NEW app password**
3. **Copy without spaces:** `abcdefghijklmnop`
4. **Update BOTH services** (web + cron)
5. **Wait for redeploy**

---

**My recommendation:** Switch to SendGrid. It's free, easy, and reliable. Takes 5 minutes to set up and you'll never have authentication issues again.
