/**
 * Rate Limiting Middleware
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { ErrorCodes } from '../utils/errors.js';
import { logSecurityEvent } from '../utils/logger.js';

/**
 * Rate limiter for CV uploads
 * Limits to 5 uploads per hour per IP address
 */
export const cvUploadLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many CV uploads from this IP address. Please try again later.',
    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Use IP address as the key
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown')
      .split(',')[0]
      .trim();
  },
  // Skip rate limiting for certain IPs (e.g., internal testing)
  skip: (req) => {
    const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '')
      .split(',')[0]
      .trim();
    
    // Skip rate limiting for localhost in development
    if (process.env.NODE_ENV === 'development' && (ip === '127.0.0.1' || ip === '::1')) {
      return false; // Don't skip - still apply rate limiting
    }
    
    return false;
  },
  handler: (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown')
      .split(',')[0]
      .trim();
    
    logSecurityEvent({
      event: 'Rate limit exceeded - CV Upload',
      ip,
      severity: 'medium',
      details: {
        path: req.path,
        method: req.method,
        userAgent: req.headers['user-agent'],
      },
    });
    
    res.status(429).json({
      success: false,
      error: 'Too many CV uploads from this IP address. Please try again later.',
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      retryAfter: Math.ceil(config.security.rateLimit.windowMs / 1000 / 60), // minutes
    });
  },
});

/**
 * General API rate limiter
 * More lenient than CV upload limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP address. Please try again later.',
    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Admin API rate limiter
 * More lenient for authenticated admin users
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for admin operations
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
