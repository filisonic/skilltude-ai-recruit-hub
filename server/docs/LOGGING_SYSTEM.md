# Logging System Documentation

## Overview

The CV Analysis System uses Winston for comprehensive application logging. All logs are written to both the console and rotating log files, with specialized logging functions for different event types.

## Log Files

Logs are stored in the `/logs` directory with automatic rotation (5MB max size, 5 files retained):

- **error.log** - Error-level logs only
- **combined.log** - All log levels
- **cv-operations.log** - CV upload and analysis operations
- **security.log** - Security events (warnings and errors)

## Log Levels

- **error** (0) - Error conditions
- **warn** (1) - Warning conditions
- **info** (2) - Informational messages
- **http** (3) - HTTP request logs
- **debug** (4) - Debug messages

Set the log level via environment variable:
```bash
LOG_LEVEL=debug  # Options: error, warn, info, http, debug
```

## Specialized Logging Functions

### CV Upload Logging

```typescript
import { logCVUpload } from '../utils/logger';

logCVUpload({
  success: true,
  email: 'user@example.com',
  ip: '192.168.1.1',
  filename: 'cv-uuid.pdf',
  submissionId: 'uuid-123',
  processingTime: 1500, // milliseconds
  error: undefined, // Only if failed
});
```

**Logged Information:**
- Success/failure status
- User email
- IP address
- Filename
- Submission UUID
- Processing time
- Error message (if failed)

### CV Analysis Logging

```typescript
import { logCVAnalysis } from '../utils/logger';

logCVAnalysis({
  submissionId: 'uuid-123',
  score: 85,
  processingTime: 2000,
  success: true,
  error: undefined, // Only if failed
});
```

**Logged Information:**
- Submission UUID
- Analysis score
- Processing time
- Success/failure status
- Error message (if failed)

### Email Delivery Logging

```typescript
import { logEmailDelivery } from '../utils/logger';

logEmailDelivery({
  submissionId: 'uuid-123',
  email: 'user@example.com',
  success: true,
  attemptNumber: 1,
  error: undefined, // Only if failed
  scheduledAt: new Date(),
});
```

**Logged Information:**
- Submission UUID
- Recipient email
- Success/failure status
- Attempt number
- Error message (if failed)
- Scheduled delivery time

### Admin Action Logging

```typescript
import { logAdminAction } from '../utils/logger';

logAdminAction({
  adminId: '123',
  action: 'UPDATE_CV_SUBMISSION',
  submissionId: 'uuid-123',
  details: { status: 'reviewed' },
  ip: '192.168.1.1',
});
```

**Logged Information:**
- Admin user ID
- Action performed
- Submission UUID (if applicable)
- Additional details
- IP address

### Security Event Logging

```typescript
import { logSecurityEvent } from '../utils/logger';

logSecurityEvent({
  event: 'Rate limit exceeded',
  ip: '192.168.1.1',
  severity: 'medium', // low, medium, high, critical
  details: {
    path: '/api/cv/upload',
    method: 'POST',
  },
});
```

**Logged Information:**
- Event description
- IP address
- Severity level
- Additional details

### File Operation Logging

```typescript
import { logFileOperation } from '../utils/logger';

logFileOperation({
  operation: 'store', // store, retrieve, delete
  filename: 'cv-uuid.pdf',
  success: true,
  size: 1024000, // bytes
  error: undefined, // Only if failed
});
```

**Logged Information:**
- Operation type
- Filename
- Success/failure status
- File size (if applicable)
- Error message (if failed)

### Database Operation Logging

```typescript
import { logDatabaseOperation } from '../utils/logger';

logDatabaseOperation({
  operation: 'INSERT',
  table: 'cv_submissions',
  success: true,
  duration: 50, // milliseconds
  error: undefined, // Only if failed
});
```

**Logged Information:**
- Operation type
- Table name
- Success/failure status
- Query duration
- Error message (if failed)

## General Logger Usage

For custom logging needs, use the default logger:

```typescript
import logger from '../utils/logger';

logger.info('Custom message', {
  category: 'custom_category',
  additionalData: 'value',
});

logger.error('Error occurred', {
  error: errorObject,
  category: 'error_category',
});

logger.debug('Debug information', {
  data: debugData,
});
```

