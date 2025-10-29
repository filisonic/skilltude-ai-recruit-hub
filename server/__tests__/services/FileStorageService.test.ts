/**
 * Unit tests for FileStorageService
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { FileStorageService } from '../../services/FileStorageService';
import { CVUploadException, ErrorCodes } from '../../types/cv.types';
import { TEST_UPLOAD_DIR } from '../setup';

describe('FileStorageService', () => {
  let service: FileStorageService;

  beforeEach(async () => {
    // Ensure test upload directory exists
    await fs.mkdir(TEST_UPLOAD_DIR, { recursive: true });
    service = new FileStorageService();
  });

  afterEach(async () => {
    // Clean up test files after each test
    try {
      await fs.rm(TEST_UPLOAD_DIR, { recursive: true, force: true });
    } catch (error) {
      // Ignore if directory doesn't exist
    }
  });

  describe('storeCV', () => {
    it('should store a valid PDF file', async () => {
      // Create a valid PDF buffer (starts with %PDF)
      const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, ...Array(100).fill(0)]);
      const metadata = {
        originalFilename: 'test-resume.pdf',
        mimeType: 'application/pdf',
        size: pdfBuffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      const filePath = await service.storeCV(pdfBuffer, metadata);

      expect(filePath).toBeTruthy();
      expect(filePath).toContain('.pdf');
      
      // Verify file exists
      const fullPath = path.join(TEST_UPLOAD_DIR, filePath);
      const stats = await fs.stat(fullPath);
      expect(stats.isFile()).toBe(true);
    });

    it('should store a valid DOCX file', async () => {
      // Create a valid DOCX buffer (starts with PK - ZIP signature)
      const docxBuffer = Buffer.from([0x50, 0x4B, 0x03, 0x04, ...Array(100).fill(0)]);
      const metadata = {
        originalFilename: 'test-resume.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: docxBuffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      const filePath = await service.storeCV(docxBuffer, metadata);

      expect(filePath).toBeTruthy();
      expect(filePath).toContain('.docx');
    });

    it('should store a valid DOC file', async () => {
      // Create a valid DOC buffer (OLE2 signature)
      const docBuffer = Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1, ...Array(100).fill(0)]);
      const metadata = {
        originalFilename: 'test-resume.doc',
        mimeType: 'application/msword',
        size: docBuffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      const filePath = await service.storeCV(docBuffer, metadata);

      expect(filePath).toBeTruthy();
      expect(filePath).toContain('.doc');
    });

    it('should reject file that exceeds maximum size', async () => {
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB
      const metadata = {
        originalFilename: 'large-file.pdf',
        mimeType: 'application/pdf',
        size: largeBuffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      await expect(service.storeCV(largeBuffer, metadata)).rejects.toThrow(CVUploadException);
      await expect(service.storeCV(largeBuffer, metadata)).rejects.toMatchObject({
        code: ErrorCodes.FILE_TOO_LARGE,
        statusCode: 400,
      });
    });

    it('should reject invalid file type', async () => {
      const buffer = Buffer.from('invalid content');
      const metadata = {
        originalFilename: 'test.txt',
        mimeType: 'text/plain',
        size: buffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      await expect(service.storeCV(buffer, metadata)).rejects.toThrow(CVUploadException);
      await expect(service.storeCV(buffer, metadata)).rejects.toMatchObject({
        code: ErrorCodes.INVALID_FILE_TYPE,
        statusCode: 400,
      });
    });

    it('should reject file with mismatched magic numbers', async () => {
      // PDF MIME type but wrong magic numbers
      const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, ...Array(100).fill(0)]);
      const metadata = {
        originalFilename: 'fake.pdf',
        mimeType: 'application/pdf',
        size: buffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      await expect(service.storeCV(buffer, metadata)).rejects.toThrow(CVUploadException);
      await expect(service.storeCV(buffer, metadata)).rejects.toMatchObject({
        code: ErrorCodes.INVALID_FILE_TYPE,
        statusCode: 400,
      });
    });
  });

  describe('generateUniqueFilename', () => {
    it('should generate unique filenames for same original filename', async () => {
      const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, ...Array(100).fill(0)]);
      const metadata1 = {
        originalFilename: 'resume.pdf',
        mimeType: 'application/pdf',
        size: pdfBuffer.length,
        uploadedBy: 'test1@example.com',
        uploadedAt: new Date(),
      };
      const metadata2 = {
        originalFilename: 'resume.pdf',
        mimeType: 'application/pdf',
        size: pdfBuffer.length,
        uploadedBy: 'test2@example.com',
        uploadedAt: new Date(),
      };

      const filePath1 = await service.storeCV(pdfBuffer, metadata1);
      const filePath2 = await service.storeCV(pdfBuffer, metadata2);

      expect(filePath1).not.toBe(filePath2);
      
      // Both files should exist
      const fullPath1 = path.join(TEST_UPLOAD_DIR, filePath1);
      const fullPath2 = path.join(TEST_UPLOAD_DIR, filePath2);
      const stats1 = await fs.stat(fullPath1);
      const stats2 = await fs.stat(fullPath2);
      expect(stats1.isFile()).toBe(true);
      expect(stats2.isFile()).toBe(true);
    });

    it('should sanitize special characters in filename', async () => {
      const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, ...Array(100).fill(0)]);
      const metadata = {
        originalFilename: 'my résumé @#$%.pdf',
        mimeType: 'application/pdf',
        size: pdfBuffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      const filePath = await service.storeCV(pdfBuffer, metadata);
      const filename = path.basename(filePath);

      // Should contain UUID and sanitized filename with .pdf extension
      // Format: {uuid}-{sanitized-name}.pdf
      expect(filename).toMatch(/^[a-f0-9-]+-[a-zA-Z0-9_-]+\.pdf$/);
    });
  });

  describe('retrieveCV', () => {
    it('should retrieve a stored file', async () => {
      // Store a file first
      const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, ...Array(100).fill(0)]);
      const metadata = {
        originalFilename: 'test.pdf',
        mimeType: 'application/pdf',
        size: pdfBuffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      const filePath = await service.storeCV(pdfBuffer, metadata);

      // Retrieve the file
      const retrievedBuffer = await service.retrieveCV(filePath);

      expect(retrievedBuffer).toBeInstanceOf(Buffer);
      expect(retrievedBuffer.length).toBe(pdfBuffer.length);
      expect(Buffer.compare(retrievedBuffer, pdfBuffer)).toBe(0);
    });

    it('should throw error for non-existent file', async () => {
      await expect(service.retrieveCV('non-existent/file.pdf')).rejects.toThrow(CVUploadException);
      await expect(service.retrieveCV('non-existent/file.pdf')).rejects.toMatchObject({
        code: ErrorCodes.NOT_FOUND,
        statusCode: 404,
      });
    });

    it('should prevent directory traversal attacks', async () => {
      await expect(service.retrieveCV('../../../etc/passwd')).rejects.toThrow(CVUploadException);
      await expect(service.retrieveCV('..\\..\\..\\windows\\system32\\config\\sam')).rejects.toThrow(CVUploadException);
    });
  });

  describe('deleteCV', () => {
    it('should delete a stored file', async () => {
      // Store a file first
      const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, ...Array(100).fill(0)]);
      const metadata = {
        originalFilename: 'test.pdf',
        mimeType: 'application/pdf',
        size: pdfBuffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      const filePath = await service.storeCV(pdfBuffer, metadata);

      // Verify file exists
      const fullPath = path.join(TEST_UPLOAD_DIR, filePath);
      const stats = await fs.stat(fullPath);
      expect(stats.isFile()).toBe(true);

      // Delete the file
      await service.deleteCV(filePath);

      // Verify file no longer exists
      const exists = await fs.access(fullPath).then(() => true).catch(() => false);
      expect(exists).toBe(false);
    });

    it('should throw error when deleting non-existent file', async () => {
      await expect(service.deleteCV('non-existent/file.pdf')).rejects.toThrow(CVUploadException);
      await expect(service.deleteCV('non-existent/file.pdf')).rejects.toMatchObject({
        code: ErrorCodes.NOT_FOUND,
        statusCode: 404,
      });
    });
  });

  describe('getFileMetadata', () => {
    it('should return correct metadata for stored file', async () => {
      // Store a file first
      const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, ...Array(100).fill(0)]);
      const metadata = {
        originalFilename: 'test.pdf',
        mimeType: 'application/pdf',
        size: pdfBuffer.length,
        uploadedBy: 'test@example.com',
        uploadedAt: new Date(),
      };

      const filePath = await service.storeCV(pdfBuffer, metadata);

      // Get metadata
      const fileMetadata = await service.getFileMetadata(filePath);

      expect(fileMetadata).toMatchObject({
        path: filePath,
        size: pdfBuffer.length,
        mimeType: 'application/pdf',
      });
      expect(fileMetadata.filename).toContain('.pdf');
      expect(fileMetadata.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error for non-existent file', async () => {
      await expect(service.getFileMetadata('non-existent/file.pdf')).rejects.toThrow(CVUploadException);
    });
  });
});
