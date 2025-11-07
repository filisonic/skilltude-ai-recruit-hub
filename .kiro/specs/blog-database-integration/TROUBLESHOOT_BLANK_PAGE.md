# Troubleshooting: Blank Page Issue

## Quick Diagnosis

The blank page issue is likely caused by one of these problems:

### 1. Backend Not Running or Not Accessible
### 2. No Articles in Database
### 3. CORS Configuration Issue
### 4. Frontend API URL Misconfigured

---

## Step-by-Step Troubleshooting

### Step 1: Check Backend Server

**Open your backend terminal and verify:**
- Is the server running?
- Do you see "Server running on port 3001"?
- Are there any error messages?

**If backend is NOT running:**
```bash
npm run server:dev
```

**Expected output:**
```
╔════════════════════════════════════════════════════════════════╗
║   CV Analysis System Server                                    ║
║   Environment: development                                     ║
║   Port:        3001                                            ║
║   Server is ready to accept connections                        ║
╚════════════════════════════════════════════════════════════════╝
```

---

### Step 2: Test Backend API Directly

**Open a new terminal and run:**
```bash
curl http://localhost:3001/api/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"...","environment":"development"}
```

**If this fails:**
- Backend is not running
- Port 3001 is blocked
- Backend crashed

**Test blog endpoint:**
```bash
curl http://localhost:3001/api/blog/articles
```

**Expected response:**
```json
{
  "success": true,
  "articles": [...]
}
```

**If you get empty articles array:**
```json
{
  "success": true,
  "articles": []
}
```
→ **Problem: No articles in database** (see Step 5)

---

### Step 3: Check Browser Console

**Open your browser:**
1. Press F12 to open DevTools
2. Go to Console tab
3. Refresh the page (F5)

**Look for errors:**

**Error 1: CORS Error**
```
Access to fetch at 'http://localhost:3001/api/blog/articles' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution:** Check backend `.env` file:
```env
FRONTEND_URL=http://localhost:5173
```

**Error 2: Network Error**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Solution:** Backend is not running. Start it with `npm run server:dev`

**Error 3: 404 Not Found**
```
GET http://localhost:3001/api/blog/articles 404 (Not Found)
```

**Solution:** Blog routes not registered. Check `server/index.ts`

---

### Step 4: Check Network Tab

**In DevTools:**
1. Go to Network tab
2. Refresh page (F5)
3. Look for request to `/api/blog/articles`

**Possible Issues:**

**Issue 1: Request shows "Failed" or "Cancelled"**
- Backend not running
- Wrong API URL

**Issue 2: Request shows 404**
- Routes not registered
- Wrong endpoint URL

**Issue 3: Request shows 500**
- Backend error
- Database connection issue
- Check backend terminal for error logs

**Issue 4: Request shows CORS error**
- CORS misconfiguration
- Check FRONTEND_URL in backend .env

---

### Step 5: Check Database for Articles

**The page will be blank if there are no published articles in the database.**

**To check, run this SQL query:**
```sql
SELECT id, title, slug, status FROM blog_articles WHERE status = 'published';
```

**If no results:**
You need to create articles in the admin panel:
1. Go to: http://localhost:5173/admin/blog
2. Create a new article
3. Set status to "Published"
4. Save

**Or insert test data directly:**
```sql
INSERT INTO blog_articles (
  title, slug, excerpt, content, author, category, 
  featured_image, status, published_at, created_at, updated_at
) VALUES (
  'Test Article',
  'test-article',
  'This is a test article excerpt',
  'This is the full content of the test article.',
  'Admin',
  'Technology',
  'https://via.placeholder.com/800x600',
  'published',
  NOW(),
  NOW(),
  NOW()
);
```

---

### Step 6: Check Frontend Environment Variables

**Check your `.env` file in the root directory:**
```env
VITE_API_URL=http://localhost:3001
```

**If this is missing or wrong:**
1. Create/update `.env` file
2. Add the line above
3. Restart frontend server (Ctrl+C, then `npm run dev`)

---

### Step 7: Check for JavaScript Errors

**In browser console, look for:**

**Error: "Cannot read property 'map' of undefined"**
- API response doesn't have expected structure
- Check backend response format

**Error: "Unexpected token < in JSON"**
- Backend returning HTML instead of JSON
- Usually means 404 or server error

**Error: "Failed to fetch"**
- Network issue
- Backend not accessible
- CORS issue

---

## Quick Fix Checklist

Run through this checklist:

- [ ] Backend server is running (`npm run server:dev`)
- [ ] Backend responds to health check (`curl http://localhost:3001/api/health`)
- [ ] Backend returns articles (`curl http://localhost:3001/api/blog/articles`)
- [ ] At least one published article exists in database
- [ ] Frontend `.env` has `VITE_API_URL=http://localhost:3001`
- [ ] Backend `.env` has `FRONTEND_URL=http://localhost:5173`
- [ ] Frontend server is running (`npm run dev`)
- [ ] Browser console shows no errors (F12)
- [ ] Network tab shows successful API request

