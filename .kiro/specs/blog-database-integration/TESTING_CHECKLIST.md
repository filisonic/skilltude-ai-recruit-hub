# Blog Database Integration - Testing Checklist

Use this checklist to track your manual testing progress. Check off each item as you complete it.

## Pre-Testing Setup

### Environment Setup
- [ ] Backend server can start: `npm run server:dev`
- [ ] Frontend server can start: `npm run dev`
- [ ] Database connection is working
- [ ] Environment variables are configured correctly

### Test Data Preparation
- [ ] At least 1 published article exists in database
- [ ] At least 4 published articles exist (for pagination)
- [ ] Articles exist in different categories
- [ ] At least 1 draft article exists (should NOT appear on frontend)
- [ ] Admin panel is accessible

### Quick API Verification
- [ ] Run quick test script: `node .kiro/specs/blog-database-integration/quick-test.js`
- [ ] All API tests pass

---

## Phase 1: Backend Route Verification

### Server Startup
- [ ] Backend server starts without errors
- [ ] Console shows "Server running on port 3001"
- [ ] Console shows database connection success
- [ ] No error messages in logs

### API Endpoints
- [ ] GET `/api/blog/articles` returns 200
- [ ] GET `/api/blog/articles` returns valid JSON with articles array
- [ ] GET `/api/blog/categories` returns 200
- [ ] GET `/api/blog/categories` returns valid JSON with categories array
- [ ] GET `/api/blog/articles/:slug` returns 200 for valid slug
- [ ] GET `/api/blog/articles/:slug` returns 404 for invalid slug

---

## Phase 2: Frontend Blog List Page

### Page Load
- [ ] Navigate to `http://localhost:5173/blog`
- [ ] Page loads without errors
- [ ] Loading indicator appears briefly
- [ ] Articles display after loading

### Article Display
- [ ] Only published articles appear (draft articles do NOT appear)
- [ ] Each article shows title
- [ ] Each article shows excerpt
- [ ] Each article shows author name
- [ ] Each article shows published date
- [ ] Each article shows category badge
- [ ] Each article shows featured image (or placeholder)
- [ ] Each article has "Read More" button

### Browser DevTools Check
- [ ] Open DevTools → Network tab
- [ ] Request to `/api/blog/articles` is made
- [ ] Request returns status 200
- [ ] Response contains articles array
- [ ] Response time is reasonable (<1 second)

---

## Phase 3: Search Functionality

### Search Tests
- [ ] Search for article by title - results appear
- [ ] Search for article by excerpt content - results appear
- [ ] Search is case-insensitive
- [ ] Search with no results shows "No articles found" message
- [ ] Clear search box - all articles reappear
- [ ] Search works while category filter is active

---

## Phase 4: Category Filter

### Filter Tests
- [ ] Click "Technology" category - only Technology articles display
- [ ] Click "Career" category - only Career articles display
- [ ] Click "Industry" category - only Industry articles display
- [ ] Click "All" - all articles display again
- [ ] Category badges match selected filter
- [ ] Filter works while search is active

---

## Phase 5: Pagination

### Pagination Tests (if 7+ articles exist)
- [ ] Pagination controls display
- [ ] Click "Next" or page 2 - next 6 articles display
- [ ] Click "Previous" or page 1 - first 6 articles display
- [ ] Page scrolls to top on navigation
- [ ] Current page is highlighted
- [ ] Pagination updates correctly with filters

---

## Phase 6: Article Detail Page

### Navigation
- [ ] Click article from list
- [ ] Navigate to `/blog/:slug`
- [ ] Loading indicator appears briefly
- [ ] Article loads successfully

### Content Display
- [ ] Full article title displays
- [ ] Featured image displays (if exists)
- [ ] Author information displays
- [ ] Published date displays
- [ ] Category badge displays
- [ ] Tags display (if exists)
- [ ] Read time displays
- [ ] View count displays
- [ ] Full content renders correctly
- [ ] Markdown formatting works (headings, lists, links, bold, italic)

### View Count
- [ ] Note current view count
- [ ] Refresh page
- [ ] View count increases by 1
- [ ] View count persists

### Related Articles
- [ ] Related articles section displays
- [ ] Related articles are from same category
- [ ] Related articles show title, excerpt, image
- [ ] Maximum 3 related articles display
- [ ] Click related article - navigates correctly

---

## Phase 7: Error Handling

### Backend Offline Test
- [ ] Stop backend server
- [ ] Refresh blog list page
- [ ] Error message displays: "Unable to load articles"
- [ ] Retry button appears
- [ ] Application doesn't crash
- [ ] Error message is user-friendly

