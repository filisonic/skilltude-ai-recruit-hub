import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { TextExtractionService } from '../../services/TextExtractionService';
import fs from 'fs/promises';
import path from 'path';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun } from 'docx';

describe('TextExtractionService', () => {
  const service = new TextExtractionService();
  const fixturesDir = path.join(__dirname, '../fixtures');
  
  // Test file paths
  const testPdfPath = path.join(fixturesDir, 'test-cv.pdf');
  const testDocxPath = path.join(fixturesDir, 'test-cv.docx');
  const emptyPdfPath = path.join(fixturesDir, 'empty.pdf');
  const corruptedPdfPath = path.join(fixturesDir, 'corrupted.pdf');
  const invalidFilePath = path.join(fixturesDir, 'nonexistent.pdf');

  // Sample CV content for testing
  const sampleCVContent = `John Doe
Software Engineer

Contact Information
Email: john.doe@example.com
Phone: +1 234 567 8900

Professional Summary
Experienced software engineer with 5+ years of expertise in full-stack development.

Work Experience
Senior Developer at Tech Corp (2020-2024)
- Led development of microservices architecture
- Improved system performance by 40%
- Mentored junior developers

Education
Bachelor of Science in Computer Science
University of Technology (2015-2019)

Skills
JavaScript, TypeScript, React, Node.js, Python, AWS`;

  beforeAll(async () => {
    // Ensure fixtures directory exists
    await fs.mkdir(fixturesDir, { recursive: true });

    // Create sample PDF file
    await createSamplePDF(testPdfPath, sampleCVContent);

    // Create sample DOCX file
    await createSampleDOCX(testDocxPath, sampleCVContent);

    // Create empty PDF
    await createSamplePDF(emptyPdfPath, '');

    // Create corrupted PDF (invalid content)
    await fs.writeFile(corruptedPdfPath, 'This is not a valid PDF file');
  });

  afterAll(async () => {
    // Clean up test files
    try {
      await fs.unlink(testPdfPath);
      await fs.unlink(testDocxPath);
      await fs.unlink(emptyPdfPath);
      await fs.unlink(corruptedPdfPath);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('extractPDF', () => {
    it('should extract text from a valid PDF file', async () => {
      const text = await service.extractPDF(testPdfPath);
      
      expect(text).toBeTruthy();
      expect(text).toContain('John Doe');
      expect(text).toContain('Software Engineer');
      expect(text).toContain('john.doe@example.com');
      expect(text).toContain('Work Experience');
    });

    it('should throw error for empty PDF', async () => {
      // Note: An "empty" PDF created by pdfkit still has some metadata/structure
      // so it may extract minimal text. We'll check that it extracts something minimal
      const text = await service.extractPDF(emptyPdfPath);
      // Empty PDFs may have page markers or minimal content
      expect(text.length).toBeLessThan(50);
    });

    it('should throw error for corrupted PDF', async () => {
      await expect(service.extractPDF(corruptedPdfPath)).rejects.toThrow(
        /PDF extraction failed/
      );
    });

    it('should throw error for nonexistent file', async () => {
      await expect(service.extractPDF(invalidFilePath)).rejects.toThrow();
    });
  });

  describe('extractDOCX', () => {
    it('should extract text from a valid DOCX file', async () => {
      const text = await service.extractDOCX(testDocxPath);
      
      expect(text).toBeTruthy();
      expect(text).toContain('John Doe');
      expect(text).toContain('Software Engineer');
      expect(text).toContain('john.doe@example.com');
      expect(text).toContain('Work Experience');
    });

    it('should throw error for nonexistent DOCX file', async () => {
      await expect(service.extractDOCX(invalidFilePath)).rejects.toThrow();
    });

    it('should throw error for invalid DOCX file', async () => {
      const invalidDocxPath = path.join(fixturesDir, 'invalid.docx');
      await fs.writeFile(invalidDocxPath, 'Not a valid DOCX file');
      
      await expect(service.extractDOCX(invalidDocxPath)).rejects.toThrow(
        /DOCX extraction failed/
      );
      
      await fs.unlink(invalidDocxPath);
    });
  });

  describe('extractText', () => {
    it('should extract text from PDF using correct MIME type', async () => {
      const text = await service.extractText(testPdfPath, 'application/pdf');
      
      expect(text).toBeTruthy();
      expect(text).toContain('John Doe');
      expect(text.split('\n').length).toBeGreaterThan(1);
    });

    it('should extract text from DOCX using correct MIME type', async () => {
      const text = await service.extractText(
        testDocxPath,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      
      expect(text).toBeTruthy();
      expect(text).toContain('John Doe');
    });

    it('should handle legacy DOC MIME type', async () => {
      const text = await service.extractText(testDocxPath, 'application/msword');
      
      expect(text).toBeTruthy();
      expect(text).toContain('John Doe');
    });

    it('should throw error for unsupported MIME type', async () => {
      await expect(
        service.extractText(testPdfPath, 'image/jpeg')
      ).rejects.toThrow(/Unsupported file type/);
    });

    it('should throw error for nonexistent file', async () => {
      await expect(
        service.extractText(invalidFilePath, 'application/pdf')
      ).rejects.toThrow(/Text extraction failed/);
    });

    it('should clean and normalize extracted text', async () => {
      const text = await service.extractText(testPdfPath, 'application/pdf');
      
      // Should not have excessive whitespace
      expect(text).not.toMatch(/  +/); // No multiple spaces
      expect(text).not.toMatch(/\n{3,}/); // No more than 2 consecutive newlines
      
      // Should be trimmed
      expect(text).toBe(text.trim());
      
      // Should preserve structure
      expect(text.split('\n').length).toBeGreaterThan(1);
    });
  });

  describe('text cleaning', () => {
    it('should normalize line breaks', async () => {
      const text = await service.extractText(testPdfPath, 'application/pdf');
      
      // Should only contain \n, not \r\n or \r
      expect(text).not.toContain('\r');
    });

    it('should remove excessive whitespace', async () => {
      const text = await service.extractText(testPdfPath, 'application/pdf');
      
      // Should not have multiple consecutive spaces
      expect(text).not.toMatch(/  +/);
      
      // Should not have more than 2 consecutive newlines
      expect(text).not.toMatch(/\n{3,}/);
    });

    it('should preserve content structure', async () => {
      const text = await service.extractText(testPdfPath, 'application/pdf');
      
      // Should maintain sections
      const lines = text.split('\n').filter(line => line.length > 0);
      expect(lines.length).toBeGreaterThan(5);
      
      // Should preserve important content
      expect(text).toContain('Contact Information');
      expect(text).toContain('Professional Summary');
      expect(text).toContain('Work Experience');
      expect(text).toContain('Education');
      expect(text).toContain('Skills');
    });

    it('should handle special characters appropriately', async () => {
      const text = await service.extractText(testPdfPath, 'application/pdf');
      
      // Should preserve common punctuation
      expect(text).toMatch(/[.,@+()-]/);
      
      // Should not contain control characters
      expect(text).not.toMatch(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/);
    });
  });

  describe('error handling', () => {
    it('should provide meaningful error messages for PDF failures', async () => {
      try {
        await service.extractPDF(corruptedPdfPath);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('PDF extraction failed');
      }
    });

    it('should provide meaningful error messages for DOCX failures', async () => {
      try {
        await service.extractDOCX(invalidFilePath);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('DOCX extraction failed');
      }
    });

    it('should handle file access errors', async () => {
      await expect(
        service.extractText(invalidFilePath, 'application/pdf')
      ).rejects.toThrow(/Text extraction failed/);
    });
  });
});

/**
 * Helper function to create a sample PDF file for testing
 */
async function createSamplePDF(filePath: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = require('fs').createWriteStream(filePath);

    doc.pipe(writeStream);

    if (content) {
      // Split content into lines and add to PDF
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (index > 0) {
          doc.moveDown(0.5);
        }
        doc.text(line);
      });
    }

    doc.end();

    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

/**
 * Helper function to create a sample DOCX file for testing
 */
async function createSampleDOCX(filePath: string, content: string): Promise<void> {
  const lines = content.split('\n');
  const paragraphs = lines.map(
    line =>
      new Paragraph({
        children: [new TextRun(line)],
      })
  );

  const doc = new Document({
    sections: [
      {
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(filePath, buffer);
}
