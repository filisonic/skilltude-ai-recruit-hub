# Admin API Guide

## Overview

This guide provides detailed information about the Admin API endpoints for managing CV submissions in the SkillTude CV Analysis System.

## Authentication

All admin endpoints require JWT-based authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

Tokens are issued upon successful admin login. The token contains:
- User ID
- Expiration time (default: 24 hours)

### Token Validation

The system validates:
- Token signature
- Token expiration
- User existence in database
- User status (must be 'active')

## Authorization

### Required Roles

All CV management endpoints require one of the following roles:
- `super_admin`: Full system access
- `admin`: Administrative access
- `hr_manager`: HR-specific access

Users with `editor` role do not have access to CV management endpoints.

## Endpoints

### 1. List CV Submissions

Retrieve a paginated list of CV submissions with filtering and search capabilities.

**Endpoint**: `GET /api/admin/cv-submissions`

**Authentication**: Required

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| status | string | No | - | Filter by status: `new`, `reviewed`, `contacted`, `hired`, `rejected` |
| search | string | No | - | Search in name, email, or phone |
| page | number | No | 1 | Page number (starts at 1) |
| limit | number | No | 20 | Items per page (max 100) |
| sortBy | string | No | submitted_at | Sort field: `submitted_at`, `updated_at`, `status` |
| sortOrder | string | No | desc | Sort order: `asc`, `desc` |

**Example Request**:
```bash
curl -X GET "http://localhost:3001/api/admin/cv-submissions?status=new&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "submissions": [
    {
      "id": 1,
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "cvFilename": "uuid-john-doe-cv.pdf",
      "cvFilePath": "/uploads/cvs/2024/12/uuid-john-doe-cv.pdf",
      "status": "new",
      "analysisScore": 75,
      "analysisResults": { ... },
      "emailSentAt": "2024-12-25T10:30:00Z",
      "emailOpenedAt": null,
      "convertedToPremium": false,
      "conversionDate": null,
      "submittedAt": "2024-12-25T09:00:00Z",
      "reviewedAt": null,
      "reviewedBy": null,
      "adminNotes": null,
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-12-25T09:00:00Z",
      "updatedAt": "2024-12-25T09:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

**Status Codes**:
- `200 OK`: Success
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### 2. Get Submission Details

Retrieve detailed information for a specific CV submission.

**Endpoint**: `GET /api/admin/cv-submissions/:id`

**Authentication**: Required

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Submission ID |

**Example Request**:
```bash
curl -X GET "http://localhost:3001/api/admin/cv-submissions/123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "id": 123,
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "cvFilename": "uuid-john-doe-cv.pdf",
  "cvFilePath": "/uploads/cvs/2024/12/uuid-john-doe-cv.pdf",
  "status": "new",
  "analysisScore": 75,
  "analysisResults": {
    "overallScore": 75,
    "strengths": [
      "Clear contact information",
      "Strong action verbs",
      "Quantifiable achievements"
    ],
    "improvements": [
      {
        "category": "Professional Summary",
        "priority": "high",
        "issue": "Missing professional summary",
        "suggestion": "Add a 3-4 sentence summary...",
        "example": "Results-driven software engineer..."
      }
    ],
    "atsCompatibility": 80,
    "sectionCompleteness": {
      "contactInfo": true,
      "summary": false,
      "experience": true,
      "education": true,
      "skills": true
    },
    "detailedFeedback": "Your CV shows strong technical experience...",
    "analyzedAt": "2024-12-25T09:05:00Z"
  },
  "emailSentAt": "2024-12-25T10:30:00Z",
  "emailOpenedAt": null,
  "convertedToPremium": false,
  "conversionDate": null,
  "submittedAt": "2024-12-25T09:00:00Z",
  "reviewedAt": null,
  "reviewedBy": null,
  "adminNotes": null,
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-12-25T09:00:00Z",
  "updatedAt": "2024-12-25T09:00:00Z"
}
```

**Status Codes**:
- `200 OK`: Success
- `400 Bad Request`: Invalid ID format
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Submission not found

---

### 3. Update Submission

Update the status, admin notes, or conversion status of a CV submission.

**Endpoint**: `PUT /api/admin/cv-submissions/:id`

**Authentication**: Required

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Submission ID |

**Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | No | New status: `new`, `reviewed`, `contacted`, `hired`, `rejected` |
| adminNotes | string | No | Admin notes (max 5000 characters) |
| convertedToPremium | boolean | No | Mark as converted to premium service |

**Example Request**:
```bash
curl -X PUT "http://localhost:3001/api/admin/cv-submissions/123" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "reviewed",
    "adminNotes": "Strong candidate. Technical skills align well with our requirements.",
    "convertedToPremium": false
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "CV submission updated successfully",
  "submission": {
    "id": 123,
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "firstName": "John",
    "lastName": "Doe",
    "status": "reviewed",
    "adminNotes": "Strong candidate. Technical skills align well with our requirements.",
    "reviewedAt": "2024-12-25T14:30:00Z",
    "reviewedBy": "admin_username",
    ...
  }
}
```

**Status Codes**:
- `200 OK`: Success
- `400 Bad Request`: Invalid input or validation error
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Submission not found

**Notes**:
- When `convertedToPremium` is set to `true`, the system automatically sets `conversion_date` to the current timestamp
- The `reviewed_at` field is automatically updated to the current timestamp
- The `reviewed_by` field is automatically set to the authenticated user's username
- All updates are logged for audit purposes

---

### 4. Download CV File

Download the original CV file submitted by the candidate.

**Endpoint**: `GET /api/admin/cv-submissions/:id/download`

**Authentication**: Required

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Submission ID |

**Example Request**:
```bash
curl -X GET "http://localhost:3001/api/admin/cv-submissions/123/download" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o downloaded-cv.pdf
```

**Response**:
- Binary file stream
- Content-Type header set to the original file's MIME type
- Content-Disposition header set to `attachment; filename="FirstName_LastName_CV.ext"`

**Status Codes**:
- `200 OK`: Success (file download)
- `400 Bad Request`: Invalid ID format
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Submission or file not found

**Notes**:
- File downloads are logged for security audit purposes
- The downloaded file is renamed to a user-friendly format: `FirstName_LastName_CV.ext`
- The system verifies file existence before attempting download

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication token |
| `NOT_FOUND` | Requested resource not found |
| `VALIDATION_ERROR` | Input validation failed |
| `DATABASE_ERROR` | Database operation failed |
| `INTERNAL_ERROR` | Unexpected server error |

## Rate Limiting

Admin endpoints use a more lenient rate limiter compared to public endpoints:
- Window: 15 minutes
- Max requests: 100 per window

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Best Practices

### 1. Token Management
- Store tokens securely (e.g., httpOnly cookies, secure storage)
- Implement token refresh mechanism
- Handle token expiration gracefully

### 2. Error Handling
- Always check response status codes
- Handle 401 errors by redirecting to login
- Display user-friendly error messages

### 3. Pagination
- Use reasonable page sizes (20-50 items)
- Implement infinite scroll or pagination UI
- Cache results when appropriate

### 4. Search and Filtering
- Debounce search input to reduce API calls
- Combine filters for more specific results
- Clear filters when navigating away

### 5. File Downloads
- Show loading indicator during download
- Handle download errors gracefully
- Verify file type before opening

## Code Examples

### JavaScript/TypeScript (Fetch API)

```typescript
// List submissions
async function getSubmissions(filters: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  
  const response = await fetch(
    `http://localhost:3001/api/admin/cv-submissions?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }
  
  return response.json();
}

// Get submission details
async function getSubmissionDetails(id: number) {
  const response = await fetch(
    `http://localhost:3001/api/admin/cv-submissions/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch submission details');
  }
  
  return response.json();
}

