/**
 * Quick test script to check blog database connection and data
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testBlogConnection() {
  let connection;
  
  try {
    console.log('🔍 Testing blog database connection...\n');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Database connection successful');

    // Check if blog_articles table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'blog_articles'"
    );
    
    if (tables.length === 0) {
      console.log('❌ blog_articles table does not exist');
      console.log('💡 Run the SQL migration: database_migrations/create_blog_tables.sql');
      return;
    }
    
    console.log('✅ blog_articles table exists');

    // Check if there are any published articles
    const [articles] = await connection.execute(
      "SELECT COUNT(*) as count FROM blog_articles WHERE status = 'published'"
    );
    
    const articleCount = articles[0].count;
    console.log(`📄 Found ${articleCount} published articles`);
    
    if (articleCount === 0) {
      console.log('❌ No published articles found');
      console.log('💡 Insert some sample data using the migration script');
      return;
    }

    // Show sample articles
    const [sampleArticles] = await connection.execute(
      "SELECT id, title, slug, category, published_at FROM blog_articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 3"
    );
    
    console.log('\n📋 Sample articles:');
    sampleArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.category})`);
    });

    // Test the API endpoint URL
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:3001';
    console.log(`\n🌐 API URL: ${apiUrl}/api/blog/articles`);
    
    console.log('\n✅ Blog setup looks good!');
    console.log('💡 Make sure your server is running with: npm run server:dev');

  } catch (error) {
    console.error('❌ Error testing blog connection:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Check your database host configuration');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Check your database credentials');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Check your database name');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the test
testBlogConnection();