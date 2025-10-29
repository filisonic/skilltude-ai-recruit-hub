-- ============================================
-- Production Database Setup Script
-- SkillTude CV Analysis System
-- ============================================
-- 
-- This script creates the production database and user
-- Run as MySQL root user:
-- mysql -u root -p < setup-production-db.sql
--

-- Create production database
CREATE DATABASE IF NOT EXISTS skilltude_production 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Create dedicated production user
-- IMPORTANT: Change 'STRONG_PASSWORD_HERE' to a strong password
CREATE USER IF NOT EXISTS 'skilltude_prod'@'localhost' 
  IDENTIFIED BY 'STRONG_PASSWORD_HERE';

-- Grant necessary privileges (minimal required permissions)
GRANT SELECT, INSERT, UPDATE, DELETE ON skilltude_production.* 
  TO 'skilltude_prod'@'localhost';

-- Grant specific privileges for schema operations (if needed)
-- Uncomment if application needs to create/alter tables
-- GRANT CREATE, ALTER, INDEX, DROP ON skilltude_production.* 
--   TO 'skilltude_prod'@'localhost';

-- Apply privilege changes
FLUSH PRIVILEGES;

-- Verify database creation
SELECT 
  SCHEMA_NAME as 'Database',
  DEFAULT_CHARACTER_SET_NAME as 'Charset',
  DEFAULT_COLLATION_NAME as 'Collation'
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'skilltude_production';

-- Verify user creation
SELECT 
  User,
  Host,
  plugin as 'Auth Plugin'
FROM mysql.user 
WHERE User = 'skilltude_prod';

-- Show granted privileges
SHOW GRANTS FOR 'skilltude_prod'@'localhost';

-- ============================================
-- Next Steps:
-- ============================================
-- 1. Update the password in this script before running
-- 2. Run database migrations to create tables
-- 3. Update .env file with database credentials
-- 4. Test database connection
-- 5. Securely store database credentials
-- ============================================
