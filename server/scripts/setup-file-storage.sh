#!/bin/bash

# ============================================
# File Storage Setup Script
# SkillTude CV Analysis System
# ============================================
#
# This script sets up the file storage directory structure
# with proper permissions for production deployment.
#
# Usage: sudo bash setup-file-storage.sh
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
UPLOAD_BASE_DIR="/var/www/skilltude/uploads"
CV_UPLOAD_DIR="${UPLOAD_BASE_DIR}/cvs"
LOG_DIR="/var/www/skilltude/logs"
APP_USER="skilltude"
APP_GROUP="skilltude"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   SkillTude File Storage Setup                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}✗ This script must be run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Running as root${NC}"

# ============================================
# 1. Create Application User
# ============================================
echo -e "\n${BLUE}[1] Creating application user${NC}"

if id "$APP_USER" &>/dev/null; then
    echo -e "${YELLOW}⚠ User $APP_USER already exists${NC}"
else
    useradd -r -s /bin/bash -d /var/www/skilltude -m "$APP_USER"
    echo -e "${GREEN}✓ Created user: $APP_USER${NC}"
fi

# ============================================
# 2. Create Directory Structure
# ============================================
echo -e "\n${BLUE}[2] Creating directory structure${NC}"

# Create base directories
mkdir -p "$UPLOAD_BASE_DIR"
mkdir -p "$CV_UPLOAD_DIR"
mkdir -p "$LOG_DIR"

echo -e "${GREEN}✓ Created directory: $UPLOAD_BASE_DIR${NC}"
echo -e "${GREEN}✓ Created directory: $CV_UPLOAD_DIR${NC}"
echo -e "${GREEN}✓ Created directory: $LOG_DIR${NC}"

# Create current year directory
CURRENT_YEAR=$(date +%Y)
mkdir -p "${CV_UPLOAD_DIR}/${CURRENT_YEAR}"
echo -e "${GREEN}✓ Created directory: ${CV_UPLOAD_DIR}/${CURRENT_YEAR}${NC}"

# ============================================
# 3. Set Ownership
# ============================================
echo -e "\n${BLUE}[3] Setting directory ownership${NC}"

chown -R ${APP_USER}:${APP_GROUP} "$UPLOAD_BASE_DIR"
chown -R ${APP_USER}:${APP_GROUP} "$LOG_DIR"

echo -e "${GREEN}✓ Set ownership to ${APP_USER}:${APP_GROUP}${NC}"

# ============================================
# 4. Set Permissions
# ============================================
echo -e "\n${BLUE}[4] Setting directory permissions${NC}"

# Base upload directory: 750 (rwxr-x---)
chmod 750 "$UPLOAD_BASE_DIR"
echo -e "${GREEN}✓ Set permissions 750 on $UPLOAD_BASE_DIR${NC}"

# CV upload directory: 750 (rwxr-x---)
chmod 750 "$CV_UPLOAD_DIR"
echo -e "${GREEN}✓ Set permissions 750 on $CV_UPLOAD_DIR${NC}"

# Year directory: 750 (rwxr-x---)
chmod 750 "${CV_UPLOAD_DIR}/${CURRENT_YEAR}"
echo -e "${GREEN}✓ Set permissions 750 on ${CV_UPLOAD_DIR}/${CURRENT_YEAR}${NC}"

# Log directory: 750 (rwxr-x---)
chmod 750 "$LOG_DIR"
echo -e "${GREEN}✓ Set permissions 750 on $LOG_DIR${NC}"

# ============================================
# 5. Create .htaccess for Apache (if needed)
# ============================================
echo -e "\n${BLUE}[5] Creating .htaccess for security${NC}"

cat > "${UPLOAD_BASE_DIR}/.htaccess" << 'EOF'
# Deny all direct access to uploaded files
Order Deny,Allow
Deny from all
EOF

chown ${APP_USER}:${APP_GROUP} "${UPLOAD_BASE_DIR}/.htaccess"
chmod 644 "${UPLOAD_BASE_DIR}/.htaccess"

echo -e "${GREEN}✓ Created .htaccess file${NC}"

# ============================================
# 6. Create README
# ============================================
echo -e "\n${BLUE}[6] Creating README${NC}"

cat > "${UPLOAD_BASE_DIR}/README.md" << 'EOF'
# SkillTude CV Upload Directory

This directory contains uploaded CV files from the CV Analysis System.

## Directory Structure

```
uploads/
└── cvs/
    └── YYYY/           # Year
        └── MM/         # Month
            └── files   # CV files with UUID names
```

## Security

- Files are stored with UUID-based names to prevent guessing
- Directory is not directly accessible via web
- Access only through authenticated API endpoints
- Permissions: 750 (owner: read/write/execute, group: read/execute, others: none)

## Maintenance

- Old files should be archived or deleted based on retention policy
- Monitor disk space usage regularly
- Backup this directory regularly

