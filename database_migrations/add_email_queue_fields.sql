-- Add email queue and tracking fields to cv_submissions table
-- This migration adds fields for email scheduling, delivery tracking, and retry logic
-- Note: email_sent_at, email_opened_at, converted_to_premium, and conversion_date 
-- were added in Task 13, so we only add the NEW email queue fields

-- Add email scheduling and tracking columns (only new ones)
ALTER TABLE cv_submissions 
ADD COLUMN email_scheduled_at TIMESTAMP NULL COMMENT 'When the email is scheduled to be sent (24-48 hours after submission)',
ADD COLUMN email_status ENUM('pending', 'queued', 'sent', 'failed', 'retrying') DEFAULT 'pending' COMMENT 'Current status of email delivery',
ADD COLUMN email_attempts INT DEFAULT 0 COMMENT 'Number of email send attempts',
ADD COLUMN email_last_attempt_at TIMESTAMP NULL COMMENT 'Timestamp of last email send attempt',
ADD COLUMN email_error TEXT NULL COMMENT 'Last error message if email failed';

-- Add indexes for efficient querying (only for new columns)
CREATE INDEX idx_email_status ON cv_submissions(email_status);
CREATE INDEX idx_email_scheduled_at ON cv_submissions(email_scheduled_at);

-- Add comment to table
ALTER TABLE cv_submissions COMMENT = 'CV submissions with email queue and conversion tracking';
