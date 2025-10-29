/**
 * CV Analysis & Upload System - Type Definitions
 */

// ============================================================================
// User Submission Types
// ============================================================================

export interface CVUploadRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consentGiven: boolean;
}

export interface CVMetadata {
  originalFilename: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

// ============================================================================
// CV Analysis Types
// ============================================================================

export interface CVAnalysisCriteria {
  // Content Analysis
  hasContactInfo: boolean;
  hasProfessionalSummary: boolean;
  hasWorkExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  
  // Quality Metrics
  wordCount: number;
  sentenceComplexity: number;
  keywordDensity: number;
  actionVerbUsage: number;
  quantifiableAchievements: number;
  
  // ATS Compatibility
  hasStandardSections: boolean;
  usesStandardFonts: boolean;
  avoidsTables: boolean;
  avoidsImages: boolean;
  hasKeywords: boolean;
  
  // Formatting
  consistentFormatting: boolean;
  appropriateLength: boolean;
  properDateFormats: boolean;
}

export interface SectionCompleteness {
  contactInfo: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
}

export interface Improvement {
  category: string;
  priority: 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
  example?: string;
}

export interface CVAnalysisResult {
  overallScore: number; // 0-100
  strengths: string[];
  improvements: Improvement[];
  atsCompatibility: number; // 0-100
  sectionCompleteness: SectionCompleteness;
  detailedFeedback: string;
  analyzedAt: Date;
}

// ============================================================================
// Database Types
// ============================================================================

export interface CVSubmission {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cvFilename: string;
  cvFilePath: string;
  status: 'new' | 'reviewed' | 'contacted' | 'hired' | 'rejected';
  analysisScore?: number;
  analysisResults?: CVAnalysisResult;
  emailSentAt?: Date;
  emailOpenedAt?: Date;
  convertedToPremium: boolean;
  conversionDate?: Date;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  adminNotes?: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CVSubmissionDetail extends CVSubmission {
  analysisResults: CVAnalysisResult;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface CVUploadResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  error?: string;
}

export interface CVSubmissionsQuery {
  status?: 'new' | 'reviewed' | 'contacted' | 'hired' | 'rejected';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'submitted_at' | 'updated_at' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface CVSubmissionsResponse {
  submissions: CVSubmission[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CVSubmissionUpdate {
  status?: 'new' | 'reviewed' | 'contacted' | 'hired' | 'rejected';
  adminNotes?: string;
  convertedToPremium?: boolean;
}

// ============================================================================
// Email Types
// ============================================================================

export interface EmailTemplate {
  subject: string;
  greeting: string;
  introduction: string;
  scoreSection: string;
  strengthsSection: string;
  improvementsSection: string;
  ctaSection: string;
  footer: string;
}

export interface EmailContent {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// ============================================================================
// Service Configuration Types
// ============================================================================

export interface FileStorageConfig {
  uploadDir: string;
  maxFileSize: number;
  allowedTypes: string[];
}

export interface EmailServiceConfig {
  provider: 'sendgrid' | 'ses' | 'mailgun' | 'smtp';
  apiKey?: string;
  fromAddress: string;
  fromName: string;
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export interface AnalysisConfig {
  minScore: number;
  maxScore: number;
  emailDelayHours: number;
}

export interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  enableVirusScanning: boolean;
}

export interface CVSystemConfig {
  storage: FileStorageConfig;
  email: EmailServiceConfig;
  analysis: AnalysisConfig;
  security: SecurityConfig;
}

// ============================================================================
// Error Types
// ============================================================================

export class CVUploadException extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'CVUploadException';
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
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
} as const;

// ============================================================================
// File Processing Types
// ============================================================================

export interface FileMetadata {
  filename: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

export interface TextExtractionResult {
  text: string;
  pageCount?: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface ConversionMetrics {
  totalSubmissions: number;
  totalConversions: number;
  conversionRate: number;
  averageScore: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface SubmissionStatistics {
  daily: number;
  weekly: number;
  monthly: number;
  byStatus: Record<string, number>;
}
