# 🔧 Fix Render 502 Bad Gateway Error

## 🔍 What's Happening:

**502 Bad Gateway** = Render service is crashing or not starting properly.

The CORS error is a side effect - we need to fix the 502 first.

---

## 📋 Step-by-Step Fix:

### Step 1: Check Render Logs

1. **Go to Render Dashboard:**
   - https://dashboard.render.com
   - Click on your service: `skilltude-ai-recruit-hub`

2. **Click "Logs" tab** (left sidebar)

3. **Look for errors** - Common issues:
   - Database connection failed
   - Missing environment variables
   - Module import errors
   - Port binding issues

4. **Share the error** - Look for lines with `Error:` or `failed`

---

### Step 2: Verify Environment Variables

**In Render Dashboard → Environment tab, verify ALL these exist:**

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://www.skilltude.com

# Database
DB_HOST=srv1510.hstgr.io
DB_PORT=3306
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1

# Email
EMAIL_PROVIDER=smtp
EMAIL_FROM_ADDRESS=noreply@skilltude.com
EMAIL_FROM_NAME=SkillTude Team
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@skilltude.com
SMTP_PASS=your_email_password

# Security
JWT_SECRET=your_64_char_secret
SESSION_SECRET=your_64_char_secret

# File Storage
UPLOAD_DIR=/tmp/uploads/cvs
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Other
EMAIL_DELAY_HOURS=24
MIN_CV_SCORE=0
MAX_CV_SCORE=100
ADMIN_EMAIL=admin@skilltude.com
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5
ENABLE_VIRUS_SCANNING=false
ENABLE_MONITORING=true
LOG_LEVEL=info
```

---

### Step 3: Test Database Connection

The most common cause of 502 is database connection failure.

**Test from Render:**
1. In Render Dashboard → Shell tab
2. Run:
   ```bash
   node -e "const mysql = require('mysql2/promise'); mysql.createConnection({host:'srv1510.hstgr.io',user:'u931066387_management',password:'Skilly@skilltude1',database:'u931066387_skilltude'}).then(()=>console.log('OK')).catch(e=>console.log('FAIL:',e.message))"
   ```

**If it fails:**
- Check if Hostinger MySQL allows external connections
- Verify database credentials
- Check if IP whitelist is needed

---

### Step 4: Manual Restart

1. In Render Dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete
4. Check logs for errors

---

## 🎯 Quick Diagnostic Checklist:

Check Render Logs for these specific errors:

### Error 1: Database Connection
```
Error: connect ETIMEDOUT
Error: ER_ACCESS_DENIED_ERROR
```
**Fix:** Check DB credentials and external access

### Error 2: Missing Environment Variable
```
Error: JWT_SECRET is required
Error: DB_HOST is not defined
```
**Fix:** Add missing env vars in Render

### Error 3: Port Binding
```
Error: listen EADDRINUSE
```
**Fix:** Make sure PORT=10000 in env vars

### Error 4: Module Not Found
```
Error: Cannot find module
```
**Fix:** Rebuild with `npm install` in build command

---

## 🔧 Common Fixes:

### Fix 1: Update Build Command

In Render Dashboard → Settings:

**Build Command:**
```bash
npm install --include=dev && npm run server:build
```

**Start Command:**
```bash
node server/dist/index.js
```

### Fix 2: Add Upload Directory

Render's filesystem is read-only except `/tmp`. Update env var:
```
UPLOAD_DIR=/tmp/uploads/cvs
```

### Fix 3: Database External Access

**In Hostinger:**
1. Go to phpMyAdmin
2. Check if remote connections are allowed
3. May need to whitelist Render's IP or allow all (%)

---

## 📞 What to Share:

If still not working, share:

1. **Last 50 lines of Render logs** (from Logs tab)
2. **Environment variables** (screenshot, hide passwords)
3. **Build output** (from deploy logs)

---

## 🎯 Expected Successful Logs:

When working, you should see:
```
Email service initialized with provider: smtp
╔════════════════════════════════════════╗
║ CV Analysis System Server              ║
║ Environment: production                ║
║ Port: 10000                           ║
║ Server is ready to accept connections  ║
╚════════════════════════════════════════╝
```

---

## 💡 Temporary Workaround:

While debugging, you can test the API directly:

```bash
curl https://skilltude-ai-recruit-hub.onrender.com/api/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

**If you get 502:** Service is crashed
**If you get CORS error:** Service is running but CORS misconfigured
**If you get timeout:** Service is sleeping (wait 60 sec)

---

**Check the Render logs and let me know what error you see!** 🔍
