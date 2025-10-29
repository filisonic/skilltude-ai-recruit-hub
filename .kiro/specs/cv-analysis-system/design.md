# Design Document: CV Analysis & Upload System

## Overview

The CV Analysis & Upload System is a full-stack feature that enables job seekers to submit their CVs for free professional analysis. The system consists of a frontend upload interface, backend API for processing, CV text extraction and analysis engine, email delivery system, and admin dashboard integration.

### Key Design Principles

1. **User-First Experience**: Make CV submission effortless with clear value proposition and immediate feedback
2. **Security by Default**: Implement secure file handling, data validation, and access controls
3. **Scalability**: Design for handling multiple concurrent uploads and analysis requests
4. **Maintainability**: Use modular architecture with clear separation of concerns
5. **Performance**: Optimize file uploads and processing to provide fast user feedback

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  CV Upload Form  │  │  Careers Page    │  │  Hero Banner  │ │
│  │  Component       │  │  Integration     │  │  CTA          │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Upload Endpoint │  │  Validation      │  │  Response     │ │
│  │  /api/cv/upload  │  │  Middleware      │  │  Handler      │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Processing Layer                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  File Storage    │  │  Text Extraction │  │  CV Analysis  │ │
│  │  Service         │  │  Service         │  │  Engine       │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data & Notification Layer                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Database        │  │  Email Service   │  │  Admin        │ │
│  │  (cv_submissions)│  │  (SMTP/API)      │  │  Dashboard    │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React with TypeScript
- React Hook Form for form management
- React Dropzone for file uploads
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Node.js with Express (or existing backend framework)
- Multer for file upload handling
- PDF-parse or pdf.js for PDF text extraction
- Mammoth.js for DOC/DOCX text extraction
- Nodemailer or SendGrid for email delivery

**Database:**
- MySQL (existing cv_submissions table from schema)
- File system storage for CV files

**Security:**
- Express-validator for input validation
- Helmet.js for security headers
- Rate limiting for upload endpoints
- File type validation using magic numbers

## Components and Interfaces

### 1. Frontend Components

#### CVUploadForm Component

**Purpose**: Main component for CV upload interface with drag-and-drop functionality

**Props:**
```typescript
interface CVUploadFormProps {
  onSuccess?: (submissionId: string) => void;
  onError?: (error: Error) => void;
  variant?: 'hero' | 'inline' | 'modal';
  showBenefits?: boolean;
}
```

**State Management:**
```typescript
interface CVUploadState {
  file: File | null;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    consentGiven: boolean;
  };
  uploadProgress: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
  submitSuccess: boolean;
}
```

**Key Features:**
- Drag-and-drop file upload with visual feedback
- File type and size validation (client-side)
- Real-time form validation
- Progress indicator during upload
- Success/error messaging
- Responsive design for mobile and desktop

#### CVUploadHero Component

**Purpose**: Prominent hero section for homepage promoting CV analysis

**Features:**
- Eye-catching headline emphasizing free analysis
- Benefit bullets (ATS optimization, professional feedback, etc.)
- Embedded CVUploadForm component
- Social proof elements (testimonials, success stats)
- Compelling call-to-action copy

#### CVUploadInline Component

**Purpose**: Compact version for careers page integration

**Features:**
- Condensed layout suitable for sidebar or above job listings
- Quick value proposition
- Streamlined upload flow
- Mobile-optimized design

### 2. Backend API Endpoints

#### POST /api/cv/upload

**Purpose**: Handle CV file upload and user information submission

**Request:**
```typescript
// Multipart form data
interface CVUploadRequest {
  file: File; // CV file (PDF, DOC, DOCX)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consentGiven: boolean;
}
```

**Response:**
```typescript
interface CVUploadResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  error?: string;
}
```

**Validation Rules:**
- File: Required, max 10MB, types: PDF/DOC/DOCX
- firstName: Required, 2-100 characters, alphanumeric + spaces
- lastName: Required, 2-100 characters, alphanumeric + spaces
- email: Required, valid email format
- phone: Required, valid phone format (flexible international)
- consentGiven: Required, must be true

**Processing Flow:**
1. Validate request data and file
2. Generate unique filename (UUID + original extension)
3. Store file in secure directory
4. Extract text from CV file
5. Run initial CV analysis
6. Create database record
7. Queue email for delivery
8. Return success response

#### GET /api/admin/cv-submissions

**Purpose**: Retrieve list of CV submissions for admin dashboard

**Query Parameters:**
```typescript
interface CVSubmissionsQuery {
  status?: 'new' | 'reviewed' | 'contacted' | 'hired' | 'rejected';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'submitted_at' | 'updated_at' | 'status';
  sortOrder?: 'asc' | 'desc';
}
```

