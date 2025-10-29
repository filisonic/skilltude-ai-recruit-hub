# Manual Migration Guide - Apply via phpMyAdmin

Since remote database connections are restricted by your hosting provider, follow these steps to apply the migration manually through phpMyAdmin.

## Steps to Apply Migration

### 1. Open phpMyAdmin
Go to: https://auth-db878.hstgr.io/index.php?db=u931066387_skilltude

### 2. Select Your Database
Make sure `u931066387_skilltude` is selected in the left sidebar.

### 3. Go to SQL Tab
Click on the "SQL" tab at the top of the page.

### 4. Copy and Paste the SQL Below
Copy the entire SQL code below and paste it into the SQL query box:

```sql
-- Migration: Add CV Analysis System columns to cv_submissions table
-- Date: 2024-12-25

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
CREATE INDEX idx_conversion_tracking ON cv_submissions(converted_to_premium, conversion_date);
```

### 5. Click "Go" Button
Click the "Go" button at the bottom right to execute the SQL.

### 6. Verify Success
You should see a success message like:
- "6 rows affected" or
- "Query executed successfully"

### 7. Verify the Changes
To verify the columns were added:

1. Click on the `cv_submissions` table in the left sidebar
2. Click on the "Structure" tab
3. Scroll down and you should see the new columns:
   - `analysis_score`
   - `analysis_results`
   - `email_sent_at`
   - `email_opened_at`
   - `converted_to_premium`
   - `conversion_date`

## Troubleshooting

### Error: "Duplicate column name"
This means the migration has already been applied. You can skip this step.

### Error: "Table 'cv_submissions' doesn't exist"
This means the base database schema hasn't been set up yet. You need to run the `complete_database_schema.sql` file first.

### Error: "Access denied"
Make sure you're logged in with the correct user (`u931066387_management`) that has ALTER and CREATE INDEX privileges.

## Rollback (If Needed)

If you need to remove these columns, run this SQL instead:

```sql
-- Rollback: Remove CV Analysis System columns

-- Drop indexes first
DROP INDEX idx_conversion_tracking ON cv_submissions;
DROP INDEX idx_conversion_date ON cv_submissions;
DROP INDEX idx_converted_to_premium ON cv_submissions;
DROP INDEX idx_email_sent_at ON cv_submissions;
DROP INDEX idx_analysis_score ON cv_submissions;

-- Remove columns
ALTER TABLE cv_submissions 
DROP COLUMN conversion_date,
DROP COLUMN converted_to_premium,
DROP COLUMN email_opened_at,
DROP COLUMN email_sent_at,
DROP COLUMN analysis_results,
DROP COLUMN analysis_score;
```

## Next Steps

After successfully applying this migration:
- ✅ Mark task 2.1 as complete
- ⏭️ Continue with task 3: Implement file storage service