## Log Format

### Console Output (Development)
```
2024-12-25 10:30:45 [info]: CV Upload - Email: user@example.com, IP: 192.168.1.1, Success: true
```

### File Output (JSON)
```json
{
  "timestamp": "2024-12-25 10:30:45",
  "level": "info",
  "message": "CV Upload - Email: user@example.com, IP: 192.168.1.1, Success: true",
  "category": "cv_upload",
  "success": true,
  "email": "user@example.com",
  "ip": "192.168.1.1",
  "filename": "cv-uuid.pdf",
  "submissionId": "uuid-123",
  "processingTime": 1500
}
```

## Integration Points

### CV Upload Route
- Logs all upload attempts (success and failure)
- Logs file storage operations
- Logs text extraction operations
- Logs analysis results
- Logs email queueing

### Email Queue Service
- Logs email queueing
- Logs email processing
- Logs delivery attempts
- Logs retry scheduling
- Logs final success/failure

### Admin Routes
- Logs all admin actions
- Logs file downloads
- Logs status updates
- Logs conversion tracking

### Security Middleware
- Logs HTTPS redirects
- Logs CSRF violations
- Logs rate limit violations
- Logs authentication failures

### File Storage Service
- Logs file storage operations
- Logs file retrieval operations
- Logs file deletion operations

## Monitoring Best Practices

### 1. Regular Log Review
- Check error.log daily for issues
- Review security.log for suspicious activity
- Monitor cv-operations.log for performance issues

### 2. Log Rotation
- Logs automatically rotate at 5MB
- 5 historical files are retained
- Older logs are automatically deleted

### 3. Production Considerations
- Set LOG_LEVEL=info in production (not debug)
- Consider shipping logs to centralized logging service:
  - AWS CloudWatch Logs
  - Splunk
  - Datadog
  - ELK Stack (Elasticsearch, Logstash, Kibana)

### 4. Performance Impact
- Logging is asynchronous and non-blocking
- File writes are buffered
- Minimal performance impact on application

## Troubleshooting

### Logs Not Appearing
1. Check LOG_LEVEL environment variable
2. Verify /logs directory exists and is writable
3. Check disk space

### Log Files Too Large
1. Reduce LOG_LEVEL (e.g., from debug to info)
2. Adjust maxsize in logger.ts
3. Reduce maxFiles to retain fewer historical logs

### Missing Log Categories
1. Ensure proper import of logging functions
2. Check that category is specified in log calls
3. Verify log level is appropriate for the message

## Example: Complete Upload Flow Logging

```typescript
// 1. Upload attempt
logCVUpload({
  success: false,
  email: 'user@example.com',
  ip: '192.168.1.1',
  error: 'File too large',
});

// 2. File storage
logFileOperation({
  operation: 'store',
  filename: 'cv-uuid.pdf',
  success: true,
  size: 1024000,
});

// 3. Analysis
logCVAnalysis({
  submissionId: 'uuid-123',
  score: 85,
  processingTime: 2000,
  success: true,
});

// 4. Email queueing
logger.info('Email queued', {
  submissionId: 'uuid-123',
  scheduledAt: '2024-12-26T10:30:00Z',
  category: 'email_queue',
});

// 5. Final success
logCVUpload({
  success: true,
  email: 'user@example.com',
  ip: '192.168.1.1',
  filename: 'cv-uuid.pdf',
  submissionId: 'uuid-123',
  processingTime: 3500,
});
```

## Security Considerations

### PII in Logs
- Email addresses are logged for tracking
- IP addresses are logged for security
- CV content is NOT logged
- Phone numbers are NOT logged

### Log Access
- Restrict access to /logs directory
- Only authorized personnel should access logs
- Consider encrypting logs at rest in production

### Retention Policy
- Default: 5 files × 5MB = 25MB max per log type
- Adjust based on compliance requirements
- Consider archiving old logs to secure storage

## Future Enhancements

1. **Structured Logging**: Already implemented with JSON format
2. **Log Aggregation**: Ship to centralized service
3. **Real-time Alerts**: Trigger alerts on critical errors
4. **Log Analytics**: Query and visualize log data
5. **Audit Trail**: Separate audit log for compliance
