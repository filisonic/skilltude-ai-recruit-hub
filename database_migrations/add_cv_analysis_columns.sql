-- Migration: Add CV Analysis System columns to cv_submissions table
-- Date: 2024-12-25
-- Description: Adds columns for CV analysis scores, results, email tracking, and conversion tracking

-- Add analysis-related columns to cv_submissions table
ALTER TABLE cv_submissions 
ADD COLUMN analysis_score INT DEFAULT NULL COMMENT 'Overall CV quality score (0-100)',
ADD COLUMN analysis_results JSON DEFAULT NULL COMMENT 'Detailed analysis results including strengths, improvements, and ATS compatibility',
ADD COLUMN email_sent_at TIMESTAMP NULL COMMENT 'Timestamp when analysis email was sent to user',
ADD COLUMN email_opened_at TIMESTAMP NULL COMMENT 'Timestamp when user opened the analysis email',
ADD COLUMN converted_to_premium BOOLEAN DEFAULT FALSE COMMENT 'Whether the user converted to premium CV service',
ADD COLUMN conversion_date TIMESTAMP NULL COMMENT 'Date when user converted to premium service';

-- Add indexes for performance optimization
CREATE INDEX idx_analysis_score ON cv_submissions(analysis_score);
CREATE INDEX idx_email_sent_at ON cv_submissions(email_sent_at);
CREATE INDEX idx_converted_to_premium ON cv_submissions(converted_to_premium);
CREATE INDEX idx_conversion_date ON cv_submissions(conversion_date);

-- Add index for conversion tracking queries
CREATE INDEX idx_conversion_tracking ON cv_submissions(converted_to_premium, conversion_date);
