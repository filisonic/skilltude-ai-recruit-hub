# Deploy CV Upload Fix - Checklist

## ✅ Changes Already Made (Local)

- [x] Updated `.env` with correct Render URL
- [x] Updated `.env.production` with correct Render URL
- [x] Updated `.env.production.local` with correct Render URL
- [x] Removed `CVUploadHero` from home page
- [x] Added CTA section on home page
- [x] Updated `/upload-cv` page to use `CVUploadHero`
- [x] Created documentation

## 🚀 Deployment Steps

### Step 1: Verify Backend is Running

```bash
# Test the Render backend health endpoint
curl https://skilltude-ai-recruit-hub.onrender.com/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-07T...",
  "environment": "production"
}
```

If this fails:
1. Go to https://dashboard.render.com
2. Check if service is running
3. Check logs for errors
4. Verify environment variables are set

### Step 2: Verify Render Environment Variables

Go to Render Dashboard → Your Service → Environment

**Required variables:**
```
FRONTEND_URL=https://skilltude.com
NODE_ENV=production
DB_HOST=srv878.hstgr.io
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
```

⚠️ **Important:** `FRONTEND_URL` must be exactly `https://skilltude.com` (no trailing slash)

### Step 3: Build Frontend

```bash
# From project root
npm run build
```

**What this does:**
- Reads `.env.production.local` (or `.env.production`)
- Embeds `VITE_API_URL=https://skilltude-ai-recruit-hub.onrender.com` into JavaScript
- Creates optimized production build in `dist/` folder

**Verify the build:**
```bash
# Search for the API URL in built files (Windows)
findstr /s "skilltude-ai-recruit-hub" dist\assets\*.js

# Should find the Render URL in the JavaScript files
```

### Step 4: Deploy to Hostinger

**Option A: File Manager (Recommended)**
1. Log in to Hostinger hPanel
2. Go to File Manager
3. Navigate to `public_html/`
4. Upload all files from local `dist/` folder
5. Overwrite existing files when prompted

**Option B: FTP**
1. Connect via FTP (FileZilla, etc.)
2. Navigate to `public_html/`
3. Upload all files from `dist/`
4. Overwrite existing files

**Files to upload:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

### Step 5: Clear Cache & Test

1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete → Clear cache
   - Or hard refresh: Ctrl+Shift+R

2. **Test home page:**
   - Visit https://skilltude.com
   - Should see new CTA section (not full form)
   - Click "Get Free CV Analysis" button
   - Should navigate to `/upload-cv`

3. **Test upload page:**
   - Visit https://skilltude.com/upload-cv
   - Should see full `CVUploadHero` component
   - Fill out form with test data
   - Upload a test PDF file
   - Click submit

4. **Check browser console:**
   ```javascript
   // Should show Render URL
   console.log(import.meta.env.VITE_API_URL)
   // Expected: https://skilltude-ai-recruit-hub.onrender.com
   ```

5. **Check Network tab:**
   - Open DevTools → Network tab
   - Submit the form
   - Look for POST request to:
     ```
     https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload
     ```
   - Should get 200 OK response

### Step 6: Verify Database

If upload succeeds, check the database:

1. Log in to Hostinger hPanel
2. Go to phpMyAdmin
3. Select database: `u931066387_skilltude`
4. Run query:
   ```sql
   SELECT * FROM cv_submissions 
   ORDER BY submitted_at DESC 
   LIMIT 1;
   ```
5. Should see your test submission

### Step 7: Monitor for Issues

**First 24 hours:**
- Check Render logs for errors
- Monitor email queue (should send analysis after 24 hours)
- Test from different browsers
- Test from mobile devices

**Check Render logs:**
1. Go to https://dashboard.render.com
2. Select your service
3. Click "Logs" tab
4. Look for any errors

## 🧪 Testing Checklist

- [ ] Backend health endpoint responds
- [ ] Home page loads correctly
- [ ] CTA section visible on home page
- [ ] Clicking CTA navigates to `/upload-cv`
- [ ] Upload page shows full form
- [ ] Can select a file
- [ ] Can fill out form fields
- [ ] Submit button works
- [ ] No "failed to fetch" error
- [ ] Success message appears
- [ ] Database record created
- [ ] No console errors
- [ ] No CORS errors
- [ ] Works on mobile
- [ ] Works on different browsers

## ⚠️ Common Issues & Solutions

### Issue 1: Still Getting "Failed to Fetch"

**Possible causes:**
1. Didn't rebuild frontend
2. Old cached version
3. Backend is down
4. CORS misconfiguration

**Solutions:**
```bash
# 1. Rebuild
npm run build

# 2. Clear cache
# Hard refresh: Ctrl+Shift+R

# 3. Check backend
curl https://skilltude-ai-recruit-hub.onrender.com/api/health

# 4. Check CORS
# Verify FRONTEND_URL on Render = https://skilltude.com
```

### Issue 2: CORS Error in Console

**Error message:**
```
Access to fetch at 'https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload' 
from origin 'https://skilltude.com' has been blocked by CORS policy
```

**Solution:**
1. Go to Render Dashboard
2. Environment tab
3. Verify `FRONTEND_URL=https://skilltude.com`
4. No trailing slash!
5. Save and wait for redeploy

### Issue 3: Backend Takes Long to Respond

**Cause:** Render free tier spins down after inactivity

**Solution:**
- First request may take 30-60 seconds
- This is normal for free tier
- Consider upgrading to paid tier for instant responses

### Issue 4: Old Version Still Showing

**Cause:** Browser cache or CDN cache

**Solution:**
```bash
# 1. Hard refresh
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)

# 2. Clear browser cache completely

# 3. Try incognito/private window

# 4. Check if correct files uploaded to Hostinger
```

## 📊 Success Criteria

✅ **Deployment is successful when:**
1. Home page shows CTA (not full form)
2. `/upload-cv` page shows full form
3. Can upload CV without errors
4. Success message appears
5. Database record created
6. No console errors
7. No CORS errors

## 🔄 Rollback Plan

If something goes wrong:

1. **Keep old `dist/` backup:**
   ```bash
   # Before deploying, backup current dist
   cp -r dist dist.backup
   ```

2. **Rollback on Hostinger:**
   - Upload files from `dist.backup` to `public_html/`

3. **Revert environment variables:**
   ```bash
   # Restore old .env files from git
   git checkout .env .env.production .env.production.local
   ```

## 📞 Support Resources

- **Render Dashboard:** https://dashboard.render.com
- **Hostinger hPanel:** https://hpanel.hostinger.com
- **Backend Health:** https://skilltude-ai-recruit-hub.onrender.com/api/health
- **Documentation:** 
  - `CV_UPLOAD_FIX_SUMMARY.md`
  - `CV_UPLOAD_BEFORE_AFTER.md`
  - `CV_UPLOAD_QUICK_FIX.md`

## 📝 Post-Deployment Notes

**Date deployed:** _______________
**Deployed by:** _______________
**Build hash:** _______________
**Backend version:** _______________

**Test results:**
- [ ] Home page: _______________
- [ ] Upload page: _______________
- [ ] CV upload: _______________
- [ ] Database: _______________

**Issues encountered:** _______________

**Notes:** _______________

---

## 🎉 Ready to Deploy!

Follow the steps above in order. Take your time and verify each step before moving to the next.

**Estimated time:** 15-30 minutes

**Good luck!** 🚀
