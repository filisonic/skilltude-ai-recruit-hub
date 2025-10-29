/**
 * File Storage Service
 * Handles secure storage, retrieval, and deletion of CV files
 */

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CVMetadata, FileMetadata, CVUploadException, ErrorCodes } from '../types/cv.types';
import { config } from '../config';
import { logFileOperation } from '../utils/logger';

/**
 * Magic numbers (file signatures) for supported file types
 * Used for validating actual file content, not just extensions
 */
const FILE_SIGNATURES = {
  PDF: [0x25, 0x50, 0x44, 0x46], // %PDF
  DOC: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // DOC (OLE2)
  DOCX: [0x50, 0x4B, 0x03, 0x04], // DOCX (ZIP format)
} as const;

/**
 * MIME type mappings
 */
const MIME_TYPES = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
} as const;

export class FileStorageService {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedTypes: string[];

  constructor() {
    this.uploadDir = config.storage.uploadDir;
    this.maxFileSize = config.storage.maxFileSize;
    this.allowedTypes = config.storage.allowedTypes;
  }

  /**
   * Store a CV file with UUID-based filename in year/month directory structure
   * @param file - File buffer
   * @param metadata - CV metadata including original filename and mime type
   * @returns Path to stored file
   */
  async storeCV(file: Buffer, metadata: CVMetadata): Promise<string> {
    let filename = metadata.originalFilename; // Initialize for error logging
    
    try {
      // Validate file size
      if (file.length > this.maxFileSize) {
        throw new CVUploadException(
          ErrorCodes.FILE_TOO_LARGE,
          `File size ${file.length} bytes exceeds maximum allowed size of ${this.maxFileSize} bytes`,
          400
        );
      }

      // Validate file type using magic numbers
      await this.validateFileType(file, metadata.mimeType);

      // Generate unique filename
      filename = this.generateUniqueFilename(metadata.originalFilename);

      // Create year/month directory structure
      const storagePath = this.getStoragePath();
      await this.ensureDirectoryExists(storagePath);

      // Full file path
      const filePath = path.join(storagePath, filename);

      // Write file to disk
      await fs.writeFile(filePath, file);

      // Return relative path from upload directory
      const relativePath = path.relative(this.uploadDir, filePath);

      // Log successful file storage
      logFileOperation({
        operation: 'store',
        filename,
        success: true,
        size: file.length,
      });

      return relativePath;
    } catch (error) {
      // Log failed file storage
      logFileOperation({
        operation: 'store',
        filename,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      if (error instanceof CVUploadException) {
        throw error;
      }
      throw new CVUploadException(
        ErrorCodes.FILE_UPLOAD_FAILED,
        `Failed to store CV file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  /**
   * Retrieve a CV file from storage
   * @param filePath - Relative path to the file
   * @returns File buffer
   */
  async retrieveCV(filePath: string): Promise<Buffer> {
    try {
      // Sanitize path to prevent directory traversal attacks
      const sanitizedPath = this.sanitizePath(filePath);
      const fullPath = path.join(this.uploadDir, sanitizedPath);

      // Check if file exists
      const exists = await this.fileExists(fullPath);
      if (!exists) {
        throw new CVUploadException(
          ErrorCodes.NOT_FOUND,
          `File not found: ${filePath}`,
          404
        );
      }

      // Read and return file
      const fileBuffer = await fs.readFile(fullPath);
      return fileBuffer;
    } catch (error) {
      if (error instanceof CVUploadException) {
        throw error;
      }
      throw new CVUploadException(
        ErrorCodes.FILE_UPLOAD_FAILED,
        `Failed to retrieve CV file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  /**
   * Delete a CV file from storage
   * @param filePath - Relative path to the file
   */
  async deleteCV(filePath: string): Promise<void> {
    try {
      // Sanitize path to prevent directory traversal attacks
      const sanitizedPath = this.sanitizePath(filePath);
      const fullPath = path.join(this.uploadDir, sanitizedPath);

      // Check if file exists
      const exists = await this.fileExists(fullPath);
      if (!exists) {
        throw new CVUploadException(
          ErrorCodes.NOT_FOUND,
          `File not found: ${filePath}`,
          404
        );
      }

      // Delete file
      await fs.unlink(fullPath);

      // Log successful file deletion
      logFileOperation({
        operation: 'delete',
        filename: filePath,
        success: true,
      });
    } catch (error) {
      // Log failed file deletion
      logFileOperation({
        operation: 'delete',
        filename: filePath,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      if (error instanceof CVUploadException) {
        throw error;
      }
      throw new CVUploadException(
        ErrorCodes.FILE_UPLOAD_FAILED,
        `Failed to delete CV file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  /**
   * Get metadata for a stored file
   * @param filePath - Relative path to the file
   * @returns File metadata
   */
  async getFileMetadata(filePath: string): Promise<FileMetadata> {
    try {
      const sanitizedPath = this.sanitizePath(filePath);
      const fullPath = path.join(this.uploadDir, sanitizedPath);

      const stats = await fs.stat(fullPath);
      const filename = path.basename(fullPath);
      
      // Determine MIME type from extension
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      if (ext === '.pdf') {
        mimeType = 'application/pdf';
      } else if (ext === '.doc') {
        mimeType = 'application/msword';
      } else if (ext === '.docx') {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }

      return {
        filename,
        path: filePath,
        size: stats.size,
        mimeType,
        createdAt: stats.birthtime,
      };
    } catch (error) {
      throw new CVUploadException(
        ErrorCodes.FILE_UPLOAD_FAILED,
        `Failed to get file metadata: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  /**
   * Validate file type using magic numbers (file signatures)
   * @param file - File buffer
   * @param mimeType - Expected MIME type
   */
  private async validateFileType(file: Buffer, mimeType: string): Promise<void> {
    // Check if MIME type is allowed
    if (!this.allowedTypes.includes(mimeType)) {
      throw new CVUploadException(
        ErrorCodes.INVALID_FILE_TYPE,
        `File type ${mimeType} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
        400
      );
    }

    // Validate using magic numbers
    const isValid = this.checkMagicNumbers(file, mimeType);
    
    if (!isValid) {
      throw new CVUploadException(
        ErrorCodes.INVALID_FILE_TYPE,
        'File content does not match the declared file type',
        400
      );
    }
  }

  /**
   * Check if file buffer matches expected magic numbers
   * @param file - File buffer
   * @param mimeType - MIME type to check against
   * @returns True if magic numbers match
   */
  private checkMagicNumbers(file: Buffer, mimeType: string): boolean {
    if (file.length < 8) {
      return false;
    }

    switch (mimeType) {
      case 'application/pdf':
        return this.matchesSignature(file, FILE_SIGNATURES.PDF);
      
      case 'application/msword':
        return this.matchesSignature(file, FILE_SIGNATURES.DOC);
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        // DOCX is a ZIP file, so check for ZIP signature
        return this.matchesSignature(file, FILE_SIGNATURES.DOCX);
      
      default:
        return false;
    }
  }

  /**
   * Check if buffer starts with expected signature
   * @param buffer - File buffer
   * @param signature - Expected byte signature
   * @returns True if signature matches
   */
  private matchesSignature(buffer: Buffer, signature: readonly number[]): boolean {
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Generate unique filename using UUID
   * @param originalFilename - Original filename
   * @returns Unique filename with UUID
   */
  private generateUniqueFilename(originalFilename: string): string {
    const uuid = uuidv4();
    const ext = path.extname(originalFilename).toLowerCase();
    
    // Sanitize original filename (remove special characters)
    const baseName = path.basename(originalFilename, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .substring(0, 50); // Limit length
    
    return `${uuid}-${baseName}${ext}`;
  }

  /**
   * Get storage path with year/month directory structure
   * @returns Path to storage directory
   */
  private getStoragePath(): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    return path.join(this.uploadDir, year, month);
  }

  /**
   * Ensure directory exists, create if it doesn't
   * @param dirPath - Directory path
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      // Directory doesn't exist, create it
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Check if file exists
   * @param filePath - Full file path
   * @returns True if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize file path to prevent directory traversal attacks
   * @param filePath - Input file path
   * @returns Sanitized path
   */
  private sanitizePath(filePath: string): string {
    // Remove any path traversal attempts
    const normalized = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    
    // Ensure path doesn't start with / or \
    return normalized.replace(/^[/\\]+/, '');
  }
}

// Export singleton instance
export const fileStorageService = new FileStorageService();