**Response:**
```typescript
interface CVSubmissionsResponse {
  submissions: CVSubmission[];
  total: number;
  page: number;
  totalPages: number;
}

interface CVSubmission {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cvFilename: string;
  cvFilePath: string;
  status: string;
  analysisScore?: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
```

#### GET /api/admin/cv-submissions/:id

**Purpose**: Retrieve detailed information for a specific CV submission

**Response:**
```typescript
interface CVSubmissionDetail extends CVSubmission {
  analysisResults: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    atsCompatibility: number;
    sectionCompleteness: {
      contactInfo: boolean;
      summary: boolean;
      experience: boolean;
      education: boolean;
      skills: boolean;
    };
  };
  adminNotes?: string;
  ipAddress: string;
  userAgent: string;
}
```

#### PUT /api/admin/cv-submissions/:id

**Purpose**: Update CV submission status and admin notes

**Request:**
```typescript
interface CVSubmissionUpdate {
  status?: 'new' | 'reviewed' | 'contacted' | 'hired' | 'rejected';
  adminNotes?: string;
}
```

#### GET /api/admin/cv-submissions/:id/download

**Purpose**: Download the original CV file

**Response:** File download with appropriate headers

### 3. File Storage Service

**Purpose**: Handle secure file storage and retrieval

**Directory Structure:**
```
/uploads/
  /cvs/
    /2024/
      /12/
        {uuid}-{original-filename}.pdf
        {uuid}-{original-filename}.docx
```

**Key Functions:**

```typescript
class FileStorageService {
  async storeCV(file: File, metadata: CVMetadata): Promise<string>;
  async retrieveCV(filePath: string): Promise<Buffer>;
  async deleteCV(filePath: string): Promise<void>;
  async getFileMetadata(filePath: string): Promise<FileMetadata>;
}
```

**Security Measures:**
- Files stored outside public web directory
- Access only through authenticated API endpoints
- Unique filenames to prevent collisions and guessing
- File type verification using magic numbers (not just extension)
- Virus scanning integration (optional but recommended)

### 4. Text Extraction Service

**Purpose**: Extract text content from CV files for analysis

**Supported Formats:**
- PDF: Using pdf-parse or pdf.js
- DOC/DOCX: Using mammoth.js or docx-parser

**Key Functions:**

```typescript
class TextExtractionService {
  async extractText(filePath: string, mimeType: string): Promise<string>;
  async extractPDF(filePath: string): Promise<string>;
  async extractDOCX(filePath: string): Promise<string>;
  private cleanText(rawText: string): string;
}
```

**Text Cleaning:**
- Remove excessive whitespace
- Normalize line breaks
- Remove special characters that interfere with analysis
- Preserve structure (sections, bullet points)

### 5. CV Analysis Engine

**Purpose**: Analyze CV content and generate improvement recommendations

**Analysis Criteria:**

```typescript
interface CVAnalysisCriteria {
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
```

**Scoring Algorithm:**

```typescript
class CVAnalysisEngine {
  async analyzeCV(cvText: string): Promise<CVAnalysisResult>;
  
  private calculateOverallScore(criteria: CVAnalysisCriteria): number;
  private identifyStrengths(criteria: CVAnalysisCriteria): string[];
  private identifyImprovements(criteria: CVAnalysisCriteria): Improvement[];
  private checkATSCompatibility(cvText: string): number;
  private analyzeSections(cvText: string): SectionAnalysis;
}

interface CVAnalysisResult {
  overallScore: number; // 0-100
  strengths: string[];
  improvements: Improvement[];
  atsCompatibility: number; // 0-100
  sectionCompleteness: SectionCompleteness;
  detailedFeedback: string;
}

interface Improvement {
  category: string;
  priority: 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
  example?: string;
}
```

**Scoring Breakdown:**
- Contact Information: 10 points
- Professional Summary: 15 points
- Work Experience: 25 points
- Education: 10 points
- Skills Section: 15 points
- ATS Compatibility: 15 points
- Formatting & Structure: 10 points

### 6. Email Service

**Purpose**: Send professional CV analysis emails to users

**Email Template Structure:**

```typescript
interface EmailTemplate {
  subject: string;
  greeting: string;
  introduction: string;
  scoreSection: string;
  strengthsSection: string;
  improvementsSection: string;
  ctaSection: string;
  footer: string;
}
```

**Email Content:**

