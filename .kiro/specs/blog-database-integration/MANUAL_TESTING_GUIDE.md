# Blog Database Integration - Manual Testing Guide

## Overview
This guide provides step-by-step instructions for manually testing the blog database integration feature. Follow each section carefully and document any issues found.

## Prerequisites

### 1. Environment Setup
- Backend server configured with database connection
- Frontend development server ready
- Database contains at least one published blog article
- Admin panel access available

### 2. Required Tools
- Web browser (Chrome/Firefox recommended)
- Browser DevTools (for network inspection)
- Terminal access for starting servers

---

## Testing Checklist

### Phase 1: Server Startup and Route Verification

#### 1.1 Start Backend Server
```bash
npm run server:dev
```

**Expected Result:**
- Server starts on port 3001
- No errors in console
- Database connection successful
- Blog routes registered

**Verification:**
- [ ] Server starts without errors
- [ ] Console shows "Server running on port 3001"
- [ ] Console shows "Database connected successfully"
- [ ] No error messages in logs

#### 1.2 Verify Blog Routes are Accessible
Open browser or use curl to test endpoints:

```bash
# Test articles list endpoint
curl http://localhost:3001/api/blog/articles

# Test categories endpoint
curl http://localhost:3001/api/blog/categories
```

**Expected Result:**
- GET `/api/blog/articles` returns JSON with articles array
- GET `/api/blog/categories` returns JSON with categories array
- Status code 200 for both requests

**Verification:**
- [ ] Articles endpoint returns valid JSON
- [ ] Categories endpoint returns valid JSON
- [ ] No 404 or 500 errors
- [ ] Response includes expected fields (title, slug, excerpt, etc.)

---

### Phase 2: Test Article Creation (Admin Panel)

#### 2.1 Access Admin Panel
Navigate to: `http://localhost:5173/admin/blog`

**Verification:**
- [ ] Admin panel loads successfully
- [ ] Blog management interface is visible
- [ ] Can see existing articles (if any)

#### 2.2 Create Test Article (if needed)
If no published articles exist, create one:

**Test Article Details:**
- Title: "Test Article for Integration Testing"
- Slug: "test-article-integration"
- Category: "Technology" (or any available category)
- Status: Published
- Content: At least 200 words of test content
- Featured Image: Any test image

**Verification:**
- [ ] Article saves successfully
- [ ] Article appears in admin article list
- [ ] Article status is "Published"
- [ ] Published date is set

#### 2.3 Create Multiple Test Articles
Create at least 3 more articles in different categories:

1. **Article 2:**
   - Title: "Career Development Tips"
   - Category: "Career"
   - Status: Published

2. **Article 3:**
   - Title: "Industry Insights 2024"
   - Category: "Industry"
   - Status: Published

3. **Article 4:**
   - Title: "Draft Article - Should Not Appear"
   - Category: "Technology"
   - Status: Draft (NOT Published)

**Verification:**
- [ ] All published articles saved successfully
- [ ] Draft article saved but not published
- [ ] Articles have different categories

---

### Phase 3: Frontend Blog List Page Testing

#### 3.1 Start Frontend Server
```bash
npm run dev
```

Navigate to: `http://localhost:5173/blog`

#### 3.2 Verify Articles Load from API
**Expected Result:**
- Blog page loads successfully
- Articles display in grid layout
- Only published articles appear (draft should NOT appear)
- Articles show: title, excerpt, author, date, category, image

**Verification:**
- [ ] Page loads without errors
- [ ] Articles display correctly
- [ ] Draft article does NOT appear
- [ ] All published articles are visible
- [ ] Loading indicator appears briefly during fetch
- [ ] No error messages displayed

#### 3.3 Check Browser DevTools Network Tab
Open DevTools → Network tab → Refresh page

**Verification:**
- [ ] Request to `/api/blog/articles` is made
- [ ] Request returns status 200
- [ ] Response contains articles array
- [ ] Response time is reasonable (<1 second)

