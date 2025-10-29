# Hostinger Production Setup Guide

This guide is specifically for deploying the SkillTude CV Analysis System to Hostinger shared hosting.

## Overview

Hostinger deployment differs from traditional VPS deployment because:
- You upload compiled files via File Manager
- Database is managed through phpMyAdmin
- No SSH access for systemd services
- Node.js apps run through Hostinger's Node.js selector
- Limited server configuration access

## Prerequisites

- Hostinger hosting account with Node.js support
- Access to Hostinger control panel (hPanel)
- Access to phpMyAdmin
- Domain configured in Hostinger

## Deployment Steps

### 1. Prepare Application Locally

#### Build the Application

You need to build both the frontend (React) and backend (Node.js server):

```bash
# From project root: D:\client websites\skilltude\skilltude-ai-recruit-hub

# Install dependencies
npm install

# Build frontend (React/Vite) - creates dist/ folder
npm run build

# Build backend (TypeScript server) - creates server/dist/ folder
npm run server:build
```

This creates:
- `dist/` - Frontend build (React app with index.html, assets/, etc.)
- `server/dist/` - Backend build (compiled Node.js server)

#### Prepare Files for Upload

**Frontend Files (from root `dist/`):**
- index.html
- assets/ folder
- All .js, .css files

**Backend Files (from `server/`):**
- server/dist/ (compiled JavaScript)
- server/node_modules/ (production dependencies only)
- server/package.json
- server/package-lock.json
- server/.env (configured for production)

**Important:** Before uploading, create your production `.env` file:

```bash
# From project root
cd server

# Copy template
cp .env.production .env

# Edit with production values
nano .env
```

### 2. Set Up Database in Hostinger

#### Access phpMyAdmin

1. Log in to Hostinger hPanel
2. Go to **Databases** → **phpMyAdmin**
3. Select your database (e.g., `u931066387_skilltude`)

#### Create Tables

Run these SQL scripts in phpMyAdmin:

**Step 1: Create cv_submissions table**

```sql
-- Run the complete_database_schema.sql
-- Or manually create the table:

CREATE TABLE IF NOT EXISTS cv_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cv_filename VARCHAR(255) NOT NULL,
  cv_filepath VARCHAR(500) NOT NULL,
  cv_filesize INT NOT NULL,
  status ENUM('new', 'reviewed', 'contacted', 'hired', 'rejected') DEFAULT 'new',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by VARCHAR(100) NULL,
  admin_notes TEXT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  consent_given BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email),
  INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Step 2: Add analysis columns**

```sql
-- From database_migrations/add_cv_analysis_columns.sql
ALTER TABLE cv_submissions 
ADD COLUMN analysis_score INT DEFAULT NULL,
ADD COLUMN analysis_results JSON DEFAULT NULL,
ADD COLUMN email_sent_at TIMESTAMP NULL,
ADD COLUMN email_opened_at TIMESTAMP NULL,
ADD COLUMN converted_to_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN conversion_date TIMESTAMP NULL;
```

**Step 3: Add email queue fields**

```sql
-- From database_migrations/add_email_queue_fields.sql
ALTER TABLE cv_submissions
ADD COLUMN email_scheduled_for TIMESTAMP NULL,
ADD COLUMN email_attempts INT DEFAULT 0,
ADD COLUMN email_last_attempt TIMESTAMP NULL,
ADD COLUMN email_error TEXT NULL,
ADD COLUMN email_status ENUM('pending', 'sent', 'failed') DEFAULT 'pending';

CREATE INDEX idx_email_scheduled ON cv_submissions(email_scheduled_for);
CREATE INDEX idx_email_status ON cv_submissions(email_status);
```

#### Verify Database Configuration

Your `.env` should have these database settings (already in `server/.env`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
```

### 3. Upload Files to Hostinger

#### Using File Manager

