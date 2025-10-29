# End-to-End Tests

This directory contains end-to-end integration tests that verify complete user flows through the CV Analysis System.

## Test Files

### complete-user-flow.test.ts
**Task 19.1**: Tests the complete user flow from CV upload to email delivery.

**What it tests**:
1. User uploads CV from homepage
2. File is stored correctly on disk
3. Database record is created with all metadata
4. CV analysis is performed
5. Email is queued for delivery
6. Email is delivered to user

**Test scenarios**:
- Complete flow with comprehensive CV
- Multiple concurrent uploads
- Data integrity throughout the flow
- Error recovery and graceful degradation

## Running the Tests

### Run all end-to-end tests
```bash
cd server
npm test e2e/
```

### Run specific test file
```bash
cd server
npm test e2e/complete-user-flow.test.ts
```

### Run with coverage
```bash
cd server
npm run test:coverage -- e2e/
```

## Test Environment

### Mocked Services
The tests use mocked services to avoid external dependencies:
- **Database**: In-memory mock database
- **Email Service**: Tracks calls without sending emails
- **Email Queue**: Simulates queue processing
- **Rate Limiter**: Bypassed for faster tests

### Test Data
- Test files are created in `test-uploads/` directory
- Test data is cleared before each test
- All test files are cleaned up after tests complete

### Environment Variables
Tests use the `.env` file in the server directory. Ensure it's configured with test-appropriate values.

## Test Results

All tests should pass with output similar to:

```
✓ server/__tests__/e2e/complete-user-flow.test.ts (5 tests) 249ms
  ✓ End-to-End: Complete User Flow (5)
    ✓ Complete User Flow - From Upload to Email Delivery (3)
      ✓ should complete the entire flow: upload → store → analyze → queue → deliver
      ✓ should handle multiple concurrent uploads correctly
      ✓ should maintain data integrity throughout the entire flow
    ✓ Error Recovery in Complete Flow (2)
      ✓ should handle file storage errors gracefully
      ✓ should handle analysis errors gracefully

Test Files  1 passed (1)
     Tests  5 passed (5)
```

## Troubleshooting

### Text Extraction Warnings
You may see warnings about text extraction failures in the test output. This is expected because:
- Files are stored in `test-uploads/` directory
- Text extraction service looks in production directory
- System gracefully handles this with fallback analysis
- Tests verify the fallback behavior works correctly

### File Cleanup
If tests fail and leave files behind:
```bash
# Clean up test files manually
rm -rf test-uploads/
```

### Database Mock Issues
If you see database-related errors:
1. Check that `database.mock.ts` is being imported
2. Verify mock is clearing data between tests
3. Ensure no real database connections are being made

## Adding New E2E Tests

When adding new end-to-end tests:

1. Create test file in `server/__tests__/e2e/`
2. Import the database mock: `import '../mocks/database.mock'`
3. Mock external services (email, payment, etc.)
4. Use `TEST_UPLOAD_DIR` from `../setup` for file operations
5. Clean up test data in `afterEach` hooks
6. Document the test in this README

### Example Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import '../mocks/database.mock';
import { clearTestData } from '../mocks/database.mock';
import app from '../../index';

describe('My E2E Test', () => {
  beforeEach(() => {
    clearTestData();
  });

  afterEach(async () => {
    // Clean up test files
  });

  it('should complete the flow', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'test' })
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

## Related Documentation

- [Task 19.1 Summary](./TASK_19.1_SUMMARY.md) - Detailed test implementation
- [API Documentation](../../docs/API_DOCUMENTATION.md) - API endpoint details
- [Testing Guide](../README.md) - General testing guidelines
- [User Guide](../../docs/USER_GUIDE.md) - User flow documentation

## CI/CD Integration

These tests are designed to run in CI/CD pipelines:
- No external dependencies required
- Fast execution (< 5 seconds)
- Deterministic results
- Automatic cleanup

Add to your CI pipeline:
```yaml
- name: Run E2E Tests
  run: |
    cd server
    npm test e2e/
```