#### 3.4 Verify Article Data Display
For each article card, verify:

**Verification:**
- [ ] Title displays correctly
- [ ] Excerpt displays correctly
- [ ] Author name displays
- [ ] Published date displays in readable format
- [ ] Category badge displays
- [ ] Featured image loads (or placeholder shows)
- [ ] "Read More" button is present

---

### Phase 4: Search Functionality Testing

#### 4.1 Test Search with Various Queries

**Test Case 1: Search by Title**
- Enter: "Test Article"
- Expected: Articles with "Test Article" in title appear

**Test Case 2: Search by Content**
- Enter: "Career Development"
- Expected: Articles with matching content appear

**Test Case 3: Search with No Results**
- Enter: "XYZ123NonExistent"
- Expected: "No articles found" message displays

**Test Case 4: Clear Search**
- Clear search box
- Expected: All articles reappear

**Verification:**
- [ ] Search filters articles correctly
- [ ] Search is case-insensitive
- [ ] Search works for both title and excerpt
- [ ] No results message displays when appropriate
- [ ] Clearing search restores all articles

---

### Phase 5: Category Filter Testing

#### 5.1 Test Category Filters

**Test Case 1: Filter by Technology**
- Click "Technology" category
- Expected: Only Technology articles display

**Test Case 2: Filter by Career**
- Click "Career" category
- Expected: Only Career articles display

**Test Case 3: Filter by Industry**
- Click "Industry" category
- Expected: Only Industry articles display

**Test Case 4: Clear Filter**
- Click "All" or clear filter
- Expected: All articles display again

**Verification:**
- [ ] Category filter works correctly
- [ ] Only articles in selected category display
- [ ] Category badges match filter selection
- [ ] "All" option shows all articles
- [ ] Filter persists during search

---

### Phase 6: Pagination Testing

#### 6.1 Test Pagination (if 7+ articles exist)

**Note:** Pagination shows 6 articles per page. Create more test articles if needed.

**Test Case 1: Navigate to Page 2**
- Click "Next" or page 2 button
- Expected: Next 6 articles display

**Test Case 2: Navigate Back to Page 1**
- Click "Previous" or page 1 button
- Expected: First 6 articles display

**Test Case 3: Scroll Behavior**
- Navigate between pages
- Expected: Page scrolls to top automatically

**Verification:**
- [ ] Pagination controls display when needed
- [ ] Page navigation works correctly
- [ ] Correct articles display on each page
- [ ] Page scrolls to top on navigation
- [ ] Current page is highlighted
- [ ] Pagination updates with filters

---

### Phase 7: Blog Post Detail Page Testing

#### 7.1 Open Article Detail Page
- Click on any article from the list
- Expected: Navigate to `/blog/[slug]`

**Verification:**
- [ ] Detail page loads successfully
- [ ] URL contains correct slug
- [ ] Loading indicator appears briefly

#### 7.2 Verify Article Content Display

**Verification:**
- [ ] Full article title displays
- [ ] Featured image displays (if exists)
- [ ] Author information displays
- [ ] Published date displays
- [ ] Category badge displays
- [ ] Tags display (if exists)
- [ ] Read time displays
- [ ] View count displays
- [ ] Full content renders correctly
- [ ] Markdown formatting works (headings, lists, links, etc.)

#### 7.3 Verify View Count Increments

**Test Steps:**
1. Note the current view count
2. Refresh the page
3. Check view count again

**Verification:**
- [ ] View count increases by 1 after refresh
- [ ] View count persists in database
- [ ] View count displays correctly

#### 7.4 Verify Related Articles Display

**Verification:**
- [ ] Related articles section displays
- [ ] Related articles are from same category
- [ ] Related articles show title, excerpt, image
- [ ] Clicking related article navigates correctly
- [ ] Maximum 3 related articles display

---

### Phase 8: Error Handling Testing

#### 8.1 Test Backend Server Offline