### Retry Functionality
- [ ] With server stopped, click "Retry" button
- [ ] Error persists (server still down)
- [ ] Restart backend server
- [ ] Click "Retry" button again
- [ ] Articles load successfully
- [ ] Loading indicator shows during retry

### 404 Handling
- [ ] Navigate to `/blog/non-existent-slug-12345`
- [ ] 404 error message displays
- [ ] Message is user-friendly
- [ ] No application crash
- [ ] Option to return to blog list exists

### Article Detail Error
- [ ] Stop backend server
- [ ] Try to open article detail page
- [ ] Error message displays
- [ ] Retry button appears
- [ ] Application doesn't crash

---

## Phase 8: Performance Testing

### Slow Network Test
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Slow 3G"
- [ ] Refresh blog list page
- [ ] Loading indicators display during slow load
- [ ] Content loads eventually (no timeout)
- [ ] Images load progressively
- [ ] Application remains responsive

### Caching Test
- [ ] Load blog list page (note response time)
- [ ] Navigate away and back to blog list
- [ ] Second load is faster (if caching implemented)
- [ ] Data is consistent between loads

---

## Phase 9: Cross-Browser Testing

### Chrome
- [ ] Blog list page works
- [ ] Search works
- [ ] Category filter works
- [ ] Article detail page works
- [ ] Error handling works

### Firefox
- [ ] Blog list page works
- [ ] Search works
- [ ] Category filter works
- [ ] Article detail page works
- [ ] Error handling works

### Safari (if on Mac)
- [ ] Blog list page works
- [ ] Search works
- [ ] Category filter works
- [ ] Article detail page works
- [ ] Error handling works

### Edge
- [ ] Blog list page works
- [ ] Search works
- [ ] Category filter works
- [ ] Article detail page works
- [ ] Error handling works

---

## Phase 10: Mobile Responsiveness

### Mobile Device Testing
- [ ] Open DevTools → Toggle device toolbar
- [ ] Select iPhone or Android device
- [ ] Blog list displays correctly on mobile
- [ ] Article cards are readable
- [ ] Search input works on mobile
- [ ] Category filter works on mobile
- [ ] Pagination works on mobile (if applicable)
- [ ] Article detail page is readable on mobile
- [ ] Images scale appropriately
- [ ] Touch interactions work
- [ ] No horizontal scrolling issues

---

## Phase 11: Additional Verification

### Console Errors
- [ ] No errors in browser console (blog list page)
- [ ] No errors in browser console (article detail page)
- [ ] No errors in backend server logs

### Data Integrity
- [ ] Article data matches database
- [ ] Author names display correctly
- [ ] Dates format correctly
- [ ] Categories match database values
- [ ] Tags display correctly

### User Experience
- [ ] Loading states are clear
- [ ] Error messages are helpful
- [ ] Navigation is intuitive
- [ ] Page transitions are smooth
- [ ] Images load without layout shift

---

## Issues Found

Document any issues discovered:

| # | Issue Description | Severity | Page/Feature | Status |
|---|-------------------|----------|--------------|--------|
| 1 |                   |          |              |        |
| 2 |                   |          |              |        |
| 3 |                   |          |              |        |

**Severity Levels:**
- Critical: Blocks core functionality
- High: Major feature broken
- Medium: Feature works but has issues
- Low: Minor cosmetic or UX issue

---

## Final Sign-Off

### Test Summary
- Total Tests: _____ / _____
- Passed: _____
- Failed: _____
- Skipped: _____

### Overall Assessment
- [ ] All critical tests passed
- [ ] All high-priority tests passed
- [ ] No blocking issues found
- [ ] Ready for production deployment

### Tester Information
- **Name:** _______________
- **Date:** _______________
- **Time Spent:** _______________

### Status
- [ ] ✅ PASS - All tests passed, ready for deployment
- [ ] ⚠️ PASS WITH ISSUES - Tests passed but minor issues noted
- [ ] ❌ FAIL - Critical issues found, needs fixes

### Notes
```
[Add any additional observations, recommendations, or concerns]
```

---

## Next Steps

After completing this checklist:

1. [ ] Review all issues found
2. [ ] Prioritize issues by severity
3. [ ] Create tickets for issues that need fixing
4. [ ] Update documentation if needed
5. [ ] Mark Task 11 as complete in tasks.md
6. [ ] Prepare for deployment (if all tests pass)

---

**Checklist Version:** 1.0
**Last Updated:** [Current Date]
