# Implementation Plan: CV Analysis & Upload System

- [x] 1. Set up project structure and dependencies





  - Install required npm packages (multer, pdf-parse, mammoth, nodemailer, express-validator)
  - Create directory structure for CV uploads (/uploads/cvs/)
  - Set up environment variables for email service and file storage paths
  - Configure TypeScript types for CV-related interfaces
  - _Requirements: 1.1, 3.1_

- [-] 2. Create database schema extensions


  - [x] 2.1 Add analysis-related columns to cv_submissions table


    - Write SQL migration to add analysis_score, analysis_results (JSON), email_sent_at, email_opened_at, converted_to_premium, conversion_date columns
    - Test migration on development database
    - _Requirements: 3.2, 3.3, 7.3_
-

  - [x] 2.2 Create database seed data for testing






    - Create sample CV submission records with various statuses
    - Generate test data for admin dashboard
    - _Requirements: 6.1_
-

- [ ] 3. Implement file storage service

  - [x] 3.1 Create FileStorageService class





    - Implement storeCV() method with UUID-based filename generation
    - Implement retrieveCV() method for file retrieval
    - Implement deleteCV() method for cleanup
    - Add file type validation using magic numbers
    - Create year/month directory structure
    - _Requirements: 3.1, 3.4, 9.2_
-



  - [x] 3.2 Write unit tests for file storage service





    - Test file storage with various file types
    - Test filename generation and collision handling
    - Test file retrieval and error cases
    - _Requirements: 3.1_

- [ ] 4. Implement text extraction service

  - [x] 4.1 Create TextExtractionService class






    - Implement extractPDF() using pdf-parse library
    - Implement extractDOCX() using mammoth.js library
    - Implement text cleaning and normalization
    - Add error handling for corrupted files
    - _Requirements: 4.1_

  - [x] 4.2 Write unit tests for text extraction






    - Test with sample PDF files
    - Test with sample DOCX files
    - Test error handling for invalid files
    - _Requirements: 4.1_

- [x] 5. Implement CV analysis engine






  - [x] 5.1 Create CVAnalysisEngine class with scoring algorithm

    - Implement section detection (contact, summary, experience, education, skills)
    - Implement keyword density analysis
    - Implement action verb detection
    - Implement quantifiable achievement detection
    - Calculate overall score (0-100) based on criteria
    - _Requirements: 4.2, 4.3, 4.4_



  - [x] 5.2 Implement improvement identification logic

    - Create rules for identifying missing sections
    - Create rules for ATS compatibility issues
    - Create rules for formatting problems
    - Generate specific, actionable suggestions
    - Prioritize improvements (high/medium/low)
    - _Requirements: 4.4, 4.5, 4.6_

  - [x] 5.3 Write unit tests for analysis engine






    - Test with high-quality CV sample (expected score 85-95)
    - Test with average CV sample (expected score 60-75)
    - Test with poor CV sample (expected score 30-50)
    - Verify improvement suggestions are generated correctly
    - _Requirements: 4.2, 4.3, 4.4_

- [x] 6. Implement email service






  - [x] 6.1 Create EmailService class

    - Set up email provider integration (SendGrid/SES/Mailgun)
    - Implement sendCVAnalysis() method
    - Create HTML email template with branding
    - Create plain text email fallback
    - Implement retry logic with exponential backoff
    - _Requirements: 5.1, 5.2, 5.3, 5.8_


  - [x] 6.2 Create dynamic email content generation

    - Generate personalized greeting with user's name
    - Format score section with interpretation
    - Format strengths list with bullet points
    - Format improvements with detailed explanations
    - Add compelling CTA section with contact information
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 6.3 Write unit tests for email service






    - Test email content generation with various analysis results
    - Test retry logic with mock SMTP failures
    - Verify email formatting and structure
    - _Requirements: 5.1, 5.8_

- [x] 7. Create backend API endpoints




  - [x] 7.1 Implement POST /api/cv/upload endpoint


    - Set up multer middleware for file upload handling
    - Add express-validator rules for input validation
    - Implement file type and size validation
    - Generate unique filename and store file
    - Extract text from uploaded CV
    - Run CV analysis
    - Create database record with all metadata
    - Queue email for delivery
    - Return success response with submission ID
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 7.2 Implement error handling and validation


    - Add try-catch blocks for all operations
    - Implement transaction rollback on failures
    - Return appropriate HTTP status codes
    - Log errors for debugging
    - _Requirements: 2.4, 3.5, 9.1_

  - [x] 7.3 Add rate limiting middleware


    - Implement rate limiting (5 uploads per hour per IP)
    - Add security headers using helmet.js
    - Implement CSRF protection
    - _Requirements: 9.1_

  - [x] 7.4 Write integration tests for upload endpoint






    - Test successful upload flow
    - Test validation errors (missing fields, invalid email, etc.)
    - Test file type rejection
    - Test file size limit enforcement
    - Test rate limiting
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_




