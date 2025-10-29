/**
 * CV Analysis System - Server Entry Point
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { serverConfig, validateConfig } from './config';

// Validate configuration on startup
validateConfig();

const app: Express = express();
const PORT = serverConfig.port;

// ============================================================================
// Middleware
// ============================================================================

import { apiLimiter } from './middleware/rateLimiter';
import { securityHeaders, enforceHttps, hstsHeader } from './middleware/security';

// HTTPS enforcement (must be first)
app.use(enforceHttps);

// HSTS header
app.use(hstsHeader);

// Security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Additional security headers
app.use(securityHeaders);

// CORS configuration
app.use(cors({
  origin: serverConfig.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// General API rate limiting
app.use('/api/', apiLimiter);

// ============================================================================
// Routes
// ============================================================================

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: serverConfig.nodeEnv,
  });
});

// CV upload routes
import cvRoutes from './routes/cv.routes';
app.use('/api/cv', cvRoutes);

// Admin CV management routes
import adminCvRoutes from './routes/admin-cv.routes';
app.use('/api/admin', adminCvRoutes);

// Monitoring routes
import monitoringRoutes from './routes/monitoring.routes';
app.use('/api/monitoring', monitoringRoutes);

// ============================================================================
// Error Handling
// ============================================================================

import { createErrorResponse, logError, CVUploadException } from './utils/errors';

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Get client information for logging
  const ipAddress = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  // Log error with context
  logError(err, {
    endpoint: `${req.method} ${req.path}`,
    ip: ipAddress,
    userAgent,
  });
  
  // Create standardized error response
  const errorResponse = createErrorResponse(err);
  
  // Determine status code
  let statusCode = 500;
  if (err instanceof CVUploadException) {
    statusCode = err.statusCode;
  } else if (err.name === 'MulterError') {
    statusCode = 400;
  } else if (err.message && err.message.includes('Invalid file type')) {
    statusCode = 400;
  }
  
  // Send response
  res.status(statusCode).json({
    ...errorResponse,
    ...(serverConfig.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// ============================================================================
// Server Startup
// ============================================================================

if (serverConfig.nodeEnv !== 'test') {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   CV Analysis System Server                                    ║
║                                                                ║
║   Environment: ${serverConfig.nodeEnv.padEnd(47)}║
║   Port:        ${PORT.toString().padEnd(47)}║
║   Frontend:    ${serverConfig.frontendUrl.padEnd(47)}║
║                                                                ║
║   Server is ready to accept connections                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
  });
}

export default app;
