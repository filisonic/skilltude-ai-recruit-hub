/**
 * Access Control Utilities
 * Provides functions for managing and logging access to sensitive resources
 */

import { Request } from 'express';
import logger, { logAdminAction as logAdminActionToLogger, logSecurityEvent } from './logger.js';

/**
 * Access event types
 */
export enum AccessEventType {
  FILE_DOWNLOAD = 'FILE_DOWNLOAD',
  FILE_VIEW = 'FILE_VIEW',
  DATA_EXPORT = 'DATA_EXPORT',
  ADMIN_ACTION = 'ADMIN_ACTION',
  SENSITIVE_DATA_ACCESS = 'SENSITIVE_DATA_ACCESS',
}

/**
 * Access log entry
 */
export interface AccessLogEntry {
  event: AccessEventType;
  userId: number;
  username: string;
  userRole: string;
  resourceType: string;
  resourceId: string | number;
  resourceDetails?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  failureReason?: string;
}

/**
 * Log access to sensitive resources
 */
export function logAccess(entry: AccessLogEntry): void {
  const logMessage = {
    ...entry,
    timestamp: entry.timestamp.toISOString(),
  };
  
  // Log using Winston logger
  if (entry.success) {
    logger.info(`[ACCESS] ${entry.event}`, {
      ...logMessage,
      category: 'access_control',
    });
  } else {
    logger.warn(`[ACCESS DENIED] ${entry.event}`, {
      ...logMessage,
      category: 'access_control',
    });
    
    // Also log as security event for denied access
    logSecurityEvent({
      event: `Access Denied: ${entry.event}`,
      ip: entry.ipAddress,
      severity: 'medium',
      details: {
        userId: entry.userId,
        username: entry.username,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        reason: entry.failureReason,
      },
    });
  }
  
  // Store in memory for reporting
  accessLogs.push(entry);
}

/**
 * Extract client information from request
 */
export function getClientInfo(req: Request): {
  ipAddress: string;
  userAgent: string;
} {
  const ipAddress = (
    req.headers['x-forwarded-for'] as string || 
    req.socket.remoteAddress || 
    'unknown'
  ).split(',')[0].trim();
  
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  return { ipAddress, userAgent };
}

/**
 * Check if user has permission to access resource
 */
export function hasPermission(
  userRole: string,
  requiredRoles: string[]
): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user owns resource or has admin access
 */
export function canAccessResource(
  userId: number,
  resourceOwnerId: number,
  userRole: string,
  adminRoles: string[] = ['super_admin', 'admin']
): boolean {
  // User owns the resource
  if (userId === resourceOwnerId) {
    return true;
  }
  
  // User has admin role
  if (adminRoles.includes(userRole)) {
    return true;
  }
  
  return false;
}

/**
 * Log file download access
 */
export function logFileDownload(
  req: Request,
  fileInfo: {
    submissionId: number;
    filename: string;
    candidateName: string;
    candidateEmail: string;
  },
  success: boolean = true,
  failureReason?: string
): void {
  if (!req.user) {
    console.error('Cannot log file download: user not authenticated');
    return;
  }
  
  const { ipAddress, userAgent } = getClientInfo(req);
  
  logAccess({
    event: AccessEventType.FILE_DOWNLOAD,
    userId: req.user.id,
    username: req.user.username,
    userRole: req.user.role,
    resourceType: 'cv_file',
    resourceId: fileInfo.submissionId,
    resourceDetails: {
      filename: fileInfo.filename,
      candidateName: fileInfo.candidateName,
      candidateEmail: fileInfo.candidateEmail,
    },
    ipAddress,
    userAgent,
    timestamp: new Date(),
    success,
    failureReason,
  });
}

/**
 * Log admin action
 */
export function logAdminAction(
  req: Request,
  action: string,
  resourceType: string,
  resourceId: string | number,
  details?: Record<string, any>,
  success: boolean = true,
  failureReason?: string
): void {
  if (!req.user) {
    logger.error('Cannot log admin action: user not authenticated', {
      category: 'admin_action',
    });
    return;
  }
  
  const { ipAddress, userAgent } = getClientInfo(req);
  
  // Log to access control system
  logAccess({
    event: AccessEventType.ADMIN_ACTION,
    userId: req.user.id,
    username: req.user.username,
    userRole: req.user.role,
    resourceType,
    resourceId,
    resourceDetails: {
      action,
      ...details,
    },
    ipAddress,
    userAgent,
    timestamp: new Date(),
    success,
    failureReason,
  });
  
  // Also log using the dedicated admin action logger
  logAdminActionToLogger({
    adminId: req.user.id.toString(),
    action,
    submissionId: resourceType === 'cv_submission' ? resourceId.toString() : undefined,
    details,
    ip: ipAddress,
  });
}

