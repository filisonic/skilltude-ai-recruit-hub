#!/usr/bin/env node

/**
 * Production Environment Validation Script
 * 
 * This script validates that all required environment variables
 * and configurations are properly set for production deployment.
 * 
 * Usage: node validate-production-env.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Load environment variables
require('dotenv').config();

let errorCount = 0;
let warningCount = 0;
let successCount = 0;

console.log(`${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║   SkillTude Production Environment Validation              ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

/**
 * Check if a value exists and is not a placeholder
 */
function checkRequired(name, value, description) {
  const placeholders = [
    'CHANGE_THIS',
    'YOUR_',
    'GENERATE_',
    'STRONG_PASSWORD_HERE',
    'your_',
    'change_in_production',
  ];
  
  if (!value) {
    error(`${name} is not set`);
    console.log(`  Description: ${description}`);
    return false;
  }
  
  const isPlaceholder = placeholders.some(p => value.includes(p));
  if (isPlaceholder) {
    error(`${name} contains placeholder value`);
    console.log(`  Current value: ${value.substring(0, 20)}...`);
    console.log(`  Description: ${description}`);
    return false;
  }
  
  success(`${name} is set`);
  return true;
}

/**
 * Check optional value
 */
function checkOptional(name, value, description) {
  if (!value) {
    warning(`${name} is not set (optional)`);
    console.log(`  Description: ${description}`);
    return false;
  }
  success(`${name} is set`);
  return true;
}

/**
 * Log error
 */
function error(message) {
  console.log(`${colors.red}✗ ERROR: ${message}${colors.reset}`);
  errorCount++;
}

/**
 * Log warning
 */
function warning(message) {
  console.log(`${colors.yellow}⚠ WARNING: ${message}${colors.reset}`);
  warningCount++;
}

/**
 * Log success
 */
function success(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
  successCount++;
}

/**
 * Log info
 */
function info(message) {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

// ============================================
// 1. Check Node Environment
// ============================================
console.log(`\n${colors.cyan}[1] Node Environment${colors.reset}`);

if (process.env.NODE_ENV !== 'production') {
  error('NODE_ENV is not set to "production"');
  console.log(`  Current value: ${process.env.NODE_ENV || 'not set'}`);
} else {
  success('NODE_ENV is set to production');
}

// ============================================
// 2. Check Database Configuration
// ============================================
console.log(`\n${colors.cyan}[2] Database Configuration${colors.reset}`);

checkRequired('DB_HOST', process.env.DB_HOST, 'Database host address');
checkRequired('DB_PORT', process.env.DB_PORT, 'Database port (usually 3306)');
checkRequired('DB_NAME', process.env.DB_NAME, 'Production database name');
checkRequired('DB_USER', process.env.DB_USER, 'Database user');
checkRequired('DB_PASSWORD', process.env.DB_PASSWORD, 'Database password');

// Check password strength
if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.length < 16) {
  warning('DB_PASSWORD is shorter than 16 characters');
  console.log('  Recommendation: Use at least 20 characters for production');
}

// ============================================
// 3. Check File Storage Configuration
// ============================================
console.log(`\n${colors.cyan}[3] File Storage Configuration${colors.reset}`);

checkRequired('UPLOAD_DIR', process.env.UPLOAD_DIR, 'Directory for CV uploads');

// Check if upload directory exists
if (process.env.UPLOAD_DIR) {
  if (fs.existsSync(process.env.UPLOAD_DIR)) {
    success('Upload directory exists');
    
    // Check permissions
    try {
      fs.accessSync(process.env.UPLOAD_DIR, fs.constants.W_OK);
      success('Upload directory is writable');
    } catch (err) {
      error('Upload directory is not writable');
      console.log(`  Path: ${process.env.UPLOAD_DIR}`);
    }
  } else {
    warning('Upload directory does not exist (will be created on first upload)');
    console.log(`  Path: ${process.env.UPLOAD_DIR}`);
  }
}

checkRequired('MAX_FILE_SIZE', process.env.MAX_FILE_SIZE, 'Maximum upload file size in bytes');
checkRequired('ALLOWED_FILE_TYPES', process.env.ALLOWED_FILE_TYPES, 'Allowed MIME types');

// ============================================
// 4. Check Email Configuration
// ============================================
console.log(`\n${colors.cyan}[4] Email Service Configuration${colors.reset}`);

checkRequired('EMAIL_PROVIDER', process.env.EMAIL_PROVIDER, 'Email service provider');
checkRequired('EMAIL_FROM_ADDRESS', process.env.EMAIL_FROM_ADDRESS, 'Sender email address');
checkRequired('EMAIL_FROM_NAME', process.env.EMAIL_FROM_NAME, 'Sender name');

