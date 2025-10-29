# HTTPS Setup Guide

## Overview

This guide explains how to configure HTTPS for the CV Analysis & Upload System in production environments.

## Why HTTPS is Required

1. **Data Protection**: Encrypts data in transit (user information, CV files, authentication tokens)
2. **Authentication**: Verifies server identity to prevent man-in-the-middle attacks
3. **Compliance**: Required for GDPR, PCI-DSS, and other regulations
4. **SEO**: Google ranks HTTPS sites higher
5. **Browser Features**: Modern browsers require HTTPS for certain features (geolocation, camera, etc.)

## Implementation

### 1. HTTPS Enforcement Middleware

The system automatically redirects HTTP to HTTPS in production:

```typescript
// In server/middleware/security.ts
export function enforceHttps(req: Request, res: Response, next: NextFunction): void {
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  const isHttps = req.secure || 
                  req.headers['x-forwarded-proto'] === 'https' ||
                  req.headers['x-forwarded-ssl'] === 'on';
  
  if (!isHttps) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  
  next();
}
```

### 2. HSTS (HTTP Strict Transport Security)

HSTS forces browsers to use HTTPS for all future requests:

```typescript
// In server/middleware/security.ts
export function hstsHeader(req: Request, res: Response, next: NextFunction): void {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  next();
}
```

**HSTS Parameters:**
- `max-age=31536000`: 1 year (recommended minimum)
- `includeSubDomains`: Apply to all subdomains
- `preload`: Eligible for browser preload lists

### 3. Secure Cookie Configuration

Cookies are configured with security flags:

```typescript
// In server/middleware/auth.ts
export function getSecureCookieOptions() {
  return {
    httpOnly: true,      // Prevents JavaScript access (XSS protection)
    secure: true,        // Only send over HTTPS
    sameSite: 'strict',  // Prevents CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
}
```

**Usage:**
```typescript
res.cookie('token', jwtToken, getSecureCookieOptions());
```

## SSL/TLS Certificate Setup

### Option 1: Let's Encrypt (Free, Recommended)

Let's Encrypt provides free SSL certificates with automatic renewal.

#### Using Certbot

1. **Install Certbot:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install certbot
   
   # CentOS/RHEL
   sudo yum install certbot
   ```

2. **Obtain Certificate:**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
   ```

3. **Certificate Location:**
   - Certificate: `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
   - Private Key: `/etc/letsencrypt/live/yourdomain.com/privkey.pem`

4. **Auto-Renewal:**
   ```bash
   # Test renewal
   sudo certbot renew --dry-run
   
   # Add to crontab for automatic renewal
   0 0 * * * certbot renew --quiet
   ```

### Option 2: Commercial SSL Certificate

Purchase from providers like:
- DigiCert
- Comodo
- GoDaddy
- Namecheap

Follow provider's instructions for certificate generation and installation.

### Option 3: Cloud Provider SSL

#### AWS Certificate Manager (ACM)
- Free SSL certificates for AWS resources
- Automatic renewal
- Integrated with ELB, CloudFront, API Gateway

#### Cloudflare SSL
- Free SSL with Cloudflare CDN
- Automatic certificate management
- DDoS protection included

## Server Configuration

### Node.js with HTTPS Module

For direct HTTPS server (not recommended for production):

```typescript
import https from 'https';
import fs from 'fs';
import app from './index';

const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem'),
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
```

### Nginx Reverse Proxy (Recommended)

#### Install Nginx:
```bash
sudo apt-get install nginx
```

#### Configure Nginx:

Create `/etc/nginx/sites-available/skilltude`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Proxy to Node.js
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
    
    # File Upload Size Limit
    client_max_body_size 10M;
}
```

#### Enable Site:
```bash
sudo ln -s /etc/nginx/sites-available/skilltude /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Apache Reverse Proxy

#### Enable Modules:
```bash
sudo a2enmod ssl proxy proxy_http headers rewrite
```

#### Configure Apache:

Create `/etc/apache2/sites-available/skilltude-ssl.conf`:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    
    # Redirect to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/yourdomain.com/privkey.pem
    
    # SSL Security
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5
    
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Security Headers
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Proxy Configuration
    ProxyPreserveHost On
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    # Set headers for proxy
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
</VirtualHost>
```

#### Enable Site:
```bash
sudo a2ensite skilltude-ssl
sudo apache2ctl configtest
sudo systemctl restart apache2
```

