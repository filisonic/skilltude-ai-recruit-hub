/**
 * Test setup file
 * Runs before all tests
 */

import { afterAll } from 'vitest';
import fs from 'fs/promises';
import path from 'path';

// Test upload directory - should match UPLOAD_DIR in vitest.config.ts
export const TEST_UPLOAD_DIR = path.join(process.cwd(), 'test-uploads');

afterAll(async () => {
  // Clean up test upload directory
  try {
    await fs.rm(TEST_UPLOAD_DIR, { recursive: true, force: true });
  } catch (error) {
    // Ignore errors if directory doesn't exist
  }
});
