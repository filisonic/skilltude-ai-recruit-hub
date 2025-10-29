/**
 * CV Upload Routes
 */

import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { config } from '../config/index.js';
import { FileStorageService } from '../services/FileStorageService.js';
import { TextExtractionService } from '../services/TextExtractionService.js';
import { CVAnalysisEngine } from '../services/CVAnalysisEngine.js';
import { EmailService } from '../services/EmailService.js';
import { EmailQueueService } from '../services/EmailQueueService.js';
import { transaction } from '../utils/database.js';
import { CVUploadException, ErrorCodes, logError } from '../utils/errors.js';
import { cvUploadLimiter } from '../middleware/rateLimiter.js';
import { csrfProtection, sanitizeBody } from '../middleware/security.js';
import { PoolConnection } from 'mysql2/promise';
import { sanitizeName, sanitizeEmail, sanitizePhone } from '../utils/sanitization.js';
import logger, { logCVUpload, logCVAnalysis, logSecurityEvent } from '../utils/logger.js';

const router = express.Router();

// Initialize services
const fileStorage = new FileStorageService();
const textExtraction = new TextExtractionService();
const analysisEngine = new CVAnalysisEngine();
const emailService = new EmailService();
const emailQueueService = new EmailQueueService(emailService);

// ============================================================================
// Multer Configuration
// ============================================================================

// Configure multer for memory storage (we'll handle file storage ourselves)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.storage.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    // Check MIME type
    if (config.storage.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
});

// ============================================================================
// Validation Rules
// ============================================================================

const uploadValidationRules = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 100 }).withMessage('First name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name contains invalid characters'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Last name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name contains invalid characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),
  
  body('consentGiven')
    .notEmpty().withMessage('Consent is required')
    .isBoolean().withMessage('Consent must be a boolean')
    .custom((value) => {
      if (value !== true && value !== 'true') {
        throw new Error('You must consent to data processing');
      }
      return true;
    }),
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate file type using magic numbers (file signature)
 */
async function validateFileSignature(buffer: Buffer, mimetype: string): Promise<boolean> {
  // PDF signature: %PDF
  if (mimetype === 'application/pdf') {
    return buffer.slice(0, 4).toString() === '%PDF';
  }
  
  // DOC signature: D0 CF 11 E0 A1 B1 1A E1
  if (mimetype === 'application/msword') {
    const signature = buffer.slice(0, 8);
    return signature[0] === 0xD0 && signature[1] === 0xCF && 
           signature[2] === 0x11 && signature[3] === 0xE0;
  }
  
  // DOCX signature: PK (ZIP format)
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return buffer[0] === 0x50 && buffer[1] === 0x4B;
  }
  
  return false;
}

/**
 * Sanitize input to prevent XSS
 * Note: This is now handled by the sanitization utilities
 * Keeping this function for backward compatibility
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Log submission for security tracking
 */
function logSubmission(
  ip: string,
  userAgent: string,
  email: string,
  success: boolean,
  error?: string,
  submissionId?: string,
  filename?: string,
  processingTime?: number
): void {
  logCVUpload({
    success,
    email,
    ip,
    filename,
    submissionId,
    error,
    processingTime,
  });
}

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /api/cv/upload
 * Upload CV and user information for analysis
 */