// Check provider-specific configuration
const provider = process.env.EMAIL_PROVIDER;
if (provider === 'sendgrid') {
  checkRequired('SENDGRID_API_KEY', process.env.SENDGRID_API_KEY, 'SendGrid API key');
} else if (provider === 'ses') {
  checkRequired('AWS_REGION', process.env.AWS_REGION, 'AWS region');
  checkRequired('AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID, 'AWS access key');
  checkRequired('AWS_SECRET_ACCESS_KEY', process.env.AWS_SECRET_ACCESS_KEY, 'AWS secret key');
} else if (provider === 'mailgun') {
  checkRequired('MAILGUN_API_KEY', process.env.MAILGUN_API_KEY, 'Mailgun API key');
  checkRequired('MAILGUN_DOMAIN', process.env.MAILGUN_DOMAIN, 'Mailgun domain');
} else if (provider === 'smtp') {
  checkRequired('SMTP_HOST', process.env.SMTP_HOST, 'SMTP server host');
  checkRequired('SMTP_PORT', process.env.SMTP_PORT, 'SMTP server port');
  checkRequired('SMTP_USER', process.env.SMTP_USER, 'SMTP username');
  checkRequired('SMTP_PASS', process.env.SMTP_PASS, 'SMTP password');
}

// ============================================
// 5. Check Security Configuration
// ============================================
console.log(`\n${colors.cyan}[5] Security Configuration${colors.reset}`);

checkRequired('JWT_SECRET', process.env.JWT_SECRET, 'JWT signing secret');
checkRequired('SESSION_SECRET', process.env.SESSION_SECRET, 'Session secret');

// Check secret strength
if (process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.length < 32) {
    error('JWT_SECRET is too short (minimum 32 characters)');
  } else if (process.env.JWT_SECRET.length < 64) {
    warning('JWT_SECRET should be at least 64 characters');
  } else {
    success('JWT_SECRET length is adequate');
  }
  
  // Check if it's random enough (entropy check)
  const entropy = calculateEntropy(process.env.JWT_SECRET);
  if (entropy < 3.5) {
    warning('JWT_SECRET may not be random enough');
    console.log('  Generate a new one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  }
}

if (process.env.SESSION_SECRET) {
  if (process.env.SESSION_SECRET.length < 32) {
    error('SESSION_SECRET is too short (minimum 32 characters)');
  } else if (process.env.SESSION_SECRET.length < 64) {
    warning('SESSION_SECRET should be at least 64 characters');
  } else {
    success('SESSION_SECRET length is adequate');
  }
}

// Check if secrets are different
if (process.env.JWT_SECRET && process.env.SESSION_SECRET) {
  if (process.env.JWT_SECRET === process.env.SESSION_SECRET) {
    error('JWT_SECRET and SESSION_SECRET should be different');
  } else {
    success('JWT_SECRET and SESSION_SECRET are different');
  }
}

checkRequired('RATE_LIMIT_WINDOW_MS', process.env.RATE_LIMIT_WINDOW_MS, 'Rate limit window in milliseconds');
checkRequired('RATE_LIMIT_MAX_REQUESTS', process.env.RATE_LIMIT_MAX_REQUESTS, 'Maximum requests per window');

// ============================================
// 6. Check Frontend Configuration
// ============================================
console.log(`\n${colors.cyan}[6] Frontend Configuration${colors.reset}`);

checkRequired('FRONTEND_URL', process.env.FRONTEND_URL, 'Frontend URL for CORS');

if (process.env.FRONTEND_URL) {
  if (process.env.FRONTEND_URL.startsWith('http://') && !process.env.FRONTEND_URL.includes('localhost')) {
    warning('FRONTEND_URL uses HTTP instead of HTTPS');
    console.log('  Production should use HTTPS');
  } else if (process.env.FRONTEND_URL.startsWith('https://')) {
    success('FRONTEND_URL uses HTTPS');
  }
}

// ============================================
// 7. Check Analysis Configuration
// ============================================
console.log(`\n${colors.cyan}[7] Analysis Configuration${colors.reset}`);

checkRequired('EMAIL_DELAY_HOURS', process.env.EMAIL_DELAY_HOURS, 'Hours to delay email delivery');
checkRequired('MIN_CV_SCORE', process.env.MIN_CV_SCORE, 'Minimum CV score');
checkRequired('MAX_CV_SCORE', process.env.MAX_CV_SCORE, 'Maximum CV score');

// ============================================
// 8. Check Admin Configuration
// ============================================
console.log(`\n${colors.cyan}[8] Admin Configuration${colors.reset}`);

checkRequired('ADMIN_EMAIL', process.env.ADMIN_EMAIL, 'Admin email for notifications');

// ============================================
// 9. Check Optional Configuration
// ============================================
console.log(`\n${colors.cyan}[9] Optional Configuration${colors.reset}`);

checkOptional('ENABLE_MONITORING', process.env.ENABLE_MONITORING, 'Enable monitoring dashboard');
checkOptional('LOG_LEVEL', process.env.LOG_LEVEL, 'Logging level');
checkOptional('ENABLE_VIRUS_SCANNING', process.env.ENABLE_VIRUS_SCANNING, 'Enable virus scanning');

// ============================================
// 10. Check File Permissions
// ============================================
console.log(`\n${colors.cyan}[10] File Permissions${colors.reset}`);

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const stats = fs.statSync(envPath);
  const mode = (stats.mode & parseInt('777', 8)).toString(8);
  
  if (mode === '600') {
    success('.env file has correct permissions (600)');
  } else {
    warning(`.env file has permissions ${mode}, should be 600`);
    console.log('  Run: chmod 600 .env');
  }
} else {
  error('.env file not found');
  console.log(`  Expected location: ${envPath}`);
}

// ============================================
// Summary
// ============================================
console.log(`\n${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║   Validation Summary                                       ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

console.log(`${colors.green}✓ Passed: ${successCount}${colors.reset}`);
console.log(`${colors.yellow}⚠ Warnings: ${warningCount}${colors.reset}`);
console.log(`${colors.red}✗ Errors: ${errorCount}${colors.reset}`);

if (errorCount > 0) {
  console.log(`\n${colors.red}❌ Production environment is NOT ready for deployment${colors.reset}`);
  console.log('Please fix all errors before deploying to production.\n');
  process.exit(1);
} else if (warningCount > 0) {
  console.log(`\n${colors.yellow}⚠️  Production environment has warnings${colors.reset}`);
  console.log('Consider addressing warnings for better security and reliability.\n');
  process.exit(0);
} else {
  console.log(`\n${colors.green}✅ Production environment is ready for deployment${colors.reset}\n`);
  process.exit(0);
}

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate Shannon entropy of a string
 */
function calculateEntropy(str) {
  const len = str.length;
  const frequencies = {};
  
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy;
}
