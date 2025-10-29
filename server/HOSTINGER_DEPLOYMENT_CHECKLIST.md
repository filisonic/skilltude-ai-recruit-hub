# Hostinger Deployment Checklist

Quick checklist for deploying CV Analysis System to Hostinger.

## Local Preparation

- [ ] Build frontend: `npm run build` (from project root)
- [ ] Build backend: `npm run server:build` (from project root)
- [ ] Create production `.env` file: `cp server/.env.production server/.env`
- [ ] Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- [ ] Generate SESSION_SECRET: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- [ ] Update `.env` with production values (database, email, secrets)
- [ ] Install production dependencies: `npm ci --production`
- [ ] Prepare files for upload (dist, node_modules, package.json, .env)

## Database Setup (phpMyAdmin)

- [ ] Access phpMyAdmin from hPanel
- [ ] Run `complete_database_schema.sql` to create cv_submissions table
- [ ] Run `add_cv_analysis_columns.sql` migration
- [ ] Run `add_email_queue_fields.sql` migration
- [ ] Verify tables exist: `SHOW TABLES;`
- [ ] Test database connection with credentials from `.env`

## File Upload (File Manager)

- [ ] Create directory: `public_html/server/`
- [ ] Create directory: `public_html/uploads/cvs/`
- [ ] Create directory: `public_html/logs/`
- [ ] Upload frontend files from root `dist/` to `public_html/` (index.html, assets/, etc.)
- [ ] Upload backend `server/dist/` folder to `public_html/server/dist/`
- [ ] Upload `server/node_modules/` folder to `public_html/server/node_modules/`
- [ ] Upload `server/package.json` and `server/package-lock.json` to `public_html/server/`
- [ ] Upload `server/.env` file to `public_html/server/`

## File Permissions

- [ ] Set `uploads/cvs/` to 755 (rwxr-xr-x)
- [ ] Set `logs/` to 755 (rwxr-xr-x)
- [ ] Set `.env` to 600 (rw-------)
- [ ] Create `.htaccess` in `uploads/` to deny direct access

## Node.js Configuration

- [ ] Access hPanel → Advanced → Node.js
- [ ] Create new application
- [ ] Set Node.js version: 18.x or higher
- [ ] Set application mode: Production
- [ ] Set application root: `public_html/server`
- [ ] Set startup file: `dist/index.js`
- [ ] Set application URL: your domain
- [ ] Add all environment variables from `.env`
- [ ] Start application
- [ ] Verify status shows "Running"

## SSL Certificate

- [ ] Access hPanel → Security → SSL
- [ ] Select domain
- [ ] Install SSL certificate
- [ ] Wait 10-15 minutes for activation
- [ ] Create `.htaccess` in `public_html/` to force HTTPS
- [ ] Test HTTPS: `https://yourdomain.com`

## Email Service (SendGrid)

- [ ] Sign up for SendGrid account
- [ ] Verify sender email address
- [ ] Verify domain in SendGrid
- [ ] Add DNS records in Hostinger (CNAME for domain verification)
- [ ] Create SendGrid API key with "Mail Send" permission
- [ ] Add API key to Node.js environment variables
- [ ] Test email sending

## Cron Job Setup

- [ ] Access hPanel → Advanced → Cron Jobs
- [ ] Create new cron job
- [ ] Set schedule: `*/5 * * * *` (every 5 minutes)
- [ ] Set command: `cd /home/USERNAME/public_html/server && /usr/bin/node dist/jobs/processEmailQueue.js`
- [ ] Replace USERNAME with your Hostinger username
- [ ] Save cron job
- [ ] Verify cron job is active

## Testing & Verification

- [ ] Test frontend loads: `https://yourdomain.com`
- [ ] Test backend health endpoint: `https://yourdomain.com/api/health`
- [ ] Test CV upload through website
- [ ] Verify file saved in `uploads/cvs/YYYY/MM/`
- [ ] Check database record created in phpMyAdmin
- [ ] Wait for cron job to run (5 minutes)
- [ ] Verify email sent (check `email_sent_at` in database)
- [ ] Check application logs in `public_html/logs/`
- [ ] Test admin dashboard access
- [ ] Test file download from admin dashboard

## Security Verification

- [ ] HTTPS is working and forced
- [ ] SSL certificate is valid (check browser)
- [ ] Upload directory not directly accessible via URL
- [ ] `.env` file not accessible via URL
- [ ] Database credentials are secure
- [ ] JWT_SECRET and SESSION_SECRET are random and unique
- [ ] Rate limiting is enabled
- [ ] CORS is configured for production domain only

## Monitoring Setup

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure email alerts for downtime
- [ ] Set up log monitoring
- [ ] Configure disk space alerts
- [ ] Test alert notifications

## Documentation

- [ ] Document production URLs
- [ ] Document database credentials (store securely)
- [ ] Document SendGrid API key (store securely)
- [ ] Document Hostinger login credentials
- [ ] Document deployment process
- [ ] Document rollback procedure

## Post-Deployment

- [ ] Monitor application for 24 hours
- [ ] Check error logs daily for first week
- [ ] Verify email delivery working
- [ ] Monitor disk space usage
- [ ] Test all features in production
- [ ] Gather user feedback

## Maintenance Schedule

### Daily
- [ ] Check application status in hPanel
- [ ] Review error logs
- [ ] Monitor email delivery queue

### Weekly
- [ ] Review security logs
- [ ] Check disk space usage
- [ ] Test backup restoration
- [ ] Review performance metrics

### Monthly
- [ ] Update dependencies (if needed)
- [ ] Security audit
- [ ] Performance review
- [ ] Database optimization

## Quick Reference

**Hostinger Paths:**
- Application: `/home/USERNAME/public_html/server`
- Uploads: `/home/USERNAME/public_html/uploads/cvs`
- Logs: `/home/USERNAME/public_html/logs`

**Important Files:**
- Entry point: `dist/index.js`
- Environment: `.env`
- Database config: In `.env`

**Key URLs:**
- Health check: `https://yourdomain.com/api/health`
- Admin dashboard: `https://yourdomain.com/admin`
- API base: `https://yourdomain.com/api`

**Support:**
- Hostinger: https://www.hostinger.com/support
- Documentation: `server/docs/HOSTINGER_PRODUCTION_SETUP.md`
- Quick Start: `server/docs/HOSTINGER_QUICK_START.md`

---

## Troubleshooting Quick Fixes

**App won't start:**
```bash
# Check Node.js logs in hPanel
# Verify dist/index.js exists
# Check environment variables are set
```

**Database connection failed:**
```bash
# Test in phpMyAdmin with same credentials
# Verify DB_HOST=localhost
# Check database name and user
```

**File upload fails:**
```bash
# Check permissions: 755 on uploads/cvs
# Verify UPLOAD_DIR path in .env
# Check disk space quota in hPanel
```

**Email not sending:**
```bash
# Verify SendGrid API key
# Check cron job is running
# Query: SELECT * FROM cv_submissions WHERE email_status='pending';
```

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Version:** _______________

✅ **All checks completed - Ready for production!**