- [x] 8. Create admin dashboard API endpoints



  - [ ] 8.1 Implement GET /api/admin/cv-submissions endpoint
    - Add authentication middleware
    - Implement filtering by status
    - Implement search functionality
    - Implement pagination
    - Implement sorting


    - Return list of submissions with metadata
    - _Requirements: 6.1, 6.2, 6.6_

  - [x] 8.2 Implement GET /api/admin/cv-submissions/:id endpoint


    - Add authentication middleware
    - Retrieve full submission details including analysis results
    - Return formatted response
    - _Requirements: 6.3_



  - [x] 8.3 Implement PUT /api/admin/cv-submissions/:id endpoint





    - Add authentication middleware
    - Validate update data
    - Update status and admin notes
    - Log admin action with timestamp
    - _Requirements: 6.5_

  - [x] 8.4 Implement GET /api/admin/cv-submissions/:id/download endpoint





    - Add authentication middleware
    - Verify file exists
    - Set appropriate headers for file download
    - Stream file to response
    - _Requirements: 6.4_

  - [x] 8.5 Write integration tests for admin endpoints






    - Test authentication requirements
    - Test filtering and search functionality
    - Test pagination
    - Test file download
    - Test status updates
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 9. Create frontend CV upload form component




  - [x] 9.1 Create CVUploadForm component with React Hook Form


    - Set up form state management
    - Create form fields (firstName, lastName, email, phone, consent)
    - Implement client-side validation
    - Add error message display
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4_

  - [x] 9.2 Implement drag-and-drop file upload

    - Integrate react-dropzone library
    - Add visual feedback for drag-over state
    - Display selected file name and size
    - Add remove file button
    - Implement client-side file type validation
    - Implement client-side file size validation
    - _Requirements: 1.2, 1.3, 1.4, 1.5_


  - [x] 9.3 Implement form submission logic

    - Create FormData with file and user information
    - Add upload progress indicator
    - Handle API response (success/error)
    - Display success message with next steps
    - Display error messages
    - Reset form after successful submission
    - _Requirements: 1.6, 2.5, 2.6_



  - [x] 9.4 Add privacy policy consent checkbox

    - Create checkbox with link to privacy policy
    - Validate consent is given before submission
    - _Requirements: 9.4, 9.5_

  - [ ]* 9.5 Write component tests for CVUploadForm
    - Test form validation
    - Test file upload interaction
    - Test form submission
    - Test error handling
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4_

- [x] 10. Create CV upload hero section component






  - [x] 10.1 Create CVUploadHero component

    - Design eye-catching headline emphasizing free analysis
    - Add benefit bullets (ATS optimization, professional feedback, etc.)
    - Embed CVUploadForm component
    - Add compelling call-to-action copy
    - Style with Tailwind CSS matching site design
    - Make responsive for mobile and desktop
    - _Requirements: 1.1, 1.6, 8.1, 8.3, 8.5_


  - [x] 10.2 Integrate hero section into homepage

    - Add CVUploadHero component to homepage
    - Position prominently (above fold or as dedicated section)
    - Test responsive behavior
    - _Requirements: 8.1_

- [x] 11. Create CV upload inline component for careers page






  - [x] 11.1 Create CVUploadInline component

    - Design compact layout suitable for sidebar or above job listings
    - Add quick value proposition
    - Embed CVUploadForm with condensed styling
    - Make mobile-optimized
    - _Requirements: 1.1, 8.2, 8.5_

  - [x] 11.2 Integrate inline component into careers page


    - Add CVUploadInline component to careers page
    - Position above job listings or in sidebar
    - Test responsive behavior
    - _Requirements: 8.2_

- [x] 12. Create admin dashboard CV management interface




  - [x] 12.1 Create CVSubmissionsList component


    - Display table/list of CV submissions
    - Show key information (name, email, date, status)
    - Add status filter dropdown
    - Add search input
    - Implement pagination controls
    - Add notification badge for new submissions
    - _Requirements: 6.1, 6.2, 6.6, 6.7_

  - [x] 12.2 Create CVSubmissionDetail component


    - Display full submission details
    - Show analysis results with score and recommendations
    - Add CV file download button
    - Add admin notes textarea
    - Add status update dropdown
    - Implement save functionality
    - _Requirements: 6.3, 6.4, 6.5_

  - [x] 12.3 Integrate CV management into admin dashboard


    - Add navigation link to CV submissions section
    - Connect components to API endpoints
    - Add loading states
    - Add error handling
    - _Requirements: 6.1, 6.7_

  - [x] 12.4 Write component tests for admin interface






    - Test list rendering and filtering
    - Test detail view display
    - Test status updates
    - Test file download
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 13. Implement conversion tracking




  - [x] 13.1 Add conversion tracking fields to database


    - Ensure converted_to_premium and conversion_date fields exist
    - Create index for conversion queries
    - _Requirements: 7.2, 7.3_

  - [x] 13.2 Create conversion tracking UI in admin dashboard


    - Add "Mark as Converted" button in submission detail view
    - Update status to show conversion
    - Display conversion date
    - _Requirements: 7.3_

  - [x] 13.3 Create analytics dashboard for conversions


    - Calculate and display conversion rate
    - Show monthly submission and conversion statistics
    - Create charts/graphs for visualization
    - _Requirements: 7.4, 7.5_