## Environment Configuration

### Production Environment Variables

Update `.env` file:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Frontend URL (HTTPS)
FRONTEND_URL=https://yourdomain.com

# Force HTTPS
FORCE_HTTPS=true

# Cookie Security
COOKIE_SECURE=true
```

### Application Configuration

The application automatically detects production environment and enables HTTPS features:

```typescript
// In server/index.ts
if (serverConfig.nodeEnv === 'production') {
  app.use(enforceHttps);
  app.use(hstsHeader);
}
```

## Testing HTTPS Configuration

### 1. SSL Labs Test

Test your SSL configuration:
- Visit: https://www.ssllabs.com/ssltest/
- Enter your domain
- Aim for A+ rating

### 2. Security Headers Test

Test security headers:
- Visit: https://securityheaders.com/
- Enter your domain
- Aim for A+ rating

### 3. Manual Testing

```bash
# Test HTTPS connection
curl -I https://yourdomain.com

# Test HTTP to HTTPS redirect
curl -I http://yourdomain.com

# Test HSTS header
curl -I https://yourdomain.com | grep -i strict-transport-security

# Test certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### 4. Browser Testing

1. Open browser DevTools (F12)
2. Go to Network tab
3. Visit your site
4. Check:
   - Connection is HTTPS (lock icon)
   - No mixed content warnings
   - Cookies have Secure flag
   - HSTS header is present

## Troubleshooting

### Mixed Content Errors

**Problem:** Page loads over HTTPS but resources load over HTTP

**Solution:**
1. Update all resource URLs to use HTTPS or protocol-relative URLs
2. Check Content-Security-Policy headers
3. Update API endpoints to use HTTPS

```typescript
// Update API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yourdomain.com'
  : 'http://localhost:3001';
```

### Certificate Errors

**Problem:** Browser shows certificate warning

**Solutions:**
1. Verify certificate is valid and not expired
2. Check certificate chain is complete
3. Ensure domain name matches certificate
4. Clear browser cache

```bash
# Check certificate expiry
openssl x509 -in /path/to/cert.pem -noout -dates

# Verify certificate chain
openssl verify -CAfile /path/to/chain.pem /path/to/cert.pem
```

### Redirect Loop

**Problem:** Infinite redirect between HTTP and HTTPS

**Solution:**
1. Check proxy headers are set correctly
2. Verify `X-Forwarded-Proto` header
3. Check both Nginx/Apache and Node.js aren't both redirecting

```nginx
# In Nginx config
proxy_set_header X-Forwarded-Proto $scheme;
```

### Performance Issues

**Problem:** HTTPS slower than HTTP

**Solutions:**
1. Enable HTTP/2
2. Use SSL session caching
3. Enable OCSP stapling
4. Use CDN for static assets

```nginx
# Enable HTTP/2
listen 443 ssl http2;

# SSL Session Cache
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
```

## Maintenance

### Certificate Renewal

#### Let's Encrypt (Automatic)
```bash
# Check renewal status
sudo certbot certificates

# Manual renewal
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

#### Commercial Certificates
- Set calendar reminder 30 days before expiry
- Follow provider's renewal process
- Update certificate files on server
- Restart web server

### Monitoring

Set up monitoring for:
- Certificate expiry (alert 30 days before)
- SSL/TLS protocol versions
- Cipher suite usage
- HTTPS availability
- Mixed content errors

### Security Updates

Regularly update:
- SSL/TLS protocols (disable old versions)
- Cipher suites (remove weak ciphers)
- Security headers
- Certificate authority trust store

## Best Practices

1. **Use Strong Ciphers**: Disable SSLv3, TLSv1.0, TLSv1.1
2. **Enable HSTS**: Force HTTPS for all future requests
3. **Use HTTP/2**: Better performance over HTTPS
4. **Enable OCSP Stapling**: Faster certificate validation
5. **Regular Updates**: Keep SSL/TLS configuration current
6. **Monitor Certificates**: Set up expiry alerts
7. **Test Regularly**: Use SSL Labs and Security Headers tests
8. **Document Changes**: Keep record of SSL configuration changes

## Resources

- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [Security Headers Test](https://securityheaders.com/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [OWASP Transport Layer Protection](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)

## Support

For HTTPS setup assistance, contact: devops@skilltude.com
