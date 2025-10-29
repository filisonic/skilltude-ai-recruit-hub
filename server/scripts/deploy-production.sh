#!/bin/bash

# ============================================
# Production Deployment Script
# SkillTude CV Analysis System
# ============================================
#
# This script automates the production deployment process
#
# Usage: sudo bash deploy-production.sh
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   SkillTude CV Analysis System                            ║
║   Production Deployment                                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Configuration
APP_DIR="/var/www/skilltude"
SERVER_DIR="$APP_DIR/server"
APP_USER="skilltude"
APP_GROUP="skilltude"
NODE_VERSION="18"

# ============================================
# Pre-flight Checks
# ============================================
echo -e "\n${BLUE}[Pre-flight Checks]${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}✗ This script must be run as root (use sudo)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Running as root${NC}"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_CURRENT" -ge "$NODE_VERSION" ]; then
        echo -e "${GREEN}✓ Node.js $(node -v) is installed${NC}"
    else
        echo -e "${RED}✗ Node.js version must be $NODE_VERSION or higher${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi

# Check MySQL
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✓ MySQL is installed${NC}"
else
    echo -e "${RED}✗ MySQL is not installed${NC}"
    exit 1
fi

# ============================================
# Step 1: Create Application User
# ============================================
echo -e "\n${BLUE}[Step 1/10] Creating application user${NC}"

if id "$APP_USER" &>/dev/null; then
    echo -e "${YELLOW}⚠ User $APP_USER already exists${NC}"
else
    useradd -r -s /bin/bash -d "$APP_DIR" -m "$APP_USER"
    echo -e "${GREEN}✓ Created user: $APP_USER${NC}"
fi

# ============================================
# Step 2: Create Directory Structure
# ============================================
echo -e "\n${BLUE}[Step 2/10] Creating directory structure${NC}"

mkdir -p "$APP_DIR"
mkdir -p "$SERVER_DIR"
mkdir -p "$APP_DIR/uploads/cvs"
mkdir -p "$APP_DIR/logs"

echo -e "${GREEN}✓ Directory structure created${NC}"

# ============================================
# Step 3: Copy Application Files
# ============================================
echo -e "\n${BLUE}[Step 3/10] Copying application files${NC}"

# Assuming script is run from project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

echo "Project root: $PROJECT_ROOT"

if [ ! -d "$PROJECT_ROOT/server" ]; then
    echo -e "${RED}✗ Server directory not found in project root${NC}"
    exit 1
fi

# Copy server files
rsync -av --exclude='node_modules' --exclude='.env' --exclude='dist' \
    "$PROJECT_ROOT/server/" "$SERVER_DIR/"

echo -e "${GREEN}✓ Application files copied${NC}"

# ============================================
# Step 4: Install Dependencies
# ============================================
echo -e "\n${BLUE}[Step 4/10] Installing dependencies${NC}"

cd "$SERVER_DIR"

# Install production dependencies
sudo -u "$APP_USER" npm ci --production

echo -e "${GREEN}✓ Dependencies installed${NC}"

# ============================================
# Step 5: Build Application (if TypeScript)
# ============================================
echo -e "\n${BLUE}[Step 5/10] Building application${NC}"

if [ -f "$SERVER_DIR/tsconfig.json" ]; then
    # Install dev dependencies for build
    sudo -u "$APP_USER" npm install --save-dev typescript @types/node
    
    # Build
    sudo -u "$APP_USER" npm run build
    
    echo -e "${GREEN}✓ Application built${NC}"
else
    echo -e "${YELLOW}⚠ No TypeScript config found, skipping build${NC}"
fi

# ============================================
# Step 6: Set Up Environment Variables
# ============================================
echo -e "\n${BLUE}[Step 6/10] Setting up environment variables${NC}"

if [ ! -f "$SERVER_DIR/.env" ]; then
    if [ -f "$SERVER_DIR/.env.production" ]; then
        cp "$SERVER_DIR/.env.production" "$SERVER_DIR/.env"
        echo -e "${YELLOW}⚠ Created .env from .env.production template${NC}"
        echo -e "${YELLOW}⚠ You MUST edit .env and fill in actual values${NC}"
    else
        echo -e "${RED}✗ No .env or .env.production file found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Set proper permissions
chmod 600 "$SERVER_DIR/.env"
chown "$APP_USER:$APP_GROUP" "$SERVER_DIR/.env"

echo -e "${GREEN}✓ Environment file configured${NC}"

# ============================================
# Step 7: Set Up Database
# ============================================
echo -e "\n${BLUE}[Step 7/10] Setting up database${NC}"

