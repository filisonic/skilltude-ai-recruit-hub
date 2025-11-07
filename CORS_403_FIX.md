# CORS 403 Error Fix

## Problem
Frontend was getting 403 Forbidden error when uploading CVs to Render backend.

## Root Cause
The backend's `csrfProtection` middleware was blocking requests because:
1. The frontend wasn't sending the required `X-Requested-With` header
2. The `FRONTEND_URL` environment variable wasn't set on Render

## Solution

### 1. Frontend Fix (COMPLETED)
Added the `X-Requested-With: XMLHttpRequest` header to the CV upload fetch request in `CVUploadForm.tsx`.

```typescript
const response = await fetch(`${API_URL}/api/cv/upload`, {
  method: "POST",
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  body: formData,
});
```

### 2. Backend Environment Variable (ACTION REQUIRED)

You need to add this environment variable to your Render backend:

**Go to Render Dashboard:**
1. Select your backend service
2. Go to "Environment" tab
3. Add new environment variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://skilltude.com` (or your actual Hostinger domain)
4. Save (Render will auto-redeploy)

### 3. Rebuild and Redeploy Frontend

After making the code change, rebuild and redeploy your frontend:

```bash
npm run build
```

Then upload the new `dist` folder to Hostinger.

## How CSRF Protection Works

The backend's `csrfProtection` middleware (in `server/middleware/security.ts`) checks for:
1. **Origin header** matches allowed origins (from FRONTEND_URL)
2. **Referer header** matches allowed origins
3. **OR** `X-Requested-With: XMLHttpRequest` header is present

By adding the header, we satisfy condition #3, which allows the request through.

## Testing

After deploying both changes:
1. Go to your Hostinger website
2. Try uploading a CV
3. Should work without 403 error

## Files Modified
- `src/components/CVUploadForm.tsx` - Added X-Requested-With header
- `RENDER_ENV_VARIABLES.txt` - Updated to use FRONTEND_URL instead of CORS_ORIGIN
