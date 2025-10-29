/**
 * Input Sanitization Utilities
 * Provides functions to sanitize user inputs and prevent XSS/SQL injection attacks
 */

/**
 * Sanitize a string for safe HTML output
 * Escapes HTML special characters to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize a string for safe use in SQL queries
 * Note: This is a backup - always use parameterized queries as primary defense
 */
export function sanitizeSql(input: string): string {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Remove SQL comment markers
  return input
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    // Remove semicolons that could terminate statements
    .replace(/;/g, '')
    // Remove null bytes
    .replace(/\0/g, '');
}

/**
 * Sanitize user input for names (first name, last name)
 * Allows letters, spaces, hyphens, and apostrophes
 */
export function sanitizeName(input: string): string {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .trim()
    // Remove any characters that aren't letters, spaces, hyphens, or apostrophes
    .replace(/[^a-zA-Z\s'\-]/g, '')
    // Limit consecutive spaces
    .replace(/\s+/g, ' ')
    // Remove leading/trailing special characters
    .replace(/^['\-\s]+|['\-\s]+$/g, '');
}

/**
 * Sanitize email address
 * Removes potentially dangerous characters while preserving valid email format
 */
export function sanitizeEmail(input: string): string {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .trim()
    .toLowerCase()
    // Remove any characters that aren't valid in email addresses
    .replace(/[^a-z0-9@._\-+]/g, '');
}

/**
 * Sanitize phone number
 * Allows digits, spaces, hyphens, parentheses, and plus sign
 */
export function sanitizePhone(input: string): string {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .trim()
    // Remove any characters that aren't valid in phone numbers
    .replace(/[^0-9\s\-+()]/g, '')
    // Limit consecutive spaces
    .replace(/\s+/g, ' ');
}

/**
 * Sanitize file path to prevent directory traversal attacks
 * Removes path traversal sequences and ensures path is relative
 */
export function sanitizePath(input: string): string {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    // Remove path traversal attempts
    .replace(/\.\./g, '')
    // Remove leading slashes
    .replace(/^[/\\]+/, '')
    // Normalize path separators
    .replace(/\\/g, '/')
    // Remove null bytes
    .replace(/\0/g, '');
}

/**
 * Sanitize general text input
 * Removes dangerous HTML/JS while preserving basic formatting
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .trim()
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object/embed tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Validate and sanitize UUID
 * Ensures input matches UUID format
 */
export function sanitizeUuid(input: string): string | null {
  if (typeof input !== 'string') {
    return null;
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (uuidRegex.test(input)) {
    return input.toLowerCase();
  }
  
  return null;
}

/**
 * Sanitize admin notes or other long-form text
 * Allows more characters but still prevents XSS
 */
export function sanitizeNotes(input: string): string {
  if (typeof input !== 'string') {
    return input;
  }
  
  return sanitizeText(input)
    // Limit length to prevent abuse
    .substring(0, 5000);
}

/**
 * Comprehensive input sanitization for CV upload data
 */
export interface CVUploadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adminNotes?: string;
}

export function sanitizeCVUploadData(data: any): CVUploadData {
  return {
    firstName: sanitizeName(data.firstName || ''),
    lastName: sanitizeName(data.lastName || ''),
    email: sanitizeEmail(data.email || ''),
    phone: sanitizePhone(data.phone || ''),
    adminNotes: data.adminNotes ? sanitizeNotes(data.adminNotes) : undefined,
  };
}

/**
 * Sanitize search query
 * Prevents SQL injection and XSS in search terms
 */
export function sanitizeSearchQuery(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    // Remove SQL wildcards that could be abused
    .replace(/%/g, '')
    // Remove SQL comment markers
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    // Remove dangerous characters
    .replace(/[<>'"]/g, '')
    // Limit length
    .substring(0, 255);
}

export default {
  sanitizeHtml,
  sanitizeSql,
  sanitizeName,
  sanitizeEmail,
  sanitizePhone,
  sanitizePath,
  sanitizeText,
  sanitizeUuid,
  sanitizeNotes,
  sanitizeCVUploadData,
  sanitizeSearchQuery,
};