- [x] 14. Implement security measures




  - [x] 14.1 Add file type validation using magic numbers


    - Implement magic number checking (not just extension)
    - Reject files that don't match allowed types
    - _Requirements: 1.3, 9.2_

  - [x] 14.2 Implement input sanitization


    - Sanitize all user inputs to prevent XSS
    - Use parameterized queries to prevent SQL injection
    - _Requirements: 3.4, 9.1_

  - [x] 14.3 Add HTTPS enforcement


    - Configure server to redirect HTTP to HTTPS
    - Set secure cookie flags
    - _Requirements: 9.1_

  - [x] 14.4 Implement access controls for file downloads


    - Verify authentication before allowing file access
    - Check admin permissions
    - Log file access attempts
    - _Requirements: 9.6_

- [x] 15. Set up email delivery scheduling




  - [x] 15.1 Create email queue system


    - Implement queue for delayed email delivery (24-48 hours)
    - Create background job to process email queue
    - Add retry logic for failed emails
    - Log all email attempts
    - _Requirements: 5.1, 5.8_

  - [x] 15.2 Create email status tracking


    - Update database when email is sent
    - Track email delivery failures
    - Create admin view for failed emails
    - _Requirements: 5.8_

- [ ] 16. Add accessibility features
  - [ ] 16.1 Ensure keyboard accessibility
    - Test all form interactions with keyboard only
    - Add proper focus indicators
    - Ensure logical tab order
    - _Requirements: 8.4_

  - [ ] 16.2 Add ARIA labels and screen reader support
    - Add aria-labels to form fields
    - Add aria-live regions for dynamic content
    - Test with screen reader
    - _Requirements: 8.4_

  - [x] 16.3 Ensure mobile responsiveness





    - Test on various mobile devices
    - Optimize touch targets
    - Ensure readable text sizes
    - _Requirements: 8.5_

- [x] 17. Implement monitoring and logging





  - [x] 17.1 Set up application logging


    - Log all CV uploads (success and failure)
    - Log analysis results
    - Log email delivery attempts
    - Log admin actions
    - Log security events
    - _Requirements: 3.6_

  - [x] 17.2 Create monitoring dashboard


    - Track upload success/failure rate
    - Track average analysis completion time
    - Track email delivery rate
    - Track storage usage
    - Track API response times
    - _Requirements: 7.4_

  - [x] 17.3 Set up alerts for critical issues


    - Alert on high failure rates
    - Alert on storage capacity issues
    - Alert on email delivery problems
    - _Requirements: 3.5_

- [x] 18. Create documentation






  - [x] 18.1 Write API documentation

    - Document all endpoints with request/response examples
    - Document authentication requirements
    - Document error codes and messages
    - _Requirements: All_


  - [x] 18.2 Write user guide

    - Create guide for submitting CVs
    - Explain what to expect after submission
    - Provide tips for improving CV before submission
    - _Requirements: 1.6, 2.6, 8.6_

  - [x] 18.3 Write admin guide


    - Document how to manage CV submissions
    - Explain status workflow
    - Provide guidelines for following up with candidates
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 19. Perform end-to-end testing



  - [x] 19.1 Test complete user flow






    - User uploads CV from homepage
    - Verify file is stored correctly
    - Verify database record is created
    - Verify analysis is performed
    - Verify email is queued
    - Verify email is delivered
    - _Requirements: All_

  - [x] 19.2 Test admin workflow






    - Admin views new submission
    - Admin downloads CV file
    - Admin updates status and adds notes
    - Admin marks as converted
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.3_

  - [x] 19.3 Test error scenarios






    - Test with invalid file types
    - Test with oversized files
    - Test with corrupted files
    - Test with network failures
    - Test with database failures
    - _Requirements: 1.3, 1.4, 3.5_

- [x] 20. Deploy and launch



  - [x] 20.1 Set up production environment





    - Configure production database
    - Set up file storage directory with proper permissions
    - Configure email service with production credentials
    - Set up SSL certificate
    - Configure environment variables
    - _Requirements: 9.1_

  - [ ] 20.2 Perform production smoke tests
    - Test CV upload in production
    - Verify file storage works
    - Verify email delivery works
    - Test admin dashboard access
    - _Requirements: All_

  - [ ] 20.3 Monitor initial launch
    - Watch for errors in logs
    - Monitor upload success rates
    - Monitor email delivery
    - Gather user feedback
    - _Requirements: All_
