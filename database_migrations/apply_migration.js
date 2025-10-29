/**
 * Database Migration Script
 * Applies the CV Analysis columns migration to the database
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

async function applyMigration() {
  let connection;
  
  try {
    // Get migration filename from command line argument
    const migrationFile = process.argv[2] || 'add_cv_analysis_columns.sql';
    
    console.log('🔌 Connecting to database...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully\n');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, migrationFile);
    console.log(`📄 Reading migration file: ${migrationFile}...`);
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    // Check if this is the email queue migration
    const isEmailQueueMigration = migrationFile.includes('email_queue');
    
    if (isEmailQueueMigration) {
      // Check if email queue columns already exist
      console.log('🔍 Checking if email queue migration has already been applied...');
      const [columns] = await connection.query(
        `SELECT COLUMN_NAME 
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = 'cv_submissions' 
         AND COLUMN_NAME IN ('email_scheduled_at', 'email_status', 'email_attempts')`,
        [dbConfig.database]
      );
      
      if (columns.length > 0) {
        console.log('⚠️  Warning: Some email queue columns already exist:');
        columns.forEach(col => console.log(`   - ${col.COLUMN_NAME}`));
        console.log('\n❓ Migration may have already been applied.');
        console.log('   To reapply, first run the rollback script.\n');
        return;
      }
    } else {
      // Check if analysis columns already exist
      console.log('🔍 Checking if migration has already been applied...');
      const [columns] = await connection.query(
        `SELECT COLUMN_NAME 
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = 'cv_submissions' 
         AND COLUMN_NAME IN ('analysis_score', 'analysis_results', 'email_sent_at', 'email_opened_at', 'converted_to_premium', 'conversion_date')`,
        [dbConfig.database]
      );
      
      if (columns.length > 0) {
        console.log('⚠️  Warning: Some columns already exist:');
        columns.forEach(col => console.log(`   - ${col.COLUMN_NAME}`));
        console.log('\n❓ Migration may have already been applied.');
        console.log('   To reapply, first run the rollback script.\n');
        return;
      }
    }
    
    // Apply the migration
    console.log('🚀 Applying migration...');
    await connection.query(migrationSQL);
    console.log('✅ Migration applied successfully!\n');
    
    // Verify the migration
    console.log('🔍 Verifying migration...');
    
    if (isEmailQueueMigration) {
      // Verify email queue columns
      const [newColumns] = await connection.query(
        `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = 'cv_submissions' 
         AND COLUMN_NAME IN ('email_scheduled_at', 'email_sent_at', 'email_status', 'email_attempts', 'email_last_attempt_at', 'email_error', 'email_opened_at', 'converted_to_premium', 'conversion_date')
         ORDER BY ORDINAL_POSITION`,
        [dbConfig.database]
      );
      
      console.log('✅ New columns added:');
      newColumns.forEach(col => {
        console.log(`   - ${col.COLUMN_NAME} (${col.COLUMN_TYPE})`);
        if (col.COLUMN_COMMENT) {
          console.log(`     Comment: ${col.COLUMN_COMMENT}`);
        }
      });
      
      // Verify indexes
      console.log('\n🔍 Verifying indexes...');
      const [indexes] = await connection.query(
        `SELECT DISTINCT INDEX_NAME 
         FROM INFORMATION_SCHEMA.STATISTICS 
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = 'cv_submissions' 
         AND INDEX_NAME IN ('idx_email_status', 'idx_email_scheduled_at', 'idx_email_sent_at', 'idx_converted_to_premium')`,
        [dbConfig.database]
      );
      
      console.log('✅ Indexes created:');
      indexes.forEach(idx => {
        console.log(`   - ${idx.INDEX_NAME}`);
      });
    } else {
      // Verify analysis columns
      const [newColumns] = await connection.query(
        `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = 'cv_submissions' 
         AND COLUMN_NAME IN ('analysis_score', 'analysis_results', 'email_sent_at', 'email_opened_at', 'converted_to_premium', 'conversion_date')
         ORDER BY ORDINAL_POSITION`,
        [dbConfig.database]
      );
      
      console.log('✅ New columns added:');
      newColumns.forEach(col => {
        console.log(`   - ${col.COLUMN_NAME} (${col.COLUMN_TYPE})`);
        if (col.COLUMN_COMMENT) {
          console.log(`     Comment: ${col.COLUMN_COMMENT}`);
        }
      });
      
      // Verify indexes
      console.log('\n🔍 Verifying indexes...');
      const [indexes] = await connection.query(
        `SELECT DISTINCT INDEX_NAME 
         FROM INFORMATION_SCHEMA.STATISTICS 
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = 'cv_submissions' 
         AND INDEX_NAME IN ('idx_analysis_score', 'idx_email_sent_at', 'idx_converted_to_premium', 'idx_conversion_date', 'idx_conversion_tracking')`,
        [dbConfig.database]
      );
      
      console.log('✅ Indexes created:');
      indexes.forEach(idx => {
        console.log(`   - ${idx.INDEX_NAME}`);
      });
    }
    
    console.log('\n✨ Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Tip: Check your database credentials in the .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Tip: Make sure your database server is running');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Tip: The database does not exist. Create it first or check DB_NAME in .env');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the migration
const migrationFile = process.argv[2] || 'add_cv_analysis_columns.sql';
console.log('═══════════════════════════════════════════════════════════');
console.log('  CV Analysis System - Database Migration');
console.log(`  Migration file: ${migrationFile}`);
console.log('═══════════════════════════════════════════════════════════\n');

applyMigration();
