import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
  }),
  
  // Error log file
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Combined log file
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // CV operations log file
  new winston.transports.File({
    filename: path.join(logsDir, 'cv-operations.log'),
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Security events log file
  new winston.transports.File({
    filename: path.join(logsDir, 'security.log'),
    level: 'warn',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
  exitOnError: false,
});

// Export logger instance
export default logger;

// Export specialized logging functions
export const logCVUpload = (data: {
  success: boolean;
  email: string;
  ip: string;
  filename?: string;
  submissionId?: string;
  error?: string;
  processingTime?: number;
}) => {
  const message = `CV Upload - Email: ${data.email}, IP: ${data.ip}, Success: ${data.success}`;
  const meta = {
    category: 'cv_upload',
    ...data,
  };
  
  if (data.success) {
    logger.info(message, meta);
  } else {
    logger.error(message, meta);
  }
};

export const logCVAnalysis = (data: {
  submissionId: string;
  score: number;
  processingTime: number;
  success: boolean;
  error?: string;
}) => {
  const message = `CV Analysis - Submission: ${data.submissionId}, Score: ${data.score}, Time: ${data.processingTime}ms`;
  const meta = {
    category: 'cv_analysis',
    ...data,
  };
  
  if (data.success) {
    logger.info(message, meta);
  } else {
    logger.error(message, meta);
  }
};

export const logEmailDelivery = (data: {
  submissionId: string;
  email: string;
  success: boolean;
  attemptNumber: number;
  error?: string;
  scheduledAt?: Date;
}) => {
  const message = `Email Delivery - Submission: ${data.submissionId}, Email: ${data.email}, Attempt: ${data.attemptNumber}, Success: ${data.success}`;
  const meta = {
    category: 'email_delivery',
    ...data,
  };
  
  if (data.success) {
    logger.info(message, meta);
  } else {
    logger.error(message, meta);
  }
};

export const logAdminAction = (data: {
  adminId: string;
  action: string;
  submissionId?: string;
  details?: any;
  ip: string;
}) => {
  const message = `Admin Action - Admin: ${data.adminId}, Action: ${data.action}${data.submissionId ? `, Submission: ${data.submissionId}` : ''}`;
  const meta = {
    category: 'admin_action',
    ...data,
  };
  
  logger.info(message, meta);
};

export const logSecurityEvent = (data: {
  event: string;
  ip: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}) => {
  const message = `Security Event - ${data.event}, IP: ${data.ip}, Severity: ${data.severity}`;
  const meta = {
    category: 'security',
    ...data,
  };
  
  if (data.severity === 'critical' || data.severity === 'high') {
    logger.error(message, meta);
  } else {
    logger.warn(message, meta);
  }
};

export const logFileOperation = (data: {
  operation: 'store' | 'retrieve' | 'delete';
  filename: string;
  success: boolean;
  error?: string;
  size?: number;
}) => {
  const message = `File Operation - ${data.operation.toUpperCase()}: ${data.filename}, Success: ${data.success}`;
  const meta = {
    category: 'file_operation',
    ...data,
  };
  
  if (data.success) {
    logger.info(message, meta);
  } else {
    logger.error(message, meta);
  }
};

export const logDatabaseOperation = (data: {
  operation: string;
  table: string;
  success: boolean;
  error?: string;
  duration?: number;
}) => {
  const message = `Database Operation - ${data.operation} on ${data.table}, Success: ${data.success}`;
  const meta = {
    category: 'database',
    ...data,
  };
  
  if (data.success) {
    logger.debug(message, meta);
  } else {
    logger.error(message, meta);
  }
};
