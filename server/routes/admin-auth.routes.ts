/**
 * Admin authentication routes
 */

import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';
import { jwtConfig, adminConfig } from '../config/index.js';
import { query } from '../utils/database.js';
import { CVUploadException, ErrorCodes } from '../utils/errors.js';
import logger from '../utils/logger.js';

const router = express.Router();

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

type AdminUserRow = {
  id: number;
  uuid: string;
  username: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
};

function issueToken(userId: number): string {
  return jwt.sign({ userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
  });
}

function formatUser(user: AdminUserRow) {
  return {
    id: user.id,
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  };
}

async function findAdminUser(identifier: string): Promise<AdminUserRow | null> {
  const users = await query(
    `SELECT id, uuid, username, email, password_hash, first_name, last_name, role, status
     FROM admin_users
     WHERE (username = ? OR email = ?) AND status = 'active'
     LIMIT 1`,
    [identifier, identifier]
  );

  return users?.[0] || null;
}

async function ensureBootstrapAdmin(): Promise<AdminUserRow> {
  const existing = await findAdminUser(DEMO_USERNAME);
  if (existing) {
    return existing;
  }

  const email = adminConfig.email || 'admin@skilltude.com';
  const byEmail = await findAdminUser(email);
  if (byEmail) {
    return byEmail;
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const uuid = uuidv4();

  await query(
    `INSERT INTO admin_users
      (uuid, username, email, password_hash, first_name, last_name, role, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
    [uuid, DEMO_USERNAME, email, passwordHash, 'Admin', 'User', 'super_admin']
  );

  const created = await findAdminUser(DEMO_USERNAME);
  if (!created) {
    throw new CVUploadException(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to bootstrap admin user',
      500
    );
  }

  logger.warn('Bootstrapped default admin user for SkillTude admin login', {
    category: 'admin_auth',
    username: DEMO_USERNAME,
  });

  return created;
}

async function passwordMatches(
  user: AdminUserRow,
  password: string
): Promise<boolean> {
  if (user.password_hash && user.password_hash.startsWith('$2')) {
    try {
      if (await bcrypt.compare(password, user.password_hash)) {
        return true;
      }
    } catch {
      // Fall through to env/demo checks
    }
  }

  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword && password === envPassword) {
    const adminEmail = (process.env.ADMIN_EMAIL || adminConfig.email || '').toLowerCase();
    if (
      user.username === DEMO_USERNAME ||
      user.email.toLowerCase() === adminEmail
    ) {
      return true;
    }
  }

  // Keep existing client credentials working until a real password is set
  if (
    user.username === DEMO_USERNAME &&
    password === DEMO_PASSWORD
  ) {
    return true;
  }

  return false;
}

/**
 * POST /api/admin/login
 */
router.post(
  '/login',
  adminLimiter,
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const username = String(req.body.username).trim();
      const password = String(req.body.password);

      let user = await findAdminUser(username);

      // Bootstrap path for the known demo credentials when no usable user exists yet
      if (
        !user &&
        username === DEMO_USERNAME &&
        password === DEMO_PASSWORD
      ) {
        user = await ensureBootstrapAdmin();
      }

      if (!user) {
        throw new CVUploadException(
          ErrorCodes.UNAUTHORIZED,
          'Invalid username or password',
          401
        );
      }

      const valid = await passwordMatches(user, password);
      if (!valid) {
        throw new CVUploadException(
          ErrorCodes.UNAUTHORIZED,
          'Invalid username or password',
          401
        );
      }

      let hashIsValid = false;
      if (user.password_hash?.startsWith('$2')) {
        try {
          hashIsValid = await bcrypt.compare(password, user.password_hash);
        } catch {
          hashIsValid = false;
        }
      }

      if (!hashIsValid) {
        const newHash = await bcrypt.hash(password, 10);
        await query('UPDATE admin_users SET password_hash = ?, last_login = NOW() WHERE id = ?', [
          newHash,
          user.id,
        ]);
      } else {
        await query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);
      }

      const token = issueToken(user.id);

      return res.status(200).json({
        success: true,
        token,
        user: formatUser(user),
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/me
 */
router.get(
  '/me',
  authenticate,
  adminLimiter,
  async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

export default router;
