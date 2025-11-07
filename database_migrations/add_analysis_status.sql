-- Add analysis_status column for async CV processing
-- Run this in Hostinger phpMyAdmin

ALTER TABLE cv_submissions
ADD COLUMN analysis_status ENUM('pending', 'processing', 'completed', 'failed') 
DEFAULT 'pending' 
AFTER analysis_results;

-- Update existing records to 'completed' since they were analyzed synchronously
UPDATE cv_submissions
SET analysis_status = 'completed'
WHERE analysis_score IS NOT NULL;

-- Verify
SELECT id, email, analysis_status, analysis_score 
FROM cv_submissions 
ORDER BY id DESC 
LIMIT 10;
