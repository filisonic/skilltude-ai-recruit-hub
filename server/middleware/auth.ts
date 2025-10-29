/**
 * Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config';
import { CVUploadException, ErrorCodes } from '../utils/errors';
import { query } from '../utils/database';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        uuid: string;
        username: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Verify JWT token and attach user to request
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CVUploadException(
        ErrorCodes.UNAUTHORIZED,
        'No authentication token provided',
        401
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtConfig.secret);
    } catch (error) {
      throw new CVUploadException(
        ErrorCodes.UNAUTHORIZED,
        'Invalid or expired token',
        401
      );
    }
    
    // Get user from database
    const users = await query(
      `SELECT id, uuid, username, email, role, status 
       FROM admin_users 
       WHERE id = ? AND status = 'active'`,
      [decoded.userId]
    );
    
    if (!users || users.length === 0) {
      throw new CVUploadException(
        ErrorCodes.UNAUTHORIZED,
        'User not found or inactive',
        401
      );
    }
    
    const user = users[0];
    
    // Attach user to request
    req.user = {
      id: user.id,
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require specific role(s)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new CVUploadException(
        ErrorCodes.UNAUTHORIZED,
        'Authentication required',
        401
      );
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      throw new CVUploadException(
        ErrorCodes.UNAUTHORIZED,
        'Insufficient permissions',
        403
      );
    }
    
    next();
  };
}

/**
 * Optional authentication - attach user if token is present but don't require it
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded: any = jwt.verify(token, jwtConfig.secret);
      
      const users = await query(
        `SELECT id, uuid, username, email, role, status 
         FROM admin_users 
         WHERE id = ? AND status = 'active'`,
        [decoded.userId]
      );
      
      if (users && users.length > 0) {
        const user = users[0];
        req.user = {
          id: user.id,
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }
    } catch (error) {
      // Invalid token, but that's okay for optional auth
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Get secure cookie options based on environment
 * Use this when setting cookies to ensure proper security flags
 */
export function getSecureCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
} {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true, // Prevents JavaScript access to cookies (XSS protection)
    secure: isProduction, // Only send over HTTPS in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
}

/**
 * Example usage of secure cookies:
 * 
 * import { getSecureCookieOptions } from './middleware/auth';
 * 
 * // When setting a cookie:
 * res.cookie('token', jwtToken, getSecureCookieOptions());
 * 
 * // For refresh tokens (longer expiry):
 * res.cookie('refreshToken', refreshToken, {
 *   ...getSecureCookieOptions(),
 *   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
 * });
 */
