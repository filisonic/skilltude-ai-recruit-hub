/**
 * Email Queue Rollback Script
 * Rolls back the email queue fields migration
 */

import mysql from 'mysql2/promise';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  database: process.env.DB_NAME || 'skilltude_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

async function rollbackMigration() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully\n');
    
    // Check if columns exist
    console.log('🔍 Checking if email queue columns exist...');
    const [columns] = await connection.query(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'cv_submissions' 
       AND COLUMN_NAME IN ('email_scheduled_at', 'email_status', 'email_attempts')`,
      [dbConfig.database]
    );
    
    if (columns.length === 0) {
      console.log('⚠️  Warning: Email queue columns do not exist.');
      console.log('   Migration may not have been applied yet.\n');
      process.exit(0);
    }
    
    console.log('✅ Found email queue columns:');
    columns.forEach(col => console.log(`   - ${col.COLUMN_NAME}`));
    
    // Read the rollback file
    const rollbackPath = path.join(__dirname, 'rollback_email_queue_fields.sql');
    console.log('\n📄 Reading rollback file: rollback_email_queue_fields.sql...');
    const rollbackSQL = await fs.readFile(rollbackPath, 'utf8');
    
    // Apply the rollback
    console.log('🔄 Rolling back migration...');
    await connection.query(rollbackSQL);
    console.log('✅ Rollback applied successfully!\n');
    
    // Verify the rollback
    console.log('🔍 Verifying rollback...');
    const [remainingColumns] = await connection.query(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'cv_submissions' 
       AND COLUMN_NAME IN ('email_scheduled_at', 'email_sent_at', 'email_status', 'email_attempts', 'email_last_attempt_at', 'email_error')`,
      [dbConfig.database]
    );
    
    if (remainingColumns.length === 0) {
      console.log('✅ All email queue columns removed successfully');
    } else {
      console.log('⚠️  Warning: Some columns still exist:');
      remainingColumns.forEach(col => console.log(`   - ${col.COLUMN_NAME}`));
    }
    
    // Verify indexes
    console.log('\n🔍 Verifying indexes removed...');
    const [remainingIndexes] = await connection.query(
      `SELECT DISTINCT INDEX_NAME 
       FROM INFORMATION_SCHEMA.STATISTICS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'cv_submissions' 
       AND INDEX_NAME IN ('idx_email_status', 'idx_email_scheduled_at', 'idx_email_sent_at')`,
      [dbConfig.database]
    );
    
    if (remainingIndexes.length === 0) {
      console.log('✅ All email queue indexes removed successfully');
    } else {
      console.log('⚠️  Warning: Some indexes still exist:');
      remainingIndexes.forEach(idx => console.log(`   - ${idx.INDEX_NAME}`));
    }
    
    console.log('\n✨ Email queue rollback completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Rollback failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Tip: Check your database credentials in the .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Tip: Make sure your database server is running');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Tip: The database does not exist. Check DB_NAME in .env');
    } else if (error.code === 'ENOENT') {
      console.error('\n💡 Tip: Rollback file not found. Make sure rollback_email_queue_fields.sql exists');
    } else if (error.sqlMessage) {
      console.error(`\n💡 SQL Error: ${error.sqlMessage}`);
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the rollback
console.log('═══════════════════════════════════════════════════════════');
console.log('  CV Analysis System - Email Queue Rollback');
console.log('  Removing email queue fields from cv_submissions table');
console.log('═══════════════════════════════════════════════════════════\n');

rollbackMigration();
