-- ============================================================================
-- Test Database Setup for CV Upload Integration Tests
-- ============================================================================
-- This script creates a separate test database for running integration tests
-- Run this in phpMyAdmin on your Hostinger database
-- ============================================================================

-- Create test database (if you have permission)
-- Note: On shared hosting, you may need to use your existing database
-- and just create test tables with a prefix

-- Option 1: If you can create databases (uncomment if allowed)
-- CREATE DATABASE IF NOT EXISTS skilltude_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE skilltude_test;

-- Option 2: Use existing database with test prefix (recommended for shared hosting)
-- Just run the table creation below in your existing database

-- ============================================================================
-- Create test cv_submissions table
-- ============================================================================
-- This is identical to the production table but for testing purposes

CREATE TABLE IF NOT EXISTS test_cv_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cv_filename VARCHAR(255) NOT NULL,
  cv_file_path VARCHAR(500) NOT NULL,
  cv_file_size INT NOT NULL,
  cv_mime_type VARCHAR(100) NOT NULL,
  status ENUM('new', 'reviewed', 'contacted', 'hired', 'rejected') DEFAULT 'new',
  analysis_score INT DEFAULT NULL,
  analysis_results JSON DEFAULT NULL,
  email_sent_at TIMESTAMP NULL DEFAULT NULL,
  email_opened_at TIMESTAMP NULL DEFAULT NULL,
  converted_to_premium BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP NULL DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  consent_given BOOLEAN DEFAULT FALSE,
  admin_notes TEXT DEFAULT NULL,
  reviewed_at TIMESTAMP NULL DEFAULT NULL,
  reviewed_by VARCHAR(100) DEFAULT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_uuid (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Grant permissions (if needed)
-- ============================================================================
-- GRANT ALL PRIVILEGES ON skilltude_test.* TO 'your_test_user'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this to verify the table was created successfully
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    CREATE_TIME,
    TABLE_COLLATION
FROM 
    information_schema.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'test_cv_submissions';

-- ============================================================================
-- Clean up test data (run this after tests)
-- ============================================================================
-- TRUNCATE TABLE test_cv_submissions;
-- Or delete specific test records:
-- DELETE FROM test_cv_submissions WHERE email LIKE '%@example.com';
