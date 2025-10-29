/**
 * Security Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { ErrorCodes, CVUploadException } from '../utils/errors';
import logger, { logSecurityEvent as logSecurityEventToLogger } from '../utils/logger';

/**
 * Simple CSRF protection middleware
 * Checks for a custom header to verify the request is from our frontend
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Check for custom header that our frontend will send
  const csrfToken = req.headers['x-requested-with'];
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  
  // Verify the request is from our frontend
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  
  // Check if origin or referer matches allowed origins
  const isValidOrigin = origin && allowedOrigins.some(allowed => origin.startsWith(allowed));
  const isValidReferer = referer && allowedOrigins.some(allowed => referer.startsWith(allowed));
  
  // Also check for XMLHttpRequest header (common for AJAX requests)
  const isXHR = csrfToken === 'XMLHttpRequest';
  
  if (!isValidOrigin && !isValidReferer && !isXHR) {
    console.warn('CSRF protection triggered:', {
      origin,
      referer,
      csrfToken,
      ip: req.socket.remoteAddress,
    });
    
    throw new CVUploadException(
      ErrorCodes.UNAUTHORIZED,
      'Invalid request origin',
      403
    );
  }
  
  next();
}

/**
 * Sanitize request body to prevent XSS
 * Recursively sanitizes all string values in the request body
 */
export function sanitizeBody(req: Request, res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Sanitize a string to prevent XSS attacks
 */
function sanitizeString(input: string): string {
  return input
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object/embed tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:text\/html/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove style attributes that could contain expressions
    .replace(/style\s*=\s*["'][^"']*expression\s*\([^"']*["']/gi, '');
}

/**
 * Add security headers
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  
  next();
}

/**
 * Enforce HTTPS in production
 * Redirects HTTP requests to HTTPS
 */
export function enforceHttps(req: Request, res: Response, next: NextFunction): void {
  // Only enforce in production
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  // Check if request is already HTTPS
  const isHttps = req.secure || 
                  req.headers['x-forwarded-proto'] === 'https' ||
                  req.headers['x-forwarded-ssl'] === 'on';
  
  if (!isHttps) {
    // Log the redirect for monitoring
    const ipAddress = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    
    logSecurityEventToLogger({
      event: 'HTTP to HTTPS redirect',
      ip: ipAddress,
      severity: 'low',
      details: {
        url: req.url,
        method: req.method,
      },
    });
    
    // Redirect to HTTPS
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  
  next();
}

/**
 * Set secure cookie options based on environment
 */
export function getSecureCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
} {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true, // Prevents JavaScript access to cookies
    secure: isProduction, // Only send over HTTPS in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
}

/**
 * Add Strict-Transport-Security header (HSTS)
 * Forces browsers to use HTTPS for future requests
 */
export function hstsHeader(req: Request, res: Response, next: NextFunction): void {
  // Only set HSTS in production
  if (process.env.NODE_ENV === 'production') {
    // max-age=31536000 (1 year), includeSubDomains, preload
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  next();
}

/**
 * Log security events
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  req: Request
): void {
  const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown')
    .split(',')[0]
    .trim();
  
  logSecurityEventToLogger({
    event,
    ip,
    severity: 'medium',
    details: {
      userAgent: req.headers['user-agent'],
      path: req.path,
      method: req.method,
      ...details,
    },
  });
  
  // In production, send to security monitoring service
}
