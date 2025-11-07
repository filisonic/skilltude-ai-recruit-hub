# 403 Forbidden Error - Complete Resolution

## Issue Summary
Your Hostinger frontend was getting a **403 Forbidden** error when trying to upload CVs to your Render backend at `https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload`.

## Root Cause Analysis

The backend has CSRF (Cross-Site Request Forgery) protection middleware that validates incoming requests. It checks for:

1. **Origin header** matching allowed origins
2. **Referer header** matching allowed origins  
3. **OR** `X-Requested-With: XMLHttpRequest` header

Your frontend wasn't sending any of these, so the backend rejected the request with 403.

## The Fix (2 Parts)

### Part 1: Frontend Code Fix ✅ COMPLETED

**File:** `src/components/CVUploadForm.tsx`

**Change:** Added the required header to the fetch request:

```typescript
const response = await fetch(`${API_URL}/api/cv/upload`, {
  method: "POST",
  headers: {
    'X-Requested-With': 'XMLHttpRequest',  // ← Added this
  },
  body: formData,
});
```

**Status:** ✅ Code updated and rebuilt successfully

### Part 2: Backend Environment Variable ⚠️ ACTION REQUIRED

**What:** Add `FRONTEND_URL` environment variable to Render

**Why:** The CSRF protection also checks if the request origin matches the configured frontend URL. This provides an additional layer of security.

**How:**
1. Go to Render Dashboard: https://dashboard.render.com
2. Select your backend service
3. Environment tab → Add Environment Variable
4. Key: `FRONTEND_URL`
5. Value: `https://skilltude.com` (your actual domain)
6. Save (auto-redeploys)

**Status:** ⏳ YOU NEED TO DO THIS

## Deployment Instructions

### 1. Deploy Backend Change (Render)
- Add the `FRONTEND_URL` environment variable as described above
- Wait for automatic redeployment (~2-3 minutes)

### 2. Deploy Frontend Change (Hostinger)
The frontend has been rebuilt. Upload the `dist` folder to Hostinger:

```
dist/
├── index.html
├── assets/
│   ├── index-BGM_dKBw.js
│   ├── index-BgHIxqRN.css
│   ├── vendor-64fz9BH2.js
│   └── router-DYaVzJ5O.js
└── ...
```

Upload to your `public_html` directory (or wherever your site is hosted).

## Testing

After both deployments:

1. **Open your website** in a browser
2. **Open Developer Tools** (F12)
3. **Go to Network tab**
4. **Try uploading a CV**
5. **Check the request:**
   - Should see status 200 (not 403)
   - Request headers should include `X-Requested-With: XMLHttpRequest`
   - Response should be success message

## Verification Checklist

- [ ] `FRONTEND_URL` added to Render environment variables
- [ ] Render backend redeployed successfully
- [ ] New frontend build uploaded to Hostinger
- [ ] CV upload works without 403 error
- [ ] Success message appears after upload
- [ ] Check Render logs for successful CV processing

## Technical Details

**Backend Middleware Chain:**
```
Request → enforceHttps → hstsHeader → helmet → securityHeaders 
→ cors → apiLimiter → cvUploadLimiter → csrfProtection → upload
```

The `csrfProtection` middleware (line 169 in `server/routes/cv.routes.ts`) was blocking your requests.

**CSRF Protection Logic:**
```typescript
// From server/middleware/security.ts
const isValidOrigin = origin && allowedOrigins.some(allowed => origin.startsWith(allowed));
const isValidReferer = referer && allowedOrigins.some(allowed => referer.startsWith(allowed));
const isXHR = csrfToken === 'XMLHttpRequest';

if (!isValidOrigin && !isValidReferer && !isXHR) {
  throw new CVUploadException(ErrorCodes.UNAUTHORIZED, 'Invalid request origin', 403);
}
```

By adding the `X-Requested-With` header, we satisfy the `isXHR` condition.

## Related Files

- ✅ `src/components/CVUploadForm.tsx` - Added header
- ✅ `RENDER_ENV_VARIABLES.txt` - Updated variable name
- 📖 `server/middleware/security.ts` - CSRF protection logic
- 📖 `server/routes/cv.routes.ts` - Upload route with middleware
- 📖 `server/index.ts` - CORS configuration

## Support

If you still get 403 after deploying:

1. Check browser console for exact error
2. Check Render logs for CSRF warnings
3. Verify `FRONTEND_URL` is set correctly (no trailing slash)
4. Try hard refresh (Ctrl+Shift+R)
5. Check that the request includes the header

## Success Indicators

When working correctly, you should see:
- ✅ Status 200 response
- ✅ Success message in UI
- ✅ Render logs show "CV upload processed successfully"
- ✅ Database entry created
- ✅ Email queued for delivery
