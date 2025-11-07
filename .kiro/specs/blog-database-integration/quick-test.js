/**
 * Quick Test Script for Blog Database Integration
 * Run this to verify the blog API is working
 */

const API_URL = 'http://localhost:3001';

async function testBlogAPI() {
  console.log('🧪 Testing Blog Database Integration\n');
  console.log('=' .repeat(60));
  
  let passedTests = 0;
  let failedTests = 0;
  
  // Test 1: Health Check
  console.log('\n📋 Test 1: Server Health Check');
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    if (response.ok && data.status === 'ok') {
      console.log('✅ PASS: Server is running');
      passedTests++;
    } else {
      console.log('❌ FAIL: Server health check failed');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ FAIL: Cannot connect to server');
    console.log('   Make sure the backend server is running: npm run server:dev');
    failedTests++;
    return;
  }
  
  // Test 2: Get Articles List
  console.log('\n📋 Test 2: Get Articles List');
  try {
    const response = await fetch(`${API_URL}/api/blog/articles`);
    const data = await response.json();
    
    if (response.ok && data.success && Array.isArray(data.articles)) {
      console.log(`✅ PASS: Articles endpoint working (${data.articles.length} articles found)`);
      
      if (data.articles.length > 0) {
        const article = data.articles[0];
        console.log(`   Sample article: "${article.title}"`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Category: ${article.category}`);
        console.log(`   Author: ${article.author}`);
      } else {
        console.log('   ⚠️  WARNING: No articles found in database');
        console.log('   Create a published article in the admin panel');
      }
      passedTests++;
    } else {
      console.log('❌ FAIL: Articles endpoint returned invalid data');
      console.log('   Response:', JSON.stringify(data, null, 2));
      failedTests++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error fetching articles');
    console.log('   Error:', error.message);
    failedTests++;
  }
  
  // Test 3: Get Categories
  console.log('\n📋 Test 3: Get Categories');
  try {
    const response = await fetch(`${API_URL}/api/blog/categories`);
    const data = await response.json();
    
    if (response.ok && data.success && Array.isArray(data.categories)) {
      console.log(`✅ PASS: Categories endpoint working (${data.categories.length} categories found)`);
      if (data.categories.length > 0) {
        console.log('   Categories:', data.categories.map(c => c.name).join(', '));
      }
      passedTests++;
    } else {
      console.log('❌ FAIL: Categories endpoint returned invalid data');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error fetching categories');
    console.log('   Error:', error.message);
    failedTests++;
  }
  
  // Test 4: Get Single Article (if articles exist)
  console.log('\n📋 Test 4: Get Single Article by Slug');
  try {
    // First get the list to find a slug
    const listResponse = await fetch(`${API_URL}/api/blog/articles`);
    const listData = await listResponse.json();
    
    if (listData.articles && listData.articles.length > 0) {
      const testSlug = listData.articles[0].slug;
      const response = await fetch(`${API_URL}/api/blog/articles/${testSlug}`);
      const data = await response.json();
      
      if (response.ok && data.success && data.article) {
        console.log(`✅ PASS: Single article endpoint working`);
        console.log(`   Article: "${data.article.title}"`);
        console.log(`   Views: ${data.article.views}`);
        console.log(`   Related articles: ${data.relatedArticles?.length || 0}`);
        passedTests++;
      } else {
        console.log('❌ FAIL: Single article endpoint returned invalid data');
        failedTests++;
      }
    } else {
      console.log('⏭️  SKIP: No articles available to test');
    }
  } catch (error) {
    console.log('❌ FAIL: Error fetching single article');
    console.log('   Error:', error.message);
    failedTests++;
  }
  
  // Test 5: Test 404 for Invalid Slug
  console.log('\n📋 Test 5: Test 404 for Invalid Slug');
  try {
    const response = await fetch(`${API_URL}/api/blog/articles/non-existent-slug-12345`);
    const data = await response.json();
    
    if (response.status === 404 && !data.success) {
      console.log('✅ PASS: 404 handling works correctly');
      passedTests++;
    } else {
      console.log('❌ FAIL: 404 handling not working as expected');
      console.log('   Expected 404, got:', response.status);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ FAIL: Error testing 404 handling');
    console.log('   Error:', error.message);
    failedTests++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   Total:  ${passedTests + failedTests}`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Blog API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📝 Next Steps:');
  console.log('   1. Start frontend: npm run dev');
  console.log('   2. Visit: http://localhost:5173/blog');
  console.log('   3. Follow the manual testing guide for complete verification');
  console.log('\n');
}

// Run tests
testBlogAPI().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
