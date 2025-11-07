/**
 * CV Analysis Background Processor
 * 
 * Processes pending CV submissions asynchronously
 * Runs every 5 minutes via cron job
 */

import mysql from 'mysql2/promise';
import { dbConfig } from '../config/index.js';
import { config } from '../config/index.js';
import { TextExtractionService } from '../services/TextExtractionService.js';
import { CVAnalysisEngine } from '../services/CVAnalysisEngine.js';
import path from 'path';

const textExtraction = new TextExtractionService();
const analysisEngine = new CVAnalysisEngine();

async function processCVAnalysis() {
  let connection;
  
  try {
    console.log('================================================================================');
    console.log('CV Analysis Processor Started');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('================================================================================');

    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // Get pending CVs
    const [pendingCVs] = await connection.execute<any[]>(
      `SELECT id, uuid, cv_file_path, cv_mime_type, email
       FROM cv_submissions
       WHERE analysis_status = 'pending'
       ORDER BY submitted_at ASC
       LIMIT 10`
    );

    if (pendingCVs.length === 0) {
      console.log('No pending CVs to process');
      console.log('================================================================================');
      return;
    }

    console.log(`Found ${pendingCVs.length} pending CV(s) to analyze`);
    console.log('--------------------------------------------------------------------------------');

    let processed = 0;
    let failed = 0;

    for (const cv of pendingCVs) {
      try {
        console.log(`Processing CV: ${cv.uuid} (${cv.email})`);

        // Mark as processing
        await connection.execute(
          `UPDATE cv_submissions SET analysis_status = 'processing' WHERE id = ?`,
          [cv.id]
        );

        // Extract text from CV
        const absoluteFilePath = path.join(config.storage.uploadDir, cv.cv_file_path);
        const extractedText = await textExtraction.extractText(absoluteFilePath, cv.cv_mime_type);

        // Analyze CV
        const analysisResult = await analysisEngine.analyzeCV(extractedText);

        // Update database with results
        await connection.execute(
          `UPDATE cv_submissions 
           SET analysis_score = ?,
               analysis_results = ?,
               analysis_status = 'completed'
           WHERE id = ?`,
          [analysisResult.overallScore, JSON.stringify(analysisResult), cv.id]
        );

        console.log(`✓ CV analyzed successfully: ${cv.uuid} (Score: ${analysisResult.overallScore})`);
        processed++;

      } catch (error) {
        console.error(`✗ Failed to analyze CV ${cv.uuid}:`, error);
        
        // Mark as failed
        await connection.execute(
          `UPDATE cv_submissions 
           SET analysis_status = 'failed'
           WHERE id = ?`,
          [cv.id]
        );
        
        failed++;
      }
    }

    console.log('--------------------------------------------------------------------------------');
    console.log(`Processing Complete:`);
    console.log(`  ✓ Analyzed: ${processed}`);
    console.log(`  ✗ Failed: ${failed}`);
    console.log('================================================================================');

  } catch (error) {
    console.error('CV Analysis Processor Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the processor
processCVAnalysis()
  .then(() => {
    console.log('CV Analysis Processor finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('CV Analysis Processor failed:', error);
    process.exit(1);
  });
