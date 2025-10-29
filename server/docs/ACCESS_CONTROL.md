# Access Control Documentation

## Overview

This document describes the access control mechanisms implemented in the CV Analysis & Upload System to protect sensitive resources and maintain security audit trails.

## Access Control Layers

### 1. Authentication

All admin endpoints require JWT authentication:

```typescript
router.get('/cv-submissions/:id/download',
  authenticate,  // Verify JWT token
  ...
);
```

**Authentication Process:**
1. Client sends JWT token in `Authorization: Bearer <token>` header
2. Server verifies token signature and expiration
3. Server loads user data from database
4. User object attached to `req.user`

### 2. Authorization (Role-Based Access Control)

After authentication, role-based permissions are checked:

```typescript
router.get('/cv-submissions/:id/download',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),  // Check role
  ...
);
```

**Role Hierarchy:**
- **super_admin**: Full system access
- **admin**: Administrative access to CV management
- **hr_manager**: Read/write access to CV submissions
- **hr_staff**: Read-only access to CV submissions
- **user**: No admin access

### 3. Resource-Level Access Control

Additional checks for specific resources:

```typescript
const accessValidation = validateFileAccess(req);
if (!accessValidation.allowed) {
  throw new CVUploadException(
    ErrorCodes.UNAUTHORIZED,
    'Access denied: ' + accessValidation.reason,
    403
  );
}
```

## File Download Access Control

### Implementation

File downloads require:

1. **Authentication**: Valid JWT token
2. **Authorization**: Admin role (super_admin, admin, or hr_manager)
3. **File Existence**: File must exist in database and filesystem
4. **Access Logging**: All access attempts are logged

### Code Example

```typescript
// In admin-cv.routes.ts
router.get('/cv-submissions/:id/download',
  authenticate,
  requireRole('super_admin', 'admin', 'hr_manager'),
  adminLimiter,
  async (req, res, next) => {
    // Validate file access permissions
    const accessValidation = validateFileAccess(req);
    if (!accessValidation.allowed) {
      logFileDownload(req, fileInfo, false, accessValidation.reason);
      throw new CVUploadException(ErrorCodes.UNAUTHORIZED, 'Access denied', 403);
    }
    
    // Log successful access
    logFileDownload(req, fileInfo);
    
    // Stream file to response
    res.send(fileBuffer);
  }
);
```

### Access Validation

The `validateFileAccess()` function checks:

```typescript
export function validateFileAccess(
  req: Request,
  fileOwnerId?: number,
  requiredRoles: string[] = ['super_admin', 'admin', 'hr_manager']
): FileAccessValidation {
  // Check authentication
  if (!req.user) {
    return { allowed: false, reason: 'User not authenticated' };
  }
  
  // Check role permissions
  if (!hasPermission(req.user.role, requiredRoles)) {
    return { allowed: false, reason: 'Insufficient permissions' };
  }
  
  // Check ownership or admin access
  if (fileOwnerId !== undefined) {
    if (!canAccessResource(req.user.id, fileOwnerId, req.user.role)) {
      return { allowed: false, reason: 'Not file owner or admin' };
    }
  }
  
  return { allowed: true };
}
```

## Access Logging

### Log Types

1. **FILE_DOWNLOAD**: CV file downloads
2. **FILE_VIEW**: Viewing file metadata
3. **DATA_EXPORT**: Exporting data
4. **ADMIN_ACTION**: Administrative actions (status updates, etc.)
5. **SENSITIVE_DATA_ACCESS**: Access to PII or sensitive information

### Log Format

```typescript
interface AccessLogEntry {
  event: AccessEventType;
  userId: number;
  username: string;
  userRole: string;
  resourceType: string;
  resourceId: string | number;
  resourceDetails?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  failureReason?: string;
}
```

### Example Log Entry

```json
{
  "event": "FILE_DOWNLOAD",
  "userId": 123,
  "username": "admin@skilltude.com",
  "userRole": "admin",
  "resourceType": "cv_file",
  "resourceId": 456,
  "resourceDetails": {
    "filename": "uuid-john-doe-cv.pdf",
    "candidateName": "John Doe",
    "candidateEmail": "john@example.com"
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-12-25T10:30:00.000Z",
  "success": true
}
```

### Logging Functions

#### Log File Download

```typescript
import { logFileDownload } from '../utils/accessControl';

logFileDownload(req, {
  submissionId: 123,
  filename: 'cv.pdf',
  candidateName: 'John Doe',
  candidateEmail: 'john@example.com',
});
```

#### Log Admin Action

```typescript
import { logAdminAction } from '../utils/accessControl';

logAdminAction(
  req,
  'UPDATE_CV_SUBMISSION',
  'cv_submission',
  submissionId,
  {
    updates: { status: 'reviewed' },
    previousStatus: 'new',
  }
);
```

