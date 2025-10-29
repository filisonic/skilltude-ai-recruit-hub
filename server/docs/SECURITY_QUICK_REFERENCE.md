# Security Quick Reference Guide

## Quick Links

- [Full Security Guide](./SECURITY.md)
- [HTTPS Setup](./HTTPS_SETUP.md)
- [Access Control](./ACCESS_CONTROL.md)
- [Implementation Summary](./TASK_14_SECURITY_IMPLEMENTATION_SUMMARY.md)

## Common Security Tasks

### Sanitize User Input

```typescript
import { sanitizeName, sanitizeEmail, sanitizePhone, sanitizeText } from '../utils/sanitization';

// Sanitize name fields
const firstName = sanitizeName(req.body.firstName);

// Sanitize email
const email = sanitizeEmail(req.body.email);

// Sanitize phone
const phone = sanitizePhone(req.body.phone);

// Sanitize general text
const notes = sanitizeText(req.body.notes);
```

### Validate File Upload

```typescript
// File type validation is automatic in FileStorageService
const filePath = await fileStorage.storeCV(fileBuffer, {
  originalFilename: file.originalname,
  mimeType: file.mimetype,
  size: file.size,
  uploadedBy: email,
  uploadedAt: new Date(),
});
```

### Protect Admin Endpoint

```typescript
import { authenticate, requireRole } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiter';

router.get('/admin/resource',
  authenticate,  // Require authentication
  requireRole('super_admin', 'admin'),  // Require specific roles
  adminLimiter,  // Rate limiting
  async (req, res) => {
    // Your code here
  }
);
```

### Log File Access

```typescript
import { logFileDownload } from '../utils/accessControl';

logFileDownload(req, {
  submissionId: 123,
  filename: 'cv.pdf',
  candidateName: 'John Doe',
  candidateEmail: 'john@example.com',
});
```

### Log Admin Action

```typescript
import { logAdminAction } from '../utils/accessControl';

logAdminAction(
  req,
  'UPDATE_STATUS',
  'cv_submission',
  submissionId,
  { newStatus: 'reviewed' }
);
```

### Set Secure Cookie

```typescript
import { getSecureCookieOptions } from '../middleware/auth';

res.cookie('token', jwtToken, getSecureCookieOptions());
```

### Use Parameterized Query

```typescript
import { query } from '../utils/database';

// CORRECT - Parameterized query
const results = await query(
  'SELECT * FROM cv_submissions WHERE email = ?',
  [email]
);

// WRONG - Never do this!
// const results = await query(`SELECT * FROM cv_submissions WHERE email = '${email}'`);
```

## Security Checklist for New Features

- [ ] All user inputs sanitized
- [ ] Database queries use parameters
- [ ] File uploads validated
- [ ] Admin endpoints protected
- [ ] Access logged
- [ ] Rate limiting applied
- [ ] Error messages don't expose sensitive data
- [ ] HTTPS enforced in production
- [ ] Security headers set
- [ ] Tests written

## Common Vulnerabilities to Avoid

### ❌ SQL Injection
```typescript
// WRONG
const query = `SELECT * FROM users WHERE email = '${email}'`;

// RIGHT
const results = await query('SELECT * FROM users WHERE email = ?', [email]);
```

### ❌ XSS (Cross-Site Scripting)
```typescript
// WRONG
const name = req.body.name;  // Unsanitized

// RIGHT
const name = sanitizeName(req.body.name);
```

### ❌ Path Traversal
```typescript
// WRONG
const filePath = path.join(uploadDir, req.params.filename);

// RIGHT
const filePath = path.join(uploadDir, sanitizePath(req.params.filename));
```

### ❌ Insecure File Upload
```typescript
// WRONG
if (file.mimetype === 'application/pdf') { /* allow */ }

// RIGHT
// Use FileStorageService which validates magic numbers
await fileStorage.storeCV(fileBuffer, metadata);
```

### ❌ Missing Authentication
```typescript
// WRONG
router.get('/admin/data', async (req, res) => { /* ... */ });

// RIGHT
router.get('/admin/data', authenticate, requireRole('admin'), async (req, res) => { /* ... */ });
```

## Environment Variables

### Required for Production

```bash
# Security
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
FORCE_HTTPS=true

# HTTPS
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem

# CORS
FRONTEND_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5
```

## Testing Security

### Manual Tests

```bash
# Test XSS
curl -X POST http://localhost:3001/api/cv/upload \
  -F "firstName=<script>alert('XSS')</script>" \
  -F "email=test@example.com"

# Test SQL Injection
curl -X GET "http://localhost:3001/api/admin/cv-submissions?search=' OR '1'='1"

# Test file upload
curl -X POST http://localhost:3001/api/cv/upload \
  -F "file=@malicious.exe" \
  -F "firstName=Test"
```

### Automated Tests

```bash
# Run security tests
npm run test:security

# Check dependencies
npm audit

# Fix vulnerabilities
npm audit fix
```

## Emergency Response

### If Security Breach Detected

1. **Immediate Actions**
   ```bash
   # Revoke all JWT tokens
   # Change JWT_SECRET in .env
   # Restart server
   pm2 restart server
   ```

2. **Investigation**
   ```bash
   # Check access logs
   tail -f /var/log/skilltude/access.log
   
   # Check error logs
   tail -f /var/log/skilltude/error.log
   ```

3. **Contact**
   - Security Team: security@skilltude.com
   - On-Call: +1-XXX-XXX-XXXX

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)

## Support

For security questions: security@skilltude.com
