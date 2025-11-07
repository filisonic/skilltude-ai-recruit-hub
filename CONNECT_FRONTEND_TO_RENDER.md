# Connect Hostinger Frontend to Render Backend

## 🎯 Overview

Your backend is now live on Render at:
**https://skilltude-ai-recruit-hub.onrender.com**

Your frontend on Hostinger needs to be updated to call this backend URL instead of a local backend.

---

## 📋 Current Situation

- ✅ **Frontend:** Deployed on Hostinger at https://skilltude.com
- ✅ **Backend:** Deployed on Render at https://skilltude-ai-recruit-hub.onrender.com
- ❌ **Problem:** Frontend is using relative URLs (`/api/cv/upload`) which won't work across domains

---

## 🔧 Solution: Two Options

### Option 1: Environment Variable (Recommended)

This is the cleanest approach - use Vite's environment variables.

#### Step 1: Create `.env.production` file in project root

```env
VITE_API_URL=https://skilltude-ai-recruit-hub.onrender.com
```

#### Step 2: Update Frontend Code

Update `src/components/CVUploadForm.tsx` (and any other files making API calls):

**Before:**
```typescript
const response = await fetch("/api/cv/upload", {
  method: "POST",
  body: formData,
});
```

**After:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || '';
const response = await fetch(`${API_URL}/api/cv/upload`, {
  method: "POST",
  body: formData,
});
```

#### Step 3: Rebuild and Redeploy

```bash
# Build with production env
npm run build

# Upload new dist/ folder to Hostinger public_html/
```

---

### Option 2: Hardcode URL (Quick & Simple)

If you want a quick fix without environment variables:

#### Update `src/components/CVUploadForm.tsx`

**Before:**
```typescript
const response = await fetch("/api/cv/upload", {
```

**After:**
```typescript
const response = await fetch("https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload", {
```

Then rebuild and redeploy:
```bash
npm run build
# Upload to Hostinger
```

---

## 🔍 Files That Need Updating

Search for all API calls in your frontend:

1. **CV Upload:**
   - `src/components/CVUploadForm.tsx` - `/api/cv/upload`
   - `src/components/CVUploadInline.tsx` - Check for API calls
   - `src/components/CVUploadHero.tsx` - Check for API calls

2. **Admin Dashboard:**
   - `src/pages/AdminDashboardEnhanced.tsx` - Check for API calls
   - `src/pages/AdminCVManagement.tsx` - Check for API calls
   - `src/components/admin/CVSubmissionsList.tsx` - Check for API calls
   - `src/components/admin/CVSubmissionDetail.tsx` - Check for API calls
   - `src/components/admin/SystemMonitoringDashboard.tsx` - `/api/monitoring/*`
   - `src/components/admin/EmailQueueMonitor.tsx` - Check for API calls

---

## ⚙️ Update Render Backend CORS

Your Render backend needs to allow requests from your Hostinger frontend.

### In Render Dashboard:

Add/Update this environment variable:
```
FRONTEND_URL=https://skilltude.com
```

This is already configured in your `server/index.ts`:
```typescript
app.use(cors({
  origin: serverConfig.frontendUrl, // Uses FRONTEND_URL env var
  credentials: true,
}));
```

---

## 🧪 Testing Steps

### 1. Test Backend Health
```bash
curl https://skilltude-ai-recruit-hub.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-29T...",
  "environment": "production"
}
```

### 2. Test Frontend → Backend Connection

After deploying updated frontend:

1. Go to https://skilltude.com
2. Open browser DevTools (F12) → Network tab
3. Try uploading a CV
4. Check the Network tab:
   - Should see request to `https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload`
   - Should get 200 OK response (or appropriate error)

### 3. Check CORS

If you see CORS errors in browser console:
- Verify `FRONTEND_URL` in Render matches your domain exactly
- Make sure it's `https://skilltude.com` (no trailing slash)
- Restart Render service after changing env vars

---

## 📝 Complete Deployment Checklist

- [ ] Create `.env.production` with `VITE_API_URL`
- [ ] Update all API calls in frontend to use `import.meta.env.VITE_API_URL`
- [ ] Run `npm run build` to create production build
- [ ] Upload `dist/` contents to Hostinger `public_html/`
- [ ] Verify `FRONTEND_URL=https://skilltude.com` in Render env vars
- [ ] Test backend health endpoint
- [ ] Test CV upload from live site
- [ ] Check browser console for errors
- [ ] Verify email delivery works

---

## 🚨 Common Issues

### Issue: CORS Error
**Error:** "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Fix:**
1. Check `FRONTEND_URL` in Render matches exactly: `https://skilltude.com`
2. No trailing slash
3. Restart Render service after changing

### Issue: 404 Not Found
**Error:** "GET https://skilltude.com/api/cv/upload 404"

**Fix:**
- Frontend is still using relative URLs
- Make sure you updated the API calls to use full Render URL
- Rebuild frontend after changes

### Issue: Network Error / Timeout
**Error:** "Failed to fetch" or timeout

**Fix:**
- Render service might be sleeping (free tier)
- Wait 60 seconds for it to wake up
- Try again

### Issue: 500 Internal Server Error
**Error:** Backend returns 500

**Fix:**
- Check Render logs for errors
- Verify all environment variables are set in Render
- Check database connection

---

## 💡 Pro Tips

1. **Use Environment Variables:** Makes it easy to switch between dev/staging/prod
2. **Test Locally First:** Set `VITE_API_URL=http://localhost:3000` for local testing
3. **Monitor Render Logs:** Watch for errors during first CV upload
4. **Cold Start:** First request after 15 min takes ~60 seconds (Render free tier)

---

## 🔗 Quick Links

- **Frontend:** https://skilltude.com
- **Backend:** https://skilltude-ai-recruit-hub.onrender.com
- **Backend Health:** https://skilltude-ai-recruit-hub.onrender.com/api/health
- **Render Dashboard:** https://dashboard.render.com
- **Hostinger Panel:** https://hpanel.hostinger.com

---

## 📞 Need Help?

If you run into issues:
1. Check browser console for errors
2. Check Render logs in dashboard
3. Verify all environment variables are set
4. Test backend health endpoint directly

---

**Ready to connect? Start with Option 1 (Environment Variable) for the cleanest solution!**
