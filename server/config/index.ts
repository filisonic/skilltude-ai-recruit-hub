/**
 * CV Analysis System - Configuration
 */

import dotenv from 'dotenv';
import path from 'path';
import { CVSystemConfig } from '../types/cv.types';

// Load environment variables
dotenv.config();

/**
 * System configuration loaded from environment variables
 */
export const config: CVSystemConfig = {
  storage: {
    uploadDir: process.env.UPLOAD_DIR || './uploads/cvs',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 
      'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      .split(','),
  },
  
  email: {
    provider: (process.env.EMAIL_PROVIDER || 'smtp') as 'sendgrid' | 'ses' | 'mailgun' | 'smtp',
    apiKey: process.env.EMAIL_API_KEY,
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@skilltude.com',
    fromName: process.env.EMAIL_FROM_NAME || 'SkillTude Team',
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
  },
  
  analysis: {
    minScore: parseInt(process.env.MIN_CV_SCORE || '0', 10),
    maxScore: parseInt(process.env.MAX_CV_SCORE || '100', 10),
    emailDelayHours: parseInt(process.env.EMAIL_DELAY_HOURS || '24', 10),
  },
  
  security: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000', 10), // 1 hour default
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
    },
    enableVirusScanning: process.env.ENABLE_VIRUS_SCANNING === 'true',
  },
};

/**
 * Server configuration
 */
export const serverConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:5173').trim(),
};

/**
 * Database configuration
 */
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  database: process.env.DB_NAME || 'skilltude_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

/**
 * JWT configuration
 */
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: '24h',
};

/**
 * Admin configuration
 */
export const adminConfig = {
  email: process.env.ADMIN_EMAIL || 'admin@skilltude.com',
};

/**
 * Validate required environment variables
 */
export function validateConfig(): void {
  const requiredVars = [
    'EMAIL_FROM_ADDRESS',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default values. Please set these in your .env file for production.');
  }
  
  // Validate email provider configuration
  if (config.email.provider === 'smtp' && !process.env.SMTP_HOST) {
    console.warn('Warning: SMTP provider selected but SMTP_HOST not configured');
  }
  
  if (config.email.provider === 'sendgrid' && !process.env.SENDGRID_API_KEY) {
    console.warn('Warning: SendGrid provider selected but SENDGRID_API_KEY not configured');
  }
}

export default config;
