-- Rollback email queue and tracking fields from cv_submissions table
-- Note: This only removes the NEW columns added in Task 15
-- It does NOT remove email_sent_at, email_opened_at, converted_to_premium, 
-- or conversion_date as those were added in Task 13

-- Drop indexes first (only new ones)
DROP INDEX IF EXISTS idx_email_status ON cv_submissions;
DROP INDEX IF EXISTS idx_email_scheduled_at ON cv_submissions;

-- Drop columns (only new ones)
ALTER TABLE cv_submissions 
DROP COLUMN IF EXISTS email_scheduled_at,
DROP COLUMN IF EXISTS email_status,
DROP COLUMN IF EXISTS email_attempts,
DROP COLUMN IF EXISTS email_last_attempt_at,
DROP COLUMN IF EXISTS email_error;