1. Log in to Hostinger hPanel
2. Go to **Files** → **File Manager**
3. Navigate to `public_html` (or your domain's root)

#### Create Directory Structure

Create these folders in File Manager:

```
public_html/
├── index.html           (frontend - from root dist/)
├── assets/              (frontend assets - from root dist/)
├── *.js, *.css         (frontend files - from root dist/)
├── server/              (backend API server)
│   ├── dist/           (compiled JavaScript from server/dist/)
│   ├── node_modules/   (production dependencies)
│   ├── package.json
│   ├── package-lock.json
│   └── .env
├── uploads/
│   └── cvs/            (for CV file storage)
└── logs/               (for application logs)
```

#### Upload Files

**Option 1: Upload via File Manager**

**Frontend:**
1. Compress your root `dist` folder locally: `frontend-dist.zip`
2. Upload to `public_html/`
3. Extract in File Manager (this puts index.html, assets/, etc. in public_html/)

**Backend:**
1. Compress `server/dist` folder locally: `server-dist.zip`
2. Upload to `public_html/server/`
3. Extract in File Manager
4. Upload `server/node_modules` (or install via SSH if available)
5. Upload `server/package.json`, `server/package-lock.json`, `server/.env`

**Option 2: Upload via FTP**
1. Get FTP credentials from hPanel → **Files** → **FTP Accounts**
2. Use FileZilla or similar FTP client
3. Upload frontend files from root `dist/` to `public_html/`
4. Upload backend files from `server/` to `public_html/server/`

### 4. Configure Node.js in Hostinger

#### Set Up Node.js Application

1. In hPanel, go to **Advanced** → **Node.js**
2. Click **Create Application**
3. Configure:
   - **Node.js version:** 18.x or higher
   - **Application mode:** Production
   - **Application root:** `public_html/server`
   - **Application URL:** Your domain
   - **Application startup file:** `dist/index.js` (or `index.js` if in root)
   - **Environment variables:** Add from your `.env` file

#### Add Environment Variables

In the Node.js application settings, add these environment variables:

```
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
UPLOAD_DIR=/home/u931066387/public_html/uploads/cvs
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_key_here
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=SkillTude Team
JWT_SECRET=your_generated_secret_here
SESSION_SECRET=your_generated_secret_here
FRONTEND_URL=https://yourdomain.com
```

**Generate Secrets Locally:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Set Up File Storage Permissions

#### Via File Manager

1. Navigate to `public_html/uploads/cvs`
2. Right-click → **Permissions**
3. Set to `755` (rwxr-xr-x)
4. Check "Apply to subdirectories"

#### Create .htaccess for Security

In `public_html/uploads/.htaccess`:

```apache
# Deny direct access to uploaded files
<Files *>
    Order Deny,Allow
    Deny from all
</Files>

# Allow access only through PHP/Node.js
<FilesMatch "\.(php|js)$">
    Allow from all
</FilesMatch>
```

### 6. Configure SSL Certificate

#### Enable SSL in Hostinger

1. Go to hPanel → **Security** → **SSL**
2. Select your domain
3. Click **Install SSL** (Hostinger provides free SSL)
4. Wait for SSL to activate (usually 10-15 minutes)

#### Force HTTPS

Add to `public_html/.htaccess`:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 7. Configure Email Service

#### SendGrid (Recommended for Hostinger)

1. Sign up at https://sendgrid.com
2. Verify your domain:
   - Go to SendGrid → **Settings** → **Sender Authentication**
   - Add your domain
   - Add DNS records in Hostinger:
     - Go to hPanel → **Domains** → **DNS Zone Editor**
     - Add CNAME records provided by SendGrid

3. Create API Key:
   - SendGrid → **Settings** → **API Keys**
   - Create key with "Mail Send" permission
   - Add to environment variables in Node.js settings

### 8. Start the Application

#### In Hostinger Node.js Manager

1. Go to **Node.js** in hPanel
2. Find your application
3. Click **Start** or **Restart**
4. Check status - should show "Running"

#### Verify Application

```bash
# Test frontend
curl https://yourdomain.com
# Should return HTML

# Test backend health endpoint
curl https://yourdomain.com/api/health
# Should return {"status":"ok"}

# Or visit in browser:
https://yourdomain.com (frontend)
https://yourdomain.com/api/health (backend)
```

### 9. Set Up Cron Jobs for Email Queue

#### Create Cron Job in Hostinger

1. Go to hPanel → **Advanced** → **Cron Jobs**
2. Click **Create Cron Job**
3. Configure:
   - **Type:** Custom
   - **Minute:** `*/5` (every 5 minutes)
   - **Hour:** `*`
   - **Day:** `*`
   - **Month:** `*`
   - **Weekday:** `*`
   - **Command:** 
     ```bash
     cd /home/u931066387/public_html/server && /usr/bin/node dist/jobs/processEmailQueue.js
     ```

**Note:** Adjust the path based on your Hostinger username and file structure.

### 10. Testing & Verification

#### Test CV Upload

1. Visit your website
2. Navigate to CV upload form
3. Upload a test CV
4. Check database in phpMyAdmin:
   ```sql
   SELECT * FROM cv_submissions ORDER BY submitted_at DESC LIMIT 1;
   ```

#### Test File Storage

1. Check if file was created in `public_html/uploads/cvs/YYYY/MM/`
2. Verify file permissions

#### Test Email Delivery

1. Wait for cron job to run (or manually trigger)
2. Check `email_sent_at` in database
3. Verify email received

#### Check Logs

View logs in File Manager:
- `public_html/logs/combined.log`
- `public_html/logs/error.log`

Or check Node.js application logs in hPanel.

## Hostinger-Specific Configuration

### File Paths

Update `.env` with Hostinger-specific paths:

```env
# Use absolute paths for Hostinger
UPLOAD_DIR=/home/u931066387/public_html/uploads/cvs
LOG_DIR=/home/u931066387/public_html/logs
```

Replace `u931066387` with your actual Hostinger username.

### Node.js Version

Ensure you're using Node.js 18+ in Hostinger Node.js selector.

### Memory Limits

Hostinger shared hosting has memory limits. Optimize:

```javascript
// In your Node.js app
process.env.NODE_OPTIONS = '--max-old-space-size=512';
```

### Database Connection Pooling

Update database config for shared hosting:

```javascript
// server/config/database.js
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5, // Lower for shared hosting
  queueLimit: 0
});
```

## Troubleshooting

### Application Won't Start

1. Check Node.js application logs in hPanel
2. Verify `dist/index.js` exists
3. Check environment variables are set
4. Verify database credentials

### Database Connection Failed

1. Verify database credentials in `.env`
2. Check database exists in phpMyAdmin
3. Ensure database user has permissions
4. Try connecting from phpMyAdmin

### File Upload Fails

1. Check directory permissions (755)
2. Verify `UPLOAD_DIR` path is correct
3. Check disk space quota in hPanel
4. Review error logs

### Email Not Sending

1. Verify SendGrid API key
2. Check domain verification in SendGrid
3. Review cron job configuration
4. Check email queue in database:
   ```sql
   SELECT * FROM cv_submissions WHERE email_status = 'pending';
   ```

### SSL Issues

1. Wait 15 minutes after SSL installation
2. Clear browser cache
3. Check SSL status in hPanel
4. Verify .htaccess redirect

## Maintenance

### Update Application

1. Build locally: `npm run build`
2. Upload new `dist` folder via File Manager
3. Restart Node.js application in hPanel

### Database Backup

1. Go to phpMyAdmin
2. Select database
3. Click **Export**
4. Choose **Quick** export method
5. Download SQL file

### Monitor Disk Space

1. Check in hPanel → **Files** → **Disk Usage**
2. Clean old CV files if needed
3. Rotate logs regularly

### View Logs

1. File Manager → `public_html/logs/`
2. Or Node.js application logs in hPanel

## Performance Optimization

### Enable Caching

Add to `.htaccess`:

```apache
# Enable browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Compress Files

```apache
# Enable Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

## Security Checklist

- [ ] SSL certificate installed and active
- [ ] HTTPS redirect enabled
- [ ] Strong database password
- [ ] JWT_SECRET and SESSION_SECRET are random
- [ ] Upload directory not directly accessible
- [ ] .env file not in public directory
- [ ] File permissions set correctly (755 for dirs, 644 for files)
- [ ] SendGrid domain verified
- [ ] Rate limiting enabled in application
- [ ] Input validation enabled

## Support

For Hostinger-specific issues:
- Hostinger Support: https://www.hostinger.com/support
- Hostinger Knowledge Base: https://support.hostinger.com

For application issues:
- Check logs in `public_html/logs/`
- Review documentation in `server/docs/`

---

**Last Updated:** December 2024
**Version:** 1.0.0 (Hostinger-specific)
