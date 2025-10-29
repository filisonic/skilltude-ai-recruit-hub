# Production Environment Setup Guide

This guide provides step-by-step instructions for setting up the CV Analysis System in a production environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Configuration](#database-configuration)
3. [File Storage Setup](#file-storage-setup)
4. [Email Service Configuration](#email-service-configuration)
5. [SSL Certificate Setup](#ssl-certificate-setup)
6. [Environment Variables](#environment-variables)
7. [Security Checklist](#security-checklist)
8. [Deployment Verification](#deployment-verification)

## Prerequisites

Before starting the production setup, ensure you have:

- Node.js 18+ installed
- MySQL 8.0+ database server
- Access to production server with sudo privileges
- Domain name configured and pointing to your server
- Email service provider account (SendGrid, AWS SES, or Mailgun)
- SSL certificate (Let's Encrypt recommended)

## Database Configuration

### 1. Create Production Database

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create production database
CREATE DATABASE skilltude_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated database user
CREATE USER 'skilltude_prod'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';

-- Grant necessary privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON skilltude_production.* TO 'skilltude_prod'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Run Database Migrations

```bash
# Navigate to database migrations directory
cd database_migrations

# Apply CV analysis schema
node apply_migration.js

# Apply email queue fields
node apply_email_queue_migration.js

# Verify tables exist
mysql -u skilltude_prod -p skilltude_production -e "SHOW TABLES;"
```

### 3. Configure Database Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-skilltude-db.sh
```

Add the following content:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/skilltude"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="skilltude_production"
DB_USER="skilltude_prod"
DB_PASS="YOUR_DB_PASSWORD"

mkdir -p $BACKUP_DIR
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

Make executable and add to cron:

```bash
sudo chmod +x /usr/local/bin/backup-skilltude-db.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-skilltude-db.sh
```

## File Storage Setup

### 1. Create Upload Directory Structure

```bash
# Create base upload directory
sudo mkdir -p /var/www/skilltude/uploads/cvs

# Set proper ownership
sudo chown -R www-data:www-data /var/www/skilltude/uploads

# Set secure permissions
sudo chmod 750 /var/www/skilltude/uploads
sudo chmod 750 /var/www/skilltude/uploads/cvs
```

### 2. Configure Directory Permissions

```bash
# Ensure Node.js process can write to upload directory
# If running as specific user (e.g., 'skilltude'):
sudo chown -R skilltude:skilltude /var/www/skilltude/uploads
sudo chmod 750 /var/www/skilltude/uploads/cvs

# Create year/month subdirectories (will be auto-created by app)
# But you can pre-create current year:
sudo mkdir -p /var/www/skilltude/uploads/cvs/$(date +%Y)
sudo chown skilltude:skilltude /var/www/skilltude/uploads/cvs/$(date +%Y)
```

### 3. Set Up Storage Monitoring

```bash
# Create storage monitoring script
sudo nano /usr/local/bin/check-storage.sh
```

Add:

```bash
#!/bin/bash
UPLOAD_DIR="/var/www/skilltude/uploads/cvs"
THRESHOLD=80
ADMIN_EMAIL="admin@skilltude.com"

USAGE=$(df -h $UPLOAD_DIR | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $USAGE -gt $THRESHOLD ]; then
    echo "Storage usage is at ${USAGE}% on $UPLOAD_DIR" | mail -s "Storage Alert: SkillTude" $ADMIN_EMAIL
fi
```

Make executable and schedule:

```bash
sudo chmod +x /usr/local/bin/check-storage.sh
sudo crontab -e
# Add: 0 */6 * * * /usr/local/bin/check-storage.sh
```

### 4. Configure Log Rotation for Uploads

```bash
sudo nano /etc/logrotate.d/skilltude-uploads
```

Add:

```
/var/www/skilltude/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 skilltude skilltude
    sharedscripts
    postrotate
        systemctl reload skilltude-api
    endscript
}
```

## Email Service Configuration

### Option 1: SendGrid (Recommended)

1. **Create SendGrid Account**
   - Sign up at https://sendgrid.com
   - Verify your domain
   - Create API key with "Mail Send" permissions

2. **Configure DNS Records**
   ```
   Add these DNS records for domain authentication:
   - CNAME: em1234.yourdomain.com → u1234.wl.sendgrid.net
   - CNAME: s1._domainkey.yourdomain.com → s1.domainkey.u1234.wl.sendgrid.net
   - CNAME: s2._domainkey.yourdomain.com → s2.domainkey.u1234.wl.sendgrid.net
   ```

3. **Set Environment Variables**
   ```bash
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM_ADDRESS=noreply@yourdomain.com
   EMAIL_FROM_NAME=SkillTude Team
   ```

### Option 2: AWS SES

1. **Set Up AWS SES**
   ```bash
   # Install AWS CLI
   sudo apt install awscli
   
   # Configure AWS credentials
   aws configure
   ```

2. **Verify Domain**
   ```bash
   aws ses verify-domain-identity --domain yourdomain.com
   ```

3. **Set Environment Variables**
   ```bash
   EMAIL_PROVIDER=ses
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
   AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM_ADDRESS=noreply@yourdomain.com
   EMAIL_FROM_NAME=SkillTude Team
   ```

### Option 3: Mailgun

1. **Create Mailgun Account**
   - Sign up at https://mailgun.com
   - Add and verify your domain

2. **Set Environment Variables**
   ```bash
   EMAIL_PROVIDER=mailgun
   MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   MAILGUN_DOMAIN=mg.yourdomain.com
   EMAIL_FROM_ADDRESS=noreply@yourdomain.com
   EMAIL_FROM_NAME=SkillTude Team
   ```

### Email Testing

```bash
# Test email configuration
cd server
node -e "
const EmailService = require('./services/EmailService').default;
const emailService = new EmailService();
emailService.sendTestEmail('your-email@example.com')
  .then(() => console.log('Test email sent successfully'))
  .catch(err => console.error('Email test failed:', err));
"
```

## SSL Certificate Setup

### Option 1: Let's Encrypt (Free, Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run

# Certificate will be at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Option 2: Commercial SSL Certificate

```bash
# Generate CSR
openssl req -new -newkey rsa:2048 -nodes \
  -keyout yourdomain.com.key \
  -out yourdomain.com.csr

# Submit CSR to certificate authority
# Download certificate files when ready

# Install certificate
sudo mkdir -p /etc/ssl/skilltude
sudo cp yourdomain.com.crt /etc/ssl/skilltude/
sudo cp yourdomain.com.key /etc/ssl/skilltude/
sudo chmod 600 /etc/ssl/skilltude/yourdomain.com.key
```

### Configure Nginx for SSL

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Environment Variables

### 1. Create Production .env File

```bash
# Navigate to server directory
cd /var/www/skilltude/server

# Create production .env file
sudo nano .env
```

### 2. Production Environment Variables Template

```bash
# ============================================
# PRODUCTION ENVIRONMENT CONFIGURATION
# ============================================

# Server Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skilltude_production
DB_USER=skilltude_prod
DB_PASSWORD=STRONG_DATABASE_PASSWORD_HERE

# File Storage Configuration
UPLOAD_DIR=/var/www/skilltude/uploads/cvs
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Email Service Configuration
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY_HERE
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=SkillTude Team

# Security Configuration
JWT_SECRET=GENERATE_STRONG_RANDOM_STRING_HERE
SESSION_SECRET=GENERATE_ANOTHER_STRONG_RANDOM_STRING_HERE
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5

# Analysis Configuration
EMAIL_DELAY_HOURS=24
MIN_CV_SCORE=0
MAX_CV_SCORE=100

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com

# Monitoring Configuration
ENABLE_MONITORING=true
LOG_LEVEL=info

# Optional: Virus Scanning
ENABLE_VIRUS_SCANNING=false
```

### 3. Generate Secure Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Secure Environment File

```bash
# Set proper permissions
sudo chmod 600 /var/www/skilltude/server/.env
sudo chown skilltude:skilltude /var/www/skilltude/server/.env
```

## Security Checklist

### Application Security

- [ ] All environment variables set with strong values
- [ ] JWT_SECRET and SESSION_SECRET are random and unique
- [ ] Database user has minimal required privileges
- [ ] File upload directory is outside web root
- [ ] Rate limiting is enabled
- [ ] CORS is configured for production domain only
- [ ] Input validation is enabled on all endpoints
- [ ] SQL injection protection via parameterized queries
- [ ] XSS protection headers are set

### Server Security

- [ ] Firewall configured (UFW or iptables)
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Fail2ban installed and configured
- [ ] Automatic security updates enabled
- [ ] Non-root user for running application
- [ ] File permissions properly set

### SSL/TLS Security

- [ ] SSL certificate installed and valid
- [ ] HTTP to HTTPS redirect configured
- [ ] HSTS header enabled
- [ ] TLS 1.2+ only
- [ ] Strong cipher suites configured

### Monitoring & Logging

- [ ] Application logs configured
- [ ] Log rotation enabled
- [ ] Error alerting configured
- [ ] Uptime monitoring enabled
- [ ] Storage monitoring enabled
- [ ] Database backup automated

## Deployment Verification

### 1. Check Application Status

```bash
# Check if application is running
sudo systemctl status skilltude-api

# Check application logs
sudo journalctl -u skilltude-api -n 50 --no-pager

# Check for errors
tail -f /var/www/skilltude/logs/error.log
```

### 2. Test Database Connection

```bash
cd /var/www/skilltude/server
node -e "
const mysql = require('mysql2/promise');
const config = require('./config').dbConfig;
mysql.createConnection(config)
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection failed:', err));
"
```

### 3. Test File Upload

```bash
# Create test upload
curl -X POST https://yourdomain.com/api/cv/upload \
  -F "file=@test-cv.pdf" \
  -F "firstName=Test" \
  -F "lastName=User" \
  -F "email=test@example.com" \
  -F "phone=1234567890" \
  -F "consentGiven=true"
```

### 4. Test Email Delivery

```bash
# Check email queue
mysql -u skilltude_prod -p skilltude_production \
  -e "SELECT * FROM cv_submissions WHERE email_sent_at IS NULL LIMIT 5;"

# Manually trigger email queue processing
cd /var/www/skilltude/server
node jobs/processEmailQueue.js
```

### 5. Test SSL Certificate

```bash
# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Test SSL rating
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

### 6. Performance Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API performance
ab -n 100 -c 10 https://yourdomain.com/api/health

# Monitor resource usage
htop
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
sudo journalctl -u skilltude-api -n 100

# Check environment variables
cd /var/www/skilltude/server
node -e "require('dotenv').config(); console.log(process.env);"

# Check port availability
sudo netstat -tulpn | grep 3001
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u skilltude_prod -p -h localhost skilltude_production

# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### File Upload Issues

```bash
# Check directory permissions
ls -la /var/www/skilltude/uploads/cvs

# Check disk space
df -h /var/www/skilltude/uploads

# Check application user
ps aux | grep node
```

### Email Delivery Issues

```bash
# Check email service logs
tail -f /var/www/skilltude/logs/combined.log | grep email

# Test email service directly
cd /var/www/skilltude/server
node examples/email-service-example.ts
```

## Maintenance Tasks

### Daily

- Monitor application logs for errors
- Check email delivery queue
- Verify backup completion

### Weekly

- Review security logs
- Check storage usage
- Update dependencies (if needed)

### Monthly

- Review and rotate logs
- Test backup restoration
- Security audit
- Performance review

## Support

For issues or questions:
- Email: admin@skilltude.com
- Documentation: /server/docs/
- Logs: /var/www/skilltude/logs/

---

**Last Updated:** December 2024
**Version:** 1.0.0
