import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import * as pdfParseModule from 'pdf-parse';

/**
 * Service for extracting text content from CV files (PDF and DOCX)
 */
export class TextExtractionService {
  /**
   * Extract text from a CV file based on its MIME type
   * @param filePath - Path to the CV file
   * @param mimeType - MIME type of the file
   * @returns Extracted and cleaned text content
   */
  async extractText(filePath: string, mimeType: string): Promise<string> {
    try {
      // Validate file exists
      await fs.access(filePath);

      // Extract based on file type
      let rawText: string;
      if (mimeType === 'application/pdf') {
        rawText = await this.extractPDF(filePath);
      } else if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword'
      ) {
        rawText = await this.extractDOCX(filePath);
      } else {
        throw new Error(`Unsupported file type: ${mimeType}`);
      }

      // Clean and normalize the extracted text
      return this.cleanText(rawText);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Text extraction failed: ${error.message}`);
      }
      throw new Error('Text extraction failed: Unknown error');
    }
  }

  /**
   * Extract text from a PDF file
   * @param filePath - Path to the PDF file
   * @returns Raw extracted text
   */
  async extractPDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      // pdf-parse exports a PDFParse class - instantiate it
      // Convert Buffer to Uint8Array as required by the library
      const uint8Array = new Uint8Array(dataBuffer);
      const { PDFParse } = pdfParseModule as any;
      const parser = new PDFParse(uint8Array);
      const result = await parser.getText();
      
      // getText() returns an object with a text property
      const text = typeof result === 'string' ? result : result?.text || '';
      
      if (!text || text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains no extractable text');
      }
      
      return text;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`PDF extraction failed: ${error.message}`);
      }
      throw new Error('PDF extraction failed: Unknown error');
    }
  }

  /**
   * Extract text from a DOCX file
   * @param filePath - Path to the DOCX file
   * @returns Raw extracted text
   */
  async extractDOCX(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('DOCX appears to be empty or contains no extractable text');
      }
      
      // Log any warnings from mammoth
      if (result.messages && result.messages.length > 0) {
        console.warn('DOCX extraction warnings:', result.messages);
      }
      
      return result.value;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`DOCX extraction failed: ${error.message}`);
      }
      throw new Error('DOCX extraction failed: Unknown error');
    }
  }

  /**
   * Clean and normalize extracted text
   * @param rawText - Raw text from extraction
   * @returns Cleaned and normalized text
   */
  private cleanText(rawText: string): string {
    let cleaned = rawText;

    // Normalize line breaks (convert all to \n)
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Remove excessive whitespace while preserving structure
    cleaned = cleaned.replace(/[ \t]+/g, ' '); // Multiple spaces/tabs to single space
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Multiple newlines to max 2

    // Trim whitespace from each line
    cleaned = cleaned
      .split('\n')
      .map(line => line.trim())
      .join('\n');

    // Remove leading/trailing whitespace
    cleaned = cleaned.trim();

    // Remove special characters that might interfere with analysis
    // but preserve common punctuation and structure
    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    return cleaned;
  }
}

export default new TextExtractionService();
