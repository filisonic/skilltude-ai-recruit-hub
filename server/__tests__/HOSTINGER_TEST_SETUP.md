# Setting Up Integration Tests on Hostinger

This guide explains how to configure your Hostinger database for running the CV upload integration tests.

## Step 1: Create Test Table in phpMyAdmin

1. **Log in to Hostinger Control Panel**
   - Go to your Hostinger dashboard
   - Navigate to **Databases** → **phpMyAdmin**

2. **Select Your Database**
   - Click on your database name (e.g., `u931066387_management`)

3. **Run the SQL Script**
   - Click on the **SQL** tab at the top
   - Copy and paste the contents of `database_migrations/create_test_database.sql`
   - Click **Go** to execute

This will create a `test_cv_submissions` table in your existing database.

## Step 2: Update Test Configuration

Update your `.env` file to use the test table:

```env
# Test Database Configuration
NODE_ENV=test
DB_HOST=your_hostinger_host
DB_NAME=u931066387_management
DB_USER=u931066387_management
DB_PASSWORD=your_password
DB_PORT=3306

# Test-specific settings
UPLOAD_DIR=./test-uploads
TEST_TABLE_PREFIX=test_
```

## Step 3: Modify Test File to Use Test Table

Update the test file to use the test table instead of the production table:

```typescript
// In server/__tests__/routes/cv.routes.test.ts
// Replace 'cv_submissions' with 'test_cv_submissions' in all queries
```

Or better yet, create a test-specific database configuration:

**Create `server/config/test.config.ts`:**

```typescript
export const testConfig = {
  tableName: 'test_cv_submissions', // Use test table
  uploadDir: './test-uploads',
};
```

## Step 4: Alternative - Mock the Database

If you prefer not to use a real database for tests, you can mock the database layer:

**Create `server/__tests__/mocks/database.mock.ts`:**

```typescript
import { vi } from 'vitest';

export const mockDatabase = {
  execute: vi.fn().mockResolvedValue([[], {}]),
  query: vi.fn().mockResolvedValue([[], {}]),
  getConnection: vi.fn().mockResolvedValue({
    execute: vi.fn().mockResolvedValue([{ insertId: 1 }, {}]),
    beginTransaction: vi.fn().mockResolvedValue(undefined),
    commit: vi.fn().mockResolvedValue(undefined),
    rollback: vi.fn().mockResolvedValue(undefined),
    release: vi.fn(),
  }),
};

// Mock the database module
vi.mock('../../utils/database', () => ({
  getPool: () => mockDatabase,
  transaction: async (callback: any) => {
    const conn = await mockDatabase.getConnection();
    return callback(conn);
  },
  closePool: vi.fn(),
}));
```

Then import this mock at the top of your test file:

```typescript
import './mocks/database.mock';
```

## Step 5: Run the Tests

```bash
# Run all integration tests
npm test -- server/__tests__/routes/cv.routes.test.ts

# Run with verbose output
npm test -- server/__tests__/routes/cv.routes.test.ts --reporter=verbose

# Run specific test suite
npm test -- server/__tests__/routes/cv.routes.test.ts -t "Validation Errors"
```

## Step 6: Clean Up Test Data

After running tests, clean up the test data:

```sql
-- In phpMyAdmin SQL tab
DELETE FROM test_cv_submissions WHERE email LIKE '%@example.com';

-- Or truncate the entire test table
TRUNCATE TABLE test_cv_submissions;
```

## Recommended Approach for Hostinger

Since Hostinger shared hosting has limitations, I recommend **Option 2: Mock the Database** for running tests locally. This way:

✅ Tests run fast without network latency
✅ No risk of affecting production data
✅ No database quota usage
✅ Tests can run offline

Only use the real database for:
- Final integration testing before deployment
- Testing actual database queries and transactions
- Verifying database schema compatibility

## Quick Setup Script

Here's a quick setup to get tests running with mocked database:

1. **Create the mock file** (see Step 4 above)

2. **Update test file** to import the mock:
   ```typescript
   // At the top of server/__tests__/routes/cv.routes.test.ts
   import './mocks/database.mock';
   ```

3. **Run tests**:
   ```bash
   npm test -- server/__tests__/routes/cv.routes.test.ts
   ```

## Troubleshooting

### Issue: "Access denied for user"
**Solution**: Check your database credentials in `.env` file

### Issue: "Table doesn't exist"
**Solution**: Run the SQL script in phpMyAdmin to create the test table

### Issue: "Too many connections"
**Solution**: Use database mocking instead of real database

### Issue: Tests are slow
**Solution**: Use database mocking for faster test execution

### Issue: "ENOENT: no such file or directory"
**Solution**: Ensure `UPLOAD_DIR=./test-uploads` is set in your `.env` file

## Summary

For **local development and CI/CD**, use **database mocking**.

For **final integration testing**, use the **test table** on Hostinger.

This approach gives you the best of both worlds: fast local testing and reliable integration verification.
