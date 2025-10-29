# Database Migrations - CV Analysis System

This directory contains database migration scripts for the CV Analysis System feature.

## Files

- `add_cv_analysis_columns.sql` - SQL migration to add analysis-related columns
- `rollback_cv_analysis_columns.sql` - SQL rollback script to remove the columns
- `apply_migration.js` - Node.js script to apply the migration
- `rollback_migration.js` - Node.js script to rollback the migration

## Prerequisites

1. **Database Setup**: Ensure your MySQL/MariaDB database is running and accessible
2. **Environment Variables**: Configure your `.env` file with database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=skilltude_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   ```
3. **Dependencies**: Install required npm packages:
   ```bash
   npm install mysql2 dotenv
   ```

## Migration Details

### Columns Added

The migration adds the following columns to the `cv_submissions` table:

| Column Name | Type | Description |
|------------|------|-------------|
| `analysis_score` | INT | Overall CV quality score (0-100) |
| `analysis_results` | JSON | Detailed analysis results including strengths, improvements, and ATS compatibility |
| `email_sent_at` | TIMESTAMP | Timestamp when analysis email was sent to user |
| `email_opened_at` | TIMESTAMP | Timestamp when user opened the analysis email |
| `converted_to_premium` | BOOLEAN | Whether the user converted to premium CV service |
| `conversion_date` | TIMESTAMP | Date when user converted to premium service |

### Indexes Created

The migration also creates the following indexes for performance optimization:

- `idx_analysis_score` - Index on analysis_score column
- `idx_email_sent_at` - Index on email_sent_at column
- `idx_converted_to_premium` - Index on converted_to_premium column
- `idx_conversion_date` - Index on conversion_date column
- `idx_conversion_tracking` - Composite index on (converted_to_premium, conversion_date)

## Usage

### Apply Migration

To apply the migration to your database:

```bash
node database_migrations/apply_migration.js
```

The script will:
1. Connect to your database using credentials from `.env`
2. Check if the migration has already been applied
3. Apply the migration if needed
4. Verify that all columns and indexes were created successfully

### Rollback Migration

To rollback the migration (remove the columns):

```bash
node database_migrations/rollback_migration.js
```

The script will:
1. Connect to your database
2. Check if the migration columns exist
3. Remove all columns and indexes
4. Verify the rollback was successful

### Manual Application

If you prefer to apply the migration manually using a MySQL client:

```bash
# Apply migration
mysql -u your_user -p your_database < database_migrations/add_cv_analysis_columns.sql

# Rollback migration
mysql -u your_user -p your_database < database_migrations/rollback_cv_analysis_columns.sql
```

## Testing

After applying the migration, you can verify the changes:

```sql
-- Check new columns
DESCRIBE cv_submissions;

-- Check new indexes
SHOW INDEX FROM cv_submissions;

-- Verify specific columns exist
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'skilltude_db' 
AND TABLE_NAME = 'cv_submissions' 
AND COLUMN_NAME IN ('analysis_score', 'analysis_results', 'email_sent_at', 'email_opened_at', 'converted_to_premium', 'conversion_date');
```

## Troubleshooting

### Connection Refused
- Ensure your database server is running
- Check that the host and port in `.env` are correct

### Access Denied
- Verify your database credentials in `.env`
- Ensure the user has ALTER and CREATE INDEX privileges

### Database Not Found
- Check that `DB_NAME` in `.env` matches your database name
- Create the database if it doesn't exist

### Migration Already Applied
- The script will detect if columns already exist
- Run the rollback script first if you need to reapply

### Columns Still Exist After Rollback
- Check for any foreign key constraints
- Manually verify and remove columns if needed

## Requirements Mapping

This migration satisfies the following requirements from the CV Analysis System spec:

- **Requirement 3.2**: Database record creation with analysis metadata
- **Requirement 3.3**: Tracking of submission status and analysis results
- **Requirement 7.3**: Conversion tracking for premium service inquiries

## Next Steps

After successfully applying this migration:

1. ✅ Database schema is ready for CV analysis data
2. ⏭️ Proceed to implement the file storage service (Task 3)
3. ⏭️ Implement the text extraction service (Task 4)
4. ⏭️ Implement the CV analysis engine (Task 5)

## Notes

- The migration is idempotent - it checks if columns exist before adding them
- All columns are nullable or have default values to maintain compatibility with existing records
- JSON column is used for `analysis_results` to store complex structured data
- Indexes are added to optimize common queries (filtering by score, conversion status, etc.)