router.post(
  '/upload',
  cvUploadLimiter, // Rate limiting: 5 uploads per hour per IP
  csrfProtection, // CSRF protection
  sanitizeBody, // XSS prevention
  upload.single('file'),
  uploadValidationRules,
  async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    let storedFilePath: string | null = null;
    
    try {
      // ========================================================================
      // 1. Validate Request
      // ========================================================================
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }
      
      // Check if file was uploaded
      if (!req.file) {
        throw new CVUploadException(
          ErrorCodes.VALIDATION_ERROR,
          'No file uploaded',
          400
        );
      }
      
      // ========================================================================
      // 2. Extract and Sanitize User Data
      // ========================================================================
      
      // Use dedicated sanitization functions for each field type
      const firstName = sanitizeName(req.body.firstName);
      const lastName = sanitizeName(req.body.lastName);
      const email = sanitizeEmail(req.body.email);
      const phone = sanitizePhone(req.body.phone);
      const consentGiven = req.body.consentGiven === true || req.body.consentGiven === 'true';
      
      // Get client information for security logging
      const ipAddress = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      // ========================================================================
      // 3. Validate File Signature
      // ========================================================================
      
      const isValidSignature = await validateFileSignature(req.file.buffer, req.file.mimetype);
      if (!isValidSignature) {
        logSubmission(ipAddress, userAgent, email, false, 'Invalid file signature');
        throw new CVUploadException(
          ErrorCodes.INVALID_FILE_TYPE,
          'Invalid file type. The file does not match its extension.',
          400
        );
      }
      
      // ========================================================================
      // 4. Generate Unique Filename and Store File
      // ========================================================================
      
      const fileMetadata = {
        originalFilename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: email,
        uploadedAt: new Date(),
      };
      
      try {
        storedFilePath = await fileStorage.storeCV(req.file.buffer, fileMetadata);
      } catch (storageError) {
        console.error('File storage failed:', storageError);
        throw new CVUploadException(
          ErrorCodes.FILE_UPLOAD_FAILED,
          'Failed to store CV file',
          500
        );
      }
      
      // Get the filename from the stored path
      const uniqueFilename = path.basename(storedFilePath);
      
      // ========================================================================
      // 5. Extract Text from CV
      // ========================================================================
      
      let extractedText: string;
      try {
        extractedText = await textExtraction.extractText(storedFilePath, req.file.mimetype);
      } catch (extractionError) {
        console.error('Text extraction failed:', extractionError);
        // Continue with empty text - analysis will handle this
        extractedText = '';
      }
      
      // ========================================================================
      // 6. Generate Submission UUID (needed for logging)
      // ========================================================================
      
      const submissionUuid = uuidv4();
      
      // ========================================================================
      // 7. Run CV Analysis
      // ========================================================================
      
      let analysisResult;
      const analysisStartTime = Date.now();
      try {
        analysisResult = await analysisEngine.analyzeCV(extractedText);
        
        // Log successful analysis
        logCVAnalysis({
          submissionId: submissionUuid,
          score: analysisResult.overallScore,
          processingTime: Date.now() - analysisStartTime,
          success: true,
        });
      } catch (analysisError) {
        logger.error('CV analysis failed', {
          error: analysisError,
          submissionId: submissionUuid,
          category: 'cv_analysis',
        });
        
        // Log failed analysis
        logCVAnalysis({
          submissionId: submissionUuid,
          score: 0,
          processingTime: Date.now() - analysisStartTime,
          success: false,
          error: analysisError instanceof Error ? analysisError.message : 'Unknown error',
        });
        // Use fallback basic analysis
        analysisResult = {
          overallScore: 50,
          strengths: ['CV received successfully'],
          improvements: [
            {
              category: 'General',
              priority: 'medium' as const,
              issue: 'Unable to perform detailed analysis',
              suggestion: 'Please ensure your CV is properly formatted and readable',
            },
          ],
          atsCompatibility: 50,
          sectionCompleteness: {
            contactInfo: false,
            summary: false,
            experience: false,
            education: false,
            skills: false,
          },
          detailedFeedback: 'We received your CV but encountered issues during analysis. Our team will review it manually.',
          analyzedAt: new Date(),
        };
      }
      
      // ========================================================================
      // 8. Create Database Record (with Transaction)
      // ========================================================================
      
      let submissionId: number = 0;
      
      try {
        await transaction(async (connection: PoolConnection) => {
          const [result] = await connection.execute(
            `INSERT INTO cv_submissions (
              uuid,
              first_name,
              last_name,
              email,
              phone,
              cv_filename,
              cv_file_path,
              cv_file_size,
              cv_mime_type,
              status,
              analysis_score,
              analysis_results,
              ip_address,
              user_agent,
              consent_given,
              submitted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              submissionUuid,
              firstName,
              lastName,
              email,
              phone,
              uniqueFilename,
              storedFilePath,
              req.file!.size,
              req.file!.mimetype,
              'new',
              analysisResult.overallScore,
              JSON.stringify(analysisResult),
              ipAddress,
              userAgent,
              consentGiven,
            ]
          );
          
          submissionId = (result as any).insertId;
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        throw new CVUploadException(
          ErrorCodes.DATABASE_ERROR,
          'Failed to save submission to database',
          500
        );
      }
      
      // ========================================================================
      // 8. Queue Email for Delivery (24-48 hours delay)
      // ========================================================================
      
      // Queue email for delayed delivery (default: 24 hours)
      // This is done asynchronously to not block the response
      emailQueueService.queueEmail(submissionId, 24).catch((emailError) => {
        logger.error('Failed to queue email', {
          error: emailError,
          submissionId,
          category: 'email_queue',
        });
        // Log for manual follow-up but don't fail the request
      });
      
      // ========================================================================
      // 9. Log Success and Return Response
      // ========================================================================
      
      const processingTime = Date.now() - startTime;
      
      logSubmission(
        ipAddress,
        userAgent,
        email,
        true,
        undefined,
        submissionUuid,
        fileMetadata.originalFilename,
        processingTime
      );
      
      logger.info(`CV upload processed successfully in ${processingTime}ms`, {
        submissionId: submissionUuid,
        processingTime,
        category: 'cv_upload',
      });
      
      return res.status(200).json({
        success: true,
        message: 'CV uploaded successfully. You will receive your analysis via email within 24-48 hours.',
        submissionId: submissionUuid,
      });
      
    } catch (error) {
      // ========================================================================
      // Error Handling with Transaction Rollback
      // ========================================================================
      
      // Log error with context
      const ipAddress = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
      const userAgent = req.headers['user-agent'] || 'unknown';
      const email = req.body.email || 'unknown';
      
      logError(error, {
        endpoint: 'POST /api/cv/upload',
        ip: ipAddress,
        userAgent,
        userId: email,
      });
      
      // Clean up stored file if it exists (rollback file storage)
      if (storedFilePath) {
        try {
          await fileStorage.deleteCV(storedFilePath);
          logger.info('Cleaned up stored file after error', {
            filePath: storedFilePath,
            category: 'file_cleanup',
          });
        } catch (cleanupError) {
          logger.error('Failed to clean up file', {
            error: cleanupError,
            filePath: storedFilePath,
            category: 'file_cleanup',
          });
        }
      }
      
      // Log failure for security tracking
      logSubmission(ipAddress, userAgent, email, false, (error as Error).message);
      
      // Pass to global error handler
      next(error);
    }
  }
);

export default router;
