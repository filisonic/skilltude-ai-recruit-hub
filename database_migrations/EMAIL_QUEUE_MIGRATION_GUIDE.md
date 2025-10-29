# Email Queue Migration Guide

## Quick Start

### Apply the Migration

```bash
# Option 1: Using npm script (recommended)
npm run migrate:email-queue

# Option 2: Using node directly
node database_migrations/apply_email_queue_migration.js

# Option 3: Using the generic migration script
node database_migrations/apply_migration.js add_email_queue_fields.sql
```

### Rollback the Migration

```bash
# Option 1: Using npm script (recommended)
npm run rollback:email-queue

# Option 2: Using node directly
node database_migrations/rollback_email_queue_migration.js
```

## What This Migration Does

This migration adds email queue and tracking fields to the `cv_submissions` table:

### New Columns

1. **email_scheduled_at** (TIMESTAMP NULL)
   - When the email is scheduled to be sent (24-48 hours after submission)

2. **email_sent_at** (TIMESTAMP NULL)
   - When the email was successfully sent

3. **email_status** (ENUM)
   - Current status: 'pending', 'queued', 'sent', 'failed', 'retrying'
   - Default: 'pending'

4. **email_attempts** (INT)
   - Number of email send attempts
   - Default: 0

5. **email_last_attempt_at** (TIMESTAMP NULL)
   - Timestamp of last email send attempt

6. **email_error** (TEXT NULL)
   - Last error message if email failed

7. **email_opened_at** (TIMESTAMP NULL)
   - When the recipient opened the email (if tracking enabled)

8. **converted_to_premium** (BOOLEAN)
   - Whether the user converted to premium service
   - Default: FALSE

9. **conversion_date** (TIMESTAMP NULL)
   - Date when user converted to premium

### New Indexes

- `idx_email_status` - For filtering by email status
- `idx_email_scheduled_at` - For finding emails due to be sent
- `idx_email_sent_at` - For tracking sent emails
- `idx_converted_to_premium` - For conversion tracking

## Prerequisites

1. **Database is running**
   ```bash
   # Check if MySQL/MariaDB is running
   # Linux/Mac:
   sudo systemctl status mysql
   # or
   sudo systemctl status mariadb
   
   # Windows:
   # Check Services for MySQL
   ```

2. **Environment variables configured**
   ```bash
   # Check your .env file has these variables:
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=skilltude_db
   DB_USER=your_user
   DB_PASSWORD=your_password
   ```

3. **Database exists**
   ```sql
   -- Create database if it doesn't exist
   CREATE DATABASE IF NOT EXISTS skilltude_db;
   ```

## Troubleshooting

### Error: "ECONNREFUSED"

**Problem**: Cannot connect to database

**Solution**:
1. Make sure MySQL/MariaDB is running
2. Check DB_HOST and DB_PORT in .env
3. Verify firewall settings

### Error: "ER_ACCESS_DENIED_ERROR"

**Problem**: Invalid database credentials

**Solution**:
1. Check DB_USER and DB_PASSWORD in .env
2. Verify user has permissions:
   ```sql
   GRANT ALL PRIVILEGES ON skilltude_db.* TO 'your_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Error: "ER_BAD_DB_ERROR"

**Problem**: Database doesn't exist

**Solution**:
```sql
CREATE DATABASE skilltude_db;
```

### Error: "Columns already exist"

**Problem**: Migration already applied

**Solution**:
- If you want to reapply, first run the rollback:
  ```bash
  npm run rollback:email-queue
  ```
- Then apply again:
  ```bash
  npm run migrate:email-queue
  ```

### Error: "ENOENT: no such file or directory"

**Problem**: Migration file not found

**Solution**:
1. Make sure you're in the project root directory
2. Verify the file exists:
   ```bash
   ls database_migrations/add_email_queue_fields.sql
   ```

## Verification

After running the migration, verify it was successful:

### Check Columns

```sql
DESCRIBE cv_submissions;
```

You should see the new email_* columns.

### Check Indexes

```sql
SHOW INDEX FROM cv_submissions;
```

You should see the new idx_email_* indexes.

### Check Data

```sql
-- Check email status distribution
SELECT email_status, COUNT(*) as count
FROM cv_submissions
GROUP BY email_status;

-- Should show all existing records with email_status = 'pending'
```

## Manual Migration (Alternative)

If the scripts don't work, you can apply the migration manually:

```bash
# Using MySQL command line
mysql -u your_user -p your_database < database_migrations/add_email_queue_fields.sql

# Or using MySQL Workbench
# 1. Open MySQL Workbench
# 2. Connect to your database
# 3. File → Open SQL Script
# 4. Select add_email_queue_fields.sql
# 5. Execute
```

## Next Steps

After successfully applying the migration:

1. **Set up the background job**
   - See `server/docs/TASK_15_QUICK_START.md`
   - Choose a scheduling method (PM2, cron, etc.)

2. **Test the system**
   - Submit a test CV
   - Verify email is queued
   - Run the background job
   - Check admin UI

3. **Monitor**
   - Use the Email Queue tab in admin dashboard
   - Check queue statistics
   - Review failed emails

## Support

For more information:
- [Task 15 Quick Start Guide](../server/docs/TASK_15_QUICK_START.md)
- [Email Queue Implementation](../server/docs/EMAIL_QUEUE_IMPLEMENTATION.md)
- [Email Status Tracking](../server/docs/EMAIL_STATUS_TRACKING.md)
