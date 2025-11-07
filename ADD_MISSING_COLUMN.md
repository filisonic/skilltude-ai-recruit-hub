# Add Missing Column to cv_submissions Table

## The Problem

The table is missing the `consent_given` column that the code expects.

## The Fix

Run this SQL in phpMyAdmin:

```sql
-- Add the missing consent_given column
ALTER TABLE cv_submissions 
ADD COLUMN consent_given BOOLEAN DEFAULT FALSE AFTER user_agent;
```

## How to Run It

1. Log into Hostinger hPanel
2. Go to Databases → phpMyAdmin
3. Select database: `u931066387_skilltude`
4. Click "SQL" tab
5. Paste the SQL above
6. Click "Go"

## After Running

Try uploading a CV again - should work!

## If You Want to Start Fresh

If you want to recreate the table from scratch with all columns:

```sql
-- Drop the existing table (WARNING: Deletes all data!)
DROP TABLE IF EXISTS cv_submissions;

-- Create the complete table
CREATE TABLE cv_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) NOT NULL UNIQUE,
  
  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- CV File Information
  cv_filename VARCHAR(255) NOT NULL,
  cv_file_path VARCHAR(500) NOT NULL,
  cv_file_size INT NOT NULL,
  cv_mime_type VARCHAR(100) NOT NULL,
  
  -- Application Status
  status ENUM('new', 'reviewed', 'contacted', 'hired', 'rejected') DEFAULT 'new',
  
  -- Analysis Results
  analysis_score INT DEFAULT NULL,
  analysis_results JSON DEFAULT NULL,
  
  -- Email Tracking
  email_sent_at TIMESTAMP NULL DEFAULT NULL,
  email_opened_at TIMESTAMP NULL DEFAULT NULL,
  email_scheduled_at TIMESTAMP NULL DEFAULT NULL,
  email_status ENUM('pending', 'scheduled', 'sent', 'failed', 'bounced') DEFAULT 'pending',
  email_error TEXT DEFAULT NULL,
  
  -- Conversion Tracking
  converted_to_premium BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP NULL DEFAULT NULL,
  
  -- Metadata
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  consent_given BOOLEAN DEFAULT FALSE,
  
  -- Admin Management
  admin_notes TEXT DEFAULT NULL,
  reviewed_at TIMESTAMP NULL DEFAULT NULL,
  reviewed_by VARCHAR(100) DEFAULT NULL,
  
  -- Timestamps
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_uuid (uuid),
  INDEX idx_email_status (email_status),
  INDEX idx_email_scheduled_at (email_scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
