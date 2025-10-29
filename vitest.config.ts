import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./server/__tests__/setup.ts'],
    env: {
      UPLOAD_DIR: './test-uploads',
      MAX_FILE_SIZE: '10485760',
      ALLOWED_FILE_TYPES: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'server/__tests__/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './server'),
    },
  },
});
