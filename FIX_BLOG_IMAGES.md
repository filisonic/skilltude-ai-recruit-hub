# Fix Blog Images Not Showing

## Problem
Featured images from Unsplash aren't showing on:
- Blog listing page (thumbnails)
- Individual article pages (hero image)

## Common Causes & Solutions

### 1. Wrong Unsplash URL Format

**Wrong:**
```
https://unsplash.com/photos/abc123
```

**Correct:**
```
https://images.unsplash.com/photo-1234567890?w=800
```

### How to Get Correct URL:
1. Go to Unsplash image
2. Right-click on the image itself
3. Select "Copy Image Address"
4. Use that URL (should start with `images.unsplash.com`)

### 2. Add Image Size Parameters

For better performance, add size parameters:

**Blog Listing (thumbnails):**
```
https://images.unsplash.com/photo-1234567890?w=600&h=400&fit=crop
```

**Article Page (hero):**
```
https://images.unsplash.com/photo-1234567890?w=1200&h=600&fit=crop
```

### 3. Test Your Image URL

Before saving article:
1. Copy your image URL
2. Open new browser tab
3. Paste URL in address bar
4. Press Enter
5. Image should load directly

If image doesn't load in browser, it won't work in your blog!

## Quick Fix for Existing Article

### Option 1: Edit the Article
1. Go to admin dashboard
2. Click edit on your article
3. In "Featured Image" field, paste correct Unsplash URL
4. Click "Publish"
5. Check blog page

### Option 2: Use Different Image Source

If Unsplash isn't working, try:

**Pexels:**
```
https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg
```

**Pixabay:**
```
https://pixabay.com/get/[image-id].jpg
```

**Direct URLs work best!**

## Recommended Unsplash URLs

### Format to Use:
```
https://images.unsplash.com/photo-[ID]?ixlib=rb-4.0.3&w=1200&q=80
```

### Example Working URLs:
```
https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200
https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200
https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200
```

## Check Browser Console

1. Open your blog page
2. Press F12 (Developer Tools)
3. Go to "Console" tab
4. Look for errors like:
   - `Failed to load resource`
   - `CORS error`
   - `404 Not Found`

### If You See CORS Error:
Unsplash images should work, but if blocked:
- Use `?ixlib=rb-4.0.3` parameter
- Or use different image host

### If You See 404 Error:
- Image URL is wrong
- Get new URL from Unsplash

## Testing Checklist

After fixing image URL:

- [ ] Image loads in browser when pasted directly
- [ ] Image shows in admin editor preview
- [ ] Thumbnail shows on blog listing page
- [ ] Hero image shows on article page
- [ ] Image loads on mobile
- [ ] No console errors

## Alternative: Use Placeholder

If you can't get Unsplash working, use a placeholder:

```
https://via.placeholder.com/1200x600/4F46E5/ffffff?text=Your+Article+Title
```

This always works and you can customize:
- Size: `1200x600`
- Background color: `4F46E5` (hex without #)
- Text color: `ffffff`
- Text: `Your+Article+Title` (use + for spaces)

## Pro Tips

### Best Image Sizes:
- **Blog thumbnails:** 600x400px
- **Article hero:** 1200x600px or 1920x1080px
- **In-content images:** 800x600px

### Image URL Checklist:
✅ Starts with `https://`
✅ Points directly to image file
✅ Loads when pasted in browser
✅ No authentication required
✅ Publicly accessible

### Unsplash Best Practices:
1. Always use `images.unsplash.com` domain
2. Add `?w=1200` for size
3. Add `&q=80` for quality
4. Test URL before saving

## Still Not Working?

### Debug Steps:
1. Check browser console (F12)
2. Verify image URL loads directly
3. Try different image from Unsplash
4. Try placeholder URL to test if images work at all
5. Check if other articles' images work

### Quick Test:
Create a test article with this known-working URL:
```
https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80
```

If this works, your image URLs are the problem.
If this doesn't work, there's a code issue.

## Need Help?

Share:
1. The exact Unsplash URL you're using
2. Any console errors (F12 → Console)
3. Screenshot of what you see

And I can help debug further!
