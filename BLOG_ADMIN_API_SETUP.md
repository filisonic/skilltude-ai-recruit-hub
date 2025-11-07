# Blog Admin API Setup Guide

## What Was Created

I've created 3 new PHP API files to enable full blog management from your admin page:

1. **create.php** - Create new blog articles
2. **update.php** - Edit existing articles
3. **delete.php** - Delete articles

## Upload Instructions

### Step 1: Create Admin Folder
1. Log into Hostinger File Manager
2. Navigate to: `public_html/api/blog/`
3. Create a new folder called `admin`
4. Path should be: `public_html/api/blog/admin/`

### Step 2: Upload the 3 Files
Upload these files to `public_html/api/blog/admin/`:

1. **create.php** - From `api/blog/admin/create.php`
2. **update.php** - From `api/blog/admin/update.php`
3. **delete.php** - From `api/blog/admin/delete.php`

### Step 3: Set Permissions (if needed)
- Ensure files have 644 permissions
- Ensure admin folder has 755 permissions

## API Endpoints

After uploading, these endpoints will be available:

### 1. Create Article
**Endpoint:** `POST https://skilltude.com/api/blog/admin/create.php`

**Request Body:**
```json
{
  "title": "Your Article Title",
  "slug": "your-article-slug",
  "content": "Full article content here...",
  "excerpt": "Brief description",
  "category": "Tech Hiring",
  "featured_image_url": "https://example.com/image.jpg",
  "tags": ["recruiting", "tech", "AI"],
  "published_at": "2024-01-15 10:00:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Article created successfully",
  "article_id": 123,
  "slug": "your-article-slug"
}
```

### 2. Update Article
**Endpoint:** `PUT https://skilltude.com/api/blog/admin/update.php`

**Request Body:**
```json
{
  "slug": "existing-article-slug",
  "title": "Updated Title",
  "content": "Updated content...",
  "excerpt": "Updated excerpt",
  "category": "AI Trends",
  "featured_image_url": "https://example.com/new-image.jpg",
  "tags": ["AI", "recruiting"],
  "published_at": "2024-01-15 10:00:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Article updated successfully",
  "slug": "existing-article-slug"
}
```

### 3. Delete Article
**Endpoint:** `DELETE https://skilltude.com/api/blog/admin/delete.php?slug=article-slug`

**Response:**
```json
{
  "success": true,
  "message": "Article deleted successfully",
  "slug": "article-slug"
}
```

## Features

### Security
- ✅ CORS configured for skilltude.com only
- ✅ Method validation (POST/PUT/DELETE only)
- ✅ Input validation for required fields
- ✅ SQL injection protection via prepared statements
- ✅ Duplicate slug detection

### Data Handling
- ✅ Automatic timestamp management (created_at, updated_at)
- ✅ JSON encoding for tags array
- ✅ Null handling for optional fields
- ✅ View count initialization (0 for new articles)

### Error Handling
- ✅ 400 - Missing required fields
- ✅ 404 - Article not found
- ✅ 405 - Method not allowed
- ✅ 409 - Duplicate slug
- ✅ 500 - Database errors

## Testing the APIs

### Test Create (using curl or Postman):
```bash
curl -X POST https://skilltude.com/api/blog/admin/create.php \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "slug": "test-article",
    "content": "This is test content",
    "excerpt": "Test excerpt",
    "category": "Tech Hiring",
    "featured_image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    "tags": ["test"]
  }'
```

### Test Update:
```bash
curl -X PUT https://skilltude.com/api/blog/admin/update.php \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-article",
    "title": "Updated Test Article",
    "content": "Updated content"
  }'
```

### Test Delete:
```bash
curl -X DELETE "https://skilltude.com/api/blog/admin/delete.php?slug=test-article"
```

## Integration with Admin Page

Your admin page should now be able to:

1. **Create New Articles**
   - Form submits to `/api/blog/admin/create.php`
   - All required fields must be filled
   - Slug must be unique

2. **Edit Existing Articles**
   - Form submits to `/api/blog/admin/update.php`
   - Only changed fields need to be sent
   - Slug identifies which article to update

3. **Delete Articles**
   - Delete button calls `/api/blog/admin/delete.php?slug=xxx`
   - Confirmation recommended before deletion

## What Happens After Upload

Once uploaded, when you:

1. **Add an article from admin page** → It saves to database → Appears on blog page immediately
2. **Edit an article** → Updates in database → Changes reflect on blog page
3. **Delete an article** → Removes from database → Disappears from blog page

## Database Fields Reference

The `blog_articles` table has these fields:

- `id` - Auto-increment primary key
- `title` - Article title
- `slug` - URL-friendly identifier (unique)
- `content` - Full article content (Markdown supported)
- `excerpt` - Brief description
- `category` - Article category
- `featured_image_url` - Main image URL
- `tags` - JSON array of tags
- `published_at` - Publication date/time
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `views` - View counter

## Next Steps

1. ✅ Upload the 3 files to Hostinger
2. ✅ Test each endpoint with sample data
3. ✅ Verify admin page can create/edit/delete articles
4. ✅ Check that changes appear on the public blog page

## Troubleshooting

### If create/update fails:
- Check that all required fields are provided
- Verify slug doesn't already exist (for create)
- Check database connection credentials

### If delete fails:
- Verify the article exists
- Check that slug is correct

### If CORS errors occur:
- Verify you're accessing from skilltude.com domain
- Check browser console for specific CORS errors

## Security Note

⚠️ **Important:** These APIs currently have no authentication. Anyone who knows the endpoints can create/edit/delete articles. 

**Recommended next step:** Add authentication/authorization:
- Check for admin session/token
- Validate user permissions
- Add rate limiting

For now, keep these endpoint URLs private and only use them from your admin interface.
