/**
 * Custom Error Classes
 */

export class CVUploadException extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'CVUploadException';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ErrorCodes = {
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  TEXT_EXTRACTION_FAILED: 'TEXT_EXTRACTION_FAILED',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

/**
 * Create a standardized error response
 */
export function createErrorResponse(error: any) {
  if (error instanceof CVUploadException) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
    };
  }
  
  // Handle Multer errors
  if (error.name === 'MulterError') {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return {
        success: false,
        error: 'File size exceeds the 10MB limit',
        code: ErrorCodes.FILE_TOO_LARGE,
      };
    }
    return {
      success: false,
      error: 'File upload error',
      code: ErrorCodes.FILE_UPLOAD_FAILED,
      details: error.message,
    };
  }
  
  // Handle validation errors
  if (error.message && error.message.includes('Invalid file type')) {
    return {
      success: false,
      error: error.message,
      code: ErrorCodes.INVALID_FILE_TYPE,
    };
  }
  
  // Handle database errors
  if (error.code && error.code.startsWith('ER_')) {
    console.error('Database error:', error);
    return {
      success: false,
      error: 'Database error occurred',
      code: ErrorCodes.DATABASE_ERROR,
    };
  }
  
  // Generic error
  return {
    success: false,
    error: 'An unexpected error occurred',
    code: ErrorCodes.INTERNAL_ERROR,
  };
}

/**
 * Log error with context
 */
export function logError(
  error: any,
  context: {
    endpoint?: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    requestId?: string;
    [key: string]: any; // Allow additional context properties
  } = {}
): void {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    message: error.message,
    stack: error.stack,
    code: error.code,
    ...context,
  };
  
  console.error('Error occurred:', JSON.stringify(errorInfo, null, 2));
  
  // In production, send to logging service (e.g., Sentry, CloudWatch, etc.)
}
