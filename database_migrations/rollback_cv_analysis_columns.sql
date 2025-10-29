-- Rollback Migration: Remove CV Analysis System columns from cv_submissions table
-- Date: 2024-12-25
-- Description: Removes the analysis-related columns added for the CV Analysis System

-- Drop indexes first
DROP INDEX IF EXISTS idx_conversion_tracking ON cv_submissions;
DROP INDEX IF EXISTS idx_conversion_date ON cv_submissions;
DROP INDEX IF EXISTS idx_converted_to_premium ON cv_submissions;
DROP INDEX IF EXISTS idx_email_sent_at ON cv_submissions;
DROP INDEX IF EXISTS idx_analysis_score ON cv_submissions;

-- Remove analysis-related columns from cv_submissions table
ALTER TABLE cv_submissions 
DROP COLUMN IF EXISTS conversion_date,
DROP COLUMN IF EXISTS converted_to_premium,
DROP COLUMN IF EXISTS email_opened_at,
DROP COLUMN IF EXISTS email_sent_at,
DROP COLUMN IF EXISTS analysis_results,
DROP COLUMN IF EXISTS analysis_score;