```html
Subject: Your CV Analysis Results - [Score]/100

Dear [FirstName],

Thank you for submitting your CV for analysis. We've completed a comprehensive 
review and are excited to share our findings with you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 YOUR CV SCORE: [Score]/100

[Score interpretation paragraph based on range]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ WHAT YOU'RE DOING WELL

[List of 3-5 strengths identified]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 KEY IMPROVEMENTS TO MAKE

[List of 3-5 specific improvements with explanations]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 READY TO TAKE YOUR CV TO THE NEXT LEVEL?

While these improvements will help, creating an ATS-optimized CV that stands 
out to recruiters requires expertise and industry knowledge.

Our professional CV writing service includes:
✓ ATS-optimized formatting that passes automated screening
✓ Industry-specific keyword optimization
✓ Achievement-focused content that highlights your value
✓ Professional design that impresses hiring managers
✓ Unlimited revisions until you're 100% satisfied

📧 Reply to this email or call us at [phone] to discuss how we can help you 
   create a CV that opens doors to your dream job.

💼 Limited Time: Mention this analysis for 15% off our CV writing service!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best regards,
The SkillTude Team

[Contact Information]
[Social Media Links]
[Unsubscribe Link]
```

**Email Service Implementation:**

```typescript
class EmailService {
  async sendCVAnalysis(
    recipient: string,
    analysisResult: CVAnalysisResult,
    userData: UserData
  ): Promise<boolean>;
  
  private generateEmailContent(
    analysisResult: CVAnalysisResult,
    userData: UserData
  ): EmailContent;
  
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string
  ): Promise<boolean>;
  
  async retryFailedEmail(submissionId: string): Promise<boolean>;
}
```

**Email Delivery:**
- Use transactional email service (SendGrid, AWS SES, or Mailgun)
- Implement retry logic (3 attempts with exponential backoff)
- Log all email attempts in database
- Track email opens and clicks (optional)
- Ensure GDPR compliance with unsubscribe option

## Data Models

### Database Schema (cv_submissions table)

The existing schema from `complete_database_schema.sql` will be used with some additional fields:

```sql
-- Additional fields to add to cv_submissions table
ALTER TABLE cv_submissions ADD COLUMN analysis_score INT DEFAULT NULL;
ALTER TABLE cv_submissions ADD COLUMN analysis_results JSON DEFAULT NULL;
ALTER TABLE cv_submissions ADD COLUMN email_sent_at TIMESTAMP NULL;
ALTER TABLE cv_submissions ADD COLUMN email_opened_at TIMESTAMP NULL;
ALTER TABLE cv_submissions ADD COLUMN converted_to_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE cv_submissions ADD COLUMN conversion_date TIMESTAMP NULL;
```

### Analysis Results JSON Structure

```json
{
  "overallScore": 75,
  "atsCompatibility": 80,
  "strengths": [
    "Clear contact information with professional email",
    "Strong action verbs used throughout experience section",
    "Quantifiable achievements with specific metrics"
  ],
  "improvements": [
    {
      "category": "Professional Summary",
      "priority": "high",
      "issue": "Missing professional summary section",
      "suggestion": "Add a 3-4 sentence summary highlighting your key skills and career objectives",
      "example": "Results-driven software engineer with 5+ years..."
    }
  ],
  "sectionCompleteness": {
    "contactInfo": true,
    "summary": false,
    "experience": true,
    "education": true,
    "skills": true
  },
  "analyzedAt": "2024-12-25T10:30:00Z"
}
```

## Error Handling

### Client-Side Error Handling

```typescript
enum CVUploadError {
  FILE_TOO_LARGE = 'File size exceeds 10MB limit',
  INVALID_FILE_TYPE = 'Only PDF, DOC, and DOCX files are accepted',
  NETWORK_ERROR = 'Network error. Please check your connection and try again',
  SERVER_ERROR = 'Server error. Please try again later',
  VALIDATION_ERROR = 'Please check your information and try again',
}
```

### Server-Side Error Handling

```typescript
class CVUploadException extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number
  ) {
    super(message);
  }
}

// Error codes
const ErrorCodes = {
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  TEXT_EXTRACTION_FAILED: 'TEXT_EXTRACTION_FAILED',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
};
```

### Error Recovery Strategies

1. **File Upload Failures**: Retry with exponential backoff
2. **Text Extraction Failures**: Log error, notify admin, send generic email
3. **Analysis Failures**: Use fallback basic analysis, notify admin
4. **Email Failures**: Queue for retry, log for manual follow-up
5. **Database Errors**: Rollback transaction, return error to user

## Testing Strategy

### Unit Tests

**Frontend Components:**
- CVUploadForm validation logic
- File type and size validation
- Form submission handling
- Error state management

**Backend Services:**
- File storage service (mock file system)
- Text extraction service (sample PDFs/DOCXs)
- CV analysis engine (various CV samples)
- Email service (mock SMTP)

### Integration Tests

- Complete upload flow from frontend to database
- File upload → text extraction → analysis pipeline
- Email generation and delivery
- Admin dashboard data retrieval

### End-to-End Tests

- User uploads CV and receives confirmation
- Admin views submission in dashboard
- Email is sent with correct analysis
- File download from admin dashboard

### Test Data

