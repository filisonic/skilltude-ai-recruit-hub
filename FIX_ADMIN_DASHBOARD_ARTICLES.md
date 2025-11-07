# Fix Admin Dashboard - Show Real Articles

## Problem
- ✅ Articles save to database
- ✅ Articles appear on public blog
- ❌ Articles don't show in admin dashboard
- ❌ Can't edit or delete articles from dashboard

## Root Cause
The admin dashboard was loading hardcoded mock data instead of fetching real articles from the database.

## Solution

### 1. Created New Admin API Endpoint
**File:** `api/blog/admin/list.php`

This endpoint:
- Returns ALL articles (including drafts)
- Includes status field (published/draft)
- Sorted by creation date (newest first)
- Includes all metadata needed for dashboard

### 2. Updated Admin Dashboard
**File:** `src/pages/AdminDashboardEnhanced.tsx`

Changed from:
```javascript
// Load sample data (in production, fetch from database)
setArticles([...hardcoded data...]);
```

To:
```javascript
// Load real articles from admin API (includes drafts)
const response = await fetch('https://skilltude.com/api/blog/admin/list.php');
const data = await response.json();
setArticles(data.articles);
```

## Upload Instructions

### Step 1: Upload New API File
Upload to Hostinger:
- `api/blog/admin/list.php` → `public_html/api/blog/admin/list.php`

### Step 2: Rebuild Frontend
```bash
npm run build
```

### Step 3: Upload New Frontend
Upload the `dist` folder contents to `public_html/`

## After Upload

### Dashboard Will Show:
- ✅ All published articles
- ✅ All draft articles
- ✅ Real article counts
- ✅ Actual view counts
- ✅ Edit buttons (will work once you click them)
- ✅ Delete buttons (will work)

### You Can Now:
1. **View all articles** - See everything you've created
2. **Filter by status** - Published, Draft, or All
3. **Search articles** - By title or content
4. **Edit articles** - Click edit button (needs one more fix)
5. **Delete articles** - Click delete button (already works)

## API Endpoints Summary

Now you have 4 admin API endpoints:

1. **list.php** - Get all articles (including drafts) for admin dashboard
2. **create.php** - Create new articles
3. **update.php** - Edit existing articles
4. **delete.php** - Delete articles

Plus 2 public API endpoints:

5. **articles.php** - Get published articles for blog page
6. **article.php** - Get single article by slug

## Testing

After uploading:

1. Go to https://skilltude.com/admin/dashboard
2. Click on "Blog Articles" tab
3. You should see:
   - Your newly created article
   - All existing articles from database
   - Correct status (Published/Draft)
   - Real view counts

## Next Step: Fix Edit Function

The edit button will need one more small fix to load the article data when you click it. But delete should work immediately!

## File Locations on Hostinger

```
public_html/
├── api/
│   └── blog/
│       ├── articles.php (public - published only)
│       ├── article.php (public - single article)
│       └── admin/
│           ├── list.php (NEW - all articles for dashboard)
│           ├── create.php (create new)
│           ├── update.php (edit existing)
│           └── delete.php (delete)
└── [dist folder contents]
```
