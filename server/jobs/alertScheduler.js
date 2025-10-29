/**
 * Alert Scheduler
 * Runs the alert checking job every 15 minutes
 * 
 * Usage:
 *   node server/jobs/alertScheduler.js
 * 
 * Or add to package.json scripts:
 *   "job:alerts": "node server/jobs/alertScheduler.js"
 */

const { spawn } = require('child_process');
const path = require('path');

// Check interval in milliseconds (15 minutes)
const CHECK_INTERVAL = 15 * 60 * 1000;

console.log('🚨 Alert Scheduler Started');
console.log(`⏰ Checking for alerts every ${CHECK_INTERVAL / 1000 / 60} minutes`);
console.log('');

/**
 * Run the alert checking job
 */
function runAlertCheck() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Running alert check...`);

  // Determine which command to use based on environment
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const command = isDevelopment ? 'tsx' : 'node';
  const scriptPath = isDevelopment
    ? path.join(__dirname, 'checkAlerts.ts')
    : path.join(__dirname, '../dist/jobs/checkAlerts.js');

  const child = spawn(command, [scriptPath], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code) => {
    const endTimestamp = new Date().toISOString();
    if (code === 0) {
      console.log(`[${endTimestamp}] ✓ Alert check completed successfully`);
    } else {
      console.error(`[${endTimestamp}] ✗ Alert check failed with code ${code}`);
    }
    console.log('');
  });

  child.on('error', (error) => {
    console.error(`[${timestamp}] ✗ Failed to start alert check:`, error);
    console.log('');
  });
}

// Run immediately on startup
runAlertCheck();

// Schedule recurring checks
setInterval(runAlertCheck, CHECK_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Alert Scheduler Stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Alert Scheduler Stopped');
  process.exit(0);
});
