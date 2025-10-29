# Security Implementation Guide

## Overview

This document outlines the security measures implemented in the CV Analysis & Upload System to protect against common web vulnerabilities including XSS, SQL Injection, CSRF, and file upload attacks.

## Security Measures

### 1. Input Sanitization (XSS Prevention)

#### Implementation

All user inputs are sanitized using dedicated sanitization functions in `server/utils/sanitization.ts`:

- **sanitizeName()**: For first/last names - allows only letters, spaces, hyphens, apostrophes
- **sanitizeEmail()**: For email addresses - removes dangerous characters while preserving valid email format
- **sanitizePhone()**: For phone numbers - allows only digits, spaces, hyphens, parentheses, plus sign
- **sanitizeNotes()**: For admin notes - removes XSS vectors while allowing longer text
- **sanitizeSearchQuery()**: For search terms - prevents SQL injection and XSS in search

#### Usage Example

```typescript
import { sanitizeName, sanitizeEmail, sanitizePhone } from '../utils/sanitization';

const firstName = sanitizeName(req.body.firstName);
const email = sanitizeEmail(req.body.email);
const phone = sanitizePhone(req.body.phone);
```

#### Middleware

The `sanitizeBody` middleware in `server/middleware/security.ts` automatically sanitizes all request body data:

```typescript
app.use(sanitizeBody);
```

This middleware:
- Recursively sanitizes all string values in request body
- Removes script tags, iframe tags, object/embed tags
- Removes javascript: and vbscript: protocols
- Removes event handlers (onclick, onload, etc.)
- Removes dangerous style attributes

### 2. SQL Injection Prevention

#### Parameterized Queries

All database queries use parameterized queries (prepared statements) via the `query()` function in `server/utils/database.ts`:

```typescript
// CORRECT - Uses parameterized query
const results = await query(
  'SELECT * FROM cv_submissions WHERE email = ?',
  [email]
);

// WRONG - Never concatenate user input into SQL
// const results = await query(`SELECT * FROM cv_submissions WHERE email = '${email}'`);
```

#### Transaction Support

Database transactions are used for operations that require atomicity:

```typescript
await transaction(async (connection: PoolConnection) => {
  await connection.execute('INSERT INTO cv_submissions ...', [values]);
  await connection.execute('UPDATE statistics ...', [values]);
});
```

If any operation fails, the entire transaction is rolled back automatically.

#### Search Query Sanitization

Search queries are sanitized before being used in LIKE clauses:

```typescript
import { sanitizeSearchQuery } from '../utils/sanitization';

const sanitizedSearch = sanitizeSearchQuery(queryParams.search);
const searchPattern = `%${sanitizedSearch}%`;
```

### 3. File Upload Security

#### File Type Validation

Files are validated using **magic numbers** (file signatures), not just file extensions:

```typescript
// In FileStorageService.ts
const FILE_SIGNATURES = {
  PDF: [0x25, 0x50, 0x44, 0x46], // %PDF
  DOC: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // DOC (OLE2)
  DOCX: [0x50, 0x4B, 0x03, 0x04], // DOCX (ZIP format)
};
```

The `validateFileType()` method checks:
1. MIME type is in allowed list
2. File content matches expected magic numbers

#### File Size Limits

- Maximum file size: 10MB (configurable via `MAX_FILE_SIZE` env var)
- Enforced at multiple layers:
  - Multer middleware
  - FileStorageService validation
  - Client-side validation

#### Secure File Storage

Files are stored with security measures:

1. **Unique Filenames**: UUID-based filenames prevent collisions and guessing
   ```typescript
   const filename = `${uuid}-${sanitizedBaseName}${ext}`;
   ```

2. **Directory Structure**: Year/month organization
   ```
   /uploads/cvs/2024/12/uuid-filename.pdf
   ```

3. **Path Sanitization**: Prevents directory traversal attacks
   ```typescript
   private sanitizePath(filePath: string): string {
     return path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
   }
   ```

4. **Non-Public Storage**: Files stored outside web root, accessible only via authenticated API

### 4. CSRF Protection

#### Implementation

CSRF protection is implemented in `server/middleware/security.ts`:

```typescript
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Verify request origin
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const csrfToken = req.headers['x-requested-with'];
  
  // Check against allowed origins
  const allowedOrigins = [process.env.FRONTEND_URL, ...];
  
  if (!isValidOrigin && !isValidReferer && !isXHR) {
    throw new CVUploadException(ErrorCodes.UNAUTHORIZED, 'Invalid request origin', 403);
  }
}
```

#### Frontend Integration

