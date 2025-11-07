# Set Up Render Cron Job - Quick Guide

## 🎯 What You're Creating

A cron job that runs every hour to send scheduled CV analysis emails.

## 📋 Steps

### 1. Go to Render Dashboard
https://dashboard.render.com

### 2. Create New Cron Job
- Click **"New +"** → **"Cron Job"**
- Connect your **skilltude-ai-recruit-hub** repository

### 3. Configuration

**Name:** `email-queue-processor`

**Region:** `Singapore (Southeast Asia)` (same as your web service)

**Branch:** `main`

**Build Command:**
```bash
npm install && npm run server:build
```

**Command:**
```bash
node server/dist/jobs/processEmailQueue.js
```

**Schedule:** `0 * * * *` (every hour)

### 4. Environment Variables

Click **"Advanced"** and add these (copy from your web service):

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

### 5. Create & Test

1. Click **"Create Cron Job"**
2. Wait for it to build
3. Click **"Trigger Run"** to test immediately
4. Check logs to verify it works

## ✅ Done!

Your cron job will now run every hour and send scheduled emails automatically.

## 🔍 Quick Check

View logs in Render dashboard to see:
- How many emails were processed
- Any errors
- Next scheduled run time
