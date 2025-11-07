# 🚀 Rebuild and Deploy Frontend - Fix API URL

## Current Issue
Your frontend is still using the old Render URL because it was built with the old environment variables.

**Error seen:**
```
XHR GET https://skilltude-ai-recruit-hub.onrender.com/api/blog/articles [HTTP/2 404 228ms]
```

**Should be:**
```
XHR GET https://skilltude.com/server/api/blog/articles
```

## ✅ Environment Files Fixed
- `.env` now has: `VITE_API_URL=https://skilltude.com/server`
- `.env.production` now has: `VITE_API_URL=https://skilltude.com/server`

## 🔧 Steps to Fix

### 1. Clean Previous Build
```bash
rm -rf dist
```

### 2. Rebuild Frontend with New API URL
```bash
npm run build
```

### 3. Verify Build Contains Correct URL
Check that the new build uses the correct API URL:
```bash
grep -r "skilltude.com/server" dist/
```

You should see references to `https://skilltude.com/server` instead of the old Render URL.

### 4. Deploy to Hostinger
1. **Backup current site** (optional but recommended)
2. **Upload new dist folder** to your Hostinger public_html directory
3. **Replace all files** in public_html with contents of the new dist folder

### 5. Test the Fix
1. Visit: https://skilltude.com/blog
2. Open browser developer tools (F12)
3. Check Network tab - you should see requests to:
   ✅ `https://skilltude.com/server/api/blog/articles`
4. Blog articles should now load properly!

## 🎯 What This Accomplishes
- Frontend will fetch from your Hostinger server instead of old Render URL
- Blog page will display the 7 articles you added to the database
- No more "Unable to load articles" error

## 🔍 Troubleshooting
If you still see the old Render URL after deployment:
1. Clear browser cache (Ctrl+F5)
2. Check that you uploaded the NEW dist folder
3. Verify the build step completed successfully