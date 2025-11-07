# Fix WWW CORS Issue

## Problem
- `https://skilltude.com/blog` works ✅
- `https://www.skilltude.com/blog` shows "Blog articles not found" ❌

## Root Cause
The API files had CORS headers that only allowed `https://skilltude.com` but blocked `https://www.skilltude.com`.

## Solution
Updated all 5 API files to accept both www and non-www versions:

1. ✅ `api/blog/articles.php`
2. ✅ `api/blog/article.php`
3. ✅ `api/blog/admin/create.php`
4. ✅ `api/blog/admin/update.php`
5. ✅ `api/blog/admin/delete.php`

## What Changed

**Before:**
```php
header('Access-Control-Allow-Origin: https://skilltude.com');
```

**After:**
```php
// Allow both www and non-www versions
$allowed_origins = ['https://skilltude.com', 'https://www.skilltude.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
```

## Upload Instructions

Re-upload these 5 files to Hostinger:

### Files to Upload:
1. `api/blog/articles.php` → `public_html/api/blog/articles.php`
2. `api/blog/article.php` → `public_html/api/blog/article.php`
3. `api/blog/admin/create.php` → `public_html/api/blog/admin/create.php`
4. `api/blog/admin/update.php` → `public_html/api/blog/admin/update.php`
5. `api/blog/admin/delete.php` → `public_html/api/blog/admin/delete.php`

### Quick Upload Steps:
1. Log into Hostinger File Manager
2. Navigate to `public_html/api/blog/`
3. Upload `articles.php` and `article.php` (overwrite existing)
4. Navigate to `public_html/api/blog/admin/`
5. Upload `create.php`, `update.php`, and `delete.php` (overwrite existing)

## After Upload

Both URLs will work:
- ✅ `https://skilltude.com/blog`
- ✅ `https://www.skilltude.com/blog`

## Why This Matters

Users can access your site with or without "www" and the blog will work correctly in both cases. This is important for:
- SEO (search engines may index both versions)
- User bookmarks
- External links
- Navigation consistency

## Bonus: Redirect Setup (Optional)

For best SEO practices, you should redirect one version to the other. In Hostinger:

1. Go to your domain settings
2. Set up a 301 redirect from one to the other
3. Choose which you prefer as canonical:
   - Redirect www → non-www, OR
   - Redirect non-www → www

This ensures all traffic goes to one canonical URL while still working if someone types the other version.