Create sample CVs representing:
- Well-formatted, high-quality CV (expected score: 85-95)
- Average CV with some issues (expected score: 60-75)
- Poor CV with multiple problems (expected score: 30-50)
- Edge cases: very short, very long, unusual formatting

### Performance Tests

- Concurrent file uploads (10, 50, 100 simultaneous)
- Large file handling (up to 10MB)
- Text extraction performance
- Database query performance with large datasets

## Security Considerations

### File Upload Security

1. **File Type Validation**: Check magic numbers, not just extensions
2. **File Size Limits**: Enforce 10MB limit at multiple layers
3. **Virus Scanning**: Integrate ClamAV or similar (recommended)
4. **Filename Sanitization**: Use UUIDs, remove special characters
5. **Storage Location**: Outside web root, not directly accessible

### Data Security

1. **Input Validation**: Sanitize all user inputs
2. **SQL Injection Prevention**: Use parameterized queries
3. **XSS Prevention**: Escape output, use Content Security Policy
4. **CSRF Protection**: Implement CSRF tokens
5. **Rate Limiting**: Limit uploads per IP (e.g., 5 per hour)

### Access Control

1. **Admin Authentication**: Require login for admin endpoints
2. **Role-Based Access**: Different permissions for admin roles
3. **File Access**: Authenticate before allowing file downloads
4. **API Security**: Use API keys or JWT tokens

### Privacy Compliance

1. **GDPR Compliance**: 
   - Explicit consent checkbox
   - Data retention policy
   - Right to deletion
   - Privacy policy link
2. **Data Minimization**: Only collect necessary information
3. **Secure Transmission**: HTTPS only
4. **Data Encryption**: Encrypt sensitive data at rest (optional)

## Deployment Considerations

### Infrastructure Requirements

- **Storage**: Estimate 5MB average per CV, plan for growth
- **Compute**: Text extraction and analysis are CPU-intensive
- **Email**: Transactional email service with good deliverability
- **Monitoring**: Track upload success rates, analysis completion, email delivery

### Configuration

```typescript
interface CVSystemConfig {
  storage: {
    uploadDir: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
  analysis: {
    minScore: number;
    maxScore: number;
    emailDelay: number; // hours
  };
  email: {
    provider: 'sendgrid' | 'ses' | 'mailgun';
    apiKey: string;
    fromAddress: string;
    fromName: string;
  };
  security: {
    rateLimit: {
      windowMs: number;
      maxRequests: number;
    };
    enableVirusScanning: boolean;
  };
}
```

### Monitoring and Logging

**Key Metrics to Track:**
- Upload success/failure rate
- Average analysis completion time
- Email delivery rate
- Conversion rate (submissions → premium inquiries)
- Storage usage
- API response times

**Logging Requirements:**
- All file uploads (success and failure)
- Analysis results
- Email delivery attempts
- Admin actions
- Security events (rate limit hits, invalid file types)

## Future Enhancements

### Phase 2 Features

1. **AI-Powered Analysis**: Integrate GPT-4 or similar for more sophisticated feedback
2. **Video CV Analysis**: Support for video CVs with transcript analysis
3. **LinkedIn Integration**: Import profile data for comparison
4. **CV Builder Tool**: Interactive CV builder based on analysis
5. **A/B Testing**: Test different email templates and CTAs
6. **Automated Follow-ups**: Scheduled follow-up emails for non-responders
7. **Referral Program**: Incentivize users to refer others
8. **Multi-language Support**: Analyze CVs in different languages

### Scalability Improvements

1. **Queue System**: Use Redis/RabbitMQ for async processing
2. **Microservices**: Separate analysis engine into independent service
3. **CDN Integration**: Serve static assets via CDN
4. **Database Optimization**: Implement caching, read replicas
5. **Horizontal Scaling**: Load balancer with multiple app servers

## Success Metrics

### Key Performance Indicators

1. **Submission Rate**: Target 50+ CV submissions per month
2. **Analysis Completion**: 95%+ of submissions analyzed within 48 hours
3. **Email Delivery**: 98%+ successful email delivery rate
4. **Conversion Rate**: 10-15% of submissions convert to premium inquiries
5. **User Satisfaction**: Positive feedback on analysis quality
6. **System Uptime**: 99.9% availability

### Analytics to Track

- Daily/weekly/monthly submission trends
- Most common improvement areas identified
- Average CV scores by industry/role
- Conversion funnel: submission → email open → reply → sale
- Geographic distribution of submissions
- Device/browser usage statistics

## Conclusion

This design provides a comprehensive, scalable solution for the CV Analysis & Upload System. The modular architecture allows for incremental development and future enhancements while maintaining security, performance, and user experience as top priorities.

The system balances automation (for efficiency) with personalization (for conversion), creating value for users while generating qualified leads for premium services.