/**
 * Log sensitive data access
 */
export function logSensitiveDataAccess(
  req: Request,
  dataType: string,
  dataId: string | number,
  details?: Record<string, any>,
  success: boolean = true,
  failureReason?: string
): void {
  if (!req.user) {
    logger.error('Cannot log sensitive data access: user not authenticated', {
      category: 'sensitive_data_access',
    });
    return;
  }
  
  const { ipAddress, userAgent } = getClientInfo(req);
  
  logAccess({
    event: AccessEventType.SENSITIVE_DATA_ACCESS,
    userId: req.user.id,
    username: req.user.username,
    userRole: req.user.role,
    resourceType: dataType,
    resourceId: dataId,
    resourceDetails: details,
    ipAddress,
    userAgent,
    timestamp: new Date(),
    success,
    failureReason,
  });
}

/**
 * Validate file access permissions
 */
export interface FileAccessValidation {
  allowed: boolean;
  reason?: string;
}

export function validateFileAccess(
  req: Request,
  fileOwnerId?: number,
  requiredRoles: string[] = ['super_admin', 'admin', 'hr_manager']
): FileAccessValidation {
  // Check authentication
  if (!req.user) {
    return {
      allowed: false,
      reason: 'User not authenticated',
    };
  }
  
  // Check role permissions
  if (!hasPermission(req.user.role, requiredRoles)) {
    return {
      allowed: false,
      reason: `User role '${req.user.role}' does not have permission to access files`,
    };
  }
  
  // If file has an owner, check ownership or admin access
  if (fileOwnerId !== undefined) {
    if (!canAccessResource(req.user.id, fileOwnerId, req.user.role)) {
      return {
        allowed: false,
        reason: 'User does not own this file and does not have admin access',
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Rate limit tracking for sensitive operations
 */
const accessAttempts = new Map<string, number[]>();

export function checkAccessRateLimit(
  userId: number,
  operation: string,
  maxAttempts: number = 10,
  windowMs: number = 60000 // 1 minute
): {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: Date;
} {
  const key = `${userId}:${operation}`;
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get existing attempts
  let attempts = accessAttempts.get(key) || [];
  
  // Remove old attempts outside the window
  attempts = attempts.filter(timestamp => timestamp > windowStart);
  
  // Check if limit exceeded
  const allowed = attempts.length < maxAttempts;
  
  if (allowed) {
    // Add new attempt
    attempts.push(now);
    accessAttempts.set(key, attempts);
  }
  
  const remainingAttempts = Math.max(0, maxAttempts - attempts.length);
  const resetTime = new Date(now + windowMs);
  
  return {
    allowed,
    remainingAttempts,
    resetTime,
  };
}

/**
 * Clean up old rate limit entries (call periodically)
 */
export function cleanupRateLimitCache(): void {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour
  
  for (const [key, attempts] of accessAttempts.entries()) {
    const recentAttempts = attempts.filter(timestamp => now - timestamp < maxAge);
    
    if (recentAttempts.length === 0) {
      accessAttempts.delete(key);
    } else {
      accessAttempts.set(key, recentAttempts);
    }
  }
}

// Clean up rate limit cache every hour
setInterval(cleanupRateLimitCache, 60 * 60 * 1000);

/**
 * Generate access report for audit purposes
 */
export interface AccessReport {
  userId: number;
  username: string;
  totalAccesses: number;
  fileDownloads: number;
  adminActions: number;
  sensitiveDataAccesses: number;
  period: {
    start: Date;
    end: Date;
  };
}

// In-memory storage for access logs (in production, query from database/logging service)
const accessLogs: AccessLogEntry[] = [];

export function generateAccessReport(
  userId: number,
  startDate: Date,
  endDate: Date
): AccessReport {
  const userLogs = accessLogs.filter(
    log => log.userId === userId &&
           log.timestamp >= startDate &&
           log.timestamp <= endDate
  );
  
  return {
    userId,
    username: userLogs[0]?.username || 'Unknown',
    totalAccesses: userLogs.length,
    fileDownloads: userLogs.filter(log => log.event === AccessEventType.FILE_DOWNLOAD).length,
    adminActions: userLogs.filter(log => log.event === AccessEventType.ADMIN_ACTION).length,
    sensitiveDataAccesses: userLogs.filter(log => log.event === AccessEventType.SENSITIVE_DATA_ACCESS).length,
    period: {
      start: startDate,
      end: endDate,
    },
  };
}

export default {
  logAccess,
  getClientInfo,
  hasPermission,
  canAccessResource,
  logFileDownload,
  logAdminAction,
  logSensitiveDataAccess,
  validateFileAccess,
  checkAccessRateLimit,
  cleanupRateLimitCache,
  generateAccessReport,
};
