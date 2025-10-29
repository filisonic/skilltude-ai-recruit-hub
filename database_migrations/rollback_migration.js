/**
 * Database Rollback Script
 * Rolls back the CV Analysis columns migration
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
    console.log('🔍 Checking if migration columns exist...');
    const [columns] = await connection.query(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'cv_submissions' 
       AND COLUMN_NAME IN ('analysis_score', 'analysis_results', 'email_sent_at', 'email_opened_at', 'converted_to_premium', 'conversion_date')`,
      [dbConfig.database]
    );
    
    if (columns.length === 0) {
      console.log('⚠️  Warning: No migration columns found.');
      console.log('   Migration may not have been applied yet.\n');
      return;
    }
    
    console.log('📋 Found columns to remove:');
    columns.forEach(col => console.log(`   - ${col.COLUMN_NAME}`));
    console.log('');
    
    // Read the rollback file
    const rollbackPath = path.join(__dirname, 'rollback_cv_analysis_columns.sql');
    console.log('📄 Reading rollback file...');
    const rollbackSQL = await fs.readFile(rollbackPath, 'utf8');
    
    // Apply the rollback
    console.log('🔄 Rolling back migration...');
    await connection.query(rollbackSQL);
    console.log('✅ Rollback completed successfully!\n');
    
    // Verify the rollback
    console.log('🔍 Verifying rollback...');
    const [remainingColumns] = await connection.query(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'cv_submissions' 
       AND COLUMN_NAME IN ('analysis_score', 'analysis_results', 'email_sent_at', 'email_opened_at', 'converted_to_premium', 'conversion_date')`,
      [dbConfig.database]
    );
    
    if (remainingColumns.length === 0) {
      console.log('✅ All migration columns removed successfully');
    } else {
      console.log('⚠️  Warning: Some columns still exist:');
      remainingColumns.forEach(col => console.log(`   - ${col.COLUMN_NAME}`));
    }
    
    // Verify indexes are removed
    console.log('\n🔍 Verifying indexes removed...');
    const [remainingIndexes] = await connection.query(
      `SELECT DISTINCT INDEX_NAME 
       FROM INFORMATION_SCHEMA.STATISTICS 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME = 'cv_submissions' 
       AND INDEX_NAME IN ('idx_analysis_score', 'idx_email_sent_at', 'idx_converted_to_premium', 'idx_conversion_date', 'idx_conversion_tracking')`,
      [dbConfig.database]
    );
    
    if (remainingIndexes.length === 0) {
      console.log('✅ All migration indexes removed successfully');
    } else {
      console.log('⚠️  Warning: Some indexes still exist:');
      remainingIndexes.forEach(idx => console.log(`   - ${idx.INDEX_NAME}`));
    }
    
    console.log('\n✨ Rollback completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Rollback failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Tip: Check your database credentials in the .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Tip: Make sure your database server is running');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Tip: The database does not exist. Check DB_NAME in .env');
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
console.log('  CV Analysis System - Database Rollback');
console.log('  Removing analysis-related columns from cv_submissions');
console.log('═══════════════════════════════════════════════════════════\n');

rollbackMigration();
