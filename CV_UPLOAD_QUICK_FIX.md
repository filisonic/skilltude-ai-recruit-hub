# CV Upload - Quick Fix Guide

## 🚨 Problem
CV upload showing "failed to fetch" error

## ✅ Solution Applied

### 1. Fixed API URL (3 files)
```bash
# All three files now point to Render backend:
.env
.env.production  
.env.production.local

# Changed to:
VITE_API_URL=https://skilltude-ai-recruit-hub.onrender.com
```

### 2. Moved CV Upload
- ❌ **Before:** Full form on home page
- ✅ **After:** CTA button on home page → Dedicated `/upload-cv` page

## 🔧 To Deploy

### Step 1: Rebuild Frontend
```bash
npm run build
```
⚠️ **IMPORTANT:** Must rebuild because `VITE_API_URL` is a build-time variable!

### Step 2: Upload to Hostinger
Upload everything from `dist/` folder to `public_html/`

### Step 3: Test
1. Visit https://skilltude.com
2. Click "Get Free CV Analysis" button
3. Upload a test CV
4. Should work! ✅

## 🧪 Quick Tests

### Test 1: Check API URL in Browser
```javascript
// Open browser console on your site:
console.log(import.meta.env.VITE_API_URL)
// Should show: https://skilltude-ai-recruit-hub.onrender.com
```

### Test 2: Check Backend Health
```bash
curl https://skilltude-ai-recruit-hub.onrender.com/api/health
# Should return: {"status":"ok",...}
```

### Test 3: Upload a CV
1. Go to https://skilltude.com/upload-cv
2. Fill form and upload PDF
3. Check Network tab in DevTools
4. Should see POST to `https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload`
5. Should get 200 OK response

## 📋 Files Changed
- `.env` - Updated API URL
- `.env.production` - Updated API URL  
- `.env.production.local` - Updated API URL
- `src/pages/Index.tsx` - Removed form, added CTA
- `src/pages/UploadCV.tsx` - Now uses full CVUploadHero

## 🎯 What Changed

### Home Page
```
Before: [Full CV Upload Form]
After:  [Clean CTA Button] → Click → /upload-cv page
```

### API Connection
```
Before: skilltude.com/api/cv/upload ❌
After:  skilltude-ai-recruit-hub.onrender.com/api/cv/upload ✅
```

## ⚠️ Important Notes

1. **Must rebuild** after changing VITE_API_URL
2. **Clear browser cache** when testing
3. **Render free tier** may take 30-60s to wake up on first request
4. **Check CORS** - Render backend needs `FRONTEND_URL=https://skilltude.com`

## 🆘 If Still Not Working

### Check 1: Backend Running?
```bash
curl https://skilltude-ai-recruit-hub.onrender.com/api/health
```
If this fails, backend is down. Check Render dashboard.

### Check 2: CORS Error?
Look in browser console for:
```
Access to fetch at 'https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload' 
from origin 'https://skilltude.com' has been blocked by CORS policy
```
Fix: Add `FRONTEND_URL=https://skilltude.com` to Render environment variables

### Check 3: Old Build?
```bash
# Rebuild and redeploy
npm run build
# Upload dist/ to Hostinger
# Hard refresh browser: Ctrl+Shift+R
```

## 📚 Full Documentation
- `CV_UPLOAD_FIX_SUMMARY.md` - Complete details
- `CV_UPLOAD_BEFORE_AFTER.md` - Visual comparison

---

**Status:** ✅ Fixed - Ready to rebuild and deploy!