#### Log Sensitive Data Access

```typescript
import { logSensitiveDataAccess } from '../utils/accessControl';

logSensitiveDataAccess(
  req,
  'personal_information',
  userId,
  { fields: ['email', 'phone', 'address'] }
);
```

## Rate Limiting for Sensitive Operations

### Implementation

```typescript
import { checkAccessRateLimit } from '../utils/accessControl';

const rateLimit = checkAccessRateLimit(
  req.user.id,
  'file_download',
  10,  // max 10 downloads
  60000  // per minute
);

if (!rateLimit.allowed) {
  throw new CVUploadException(
    ErrorCodes.RATE_LIMIT_EXCEEDED,
    `Rate limit exceeded. Try again after ${rateLimit.resetTime}`,
    429
  );
}
```

### Default Limits

- **File Downloads**: 10 per minute per user
- **Data Exports**: 5 per hour per user
- **Admin Actions**: 100 per 15 minutes per user

## Audit Trail

### Viewing Access Logs

Access logs can be queried for audit purposes:

```typescript
import { generateAccessReport } from '../utils/accessControl';

const report = generateAccessReport(
  userId,
  new Date('2024-01-01'),
  new Date('2024-12-31')
);

console.log(report);
// {
//   userId: 123,
//   username: 'admin@skilltude.com',
//   totalAccesses: 150,
//   fileDownloads: 45,
//   adminActions: 80,
//   sensitiveDataAccesses: 25,
//   period: { start: ..., end: ... }
// }
```

### Log Retention

**Development:**
- Logs stored in console output
- No long-term retention

**Production:**
- Logs sent to security monitoring service
- Retention: 90 days minimum (compliance requirement)
- Archive: 7 years for audit purposes

### Log Storage Options

1. **AWS CloudWatch Logs**
   ```typescript
   import AWS from 'aws-sdk';
   const cloudwatch = new AWS.CloudWatchLogs();
   
   await cloudwatch.putLogEvents({
     logGroupName: '/skilltude/access-logs',
     logStreamName: 'file-downloads',
     logEvents: [{ message: JSON.stringify(logEntry), timestamp: Date.now() }],
   }).promise();
   ```

2. **Splunk**
   ```typescript
   import SplunkLogger from 'splunk-logging';
   const logger = new SplunkLogger({ token: process.env.SPLUNK_TOKEN });
   
   logger.send({ message: logEntry });
   ```

3. **ELK Stack (Elasticsearch, Logstash, Kibana)**
   ```typescript
   import { Client } from '@elastic/elasticsearch';
   const client = new Client({ node: process.env.ELASTICSEARCH_URL });
   
   await client.index({
     index: 'access-logs',
     body: logEntry,
   });
   ```

## Security Best Practices

### 1. Principle of Least Privilege

Grant minimum necessary permissions:

```typescript
// GOOD: Specific roles for specific actions
requireRole('super_admin', 'admin')  // Only admins can delete

// BAD: Too permissive
requireRole('super_admin', 'admin', 'hr_manager', 'hr_staff', 'user')
```

### 2. Defense in Depth

Multiple layers of security:

1. Network firewall
2. HTTPS encryption
3. Authentication (JWT)
4. Authorization (RBAC)
5. Resource-level access control
6. Rate limiting
7. Audit logging

### 3. Fail Securely

Default to denying access:

```typescript
// GOOD: Explicit allow, default deny
if (!hasPermission(user.role, requiredRoles)) {
  throw new Error('Access denied');
}

// BAD: Implicit allow
if (hasPermission(user.role, requiredRoles)) {
  // allow access
}
// No else clause - might allow by default
```

### 4. Log Everything

Log all access attempts (success and failure):

```typescript
try {
  // Attempt access
  const file = await downloadFile(fileId);
  logFileDownload(req, fileInfo, true);
  return file;
} catch (error) {
  logFileDownload(req, fileInfo, false, error.message);
  throw error;
}
```

### 5. Regular Audits

Review access logs regularly:

- Daily: Check for unusual patterns
- Weekly: Review failed access attempts
- Monthly: Generate access reports per user
- Quarterly: Full security audit

## Compliance

### GDPR Requirements

1. **Right to Access**: Users can request access logs
2. **Right to Erasure**: Delete user data and access logs
3. **Data Minimization**: Log only necessary information
4. **Purpose Limitation**: Use logs only for security/audit

### Implementation

```typescript
// Get user's access logs (GDPR Right to Access)
router.get('/api/user/access-logs',
  authenticate,
  async (req, res) => {
    const logs = await getAccessLogsForUser(req.user.id);
    res.json(logs);
  }
);

// Delete user's data (GDPR Right to Erasure)
router.delete('/api/user/data',
  authenticate,
  async (req, res) => {
    await deleteUserData(req.user.id);
    await deleteAccessLogs(req.user.id);
    res.json({ success: true });
  }
);
```

