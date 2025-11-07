/**
 * Blog Database Setup Script
 * 
 * This script creates the necessary database tables for the blog feature
 * and inserts sample data for testing.
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupBlogDatabase() {
  console.log('🔧 Blog Database Setup\n');
  console.log('='.repeat(60));
  
  // Database configuration from environment
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'u931066387_skilltude',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };
  
  console.log('\n📋 Database Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  console.log('');
  
  let connection;
  
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully\n');
    
    // Read SQL file
    console.log('📖 Reading migration SQL file...');
    const sqlFile = path.join(__dirname, 'database_migrations', 'create_blog_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log('✅ SQL file loaded\n');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim().length === 0) {
        continue;
      }
      
      try {
        await connection.query(statement);
        
        // Log progress for important statements
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE.*?`(\w+)`/)?.[1];
          console.log(`   ✅ Created table: ${tableName}`);
        } else if (statement.includes('INSERT')) {
          console.log(`   ✅ Inserted sample data`);
        }
      } catch (error) {
        // Ignore "table already exists" errors
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          const tableName = statement.match(/CREATE TABLE.*?`(\w+)`/)?.[1];
          console.log(`   ℹ️  Table already exists: ${tableName}`);
        } else if (error.code === 'ER_DUP_ENTRY') {
          console.log(`   ℹ️  Sample data already exists (skipping)`);
        } else {
          console.error(`   ❌ Error executing statement:`, error.message);
          console.error(`   Statement: ${statement.substring(0, 100)}...`);
        }
      }
    }
    
    console.log('\n📊 Verifying setup...\n');
    
    // Check if blog_articles table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'blog_articles'"
    );
    
    if (tables.length === 0) {
      console.log('❌ blog_articles table was not created');
      process.exit(1);
    }
    
    console.log('   ✅ blog_articles table exists');
    
    // Check if admin_users table exists
    const [adminTables] = await connection.query(
      "SHOW TABLES LIKE 'admin_users'"
    );
    
    if (adminTables.length === 0) {
      console.log('   ⚠️  admin_users table does not exist');
      console.log('   Note: Blog articles will not have author information');
    } else {
      console.log('   ✅ admin_users table exists');
    }
    
    // Count articles
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as count FROM blog_articles'
    );
    const articleCount = countResult[0].count;
    
    console.log(`   ✅ Found ${articleCount} articles in database`);
    
    // Show sample articles
    if (articleCount > 0) {
      const [articles] = await connection.query(
        'SELECT id, title, slug, category, status FROM blog_articles LIMIT 5'
      );
      
      console.log('\n📰 Sample Articles:');
      articles.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      Slug: ${article.slug}`);
        console.log(`      Category: ${article.category}`);
        console.log(`      Status: ${article.status}`);
        console.log('');
      });
    }
    
    console.log('='.repeat(60));
    console.log('\n🎉 Blog database setup complete!\n');
    console.log('Next steps:');
    console.log('1. Restart your backend server: npm run server:dev');
    console.log('2. Visit: http://localhost:5173/blog');
    console.log('3. You should see the sample articles\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed\n');
    }
  }
}

// Run setup
setupBlogDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
