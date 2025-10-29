# Hostinger Quick Start Guide

Quick reference for deploying to Hostinger shared hosting.

## Pre-Deployment (Local Machine)

### 1. Build Application

You need to build both the frontend (React) and backend (Node.js server):

```bash
# From project root: D:\client websites\skilltude\skilltude-ai-recruit-hub

# Install dependencies (if not already done)
npm install

# Build frontend (React/Vite) - creates dist/ folder
npm run build

# Build backend (TypeScript server) - creates server/dist/ folder
npm run server:build
```

This creates:
- `dist/` - Frontend build (React app)
- `server/dist/` - Backend build (compiled Node.js server)

### 2. Prepare .env File

```bash
# Copy template
cp .env.production .env

# Edit with your production values
nano .env
```

**Required values:**
```env
NODE_ENV=production
DB_HOST=localhost
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
UPLOAD_DIR=/home/u931066387/public_html/uploads/cvs
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
JWT_SECRET=generate_with_crypto
SESSION_SECRET=generate_with_crypto
FRONTEND_URL=https://yourdomain.com
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Prepare Files for Upload

**For Backend (API Server):**
- `server/dist/` (compiled Node.js server code)
- `server/node_modules/` (production only: `cd server && npm ci --production`)
- `server/package.json`
- `server/package-lock.json`
- `server/.env`

**For Frontend (React App):**
- `dist/` (compiled React app from root build)

**Note:** The frontend `dist/` goes to `public_html/` and the backend `server/dist/` goes to `public_html/server/`

## Hostinger Setup

### 1. Database Setup (phpMyAdmin)

**Access:** hPanel → Databases → phpMyAdmin

**Run these SQL scripts:**

```sql
-- 1. Create cv_submissions table (from complete_database_schema.sql)
-- Copy the CREATE TABLE statement for cv_submissions

-- 2. Add analysis columns
ALTER TABLE cv_submissions 
ADD COLUMN analysis_score INT DEFAULT NULL,
ADD COLUMN analysis_results JSON DEFAULT NULL,
ADD COLUMN email_sent_at TIMESTAMP NULL,
ADD COLUMN email_opened_at TIMESTAMP NULL,
ADD COLUMN converted_to_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN conversion_date TIMESTAMP NULL;

-- 3. Add email queue fields
ALTER TABLE cv_submissions
ADD COLUMN email_scheduled_for TIMESTAMP NULL,
ADD COLUMN email_attempts INT DEFAULT 0,
ADD COLUMN email_last_attempt TIMESTAMP NULL,
ADD COLUMN email_error TEXT NULL,
ADD COLUMN email_status ENUM('pending', 'sent', 'failed') DEFAULT 'pending';

CREATE INDEX idx_email_scheduled ON cv_submissions(email_scheduled_for);
CREATE INDEX idx_email_status ON cv_submissions(email_status);
```

### 2. Upload Files (File Manager)

**Access:** hPanel → Files → File Manager

**Create structure:**
```
public_html/
├── index.html              # From root dist/ (frontend)
├── assets/                 # From root dist/ (frontend)
├── *.js, *.css            # From root dist/ (frontend)
├── server/
│   ├── dist/              # From server/dist/ (backend)
│   ├── node_modules/      # From server/node_modules/
│   ├── package.json       # From server/
│   ├── package-lock.json  # From server/
│   └── .env              # From server/ (configured)
├── uploads/
│   └── cvs/
└── logs/
```

**Upload methods:**
- Zip files locally, upload zip, extract in File Manager
- Or use FTP client (FileZilla)

**Important:** 
- Frontend files (from root `dist/`) go to `public_html/`
- Backend files (from `server/dist/`) go to `public_html/server/dist/`

### 3. Set Permissions

**Via File Manager:**
- Right-click `uploads/cvs` → Permissions → `755`
- Right-click `.env` → Permissions → `600`

### 4. Configure Node.js Application

**Access:** hPanel → Advanced → Node.js → Create Application

**Settings:**
- **Node.js version:** 18.x
- **Application mode:** Production
- **Application root:** `public_html/server`
- **Application startup file:** `dist/index.js`
- **Application URL:** yourdomain.com

**Environment Variables:** (Add in Node.js settings)
```
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
JWT_SECRET=your_secret
SESSION_SECRET=your_secret
FRONTEND_URL=https://yourdomain.com
```

### 5. Enable SSL

**Access:** hPanel → Security → SSL

- Select domain
- Click "Install SSL"
- Wait 10-15 minutes

**Force HTTPS:** Create `public_html/.htaccess`:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 6. Configure SendGrid

1. Sign up at https://sendgrid.com
2. Verify domain (add DNS records in Hostinger)
3. Create API key
4. Add to Node.js environment variables

### 7. Set Up Cron Job

**Access:** hPanel → Advanced → Cron Jobs

**Create job:**
- **Schedule:** `*/5 * * * *` (every 5 minutes)
- **Command:**
  ```bash
  cd /home/u931066387/public_html/server && /usr/bin/node dist/jobs/processEmailQueue.js
  ```

### 8. Start Application

**Access:** hPanel → Node.js

- Find your application
- Click "Start"
- Status should show "Running"

## Verification

### Test Endpoints

```bash
# Health check
curl https://yourdomain.com/api/health

# Or visit in browser
https://yourdomain.com/api/health
```

### Test CV Upload

1. Visit website
2. Upload test CV
3. Check database:
   ```sql
   SELECT * FROM cv_submissions ORDER BY submitted_at DESC LIMIT 1;
   ```

### Check Logs

File Manager → `public_html/logs/combined.log`

## Common Issues

### App Won't Start
- Check Node.js logs in hPanel
- Verify `dist/index.js` exists
- Check environment variables

### Database Connection Failed
- Verify credentials in `.env`
- Test in phpMyAdmin

### File Upload Fails
- Check permissions: `755` on `uploads/cvs`
- Verify `UPLOAD_DIR` path
- Check disk space quota

### Email Not Sending
- Verify SendGrid API key
- Check cron job is running
- Query database:
  ```sql
  SELECT * FROM cv_submissions WHERE email_status = 'pending';
  ```

## Update Application

1. Build locally: `npm run build`
2. Upload new `dist` folder
3. Restart Node.js app in hPanel

## Backup Database

phpMyAdmin → Select database → Export → Download

## File Structure Reference

```
/home/u931066387/public_html/
├── server/
│   ├── dist/
│   │   ├── index.js (entry point)
│   │   ├── config/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── node_modules/
│   ├── package.json
│   └── .env
├── uploads/
│   └── cvs/
│       └── YYYY/
│           └── MM/
└── logs/
    ├── combined.log
    ├── error.log
    └── security.log
```

## Support

- **Hostinger Support:** https://www.hostinger.com/support
- **Application Docs:** `server/docs/`
- **Full Guide:** `server/docs/HOSTINGER_PRODUCTION_SETUP.md`

---

**Quick Reference Card**

| Task | Location |
|------|----------|
| Database | hPanel → Databases → phpMyAdmin |
| Upload Files | hPanel → Files → File Manager |
| Node.js Config | hPanel → Advanced → Node.js |
| SSL Setup | hPanel → Security → SSL |
| Cron Jobs | hPanel → Advanced → Cron Jobs |
| DNS Records | hPanel → Domains → DNS Zone Editor |
| Logs | File Manager → `public_html/logs/` |

---

**Last Updated:** December 2024