Frontend should include:
```typescript
headers: {
  'X-Requested-With': 'XMLHttpRequest'
}
```

### 5. Rate Limiting

#### Upload Rate Limiting

CV uploads are rate-limited to prevent abuse:

```typescript
// 5 uploads per hour per IP
export const cvUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many CV uploads from this IP, please try again later',
});
```

#### Admin Rate Limiting

Admin endpoints have separate rate limiting:

```typescript
// 100 requests per 15 minutes
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

### 6. Security Headers

#### Helmet.js

Security headers are set using Helmet.js:

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

#### Additional Headers

Custom security headers in `server/middleware/security.ts`:

- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
- **X-XSS-Protection**: 1; mode=block (enables XSS filter)
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Content-Security-Policy**: Restricts resource loading

### 7. Authentication & Authorization

#### JWT Authentication

Admin endpoints require JWT authentication:

```typescript
router.get('/cv-submissions',
  authenticate,  // Verify JWT token
  requireRole('super_admin', 'admin', 'hr_manager'),  // Check role
  ...
);
```

#### File Download Access Control

File downloads require:
1. Authentication (valid JWT token)
2. Admin role authorization
3. File access logging

```typescript
// Log file access
console.log(`[FILE ACCESS] User ${req.user!.username} downloaded CV ${submissionId}`);
```

### 8. HTTPS Enforcement

#### Configuration

HTTPS should be enforced in production:

```typescript
// In production, redirect HTTP to HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

#### Secure Cookies

Set secure cookie flags:

```typescript
res.cookie('token', jwt, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
```

### 9. Error Handling

#### Secure Error Messages

Error messages don't expose sensitive information:

```typescript
// CORRECT - Generic error message
throw new CVUploadException(
  ErrorCodes.DATABASE_ERROR,
  'Database error occurred',
  500
);

// WRONG - Exposes database structure
// throw new Error(`Failed to insert into cv_submissions table: ${dbError}`);
```

#### Error Logging

Detailed errors are logged server-side only:

```typescript
export function logError(error: any, context: any): void {
  console.error('Error occurred:', JSON.stringify({
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    ...context,
  }, null, 2));
  
  // In production, send to logging service (Sentry, CloudWatch, etc.)
}
```

### 10. Security Logging

#### Events Logged

- All CV uploads (success and failure)
- File access attempts
- Admin actions (status updates, file downloads)
- Security events (rate limit hits, CSRF violations)
- Authentication failures

#### Log Format

```typescript
console.log(`[SECURITY] ${timestamp} - ${event}`, {
  ip: req.socket.remoteAddress,
  userAgent: req.headers['user-agent'],
  path: req.path,
  method: req.method,
  ...details,
});
```

## Security Checklist

### Deployment Checklist

- [ ] Set strong `JWT_SECRET` in environment variables
- [ ] Enable HTTPS and set `secure: true` for cookies
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting for all public endpoints
- [ ] Enable security headers (Helmet.js)
- [ ] Configure file upload directory with proper permissions
- [ ] Set up security monitoring and alerting
- [ ] Enable database connection encryption
- [ ] Configure firewall rules
- [ ] Set up regular security audits

### Code Review Checklist

- [ ] All database queries use parameterized queries
- [ ] All user inputs are sanitized
- [ ] File uploads validate magic numbers
- [ ] Admin endpoints require authentication
- [ ] Error messages don't expose sensitive data
- [ ] Security events are logged
- [ ] Rate limiting is applied
- [ ] CSRF protection is enabled
- [ ] File paths are sanitized
- [ ] Sensitive data is not logged

## Testing Security

### Manual Testing

1. **XSS Testing**: Try submitting `<script>alert('XSS')</script>` in form fields
2. **SQL Injection**: Try `' OR '1'='1` in search fields
3. **File Upload**: Try uploading files with wrong extensions
4. **Directory Traversal**: Try accessing `../../etc/passwd`
5. **Rate Limiting**: Make multiple rapid requests
6. **CSRF**: Try requests without proper headers

### Automated Testing

Run security tests:

```bash
npm run test:security
```

## Incident Response

### If Security Breach Detected

1. **Immediate Actions**:
   - Isolate affected systems
   - Revoke compromised credentials
   - Enable additional logging

2. **Investigation**:
   - Review security logs
   - Identify attack vector
   - Assess data exposure

3. **Remediation**:
   - Patch vulnerabilities
   - Update security measures
   - Notify affected users (if required)

4. **Post-Incident**:
   - Document incident
   - Update security procedures
   - Conduct security training

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## Contact

For security concerns, contact: security@skilltude.com
