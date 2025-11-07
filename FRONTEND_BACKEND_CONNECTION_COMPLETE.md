# ✅ Frontend-Backend Connection Setup Complete

## What I Just Did

### 1. Created Environment Variable File
**File:** `.env.production.local`
```env
VITE_API_URL=https://skilltude-ai-recruit-hub.onrender.com
```

### 2. Updated CVUploadForm Component
**File:** `src/components/CVUploadForm.tsx`

**Changed:**
```typescript
// Before
const response = await fetch("/api/cv/upload", {

// After  
const API_URL = import.meta.env.VITE_API_URL || '';
const response = await fetch(`${API_URL}/api/cv/upload`, {
```

---

## 🚀 Next Steps - Deploy to Hostinger

### Step 1: Rebuild Frontend
```bash
npm run build
```

This will:
- Use the `.env.production.local` file
- Bundle the frontend with the Render backend URL
- Create optimized files in `dist/` folder

### Step 2: Upload to Hostinger

Upload the contents of `dist/` folder to your Hostinger `public_html/`:

**Via Hostinger File Manager:**
1. Login to https://hpanel.hostinger.com
2. Go to File Manager
3. Navigate to `public_html/`
4. Delete old files (keep `server/` folder!)
5. Upload all files from your local `dist/` folder:
   - `index.html`
   - `assets/` folder
   - All `.js` and `.css` files

**Via FTP (Alternative):**
```bash
# Use FileZilla or similar FTP client
# Host: ftp.yourdomain.com
# Upload dist/* to public_html/
```

### Step 3: Verify Render CORS Settings

Make sure your Render backend allows requests from Hostinger:

1. Go to https://dashboard.render.com
2. Select your service: `skilltude-ai-recruit-hub`
3. Go to Environment tab
4. Verify this variable exists:
   ```
   FRONTEND_URL=https://skilltude.com
   ```
5. If you changed it, click "Save Changes" and wait for redeploy

---

## 🧪 Testing

### Test 1: Backend Health
Open in browser:
```
https://skilltude-ai-recruit-hub.onrender.com/api/health
```

Should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "production"
}
```

### Test 2: Frontend Loads
Open in browser:
```
https://skilltude.com
```

Should load your website normally.

### Test 3: CV Upload Works
1. Go to https://skilltude.com
2. Open browser DevTools (F12) → Network tab
3. Try uploading a CV
4. In Network tab, look for request to:
   ```
   https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload
   ```
5. Should get 200 OK response

### Test 4: Check for Errors
In browser console (F12), check for:
- ❌ CORS errors → Fix FRONTEND_URL in Render
- ❌ 404 errors → Rebuild frontend
- ❌ Network errors → Render might be sleeping (wait 60 sec)

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  USER BROWSER                                               │
│  https://skilltude.com                                      │
│                                                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ 1. Loads HTML/JS/CSS
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  HOSTINGER (Frontend)                                       │
│  - Serves React app (static files)                          │
│  - public_html/index.html, assets/, etc.                    │
│                                                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ 2. API calls to
                 │    https://skilltude-ai-recruit-hub.onrender.com
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  RENDER (Backend)                                           │
│  - Node.js/Express API                                      │
│  - Handles CV uploads, analysis, emails                     │
│  - Connects to Hostinger MySQL database                     │
│                                                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ 3. Stores data
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  HOSTINGER (Database)                                       │
│  - MySQL database                                           │
│  - Stores CV submissions, analysis results                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Environment Variables Summary

### Frontend (.env.production.local)
```env
VITE_API_URL=https://skilltude-ai-recruit-hub.onrender.com
```

### Backend (Render Dashboard)
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://skilltude.com
DB_HOST=srv1510.hstgr.io
DB_PORT=3306
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
# ... (all other env vars from RENDER_ENV_VARIABLES.txt)
```

---

## 🎯 Current Status

- ✅ Backend deployed on Render
- ✅ Backend environment variables configured
- ✅ Frontend code updated to use Render backend
- ✅ Environment variable file created
- ⏳ **NEXT:** Rebuild and upload frontend to Hostinger

---

## 📝 Quick Command Reference

```bash
# Rebuild frontend with production settings
npm run build

# Test locally before deploying (optional)
npm run dev
# Then manually test with DevTools to see API calls

# After uploading to Hostinger, test:
# 1. https://skilltude.com (should load)
# 2. Try CV upload
# 3. Check browser console for errors
```

---

## 🆘 Troubleshooting

### CORS Error
```
Access-Control-Allow-Origin error
```
**Fix:** Check `FRONTEND_URL` in Render = `https://skilltude.com` (exact match, no trailing slash)

### 404 Error on API Call
```
GET https://skilltude.com/api/cv/upload 404
```
**Fix:** Frontend not rebuilt. Run `npm run build` again and re-upload.

### Timeout / Network Error
```
Failed to fetch
```
**Fix:** Render service sleeping. Wait 60 seconds and try again.

---

## ✅ Deployment Checklist

- [x] Created `.env.production.local` with Render URL
- [x] Updated `CVUploadForm.tsx` to use environment variable
- [ ] Run `npm run build`
- [ ] Upload `dist/` contents to Hostinger `public_html/`
- [ ] Verify `FRONTEND_URL` in Render dashboard
- [ ] Test backend health endpoint
- [ ] Test frontend loads
- [ ] Test CV upload functionality
- [ ] Check browser console for errors

---

**Ready to deploy! Run `npm run build` and upload to Hostinger!** 🚀
