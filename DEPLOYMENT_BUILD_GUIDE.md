# Build & Deployment Guide

## Your Project Structure

```
D:\client websites\skilltude\skilltude-ai-recruit-hub\
├── src/                    # Frontend React source
├── server/                 # Backend Node.js source
├── dist/                   # Frontend build output (after npm run build)
├── server/dist/            # Backend build output (after npm run server:build)
├── package.json            # Root package.json with build scripts
└── server/package.json     # Server package.json
```

## Build Commands (Run from Project Root)

### Frontend Build (React/Vite)
```bash
# From: D:\client websites\skilltude\skilltude-ai-recruit-hub
npm run build
```
- **Output:** `dist/` folder
- **Contains:** index.html, assets/, .js, .css files
- **Upload to:** `public_html/` on Hostinger

### Backend Build (Node.js/TypeScript)
```bash
# From: D:\client websites\skilltude\skilltude-ai-recruit-hub
npm run server:build
```
- **Output:** `server/dist/` folder
- **Contains:** Compiled JavaScript from TypeScript
- **Upload to:** `public_html/server/dist/` on Hostinger

## Complete Build Process

```bash
# 1. Navigate to project root
cd "D:\client websites\skilltude\skilltude-ai-recruit-hub"

# 2. Install dependencies (if needed)
npm install

# 3. Build frontend
npm run build
# ✅ Creates: dist/

# 4. Build backend
npm run server:build
# ✅ Creates: server/dist/

# 5. Prepare backend environment
cd server
cp .env.production .env
# Edit .env with production values

# 6. Install production dependencies for backend
npm ci --production
# ✅ Creates: server/node_modules/ (production only)
```

## What to Upload to Hostinger

### Frontend Files
**Source:** `dist/` (from project root)
**Destination:** `public_html/`

Files to upload:
- `dist/index.html` → `public_html/index.html`
- `dist/assets/` → `public_html/assets/`
- `dist/*.js` → `public_html/*.js`
- `dist/*.css` → `public_html/*.css`

### Backend Files
**Source:** `server/` folder
**Destination:** `public_html/server/`

Files to upload:
- `server/dist/` → `public_html/server/dist/`
- `server/node_modules/` → `public_html/server/node_modules/`
- `server/package.json` → `public_html/server/package.json`
- `server/package-lock.json` → `public_html/server/package-lock.json`
- `server/.env` → `public_html/server/.env`

## Hostinger File Structure

```
public_html/
├── index.html              ← Frontend entry point
├── assets/                 ← Frontend assets (images, fonts, etc.)
│   ├── index-[hash].js    ← Frontend JavaScript
│   ├── index-[hash].css   ← Frontend CSS
│   └── ...
├── server/                 ← Backend API
│   ├── dist/              ← Compiled backend code
│   │   ├── index.js       ← Backend entry point
│   │   ├── config/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── node_modules/      ← Backend dependencies
│   ├── package.json
│   ├── package-lock.json
│   └── .env              ← Backend configuration
├── uploads/
│   └── cvs/              ← CV file storage
└── logs/                 ← Application logs
```

## Upload Methods

### Method 1: File Manager (Recommended)

1. **Zip files locally:**
   ```bash
   # Frontend
   cd dist
   # Zip all contents
   
   # Backend
   cd ../server/dist
   # Zip all contents
   ```

2. **Upload to Hostinger:**
   - Log in to hPanel → Files → File Manager
   - Upload frontend zip to `public_html/`, extract
   - Upload backend zip to `public_html/server/`, extract
   - Upload other backend files (node_modules, package.json, .env)

### Method 2: FTP Client

1. Get FTP credentials from hPanel
2. Use FileZilla or similar
3. Upload:
   - `dist/*` → `public_html/`
   - `server/dist/*` → `public_html/server/dist/`
   - `server/node_modules/` → `public_html/server/node_modules/`
   - `server/package.json`, `.env` → `public_html/server/`

## Node.js Configuration in Hostinger

**hPanel → Advanced → Node.js → Create Application**

Settings:
- **Node.js version:** 18.x or higher
- **Application mode:** Production
- **Application root:** `public_html/server`
- **Application startup file:** `dist/index.js`
- **Application URL:** yourdomain.com

## Environment Variables

Add these in Node.js application settings (or in `server/.env`):

```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
UPLOAD_DIR=/home/u931066387/public_html/uploads/cvs
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
JWT_SECRET=generate_64_char_random
SESSION_SECRET=generate_64_char_random
FRONTEND_URL=https://yourdomain.com
```

## Testing

### Test Frontend
```bash
curl https://yourdomain.com
# Should return HTML
```

Or visit in browser: `https://yourdomain.com`

### Test Backend
```bash
curl https://yourdomain.com/api/health
# Should return: {"status":"ok"}
```

Or visit in browser: `https://yourdomain.com/api/health`

### Test Full Flow
1. Visit website: `https://yourdomain.com`
2. Navigate to CV upload page
3. Upload a test CV
4. Check database in phpMyAdmin
5. Verify file in `uploads/cvs/`

## Common Issues

### Frontend not loading
- Check that `index.html` is in `public_html/`
- Check that `assets/` folder is in `public_html/`
- Check SSL certificate is active

### Backend API not responding
- Check Node.js app is running in hPanel
- Verify `dist/index.js` exists in `public_html/server/dist/`
- Check environment variables are set
- Review Node.js logs in hPanel

### Build errors
```bash
# Clear cache and rebuild
npm run build -- --force
npm run server:build

# Or clean install
rm -rf node_modules dist server/dist
npm install
npm run build
npm run server:build
```

## Quick Reference

| Task | Command | Output |
|------|---------|--------|
| Build Frontend | `npm run build` | `dist/` |
| Build Backend | `npm run server:build` | `server/dist/` |
| Install Backend Deps | `cd server && npm ci --production` | `server/node_modules/` |
| Test Frontend | `npm run dev` | http://localhost:5173 |
| Test Backend | `npm run server:dev` | http://localhost:3001 |

## Next Steps

1. ✅ Build both frontend and backend
2. ✅ Configure `server/.env`
3. ✅ Upload files to Hostinger
4. ✅ Set up database in phpMyAdmin
5. ✅ Configure Node.js app in hPanel
6. ✅ Enable SSL
7. ✅ Set up cron job for email queue
8. ✅ Test everything

---

**For detailed deployment instructions, see:**
- `server/docs/HOSTINGER_QUICK_START.md`
- `server/HOSTINGER_DEPLOYMENT_CHECKLIST.md`
- `HOSTINGER_DEPLOYMENT_QUICK_REFERENCE.md`
