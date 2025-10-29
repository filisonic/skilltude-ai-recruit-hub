/**
 * Monitoring Routes
 * Provides endpoints for system monitoring and metrics
 */

import express, { Request, Response } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';
import monitoringService from '../services/MonitoringService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/monitoring/metrics
 * Get comprehensive system metrics
 */
router.get(
  '/metrics',
  authenticate,
  requireRole('super_admin', 'admin'),
  adminLimiter,
  async (req: Request, res: Response) => {
    try {
      const metrics = await monitoringService.getSystemMetrics();
      
      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      logger.error('Failed to get system metrics', {
        error,
        category: 'monitoring',
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve system metrics',
      });
    }
  }
);

/**
 * GET /api/monitoring/timeseries
 * Get time series data for charts
 */
router.get(
  '/timeseries',
  authenticate,
  requireRole('super_admin', 'admin'),
  adminLimiter,
  async (req: Request, res: Response) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      
      if (days < 1 || days > 365) {
        return res.status(400).json({
          success: false,
          error: 'Days parameter must be between 1 and 365',
        });
      }
      
      const data = await monitoringService.getTimeSeriesData(days);
      
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      logger.error('Failed to get time series data', {
        error,
        category: 'monitoring',
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve time series data',
      });
    }
  }
);

/**
 * GET /api/monitoring/errors
 * Get recent errors from logs
 */
router.get(
  '/errors',
  authenticate,
  requireRole('super_admin', 'admin'),
  adminLimiter,
  async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      
      if (limit < 1 || limit > 500) {
        return res.status(400).json({
          success: false,
          error: 'Limit parameter must be between 1 and 500',
        });
      }
      
      const errors = await monitoringService.getRecentErrors(limit);
      
      res.json({
        success: true,
        data: errors,
      });
    } catch (error) {
      logger.error('Failed to get recent errors', {
        error,
        category: 'monitoring',
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve recent errors',
      });
    }
  }
);

/**
 * GET /api/monitoring/health
 * Get system health status
 */
router.get(
  '/health',
  authenticate,
  requireRole('super_admin', 'admin'),
  adminLimiter,
  async (req: Request, res: Response) => {
    try {
      const health = await monitoringService.getHealthStatus();
      
      res.json({
        success: true,
        data: health,
      });
    } catch (error) {
      logger.error('Failed to get health status', {
        error,
        category: 'monitoring',
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve health status',
      });
    }
  }
);

/**
 * GET /api/monitoring/performance
 * Get performance metrics
 */
router.get(
  '/performance',
  authenticate,
  requireRole('super_admin', 'admin'),
  adminLimiter,
  async (req: Request, res: Response) => {
    try {
      const performance = await monitoringService.getPerformanceMetrics();
      
      res.json({
        success: true,
        data: performance,
      });
    } catch (error) {
      logger.error('Failed to get performance metrics', {
        error,
        category: 'monitoring',
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve performance metrics',
      });
    }
  }
);

export default router;
