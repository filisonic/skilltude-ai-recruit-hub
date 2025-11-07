# Deploy CORS Fix - Quick Checklist

## What Was Fixed
- Added `X-Requested-With: XMLHttpRequest` header to CV upload requests
- This allows the backend's CSRF protection to accept the requests

## Deployment Steps

### Step 1: Add Environment Variable to Render Backend ⚠️ CRITICAL

1. Go to https://dashboard.render.com
2. Select your backend service (skilltude-ai-recruit-hub)
3. Click "Environment" in the left sidebar
4. Click "Add Environment Variable"
5. Add:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://skilltude.com` (replace with your actual domain)
6. Click "Save Changes"
7. Render will automatically redeploy (wait ~2-3 minutes)

### Step 2: Upload New Frontend Build to Hostinger

The frontend has been rebuilt with the fix. Upload the `dist` folder:

**Option A: Using File Manager**
1. Log into Hostinger
2. Go to File Manager
3. Navigate to `public_html` (or your website root)
4. Delete old files (keep .htaccess if you have one)
5. Upload all files from the `dist` folder

**Option B: Using FTP**
1. Connect via FTP client (FileZilla, etc.)
2. Navigate to `public_html`
3. Upload all files from `dist` folder

### Step 3: Test the Fix

1. Go to your website: https://skilltude.com
2. Navigate to the CV upload section
3. Fill out the form and upload a test CV
4. Should work without 403 error!

## What to Check

✅ Backend logs on Render show the request coming through
✅ No 403 Forbidden error in browser console
✅ Success message appears after upload
✅ Email is queued (check backend logs)

## If Still Getting 403

1. **Check FRONTEND_URL on Render:**
   - Make sure it matches your domain exactly
   - Include `https://` prefix
   - No trailing slash

2. **Check browser console:**
   - Look for the request headers
   - Should see `X-Requested-With: XMLHttpRequest`

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check Render logs:**
   - Go to Render dashboard → Your service → Logs
   - Look for CSRF protection warnings

## Files Changed
- ✅ `src/components/CVUploadForm.tsx` - Added header
- ✅ Frontend rebuilt successfully
- ⏳ `FRONTEND_URL` environment variable on Render (YOU NEED TO DO THIS)

## Next Steps After Deployment
1. Test CV upload functionality
2. Monitor Render logs for any errors
3. Check that emails are being queued properly
