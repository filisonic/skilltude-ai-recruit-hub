# 🚀 Deploy Frontend to Hostinger - Step by Step

## Quick Start

### 1. Build Frontend
```bash
npm run build
```

**What this does:**
- Reads `.env.production.local` (contains Render backend URL)
- Compiles React/TypeScript code
- Optimizes and minifies files
- Creates `dist/` folder with production-ready files

**Expected output:**
```
✓ built in 15.23s
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-abc123.css     45.67 kB │ gzip: 12.34 kB
dist/assets/index-xyz789.js     234.56 kB │ gzip: 78.90 kB
```

---

### 2. Upload to Hostinger

#### Option A: File Manager (Easiest)

1. **Login to Hostinger**
   - Go to: https://hpanel.hostinger.com
   - Login with your credentials

2. **Open File Manager**
   - Click "File Manager" in the dashboard
   - Navigate to `public_html/`

3. **Backup Current Files (Optional but Recommended)**
   - Select all files EXCEPT `server/` folder
   - Click "Compress" → Create `backup-YYYY-MM-DD.zip`
   - Download the backup

4. **Delete Old Frontend Files**
   - Select and delete:
     - `index.html`
     - `assets/` folder
     - Any `.js`, `.css` files
   - **DO NOT DELETE:**
     - `server/` folder
     - `.htaccess` file
     - `uploads/` folder
     - `logs/` folder

5. **Upload New Files**
   - Click "Upload" button
   - Select ALL files from your local `dist/` folder:
     - `index.html`
     - `assets/` folder (entire folder)
     - All other files
   - Wait for upload to complete

6. **Verify Upload**
   - Check that `public_html/` now contains:
     - `index.html` (new timestamp)
     - `assets/` folder with new files
     - `server/` folder (unchanged)

#### Option B: FTP (Alternative)

```bash
# Using FileZilla or similar FTP client

Host: ftp.yourdomain.com
Username: your_ftp_username
Password: your_ftp_password
Port: 21

# Upload:
Local: D:\client websites\skilltude\skilltude-ai-recruit-hub\dist\*
Remote: /public_html/

# Make sure to:
# 1. Delete old frontend files first
# 2. Keep server/ folder intact
# 3. Upload all dist/ contents
```

---

### 3. Verify Deployment

#### Test 1: Website Loads
```
https://skilltude.com
```
- Should load your website
- Check that design looks correct
- No broken images or styles

#### Test 2: Check API Configuration
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```
4. Should show: `https://skilltude-ai-recruit-hub.onrender.com`

#### Test 3: CV Upload
1. Go to CV upload section
2. Open DevTools → Network tab
3. Upload a test CV
4. In Network tab, look for:
   - Request to: `https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload`
   - Status: 200 OK (or appropriate response)
5. Check Console tab for any errors

#### Test 4: Check CORS
If you see CORS errors:
```
Access to fetch at 'https://skilltude-ai-recruit-hub.onrender.com/api/cv/upload' 
from origin 'https://skilltude.com' has been blocked by CORS policy
```

**Fix:**
1. Go to Render dashboard
2. Check `FRONTEND_URL` environment variable
3. Must be exactly: `https://skilltude.com` (no trailing slash)
4. Save and wait for service to restart

---

## 📁 File Structure After Deployment

```
public_html/
├── index.html              ← New (from dist/)
├── assets/
│   ├── index-abc123.js    ← New (from dist/assets/)
│   ├── index-xyz789.css   ← New (from dist/assets/)
│   └── ...                ← New (from dist/assets/)
├── server/                 ← Keep unchanged
│   ├── dist/
│   ├── node_modules/
│   ├── package.json
│   └── .env
├── uploads/                ← Keep unchanged
│   └── cvs/
├── logs/                   ← Keep unchanged
└── .htaccess              ← Keep unchanged
```

---

## 🔍 Troubleshooting

### Issue: Website shows old version
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Try incognito/private window

### Issue: Blank page after deployment
**Solution:**
1. Check browser console for errors
2. Verify all files uploaded correctly
3. Check `index.html` exists in `public_html/`
4. Verify file permissions (should be 644)

### Issue: API calls fail with 404
**Solution:**
1. Rebuild: `npm run build`
2. Verify `.env.production.local` exists and has correct URL
3. Re-upload dist/ files

### Issue: CORS errors
**Solution:**
1. Check Render `FRONTEND_URL` = `https://skilltude.com`
2. No trailing slash
3. Exact match with your domain
4. Restart Render service

### Issue: Styles broken / missing
**Solution:**
1. Check that `assets/` folder uploaded completely
2. Verify file permissions
3. Clear browser cache

---

## ⚡ Quick Redeploy (After Code Changes)

```bash
# 1. Make your code changes
# 2. Rebuild
npm run build

# 3. Upload only changed files to Hostinger
# - Usually just need to replace:
#   - index.html
#   - assets/ folder

# 4. Clear browser cache and test
```

---

## 📊 Deployment Checklist

Before deploying:
- [ ] Code changes tested locally
- [ ] `.env.production.local` has correct Render URL
- [ ] Run `npm run build` successfully
- [ ] Backup current Hostinger files (optional)

During deployment:
- [ ] Login to Hostinger File Manager
- [ ] Navigate to `public_html/`
- [ ] Delete old frontend files (keep `server/`)
- [ ] Upload all files from `dist/`
- [ ] Verify upload completed

After deployment:
- [ ] Test website loads: https://skilltude.com
- [ ] Test CV upload functionality
- [ ] Check browser console for errors
- [ ] Verify API calls go to Render backend
- [ ] Test on mobile device (optional)

---

## 🎯 Current Configuration

**Frontend (Hostinger):**
- URL: https://skilltude.com
- Location: `public_html/`
- API calls to: Render backend

**Backend (Render):**
- URL: https://skilltude-ai-recruit-hub.onrender.com
- Accepts requests from: https://skilltude.com
- Database: Hostinger MySQL

---

## 📞 Support

**Hostinger Issues:**
- File Manager not working → Try FTP
- Upload fails → Check disk space in hPanel
- Permissions errors → Set files to 644, folders to 755

**Render Issues:**
- Service sleeping → Wait 60 seconds
- CORS errors → Check FRONTEND_URL
- 500 errors → Check Render logs

**Build Issues:**
- Build fails → Check for TypeScript errors
- Missing env var → Verify `.env.production.local` exists
- Large bundle → Normal for production build

---

**Ready to deploy? Run `npm run build` and follow the steps above!** 🚀
