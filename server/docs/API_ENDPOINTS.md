# CV Analysis System - API Endpoints

## Overview

This document describes the backend API endpoints for the CV Analysis & Upload System.

## Endpoints

### POST /api/cv/upload

Upload a CV file and user information for automated analysis.

#### Security Features

- **Rate Limiting**: 5 uploads per hour per IP address
- **CSRF Protection**: Validates request origin
- **XSS Prevention**: Sanitizes all user inputs
- **File Validation**: Checks file type using magic numbers (not just extensions)
- **Size Limits**: Maximum 10MB file size

#### Request

**Content-Type**: `multipart/form-data`

**Fields**:
- `file` (File, required): CV file (PDF, DOC, or DOCX)
- `firstName` (string, required): User's first name (2-100 characters)
- `lastName` (string, required): User's last name (2-100 characters)
- `email` (string, required): Valid email address
- `phone` (string, required): Phone number
- `consentGiven` (boolean, required): Must be `true`

**Headers**:
- `X-Requested-With`: Should be set to `XMLHttpRequest` for CSRF protection
- `Origin` or `Referer`: Must match allowed frontend URLs

#### Response

**Success (200 OK)**:
```json
{
  "success": true,
  "message": "CV uploaded successfully. You will receive your analysis via email within 24-48 hours.",
  "submissionId": "uuid-string"
}
```

**Validation Error (400 Bad Request)**:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Rate Limit Exceeded (429 Too Many Requests)**:
```json
{
  "success": false,
  "error": "Too many CV uploads from this IP address. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

**Server Error (500 Internal Server Error)**:
```json
{
  "success": false,
  "error": "An unexpected error occurred",
  "code": "INTERNAL_ERROR"
}
```

#### Processing Flow

1. **Validation**: Validates all input fields and file
2. **File Signature Check**: Verifies file type using magic numbers
3. **File Storage**: Stores file with UUID-based filename in year/month directory structure
4. **Text Extraction**: Extracts text from PDF/DOC/DOCX file
5. **CV Analysis**: Analyzes CV content and generates score and recommendations
6. **Database Record**: Creates submission record with all metadata
7. **Email Queue**: Queues email for delivery (sent asynchronously)
8. **Response**: Returns success response with submission ID

#### Error Handling

All operations are wrapped in a transaction. If any step fails:
- Database changes are rolled back
- Stored files are deleted
- Appropriate error response is returned
- Error is logged with context for debugging

#### Security Logging

All upload attempts are logged with:
- IP address
- User agent
- Email address
- Success/failure status
- Error message (if failed)

## Error Codes

| Code | Description |
|------|-------------|
| `FILE_UPLOAD_FAILED` | Failed to store file on server |
| `TEXT_EXTRACTION_FAILED` | Failed to extract text from CV |
| `ANALYSIS_FAILED` | Failed to analyze CV content |
| `DATABASE_ERROR` | Database operation failed |
| `EMAIL_SEND_FAILED` | Failed to send email |
| `INVALID_FILE_TYPE` | File type not allowed or signature mismatch |
| `FILE_TOO_LARGE` | File exceeds 10MB limit |
| `VALIDATION_ERROR` | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests from IP |
| `UNAUTHORIZED` | Invalid request origin (CSRF) |

## Testing

### Using cURL

```bash
curl -X POST http://localhost:3001/api/cv/upload \
  -H "X-Requested-With: XMLHttpRequest" \
  -F "file=@/path/to/cv.pdf" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john.doe@example.com" \
  -F "phone=+1234567890" \
  -F "consentGiven=true"
```

### Using Postman

1. Set method to POST
2. URL: `http://localhost:3001/api/cv/upload`
3. Headers:
   - `X-Requested-With`: `XMLHttpRequest`
4. Body (form-data):
   - `file`: Select CV file
   - `firstName`: Text value
   - `lastName`: Text value
   - `email`: Text value
   - `phone`: Text value
   - `consentGiven`: `true`

## Rate Limiting

The CV upload endpoint has strict rate limiting:
- **Window**: 1 hour (3600000ms)
- **Max Requests**: 5 per IP address
- **Headers**: Returns `RateLimit-*` headers with current usage

To check rate limit status, inspect response headers:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Timestamp when limit resets

## Future Endpoints

The following endpoints will be implemented in subsequent tasks:

- `GET /api/admin/cv-submissions` - List all CV submissions
- `GET /api/admin/cv-submissions/:id` - Get submission details
- `PUT /api/admin/cv-submissions/:id` - Update submission status
- `GET /api/admin/cv-submissions/:id/download` - Download CV file

## Configuration

Environment variables for CV upload:

```env
# File Storage
UPLOAD_DIR=./uploads/cvs
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5

# Security
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```