## Monitoring and Alerts

### Alert Triggers

Set up alerts for:

1. **Multiple Failed Access Attempts**
   - Threshold: 5 failures in 5 minutes
   - Action: Lock account, notify security team

2. **Unusual Access Patterns**
   - Access from new location
   - Access outside business hours
   - Bulk file downloads

3. **Privilege Escalation Attempts**
   - User trying to access admin resources
   - Role modification attempts

4. **Data Exfiltration Indicators**
   - Large number of file downloads
   - Rapid sequential access
   - Access to many different records

### Example Alert Configuration

```typescript
// Monitor for suspicious activity
function checkSuspiciousActivity(userId: number): boolean {
  const recentLogs = getRecentAccessLogs(userId, 5 * 60 * 1000); // 5 minutes
  
  // Check for rapid file downloads
  const downloads = recentLogs.filter(log => log.event === 'FILE_DOWNLOAD');
  if (downloads.length > 20) {
    alertSecurityTeam({
      type: 'SUSPICIOUS_ACTIVITY',
      userId,
      reason: 'Rapid file downloads detected',
      count: downloads.length,
    });
    return true;
  }
  
  // Check for failed access attempts
  const failures = recentLogs.filter(log => !log.success);
  if (failures.length > 5) {
    alertSecurityTeam({
      type: 'MULTIPLE_FAILURES',
      userId,
      reason: 'Multiple failed access attempts',
      count: failures.length,
    });
    return true;
  }
  
  return false;
}
```

## Testing Access Control

### Unit Tests

```typescript
describe('Access Control', () => {
  it('should deny access without authentication', async () => {
    const req = { user: null };
    const validation = validateFileAccess(req);
    expect(validation.allowed).toBe(false);
  });
  
  it('should deny access with insufficient role', async () => {
    const req = { user: { id: 1, role: 'user' } };
    const validation = validateFileAccess(req, undefined, ['admin']);
    expect(validation.allowed).toBe(false);
  });
  
  it('should allow access with correct role', async () => {
    const req = { user: { id: 1, role: 'admin' } };
    const validation = validateFileAccess(req, undefined, ['admin']);
    expect(validation.allowed).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('File Download Access Control', () => {
  it('should require authentication', async () => {
    const response = await request(app)
      .get('/api/admin/cv-submissions/1/download');
    
    expect(response.status).toBe(401);
  });
  
  it('should require admin role', async () => {
    const token = generateToken({ userId: 1, role: 'user' });
    const response = await request(app)
      .get('/api/admin/cv-submissions/1/download')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(403);
  });
  
  it('should log successful download', async () => {
    const token = generateToken({ userId: 1, role: 'admin' });
    const response = await request(app)
      .get('/api/admin/cv-submissions/1/download')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    // Verify log entry was created
    const logs = await getAccessLogs();
    expect(logs).toContainEqual(expect.objectContaining({
      event: 'FILE_DOWNLOAD',
      userId: 1,
      success: true,
    }));
  });
});
```

## Troubleshooting

### Common Issues

#### 1. Access Denied Despite Correct Role

**Symptoms:** User has correct role but still gets 403 error

**Possible Causes:**
- JWT token expired
- User account deactivated
- Role changed but token not refreshed

**Solution:**
```typescript
// Check token expiration
const decoded = jwt.decode(token);
console.log('Token expires:', new Date(decoded.exp * 1000));

// Verify user status in database
const user = await query('SELECT * FROM admin_users WHERE id = ?', [userId]);
console.log('User status:', user.status);
```

#### 2. Logs Not Appearing

**Symptoms:** Access logs not being recorded

**Possible Causes:**
- Logging function not called
- Error in logging code
- Log destination unavailable

**Solution:**
```typescript
// Add try-catch around logging
try {
  logFileDownload(req, fileInfo);
} catch (error) {
  console.error('Failed to log access:', error);
  // Don't fail the request due to logging error
}
```

#### 3. Rate Limit False Positives

**Symptoms:** Legitimate users hitting rate limits

**Possible Causes:**
- Limits too restrictive
- Multiple users behind same IP (NAT)
- Automated testing

**Solution:**
```typescript
// Adjust rate limits
const rateLimit = checkAccessRateLimit(
  req.user.id,
  'file_download',
  50,  // Increase limit
  60000
);

// Or use user-based instead of IP-based limiting
```

## Resources

- [OWASP Access Control Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)
- [NIST Access Control Guidelines](https://csrc.nist.gov/publications/detail/sp/800-162/final)
- [GDPR Compliance Guide](https://gdpr.eu/)

## Support

For access control questions, contact: security@skilltude.com
