/**
 * Email Queue Scheduler
 * Simple scheduler that runs the email queue processor every 15 minutes
 * 
 * Usage: node server/jobs/emailQueueScheduler.js
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INTERVAL_MINUTES = 15;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

console.log('═══════════════════════════════════════════════════════════');
console.log('  Email Queue Scheduler Started');
console.log(`  Running every ${INTERVAL_MINUTES} minutes`);
console.log('═══════════════════════════════════════════════════════════\n');

function runEmailQueueProcessor() {
  console.log(`[${new Date().toISOString()}] Starting email queue processor...`);
  
  const jobPath = path.join(__dirname, 'processEmailQueue.js');
  const child = spawn('node', [jobPath], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../..'),
  });

  child.on('exit', (code) => {
    if (code === 0) {
      console.log(`[${new Date().toISOString()}] ✓ Email queue processor completed successfully\n`);
    } else {
      console.error(`[${new Date().toISOString()}] ✗ Email queue processor failed with code ${code}\n`);
    }
  });

  child.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] ✗ Failed to start email queue processor:`, error);
  });
}

// Run immediately on start
runEmailQueueProcessor();

// Then run every 15 minutes
setInterval(runEmailQueueProcessor, INTERVAL_MS);

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\nEmail Queue Scheduler stopped');
  process.exit(0);
});

console.log('Scheduler is running. Press Ctrl+C to stop.\n');
