/**
 * Blog Integration Diagnostic Script
 * Run this to quickly identify the issue with blank page
 */

const API_URL = 'http://localhost:3001';

async function diagnose() {
  console.log('🔍 Blog Integration Diagnostics\n');
  console.log('='.repeat(60));
  
  let issues = [];
  let warnings = [];
  
  // Test 1: Backend Health Check
  console.log('\n📋 Test 1: Backend Server Health');
  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ PASS: Backend server is running');
      console.log(`   Status: ${data.status}`);
      console.log(`   Environment: ${data.environment}`);
    } else {
      console.log(`❌ FAIL: Backend returned status ${response.status}`);
      issues.push('Backend server returned error status');
    }
  } catch (error) {
    console.log('❌ FAIL: Cannot connect to backend server');
    console.log(`   Error: ${error.message}`);
    issues.push('Backend server is not running or not accessible');
    console.log('\n💡 Solution: Start backend with: npm run server:dev');
    return; // Can't continue without backend
  }
  
  // Test 2: Blog Articles Endpoint
  console.log('\n📋 Test 2: Blog Articles API');
  try {
    const response = await fetch(`${API_URL}/api/blog/articles`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      console.log(`❌ FAIL: Articles endpoint returned status ${response.status}`);
      issues.push(`Articles API returned ${response.status}`);
      
      const text = await response.text();
      console.log(`   Response: ${text.substring(0, 200)}`);
      
      if (response.status === 404) {
        console.log('\n💡 Solution: Blog routes may not be registered in server/index.ts');
      }
    } else {
      const data = await response.json();
      
      if (!data.success) {
        console.log('❌ FAIL: API returned success: false');
        console.log(`   Error: ${data.error || 'Unknown error'}`);
        issues.push('API returned error response');
      } else if (!Array.isArray(data.articles)) {
        console.log('❌ FAIL: API response missing articles array');
        issues.push('Invalid API response structure');
      } else if (data.articles.length === 0) {
        console.log('⚠️  WARNING: No articles found in database');
        console.log('   The blog page will appear empty');
        warnings.push('No published articles in database');
        console.log('\n💡 Solution: Create articles in admin panel at http://localhost:5173/admin/blog');
      } else {
        console.log(`✅ PASS: Found ${data.articles.length} articles`);
        console.log('\n   Sample article:');
        const sample = data.articles[0];
        console.log(`   - Title: ${sample.title}`);
        console.log(`   - Slug: ${sample.slug}`);
        console.log(`   - Category: ${sample.category}`);
        console.log(`   - Author: ${sample.author}`);
        console.log(`   - Status: ${sample.status || 'N/A'}`);
      }
    }
  } catch (error) {
    console.log('❌ FAIL: Error fetching articles');
    console.log(`   Error: ${error.message}`);
    issues.push('Cannot fetch articles from API');
  }
  
  // Test 3: Categories Endpoint
  console.log('\n📋 Test 3: Blog Categories API');
  try {
    const response = await fetch(`${API_URL}/api/blog/categories`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.categories)) {
        console.log(`✅ PASS: Found ${data.categories.length} categories`);
        if (data.categories.length > 0) {
          console.log(`   Categories: ${data.categories.map(c => c.name).join(', ')}`);
        }
      } else {
        console.log('⚠️  WARNING: Categories endpoint returned unexpected format');
        warnings.push('Categories API response format issue');
      }
    } else {
      console.log(`⚠️  WARNING: Categories endpoint returned status ${response.status}`);
      warnings.push('Categories API not working');
    }
  } catch (error) {
    console.log('⚠️  WARNING: Error fetching categories');
    console.log(`   Error: ${error.message}`);
    warnings.push('Cannot fetch categories');
  }
  
  // Test 4: CORS Check
  console.log('\n📋 Test 4: CORS Configuration');
  try {
    const response = await fetch(`${API_URL}/api/blog/articles`, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173'
      }
    });
    
    const corsHeader = response.headers.get('access-control-allow-origin');
    if (corsHeader) {
      console.log('✅ PASS: CORS headers present');
      console.log(`   Allowed origin: ${corsHeader}`);
    } else {
      console.log('⚠️  WARNING: No CORS headers found');
      warnings.push('CORS may not be configured');
      console.log('\n💡 Check: Backend .env should have FRONTEND_URL=http://localhost:5173');
    }
  } catch (error) {
    console.log('⚠️  WARNING: Could not check CORS');
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 DIAGNOSTIC SUMMARY\n');
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log('🎉 All tests passed! Blog should be working.');
    console.log('\nNext steps:');
    console.log('1. Make sure frontend is running: npm run dev');
    console.log('2. Visit: http://localhost:5173/blog');
    console.log('3. Check browser console (F12) for any errors');
  } else {
    if (issues.length > 0) {
      console.log('❌ CRITICAL ISSUES FOUND:');
      issues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue}`);
      });
      console.log('');
    }
    
    if (warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
      console.log('');
    }
    
    console.log('📝 RECOMMENDED ACTIONS:\n');
    
    if (issues.some(i => i.includes('not running'))) {
      console.log('1. Start backend server:');
      console.log('   npm run server:dev\n');
    }
    
    if (warnings.some(w => w.includes('No published articles'))) {
      console.log('2. Create test articles:');
      console.log('   - Go to: http://localhost:5173/admin/blog');
      console.log('   - Create a new article');
      console.log('   - Set status to "Published"');
      console.log('   - Save\n');
    }
    
    if (warnings.some(w => w.includes('CORS'))) {
      console.log('3. Check CORS configuration:');
      console.log('   - Backend .env should have: FRONTEND_URL=http://localhost:5173');
      console.log('   - Restart backend after changing .env\n');
    }
    
    console.log('4. Check frontend configuration:');
    console.log('   - Root .env should have: VITE_API_URL=http://localhost:3001');
    console.log('   - Restart frontend after changing .env\n');
    
    console.log('5. Clear browser cache and try again\n');
  }
  
  console.log('='.repeat(60));
  console.log('\n📖 For detailed troubleshooting, see:');
  console.log('   .kiro/specs/blog-database-integration/TROUBLESHOOT_BLANK_PAGE.md\n');
}

// Run diagnostics
console.log('Starting diagnostics...\n');
diagnose().catch(error => {
  console.error('\n💥 Fatal error running diagnostics:', error);
  console.log('\nThis usually means:');
  console.log('1. Backend server is not running');
  console.log('2. Network connectivity issue');
  console.log('3. Port 3001 is blocked\n');
  process.exit(1);
});