**Test Steps:**
1. Stop the backend server (Ctrl+C in server terminal)
2. Refresh blog list page
3. Try to open an article

**Expected Result:**
- Error message displays: "Unable to load articles"
- Retry button appears
- No application crash

**Verification:**
- [ ] Error message displays on blog list page
- [ ] Error message displays on detail page
- [ ] Retry button is visible
- [ ] Application doesn't crash
- [ ] Error is user-friendly

#### 8.2 Test Retry Functionality

**Test Steps:**
1. With server still stopped, click "Retry" button
2. Expected: Error persists (server still down)
3. Restart backend server
4. Click "Retry" button again
5. Expected: Articles load successfully

**Verification:**
- [ ] Retry button triggers new API request
- [ ] Error persists when server is down
- [ ] Articles load after server restart
- [ ] Loading indicator shows during retry
- [ ] Success state restores properly

#### 8.3 Test Invalid Article Slug

**Test Steps:**
1. Navigate to: `http://localhost:5173/blog/non-existent-article-slug`
2. Expected: 404 error message displays

**Verification:**
- [ ] 404 error message displays
- [ ] Message is user-friendly
- [ ] No application crash
- [ ] Option to return to blog list

---

### Phase 9: Network Performance Testing

#### 9.1 Test with Slow Network

**Test Steps:**
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Refresh blog list page
4. Open an article

**Verification:**
- [ ] Loading indicators display during slow load
- [ ] Content loads eventually
- [ ] No timeout errors
- [ ] Images load progressively
- [ ] Application remains responsive

#### 9.2 Test Caching Behavior

**Test Steps:**
1. Load blog list page (first load)
2. Note response time in Network tab
3. Navigate away and back to blog list
4. Note response time again (should be faster if cached)

**Verification:**
- [ ] Second load is faster (if caching implemented)
- [ ] Data is consistent between loads
- [ ] No stale data issues

---

### Phase 10: Cross-Browser Testing

#### 10.1 Test in Multiple Browsers

Test the following in each browser:
- Chrome
- Firefox
- Safari (if on Mac)
- Edge

**Basic Tests:**
- Load blog list page
- Search for articles
- Filter by category
- Open article detail page
- Test error handling

**Verification:**
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] No browser-specific issues

---

### Phase 11: Mobile Responsiveness Testing

#### 11.1 Test on Mobile Devices

**Test Steps:**
1. Open DevTools → Toggle device toolbar
2. Select mobile device (iPhone, Android)
3. Test all functionality

**Verification:**
- [ ] Blog list displays correctly on mobile
- [ ] Article cards are readable
- [ ] Search works on mobile
- [ ] Category filter works on mobile
- [ ] Article detail page is readable
- [ ] Images scale appropriately
- [ ] Touch interactions work

---

## Test Results Summary

### Issues Found
Document any issues discovered during testing:

| Issue # | Description | Severity | Page/Feature | Status |
|---------|-------------|----------|--------------|--------|
| 1       |             |          |              |        |
| 2       |             |          |              |        |
| 3       |             |          |              |        |

### Test Coverage
- [ ] All test cases executed
- [ ] All verifications completed
- [ ] Issues documented
- [ ] Critical issues resolved

### Sign-Off
- Tester Name: _______________
- Date: _______________
- Overall Status: ☐ Pass ☐ Pass with Issues ☐ Fail

---

## Quick Reference Commands

### Start Servers
```bash
# Backend
npm run server:dev

# Frontend
npm run dev
```

### Test API Endpoints
```bash
# List articles
curl http://localhost:3001/api/blog/articles

# Get single article
curl http://localhost:3001/api/blog/articles/test-article-integration

# Get categories
curl http://localhost:3001/api/blog/categories
```

### Check Logs
```bash
# Backend logs
tail -f logs/combined.log

# Error logs
tail -f logs/error.log
```

---

## Notes
- Document any unexpected behavior
- Take screenshots of issues
- Note browser console errors
- Record network request failures
- Save error messages for debugging
