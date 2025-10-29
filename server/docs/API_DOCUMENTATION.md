# CV Analysis System - API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints in the CV Analysis & Upload System. All endpoints use JSON for request/response bodies unless otherwise specified.

**Base URL**: `/api`

**API Version**: 1.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [Public Endpoints](#public-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Error Codes](#error-codes)
5. [Rate Limiting](#rate-limiting)

---

## Authentication

### Admin Endpoints

Admin endpoints require authentication via session-based authentication. Users must be logged in with admin privileges.

**Authentication Method**: Session-based (cookies)

**Required Headers**:
```
Cookie: connect.sid=<session-id>
```

**Authentication Failure Response**:
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

**Status Code**: `401 Unauthorized`

---

## Public Endpoints

### POST /api/cv/upload

Upload a CV file for analysis.

**Authentication**: Not required

**Rate Limit**: 5 requests per hour per IP address

**Content-Type**: `multipart/form-data`

#### Request

**Form Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `file` | File | Yes | CV file (PDF, DOC, DOCX) | Max 10MB, allowed types: .pdf, .doc, .docx |
| `firstName` | String | Yes | User's first name | 2-100 characters, alphanumeric + spaces |
| `lastName` | String | Yes | User's last name | 2-100 characters, alphanumeric + spaces |
| `email` | String | Yes | User's email address | Valid email format |
| `phone` | String | Yes | User's phone number | Valid phone format (international supported) |
| `consentGiven` | Boolean | Yes | Privacy policy consent | Must be `true` |

**Example Request** (using cURL):
```bash
curl -X POST http://localhost:3000/api/cv/upload \
  -F "file=@/path/to/cv.pdf" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john.doe@example.com" \
  -F "phone=+1234567890" \
  -F "consentGiven=true"
```

**Example Request** (using JavaScript Fetch):
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('email', 'john.doe@example.com');
formData.append('phone', '+1234567890');
formData.append('consentGiven', 'true');

const response = await fetch('/api/cv/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

#### Response

**Success Response** (Status: `200 OK`):
```json
{
  "success": true,
  "message": "CV uploaded successfully. You will receive your analysis via email within 24-48 hours.",
  "submissionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Validation Error Response** (Status: `400 Bad Request`):
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "file",
      "message": "File size exceeds 10MB limit"
    }
  ]
}
```

**File Type Error Response** (Status: `400 Bad Request`):
```json
{
  "success": false,
  "error": "Invalid file type. Only PDF, DOC, and DOCX files are accepted."
}
```

**Rate Limit Error Response** (Status: `429 Too Many Requests`):
```json
{
  "success": false,
  "error": "Too many upload attempts. Please try again later.",
  "retryAfter": 3600
}
```

**Server Error Response** (Status: `500 Internal Server Error`):
```json
{
  "success": false,
  "error": "An error occurred while processing your CV. Please try again later."
}
```

---

## Admin Endpoints

All admin endpoints require authentication. Include session cookie in requests.

### GET /api/admin/cv-submissions

Retrieve a paginated list of CV submissions with filtering and search capabilities.

**Authentication**: Required (Admin)

**Rate Limit**: 100 requests per minute

#### Request

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | String | No | All | Filter by status: `new`, `reviewed`, `contacted`, `hired`, `rejected` |
| `search` | String | No | - | Search by name, email, or phone |
| `page` | Number | No | 1 | Page number (1-indexed) |
| `limit` | Number | No | 20 | Items per page (max 100) |
| `sortBy` | String | No | `submitted_at` | Sort field: `submitted_at`, `updated_at`, `status`, `analysis_score` |
| `sortOrder` | String | No | `desc` | Sort order: `asc`, `desc` |

**Example Request**:
```bash
GET /api/admin/cv-submissions?status=new&page=1&limit=20&sortBy=submitted_at&sortOrder=desc
```

```javascript
const response = await fetch('/api/admin/cv-submissions?status=new&page=1&limit=20', {
  credentials: 'include' // Include session cookie
});

const data = await response.json();
```

#### Response

**Success Response** (Status: `200 OK`):
```json
{
  "submissions": [
    {
      "id": 123,
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "cvFilename": "550e8400-e29b-41d4-a716-446655440000-resume.pdf",
      "cvFilePath": "/uploads/cvs/2024/12/550e8400-e29b-41d4-a716-446655440000-resume.pdf",
      "status": "new",
      "analysisScore": 75,
      "submittedAt": "2024-12-25T10:30:00.000Z",
      "reviewedAt": null,
      "reviewedBy": null,
      "emailSentAt": "2024-12-26T10:30:00.000Z",
      "convertedToPremium": false
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

**Authentication Error** (Status: `401 Unauthorized`):
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

---

### GET /api/admin/cv-submissions/:id

Retrieve detailed information for a specific CV submission, including full analysis results.

**Authentication**: Required (Admin)

**Rate Limit**: 100 requests per minute

#### Request

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Number | Yes | CV submission ID |

**Example Request**:
```bash
GET /api/admin/cv-submissions/123
```

```javascript
const response = await fetch('/api/admin/cv-submissions/123', {
  credentials: 'include'
});

const data = await response.json();
```

#### Response

**Success Response** (Status: `200 OK`):
```json
{
  "id": 123,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "cvFilename": "550e8400-e29b-41d4-a716-446655440000-resume.pdf",
  "cvFilePath": "/uploads/cvs/2024/12/550e8400-e29b-41d4-a716-446655440000-resume.pdf",
  "status": "reviewed",
  "analysisScore": 75,
  "analysisResults": {
    "overallScore": 75,
    "atsCompatibility": 80,
    "strengths": [
      "Clear contact information with professional email",
      "Strong action verbs used throughout experience section",
      "Quantifiable achievements with specific metrics"
    ],
    "improvements": [
      {
        "category": "Professional Summary",
        "priority": "high",
        "issue": "Missing professional summary section",
        "suggestion": "Add a 3-4 sentence summary highlighting your key skills and career objectives"
      }
    ],
    "sectionCompleteness": {
      "contactInfo": true,
      "summary": false,
      "experience": true,
      "education": true,
      "skills": true
    }
  },
  "adminNotes": "Strong candidate, followed up via phone",
  "submittedAt": "2024-12-25T10:30:00.000Z",
  "reviewedAt": "2024-12-26T14:20:00.000Z",
  "reviewedBy": "admin@skilltude.com",
  "emailSentAt": "2024-12-26T10:30:00.000Z",
  "emailOpenedAt": "2024-12-26T15:45:00.000Z",
  "convertedToPremium": false,
  "conversionDate": null,
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

**Not Found Response** (Status: `404 Not Found`):
```json
{
  "error": "Not found",
  "message": "CV submission not found"
}
```

---

### PUT /api/admin/cv-submissions/:id

Update a CV submission's status and admin notes.

**Authentication**: Required (Admin)

**Rate Limit**: 100 requests per minute

**Content-Type**: `application/json`

#### Request

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Number | Yes | CV submission ID |

**Request Body**:

| Field | Type | Required | Description | Allowed Values |
|-------|------|----------|-------------|----------------|
| `status` | String | No | Submission status | `new`, `reviewed`, `contacted`, `hired`, `rejected` |
| `adminNotes` | String | No | Admin notes/comments | Max 1000 characters |
| `convertedToPremium` | Boolean | No | Mark as converted to premium service | `true`, `false` |

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/admin/cv-submissions/123 \
  -H "Content-Type: application/json" \
  -b "connect.sid=<session-id>" \
  -d '{
    "status": "contacted",
    "adminNotes": "Called candidate, very interested in premium service"
  }'
```

```javascript
const response = await fetch('/api/admin/cv-submissions/123', {
  method: 'PUT',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'contacted',
    adminNotes: 'Called candidate, very interested in premium service'
  })
});

const data = await response.json();
```

#### Response

**Success Response** (Status: `200 OK`):
```json
{
  "success": true,
  "message": "CV submission updated successfully",
  "submission": {
    "id": 123,
    "status": "contacted",
    "adminNotes": "Called candidate, very interested in premium service",
    "updatedAt": "2024-12-27T09:15:00.000Z",
    "updatedBy": "admin@skilltude.com"
  }
}
```

**Validation Error** (Status: `400 Bad Request`):
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "status",
      "message": "Invalid status value"
    }
  ]
}
```

---

### GET /api/admin/cv-submissions/:id/download

Download the original CV file.

**Authentication**: Required (Admin)

**Rate Limit**: 50 requests per minute

#### Request

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Number | Yes | CV submission ID |

**Example Request**:
```bash
curl -X GET http://localhost:3000/api/admin/cv-submissions/123/download \
  -b "connect.sid=<session-id>" \
  -o downloaded-cv.pdf
```

```javascript
const response = await fetch('/api/admin/cv-submissions/123/download', {
  credentials: 'include'
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'cv.pdf';
a.click();
```

#### Response

**Success Response** (Status: `200 OK`):
- **Content-Type**: `application/pdf`, `application/msword`, or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Content-Disposition**: `attachment; filename="john-doe-cv.pdf"`
- **Body**: Binary file data

**Not Found Response** (Status: `404 Not Found`):
```json
{
  "error": "Not found",
  "message": "CV file not found"
}
```

**File Access Error** (Status: `500 Internal Server Error`):
```json
{
  "error": "File access error",
  "message": "Unable to retrieve CV file"
}
```

---

### GET /api/admin/cv-analytics

Retrieve analytics and statistics for CV submissions and conversions.

**Authentication**: Required (Admin)

**Rate Limit**: 100 requests per minute

#### Request

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `startDate` | String | No | 30 days ago | Start date (ISO 8601 format) |
| `endDate` | String | No | Today | End date (ISO 8601 format) |

**Example Request**:
```bash
GET /api/admin/cv-analytics?startDate=2024-01-01&endDate=2024-12-31
```

#### Response

**Success Response** (Status: `200 OK`):
```json
{
  "summary": {
    "totalSubmissions": 450,
    "totalAnalyzed": 445,
    "totalEmailsSent": 440,
    "totalConversions": 45,
    "conversionRate": 10.0,
    "averageScore": 72.5
  },
  "monthlyStats": [
    {
      "month": "2024-12",
      "submissions": 50,
      "conversions": 5,
      "conversionRate": 10.0
    }
  ],
  "statusBreakdown": {
    "new": 25,
    "reviewed": 150,
    "contacted": 200,
    "hired": 30,
    "rejected": 45
  }
}
```

---

## Error Codes

### HTTP Status Codes

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| `200 OK` | Success | Request completed successfully |
| `400 Bad Request` | Validation error | Invalid input data, file type, or file size |
| `401 Unauthorized` | Authentication required | Missing or invalid authentication |
| `403 Forbidden` | Access denied | User lacks required permissions |
| `404 Not Found` | Resource not found | CV submission or file doesn't exist |
| `429 Too Many Requests` | Rate limit exceeded | Too many requests in time window |
| `500 Internal Server Error` | Server error | Unexpected server-side error |

### Application Error Codes

| Error Code | Description | HTTP Status |
|------------|-------------|-------------|
| `FILE_TOO_LARGE` | File exceeds 10MB limit | 400 |
| `INVALID_FILE_TYPE` | File type not supported | 400 |
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `FILE_UPLOAD_FAILED` | File upload failed | 500 |
| `TEXT_EXTRACTION_FAILED` | Unable to extract text from CV | 500 |
| `ANALYSIS_FAILED` | CV analysis failed | 500 |
| `DATABASE_ERROR` | Database operation failed | 500 |
| `EMAIL_SEND_FAILED` | Email delivery failed | 500 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Access denied | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |

---

## Rate Limiting

Rate limits are applied per IP address for public endpoints and per user session for admin endpoints.

### Public Endpoints

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| `POST /api/cv/upload` | 5 requests | 1 hour |

### Admin Endpoints

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| `GET /api/admin/cv-submissions` | 100 requests | 1 minute |
| `GET /api/admin/cv-submissions/:id` | 100 requests | 1 minute |
| `PUT /api/admin/cv-submissions/:id` | 100 requests | 1 minute |
| `GET /api/admin/cv-submissions/:id/download` | 50 requests | 1 minute |
| `GET /api/admin/cv-analytics` | 100 requests | 1 minute |

### Rate Limit Headers

When rate limited, the following headers are included in the response:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640000000
Retry-After: 3600
```

---

## Security

### HTTPS

All API requests must be made over HTTPS in production. HTTP requests will be redirected to HTTPS.

### CSRF Protection

Admin endpoints are protected against CSRF attacks. Ensure cookies are sent with requests (`credentials: 'include'`).

### Input Sanitization

All user inputs are sanitized to prevent:
- SQL Injection
- XSS (Cross-Site Scripting)
- Path Traversal

### File Security

- File types are validated using magic numbers (not just extensions)
- Files are stored outside the public web directory
- File access requires authentication
- All file operations are logged

---

## Support

For API support or questions, contact:
- **Email**: support@skilltude.com
- **Documentation**: https://skilltude.com/docs
- **Status Page**: https://status.skilltude.com

---

**Last Updated**: December 2024  
**API Version**: 1.0
