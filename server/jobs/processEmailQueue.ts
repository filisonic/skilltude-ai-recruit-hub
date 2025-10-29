/**
 * Background Job: Process Email Queue
 * 
 * This script processes the email queue and sends scheduled emails.
 * It should be run periodically (e.g., every 15 minutes) via cron or a task scheduler.
 * 
 * Usage:
 *   node dist/jobs/processEmailQueue.js
 *   or
 *   ts-node server/jobs/processEmailQueue.ts
 */

import { EmailQueueService } from '../services/EmailQueueService.js';
import { EmailService } from '../services/EmailService.js';

/**
 * Main function to process the email queue
 */
async function main() {
  console.log('='.repeat(80));
  console.log('Email Queue Processor Started');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('='.repeat(80));

  const emailService = new EmailService();
  const queueService = new EmailQueueService(emailService);

  try {
    // Verify email service connection
    const isConnected = await emailService.verifyConnection();
    if (!isConnected) {
      console.error('❌ Email service connection failed. Aborting queue processing.');
      process.exit(1);
    }

    console.log('✓ Email service connection verified');

    // Get queue statistics before processing
    const statsBefore = await queueService.getQueueStats();
    console.log('\nQueue Statistics (Before):');
    console.log(`  Pending:  ${statsBefore.pending}`);
    console.log(`  Queued:   ${statsBefore.queued}`);
    console.log(`  Retrying: ${statsBefore.retrying}`);
    console.log(`  Sent:     ${statsBefore.sent}`);
    console.log(`  Failed:   ${statsBefore.failed}`);

    // Process the queue
    console.log('\n' + '-'.repeat(80));
    console.log('Processing Email Queue...');
    console.log('-'.repeat(80) + '\n');

    const result = await queueService.processQueue();

    console.log('\n' + '-'.repeat(80));
    console.log('Queue Processing Complete');
    console.log('-'.repeat(80));
    console.log(`✓ Emails sent successfully: ${result.sent}`);
    console.log(`✗ Emails failed: ${result.failed}`);

    // Get queue statistics after processing
    const statsAfter = await queueService.getQueueStats();
    console.log('\nQueue Statistics (After):');
    console.log(`  Pending:  ${statsAfter.pending}`);
    console.log(`  Queued:   ${statsAfter.queued}`);
    console.log(`  Retrying: ${statsAfter.retrying}`);
    console.log(`  Sent:     ${statsAfter.sent}`);
    console.log(`  Failed:   ${statsAfter.failed}`);

    // Show failed emails if any
    if (statsAfter.failed > 0) {
      console.log('\n' + '-'.repeat(80));
      console.log('Failed Emails (Recent):');
      console.log('-'.repeat(80));
      
      const failedEmails = await queueService.getFailedEmails(10);
      failedEmails.forEach((email, index) => {
        console.log(`\n${index + 1}. ${email.firstName} ${email.lastName} (${email.email})`);
        console.log(`   Submission ID: ${email.uuid}`);
        console.log(`   Attempts: ${email.emailAttempts}`);
        console.log(`   Last Attempt: ${email.emailLastAttemptAt}`);
        console.log(`   Error: ${email.emailError}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('Email Queue Processor Finished Successfully');
    console.log('='.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('❌ Email Queue Processor Failed');
    console.error('='.repeat(80));
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the main function
main();
