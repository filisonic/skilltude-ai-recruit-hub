# Render Environment Variables - Fix Now

## 🚨 Issues Found in Your Render Logs

1. ❌ `FRONTEND_URL=https://www.skilltude.com` (has www)
2. ❌ Missing `UPLOAD_DIR` variable
3. ❌ Database access denied

## ✅ Fix These on Render Dashboard

### Step 1: Go to Render

1. Visit: https://dashboard.render.com
2. Click on your service: **skilltude-ai-recruit-hub**
3. Click **"Environment"** tab (left sidebar)

### Step 2: Update These Variables

**Find and CHANGE:**

```env
# WRONG (current):
FRONTEND_URL=https://www.skilltude.com

# CORRECT (change to):
FRONTEND_URL=https://skilltude.com
```

**ADD this new variable:**

```env
UPLOAD_DIR=/tmp/uploads/cvs
```

### Step 3: Verify All Variables

Make sure you have ALL of these:

```env
# Server
NODE_ENV=production
PORT=10000

# Frontend (FIX THIS - remove www)
FRONTEND_URL=https://skilltude.com

# Database
DB_HOST=srv878.hstgr.io
DB_PORT=3306
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1

# File Storage (ADD THIS)
UPLOAD_DIR=/tmp/uploads/cvs
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Email
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=careers@skilltude.com
SMTP_PASS=gsqu obzl levs mhbj
EMAIL_FROM_ADDRESS=careers@skilltude.com
EMAIL_FROM_NAME=SkillTude Careers Team

# Security
JWT_SECRET=f1852fe899833aba9afb0f90bbc1051ea8ce47a62fce0177b8c66249961d6112eb12d1c1c6f61ce4d7698280701dc3c7001d4ed46cd2d1cf6223c742bc286dbf
SESSION_SECRET=d5b622ab3e0b4742161a4aafe41677f0740956189286edb20a132085b2ecff896779d5f5d9a4f880d26173c0b5ec6538a5f80449ca78437ace7274763f24fb9d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5

# Analysis
EMAIL_DELAY_HOURS=24
MIN_CV_SCORE=0
MAX_CV_SCORE=100

# Admin
ADMIN_EMAIL=careers@skilltude.com

# Monitoring
ENABLE_MONITORING=true
LOG_LEVEL=info
```

### Step 4: Save and Redeploy

1. Click **"Save Changes"** button
2. Render will automatically redeploy (takes 2-3 minutes)
3. Watch the "Events" or "Logs" tab

## 🎯 What Each Fix Does

### Fix 1: Remove `www` from FRONTEND_URL

**Why:** Your frontend is at `https://skilltude.com` (no www)

**Before:**
```env
FRONTEND_URL=https://www.skilltude.com  ❌
```

**After:**
```env
FRONTEND_URL=https://skilltude.com  ✅
```

**Impact:** Fixes CORS errors

### Fix 2: Add UPLOAD_DIR

**Why:** Render needs to know where to store uploaded files

**Add:**
```env
UPLOAD_DIR=/tmp/uploads/cvs
```

**Impact:** Fixes file storage errors

**Note:** `/tmp` is temporary storage on Render. Files are deleted on redeploy. This is OK for CV analysis since we only need them temporarily.

## 🧪 Verify the Fix

### Check 1: Render Logs

After redeploy, check logs for:

**Should see:**
```
✅ Server is ready to accept connections
✅ Environment: production
✅ Frontend: https://skilltude.com
```

**Should NOT see:**
```
❌ Access denied for user
❌ ENOENT: no such file or directory
❌ CORS error
```

### Check 2: Test CV Upload

1. Go to https://skilltude.com/upload-cv
2. Upload a test CV
3. Check Render logs:

**Should see:**
```
✅ File Operation - STORE: [filename], Success: true
✅ CV upload processed successfully
```

## 📋 Copy-Paste Ready

If you want to copy-paste all variables at once:

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://skilltude.com
DB_HOST=srv878.hstgr.io
DB_PORT=3306
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
UPLOAD_DIR=/tmp/uploads/cvs
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=careers@skilltude.com
SMTP_PASS=gsqu obzl levs mhbj
EMAIL_FROM_ADDRESS=careers@skilltude.com
EMAIL_FROM_NAME=SkillTude Careers Team
JWT_SECRET=f1852fe899833aba9afb0f90bbc1051ea8ce47a62fce0177b8c66249961d6112eb12d1c1c6f61ce4d7698280701dc3c7001d4ed46cd2d1cf6223c742bc286dbf
SESSION_SECRET=d5b622ab3e0b4742161a4aafe41677f0740956189286edb20a132085b2ecff896779d5f5d9a4f880d26173c0b5ec6538a5f80449ca78437ace7274763f24fb9d
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5
EMAIL_DELAY_HOURS=24
MIN_CV_SCORE=0
MAX_CV_SCORE=100
ADMIN_EMAIL=careers@skilltude.com
ENABLE_MONITORING=true
LOG_LEVEL=info
```

## ⚠️ Important Notes

### About `/tmp` Storage on Render

- ✅ Files stored in `/tmp/uploads/cvs`
- ⚠️ Files deleted on each redeploy
- ✅ OK for CV analysis (temporary processing)
- ❌ NOT for permanent storage

**Why this is OK:**
1. CV is uploaded
2. Text is extracted
3. Analysis is performed
4. Results saved to database
5. Email queued
6. File can be deleted

### About Database Access

After fixing Render environment variables, you STILL need to:
1. Enable Remote MySQL on Hostinger
2. Add `%` or Render IPs to whitelist

See: `FIX_RENDER_DATABASE_ACCESS.md`

## 🔄 Deployment Timeline

```
1. Update environment variables on Render
   ↓ (30 seconds)
2. Click "Save Changes"
   ↓ (automatic)
3. Render starts redeploying
   ↓ (2-3 minutes)
4. New version goes live
   ↓ (immediate)
5. Test CV upload
```

## 🆘 If Still Not Working

### Issue: Still Getting Database Error

**You need to ALSO:**
1. Enable Remote MySQL on Hostinger
2. See: `HOSTINGER_REMOTE_MYSQL_SETUP.md`

### Issue: File Upload Fails

**Check:**
1. `UPLOAD_DIR=/tmp/uploads/cvs` is set
2. Render has redeployed
3. Check logs for file errors

### Issue: CORS Error

**Check:**
1. `FRONTEND_URL=https://skilltude.com` (no www)
2. No trailing slash
3. Exact match with your domain

## ✅ Success Checklist

- [ ] Logged into Render Dashboard
- [ ] Opened Environment tab
- [ ] Changed `FRONTEND_URL` (removed www)
- [ ] Added `UPLOAD_DIR=/tmp/uploads/cvs`
- [ ] Clicked "Save Changes"
- [ ] Waited for redeploy (2-3 min)
- [ ] Checked logs for errors
- [ ] Tested CV upload

---

**Do this NOW - takes 5 minutes!** ⏰

**Then do:** `FIX_RENDER_DATABASE_ACCESS.md` (Hostinger MySQL setup)

**Both fixes needed for CV upload to work!** 🎯