---

## Common Solutions

### Solution 1: No Articles in Database

**Create a test article:**
```bash
# Access your database and run:
INSERT INTO blog_articles (
  title, slug, excerpt, content, author, category, 
  featured_image, status, published_at, created_at, updated_at
) VALUES (
  'Welcome to Our Blog',
  'welcome-to-our-blog',
  'This is our first blog post. Welcome!',
  '# Welcome\n\nThis is the full content of our first blog post.',
  'SkillTude Team',
  'Company News',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
  'published',
  NOW(),
  NOW(),
  NOW()
);
```

### Solution 2: CORS Issue

**Update backend `.env`:**
```env
FRONTEND_URL=http://localhost:5173
```

**Restart backend server**

### Solution 3: Wrong API URL

**Update frontend `.env`:**
```env
VITE_API_URL=http://localhost:3001
```

**Restart frontend server**

### Solution 4: Backend Not Running

```bash
# In backend terminal
npm run server:dev
```

---

## Testing the Fix

After applying fixes:

1. **Restart both servers:**
   ```bash
   # Terminal 1: Backend
   npm run server:dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

2. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Or use Incognito/Private mode

3. **Test the page:**
   - Go to http://localhost:5173/blog
   - Should see articles loading
   - Check console for errors (F12)

4. **Run quick test:**
   ```bash
   node .kiro/specs/blog-database-integration/quick-test.js
   ```

---

## Still Having Issues?

### Collect Diagnostic Information

**1. Backend logs:**
```bash
# Check what backend is outputting
# Look for errors in the terminal running npm run server:dev
```

**2. Browser console:**
- Press F12
- Copy all errors from Console tab

**3. Network requests:**
- Press F12
- Go to Network tab
- Find the `/api/blog/articles` request
- Right-click → Copy → Copy as cURL

**4. Environment check:**
```bash
# Check frontend env
cat .env

# Check backend env  
cat server/.env
```

**5. Database check:**
```sql
-- Check if blog_articles table exists
SHOW TABLES LIKE 'blog_articles';

-- Check if any articles exist
SELECT COUNT(*) FROM blog_articles;

-- Check published articles
SELECT COUNT(*) FROM blog_articles WHERE status = 'published';
```

---

## Expected Behavior

When everything is working correctly:

1. **Backend terminal shows:**
   ```
   Server running on port 3001
   Database connected successfully
   ```

2. **Frontend loads at http://localhost:5173/blog**

3. **Browser console shows:**
   - No errors
   - Successful API request to `/api/blog/articles`

4. **Page displays:**
   - Blog header
   - Search bar
   - Category filters
   - Article cards (if articles exist)
   - Or "No articles found" message (if no articles)

5. **Network tab shows:**
   - Request to `/api/blog/articles`
   - Status: 200 OK
   - Response: JSON with articles array

---

## Emergency Diagnostic Script

Save this as `diagnose.js` and run with `node diagnose.js`:

```javascript
const API_URL = 'http://localhost:3001';

async function diagnose() {
  console.log('🔍 Running diagnostics...\n');
  
  // Test 1: Health check
  try {
    const response = await fetch(`${API_URL}/api/health`);
    console.log('✅ Backend is running');
  } catch (error) {
    console.log('❌ Backend is NOT running');
    console.log('   Start it with: npm run server:dev');
    return;
  }
  
  // Test 2: Articles endpoint
  try {
    const response = await fetch(`${API_URL}/api/blog/articles`);
    const data = await response.json();
    
    if (data.articles && data.articles.length > 0) {
      console.log(`✅ Found ${data.articles.length} articles`);
    } else {
      console.log('⚠️  No articles in database');
      console.log('   Create articles in admin panel');
    }
  } catch (error) {
    console.log('❌ Cannot fetch articles');
    console.log('   Error:', error.message);
  }
  
  console.log('\n✅ Diagnostics complete');
}

diagnose();
```

---

## Contact Support

If you've tried all the above and still have issues, provide:
1. Backend terminal output
2. Browser console errors
3. Network tab screenshot
4. Output from diagnostic script
5. Contents of `.env` files (remove sensitive data)
