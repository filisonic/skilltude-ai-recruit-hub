# Fix CV Upload NOW - Quick Reference

## 🚨 3 Critical Issues

1. **Database:** Hostinger blocking Render's IP
2. **CORS:** Wrong FRONTEND_URL (has www)
3. **Storage:** Missing UPLOAD_DIR variable

## ⚡ Quick Fix (15 minutes)

### 1️⃣ Hostinger MySQL (5 min)

```
hPanel → Databases → Remote MySQL → Add host: %
```

**Detailed:** `HOSTINGER_REMOTE_MYSQL_SETUP.md`

### 2️⃣ Render Environment (5 min)

```
Render Dashboard → Environment → Update these:

FRONTEND_URL=https://skilltude.com  (remove www)
UPLOAD_DIR=/tmp/uploads/cvs  (add this)
```

**Detailed:** `RENDER_ENV_FIX_NOW.md`

### 3️⃣ Rebuild Frontend (5 min)

```bash
npm run build
# Upload dist/ to Hostinger
```

**Detailed:** `DEPLOY_CV_UPLOAD_FIX.md`

## ✅ Test

```
Go to: https://skilltude.com/upload-cv
Upload a CV
Should work! ✅
```

## 📚 Full Guide

See: `CV_UPLOAD_COMPLETE_FIX.md`

---

**Start here:** `HOSTINGER_REMOTE_MYSQL_SETUP.md`
