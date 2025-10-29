#!/bin/bash

# ============================================
# SSL Certificate Setup Script
# SkillTude CV Analysis System
# ============================================
#
# This script sets up SSL certificate using Let's Encrypt
#
# Usage: sudo bash setup-ssl.sh yourdomain.com
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if domain provided
if [ -z "$1" ]; then
    echo -e "${RED}✗ Usage: sudo bash setup-ssl.sh yourdomain.com${NC}"
    exit 1
fi

DOMAIN=$1
WWW_DOMAIN="www.$DOMAIN"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   SkillTude SSL Certificate Setup                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}✗ This script must be run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Running as root${NC}"
echo -e "Domain: ${BLUE}$DOMAIN${NC}"

# ============================================
# 1. Check Prerequisites
# ============================================
echo -e "\n${BLUE}[1] Checking prerequisites${NC}"

# Check if Nginx is installed
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✓ Nginx is installed${NC}"
else
    echo -e "${RED}✗ Nginx is not installed${NC}"
    read -p "Do you want to install Nginx? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        apt update
        apt install -y nginx
        echo -e "${GREEN}✓ Nginx installed${NC}"
    else
        echo -e "${RED}✗ Nginx is required. Exiting.${NC}"
        exit 1
    fi
fi

# Check if domain resolves to this server
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

echo "Server IP: $SERVER_IP"
echo "Domain IP: $DOMAIN_IP"

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo -e "${YELLOW}⚠ Warning: Domain does not resolve to this server${NC}"
    echo "Make sure your DNS is configured correctly before continuing."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ Domain resolves to this server${NC}"
fi

# ============================================
# 2. Install Certbot
# ============================================
echo -e "\n${BLUE}[2] Installing Certbot${NC}"

if command -v certbot &> /dev/null; then
    echo -e "${GREEN}✓ Certbot is already installed${NC}"
else
    apt update
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
fi

# ============================================
# 3. Create Nginx Configuration
# ============================================
echo -e "\n${BLUE}[3] Creating Nginx configuration${NC}"

NGINX_CONF="/etc/nginx/sites-available/skilltude"

cat > "$NGINX_CONF" << EOF
# SkillTude CV Analysis System - Nginx Configuration
# HTTP server (will redirect to HTTPS after SSL setup)

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN;

    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all other traffic to HTTPS (will be enabled after SSL setup)
    # location / {
    #     return 301 https://\$server_name\$request_uri;
    # }

    # Temporary: Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/skilltude

# Remove default site if exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
    echo -e "${GREEN}✓ Removed default Nginx site${NC}"
fi

# Test Nginx configuration
if nginx -t; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✓ Nginx reloaded${NC}"
else
    echo -e "${RED}✗ Nginx configuration is invalid${NC}"
    exit 1
fi

# ============================================
# 4. Obtain SSL Certificate
# ============================================
echo -e "\n${BLUE}[4] Obtaining SSL certificate${NC}"

read -p "Enter your email address for Let's Encrypt notifications: " EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}✗ Email is required${NC}"
    exit 1
fi

echo -e "${YELLOW}Obtaining certificate for $DOMAIN and $WWW_DOMAIN...${NC}"

certbot --nginx \
    -d "$DOMAIN" \
    -d "$WWW_DOMAIN" \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --redirect

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate obtained successfully${NC}"
else
    echo -e "${RED}✗ Failed to obtain SSL certificate${NC}"
    exit 1
fi

# ============================================
# 5. Update Nginx Configuration for Production
# ============================================
echo -e "\n${BLUE}[5] Updating Nginx configuration for production${NC}"

cat > "$NGINX_CONF" << 'EOF'
# SkillTude CV Analysis System - Nginx Configuration
# Production configuration with SSL

# HTTP server - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN;

    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN $WWW_DOMAIN;

    # SSL configuration (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/skilltude-access.log;
    error_log /var/log/nginx/skilltude-error.log;

    # Max upload size (10MB for CV files)
    client_max_body_size 10M;

    # Proxy to Node.js application
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files (if serving from Nginx)
    location /static/ {
        alias /var/www/skilltude/public/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}
EOF

# Replace placeholders
sed -i "s/\$DOMAIN/$DOMAIN/g" "$NGINX_CONF"
sed -i "s/\$WWW_DOMAIN/$WWW_DOMAIN/g" "$NGINX_CONF"

# Test and reload
if nginx -t; then
    echo -e "${GREEN}✓ Nginx configuration updated${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✓ Nginx reloaded${NC}"
else
    echo -e "${RED}✗ Nginx configuration is invalid${NC}"
    exit 1
fi

# ============================================
# 6. Test SSL Certificate
# ============================================
echo -e "\n${BLUE}[6] Testing SSL certificate${NC}"

# Test HTTPS connection
if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ HTTPS is working${NC}"
else
    echo -e "${YELLOW}⚠ HTTPS test returned unexpected status${NC}"
fi

# ============================================
# 7. Set up Auto-Renewal
# ============================================
echo -e "\n${BLUE}[7] Setting up auto-renewal${NC}"

# Test renewal
if certbot renew --dry-run; then
    echo -e "${GREEN}✓ Auto-renewal test successful${NC}"
else
    echo -e "${YELLOW}⚠ Auto-renewal test failed${NC}"
fi

# Certbot automatically sets up a systemd timer for renewal
if systemctl is-enabled certbot.timer &> /dev/null; then
    echo -e "${GREEN}✓ Auto-renewal timer is enabled${NC}"
else
    systemctl enable certbot.timer
    systemctl start certbot.timer
    echo -e "${GREEN}✓ Auto-renewal timer enabled${NC}"
fi

# ============================================
# Summary
# ============================================
echo -e "\n${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   SSL Setup Complete                                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}SSL certificate setup completed successfully!${NC}\n"

echo "Certificate Details:"
echo "  Domain: $DOMAIN"
echo "  WWW Domain: $WWW_DOMAIN"
echo "  Certificate: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "  Private Key: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
echo ""
echo "Next Steps:"
echo "  1. Test your site: https://$DOMAIN"
echo "  2. Check SSL rating: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo "  3. Update .env file with FRONTEND_URL=https://$DOMAIN"
echo "  4. Restart your application"
echo ""
echo "Auto-Renewal:"
echo "  Certificates will auto-renew via systemd timer"
echo "  Check status: systemctl status certbot.timer"
echo "  Test renewal: certbot renew --dry-run"
echo ""

echo -e "${GREEN}All done! 🎉${NC}\n"