read -p "Do you want to run database setup? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "$SERVER_DIR/scripts/setup-production-db.sql" ]; then
        echo -e "${YELLOW}Please edit the SQL file with your database password first${NC}"
        echo "File: $SERVER_DIR/scripts/setup-production-db.sql"
        read -p "Press enter when ready to continue..."
        
        mysql -u root -p < "$SERVER_DIR/scripts/setup-production-db.sql"
        echo -e "${GREEN}✓ Database created${NC}"
        
        # Run migrations
        cd "$PROJECT_ROOT/database_migrations"
        node apply_migration.js
        node apply_email_queue_migration.js
        echo -e "${GREEN}✓ Migrations applied${NC}"
    else
        echo -e "${YELLOW}⚠ Database setup script not found${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Skipped database setup${NC}"
fi

# ============================================
# Step 8: Set Up File Storage
# ============================================
echo -e "\n${BLUE}[Step 8/10] Setting up file storage${NC}"

# Set ownership
chown -R "$APP_USER:$APP_GROUP" "$APP_DIR/uploads"
chown -R "$APP_USER:$APP_GROUP" "$APP_DIR/logs"

# Set permissions
chmod 750 "$APP_DIR/uploads"
chmod 750 "$APP_DIR/uploads/cvs"
chmod 750 "$APP_DIR/logs"

# Create .htaccess
cat > "$APP_DIR/uploads/.htaccess" << 'EOF'
Order Deny,Allow
Deny from all
EOF

echo -e "${GREEN}✓ File storage configured${NC}"

# ============================================
# Step 9: Set Up Systemd Service
# ============================================
echo -e "\n${BLUE}[Step 9/10] Setting up systemd service${NC}"

if [ -f "$SERVER_DIR/skilltude-api.service" ]; then
    # Update paths in service file
    sed "s|/var/www/skilltude|$APP_DIR|g" "$SERVER_DIR/skilltude-api.service" > /tmp/skilltude-api.service
    
    # Copy to systemd
    cp /tmp/skilltude-api.service /etc/systemd/system/skilltude-api.service
    
    # Reload systemd
    systemctl daemon-reload
    
    # Enable service
    systemctl enable skilltude-api
    
    echo -e "${GREEN}✓ Systemd service configured${NC}"
else
    echo -e "${YELLOW}⚠ Service file not found${NC}"
fi

# ============================================
# Step 10: Validate Configuration
# ============================================
echo -e "\n${BLUE}[Step 10/10] Validating configuration${NC}"

if [ -f "$SERVER_DIR/scripts/validate-production-env.js" ]; then
    cd "$SERVER_DIR"
    node scripts/validate-production-env.js
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Configuration validation passed${NC}"
    else
        echo -e "${RED}✗ Configuration validation failed${NC}"
        echo -e "${YELLOW}Please fix the errors before starting the service${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ Validation script not found${NC}"
fi

# ============================================
# Final Steps
# ============================================
echo -e "\n${BLUE}[Final Steps]${NC}"

# Set ownership of all files
chown -R "$APP_USER:$APP_GROUP" "$APP_DIR"

echo -e "${GREEN}✓ Ownership set${NC}"

# ============================================
# Summary
# ============================================
echo -e "\n${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║   Deployment Complete                                      ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${GREEN}Production deployment completed successfully!${NC}\n"

echo "Application Details:"
echo "  Directory: $APP_DIR"
echo "  User: $APP_USER"
echo "  Service: skilltude-api"
echo ""
echo "Next Steps:"
echo ""
echo "  1. Edit environment file:"
echo "     sudo nano $SERVER_DIR/.env"
echo ""
echo "  2. Start the service:"
echo "     sudo systemctl start skilltude-api"
echo ""
echo "  3. Check service status:"
echo "     sudo systemctl status skilltude-api"
echo ""
echo "  4. View logs:"
echo "     sudo journalctl -u skilltude-api -f"
echo ""
echo "  5. Set up SSL certificate:"
echo "     sudo bash $SERVER_DIR/scripts/setup-ssl.sh yourdomain.com"
echo ""
echo "  6. Test the application:"
echo "     curl http://localhost:3001/health"
echo ""
echo "Useful Commands:"
echo "  Start:   sudo systemctl start skilltude-api"
echo "  Stop:    sudo systemctl stop skilltude-api"
echo "  Restart: sudo systemctl restart skilltude-api"
echo "  Status:  sudo systemctl status skilltude-api"
echo "  Logs:    sudo journalctl -u skilltude-api -f"
echo ""

echo -e "${YELLOW}⚠ IMPORTANT: Don't forget to:${NC}"
echo "  - Update .env with actual production values"
echo "  - Set up SSL certificate"
echo "  - Configure firewall"
echo "  - Set up monitoring"
echo "  - Configure backups"
echo ""

echo -e "${GREEN}All done! 🎉${NC}\n"
