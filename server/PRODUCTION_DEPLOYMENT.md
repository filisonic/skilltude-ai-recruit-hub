# Production Deployment Guide

This guide provides a complete walkthrough for deploying the SkillTude CV Analysis System to production.

## Quick Start

For experienced administrators, use the automated deployment script:

```bash
# Clone repository
git clone <repository-url>
cd skilltude

# Run deployment script
sudo bash server/scripts/deploy-production.sh
```

## Manual Deployment Steps

### Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+
- MySQL 8.0+
- Nginx
- Domain name pointing to your server
- Root or sudo access

### Step-by-Step Deployment

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install other dependencies
sudo apt install -y git build-essential
```

#### 2. Set Up Database

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create production database
sudo mysql -u root -p < server/scripts/setup-production-db.sql

# Run migrations
cd database_migrations
node apply_migration.js
node apply_email_queue_migration.js
```

#### 3. Set Up Application

```bash
# Create application directory
sudo mkdir -p /var/www/skilltude
cd /var/www/skilltude

# Clone repository
git clone <repository-url> .

# Install dependencies
cd server
npm ci --production

# Build application (if TypeScript)
npm run build
```

#### 4. Configure Environment

```bash
# Copy environment template
cp .env.production .env

# Edit environment file
nano .env

# Generate secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Set proper permissions
chmod 600 .env
```

#### 5. Set Up File Storage

```bash
# Run file storage setup script
sudo bash server/scripts/setup-file-storage.sh

# Or manually:
sudo mkdir -p /var/www/skilltude/uploads/cvs
sudo chown -R skilltude:skilltude /var/www/skilltude/uploads
sudo chmod 750 /var/www/skilltude/uploads/cvs
```

#### 6. Configure Email Service

Choose one of the following email providers:

**SendGrid (Recommended)**
```bash
# Sign up at https://sendgrid.com
# Create API key
# Add to .env:
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_api_key_here
```

**AWS SES**
```bash
# Configure AWS credentials
EMAIL_PROVIDER=ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

**Mailgun**
```bash
# Sign up at https://mailgun.com
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=your_key
MAILGUN_DOMAIN=mg.yourdomain.com
```

#### 7. Set Up SSL Certificate

```bash
# Run SSL setup script
sudo bash server/scripts/setup-ssl.sh yourdomain.com

# Or manually with Certbot:
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 8. Set Up Systemd Service

```bash
# Copy service file
sudo cp server/skilltude-api.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable skilltude-api

# Start service
sudo systemctl start skilltude-api

# Check status
sudo systemctl status skilltude-api
```

#### 9. Configure Nginx

```bash
# Nginx configuration is set up by SSL script
# Or manually create /etc/nginx/sites-available/skilltude

# Enable site
sudo ln -s /etc/nginx/sites-available/skilltude /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### 10. Validate Deployment

```bash
# Run validation script
cd /var/www/skilltude/server
node scripts/validate-production-env.js

# Test application
curl http://localhost:3001/health
curl https://yourdomain.com/health

# Check logs
sudo journalctl -u skilltude-api -n 50
```

## Post-Deployment

### Security Hardening

```bash
# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### Set Up Monitoring

```bash
# Enable application monitoring
# Set in .env:
ENABLE_MONITORING=true

# Access monitoring dashboard
https://yourdomain.com/admin/monitoring
```

### Configure Backups

```bash
# Database backups
sudo nano /usr/local/bin/backup-skilltude-db.sh
sudo chmod +x /usr/local/bin/backup-skilltude-db.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-skilltude-db.sh

# File backups
sudo apt install rsync
# Configure rsync or use cloud backup solution
```

### Set Up Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/skilltude

# Add configuration (see PRODUCTION_SETUP_GUIDE.md)

# Test logrotate
sudo logrotate -d /etc/logrotate.d/skilltude
```

## Maintenance

### Update Application

```bash
# Pull latest code
cd /var/www/skilltude
sudo -u skilltude git pull

# Install dependencies
cd server
sudo -u skilltude npm ci --production

# Build (if needed)
sudo -u skilltude npm run build

# Restart service
sudo systemctl restart skilltude-api
```

### View Logs

```bash
# Application logs
sudo journalctl -u skilltude-api -f

# Nginx logs
sudo tail -f /var/log/nginx/skilltude-access.log
sudo tail -f /var/log/nginx/skilltude-error.log

# Application file logs
tail -f /var/www/skilltude/logs/combined.log
tail -f /var/www/skilltude/logs/error.log
```

### Restart Services

```bash
# Restart application
sudo systemctl restart skilltude-api

# Restart Nginx
sudo systemctl restart nginx

# Restart MySQL
sudo systemctl restart mysql
```

## Troubleshooting

### Application Won't Start

```bash
# Check service status
sudo systemctl status skilltude-api

# Check logs
sudo journalctl -u skilltude-api -n 100

# Check environment variables
cd /var/www/skilltude/server
node -e "require('dotenv').config(); console.log(process.env.NODE_ENV);"

# Check port availability
sudo netstat -tulpn | grep 3001
```

### Database Connection Issues

```bash
# Test database connection
mysql -u skilltude_prod -p -h localhost skilltude_production

# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Check Nginx SSL configuration
sudo nginx -t
```

### File Upload Issues

```bash
# Check directory permissions
ls -la /var/www/skilltude/uploads/cvs

# Check disk space
df -h

# Check application user
ps aux | grep node
```

## Performance Optimization

### Enable Caching

```bash
# Install Redis (optional)
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Add to .env:
REDIS_URL=redis://localhost:6379
```

### Optimize Database

```bash
# Add indexes
mysql -u skilltude_prod -p skilltude_production

# Run optimization
OPTIMIZE TABLE cv_submissions;
ANALYZE TABLE cv_submissions;
```

### Enable Compression

```bash
# Nginx gzip is enabled by default
# Verify in /etc/nginx/nginx.conf
```

## Monitoring & Alerts

### Set Up Uptime Monitoring

- Use services like UptimeRobot, Pingdom, or StatusCake
- Monitor: https://yourdomain.com/health

### Set Up Error Tracking

```bash
# Optional: Set up Sentry
# Add to .env:
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### Set Up Log Monitoring

```bash
# Install logwatch
sudo apt install logwatch

# Configure email alerts
sudo nano /etc/logwatch/conf/logwatch.conf
```

## Rollback Procedure

If deployment fails:

```bash
# Stop service
sudo systemctl stop skilltude-api

# Restore previous version
cd /var/www/skilltude
sudo -u skilltude git checkout <previous-commit>

# Restore database (if needed)
mysql -u skilltude_prod -p skilltude_production < backup.sql

# Restart service
sudo systemctl start skilltude-api
```

## Support

For issues or questions:

- Documentation: `/server/docs/`
- Logs: `/var/www/skilltude/logs/`
- Email: admin@skilltude.com

## Checklist

Use the comprehensive checklist:

```bash
cat server/docs/DEPLOYMENT_CHECKLIST.md
```

## Additional Resources

- [Production Setup Guide](./docs/PRODUCTION_SETUP_GUIDE.md)
- [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Admin Guide](./docs/ADMIN_GUIDE.md)
- [Security Guide](./docs/SECURITY.md)

---

**Last Updated:** December 2024
**Version:** 1.0.0