// Update submission
async function updateSubmission(
  id: number,
  updates: {
    status?: string;
    adminNotes?: string;
    convertedToPremium?: boolean;
  }
) {
  const response = await fetch(
    `http://localhost:3001/api/admin/cv-submissions/${id}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to update submission');
  }
  
  return response.json();
}

// Download CV
async function downloadCV(id: number) {
  const response = await fetch(
    `http://localhost:3001/api/admin/cv-submissions/${id}/download`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to download CV');
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cv.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useCVSubmissions(filters: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getSubmissions(filters);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [filters.status, filters.search, filters.page, filters.limit]);
  
  return { data, loading, error };
}
```

## Testing

### Manual Testing with cURL

```bash
# Set your token
TOKEN="your-jwt-token-here"

# List submissions
curl -X GET "http://localhost:3001/api/admin/cv-submissions" \
  -H "Authorization: Bearer $TOKEN"

# Get submission details
curl -X GET "http://localhost:3001/api/admin/cv-submissions/1" \
  -H "Authorization: Bearer $TOKEN"

# Update submission
curl -X PUT "http://localhost:3001/api/admin/cv-submissions/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "reviewed", "adminNotes": "Test note"}'

# Download CV
curl -X GET "http://localhost:3001/api/admin/cv-submissions/1/download" \
  -H "Authorization: Bearer $TOKEN" \
  -o cv.pdf
```

### Postman Collection

Import the following collection into Postman:

```json
{
  "info": {
    "name": "Admin CV API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "List Submissions",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/admin/cv-submissions"
      }
    },
    {
      "name": "Get Submission",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/admin/cv-submissions/{{submission_id}}"
      }
    },
    {
      "name": "Update Submission",
      "request": {
        "method": "PUT",
        "url": "{{base_url}}/api/admin/cv-submissions/{{submission_id}}",
        "body": {
          "mode": "raw",
          "raw": "{\"status\": \"reviewed\", \"adminNotes\": \"Test\"}"
        }
      }
    },
    {
      "name": "Download CV",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/admin/cv-submissions/{{submission_id}}/download"
      }
    }
  ]
}
```

## Support

For issues or questions:
- Check the [Implementation Summary](./TASK_8_IMPLEMENTATION_SUMMARY.md)
- Review the [API Endpoints Documentation](./API_ENDPOINTS.md)
- Contact the development team

## Changelog

### Version 1.0.0 (Initial Release)
- List CV submissions with filtering, search, pagination, and sorting
- Get detailed submission information
- Update submission status and notes
- Download original CV files
- JWT-based authentication
- Role-based authorization
- Comprehensive error handling
- Audit logging