## File Naming Convention

Files are named: `{UUID}-{sanitized-original-name}.{ext}`

Example: `a1b2c3d4-e5f6-7890-abcd-ef1234567890-john-doe-cv.pdf`

## Permissions

- Owner: skilltude
- Group: skilltude
- Permissions: 750 (directories), 640 (files)

## Support

For issues, contact: admin@skilltude.com
EOF

chown ${APP_USER}:${APP_GROUP} "${UPLOAD_BASE_DIR}/README.md"
chmod 644 "${UPLOAD_BASE_DIR}/README.md"

echo -e "${GREEN}✓ Created README.md${NC}"

# ============================================
# 7. Verify Setup
# ============================================
echo -e "\n${BLUE}[7] Verifying setup${NC}"

# Check directories exist
if [ -d "$CV_UPLOAD_DIR" ]; then
    echo -e "${GREEN}✓ CV upload directory exists${NC}"
else
    echo -e "${RED}✗ CV upload directory not found${NC}"
    exit 1
fi

# Check ownership
OWNER=$(stat -c '%U:%G' "$CV_UPLOAD_DIR")
if [ "$OWNER" = "${APP_USER}:${APP_GROUP}" ]; then
    echo -e "${GREEN}✓ Correct ownership: $OWNER${NC}"
else
    echo -e "${RED}✗ Incorrect ownership: $OWNER (expected ${APP_USER}:${APP_GROUP})${NC}"
    exit 1
fi

# Check permissions
PERMS=$(stat -c '%a' "$CV_UPLOAD_DIR")
if [ "$PERMS" = "750" ]; then
    echo -e "${GREEN}✓ Correct permissions: $PERMS${NC}"
else
    echo -e "${YELLOW}⚠ Permissions: $PERMS (expected 750)${NC}"
fi

# Test write access
TEST_FILE="${CV_UPLOAD_DIR}/.write_test"
if sudo -u "$APP_USER" touch "$TEST_FILE" 2>/dev/null; then
    echo -e "${GREEN}✓ Write access verified${NC}"
    rm -f "$TEST_FILE"
else
    echo -e "${RED}✗ Write access test failed${NC}"
    exit 1
fi

# ============================================
# 8. Display Summary
# ============================================
echo -e "\n${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Setup Complete                                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}File storage setup completed successfully!${NC}\n"

echo "Directory Structure:"
echo "  Base: $UPLOAD_BASE_DIR"
echo "  CVs:  $CV_UPLOAD_DIR"
echo "  Logs: $LOG_DIR"
echo ""
echo "Ownership: ${APP_USER}:${APP_GROUP}"
echo "Permissions: 750 (directories), 640 (files)"
echo ""
echo "Next Steps:"
echo "  1. Update .env file with UPLOAD_DIR=$CV_UPLOAD_DIR"
echo "  2. Test file upload through the application"
echo "  3. Set up backup for $UPLOAD_BASE_DIR"
echo "  4. Configure log rotation for $LOG_DIR"
echo ""

# ============================================
# 9. Optional: Set up log rotation
# ============================================
echo -e "${BLUE}[Optional] Setting up log rotation${NC}"

read -p "Do you want to set up log rotation? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat > /etc/logrotate.d/skilltude << 'EOF'
/var/www/skilltude/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 skilltude skilltude
    sharedscripts
    postrotate
        systemctl reload skilltude-api 2>/dev/null || true
    endscript
}
EOF
    echo -e "${GREEN}✓ Log rotation configured${NC}"
else
    echo -e "${YELLOW}⚠ Skipped log rotation setup${NC}"
fi

# ============================================
# 10. Optional: Set up storage monitoring
# ============================================
echo -e "\n${BLUE}[Optional] Setting up storage monitoring${NC}"

read -p "Do you want to set up storage monitoring? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cat > /usr/local/bin/check-skilltude-storage.sh << 'EOF'
#!/bin/bash
UPLOAD_DIR="/var/www/skilltude/uploads/cvs"
THRESHOLD=80
ADMIN_EMAIL="admin@skilltude.com"

USAGE=$(df -h $UPLOAD_DIR | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $USAGE -gt $THRESHOLD ]; then
    echo "Storage usage is at ${USAGE}% on $UPLOAD_DIR" | \
        mail -s "Storage Alert: SkillTude" $ADMIN_EMAIL
fi
EOF
    
    chmod +x /usr/local/bin/check-skilltude-storage.sh
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 */6 * * * /usr/local/bin/check-skilltude-storage.sh") | crontab -
    
    echo -e "${GREEN}✓ Storage monitoring configured (runs every 6 hours)${NC}"
else
    echo -e "${YELLOW}⚠ Skipped storage monitoring setup${NC}"
fi

echo -e "\n${GREEN}All done! 🎉${NC}\n"
