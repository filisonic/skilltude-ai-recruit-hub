# Fix Article Display Issues

## Issues

1. ✅ **Thumbnail shows** on blog listing
2. ❌ **Hero image doesn't show** on article page
3. ❌ **Headers not formatted** (not bold, wrong size)

## Root Causes

### Issue 1: Hero Image
The hero image IS in the code, but might not be showing because:
- Image URL is empty/null in database
- Image URL is incorrect
- CORS blocking the image

### Issue 2: Markdown Not Rendering
The content editor is a plain textarea - you need to type markdown syntax manually:
- `# Header` for headers
- `**bold**` for bold text
- `- item` for bullet lists

There are NO formatting buttons - it's markdown-only.

## Solutions

### Fix Hero Image

**Check Your Article:**
1. Go to admin dashboard
2. Edit your article
3. Look at "Featured Image" field
4. Is there a URL? Is it correct?

**If Empty:**
Add an Unsplash URL:
```
https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200
```

**If Has URL But Not Showing:**
1. Copy the URL
2. Paste in browser address bar
3. Does image load?
4. If not, URL is wrong - get new one

### Fix Header Formatting

**You Need to Use Markdown Syntax:**

Instead of typing:
```
Introduction
```

Type:
```
## Introduction
```

Instead of typing:
```
Key Points
```

Type:
```
### Key Points
```

## Complete Example

### What to Type in Editor:

```markdown
# The Future of AI in Recruiting

Artificial Intelligence is transforming recruitment. Here's what you need to know.

## Why It Matters

AI recruiting tools offer several advantages:

- **Faster screening**: Process thousands of resumes in minutes
- **Better matching**: Find candidates that truly fit
- **Reduced bias**: Focus on skills, not demographics

### Getting Started

Here are the key steps:

1. Assess your needs
2. Choose the right tools
3. Train your team

## Conclusion

**AI is here to stay** in the recruiting world. Companies that adapt early will have a significant advantage.
```

### What You'll See on Blog:

- "The Future of AI in Recruiting" = LARGE HEADER
- "Why It Matters" = MEDIUM HEADER
- "Getting Started" = SMALL HEADER
- "Faster screening" = Bold text
- Bullet points formatted correctly
- Numbered list formatted correctly

## Quick Fixes

### Fix Your Current Article:

1. **Go to admin dashboard**
2. **Click edit** on your article
3. **Add markdown formatting:**
   - Add `##` before section titles
   - Add `###` before subsection titles
   - Add `**` around important words
   - Add `-` before list items
4. **Check Featured Image URL** is correct
5. **Click Publish**
6. **View article** - should look better!

## Markdown Cheat Sheet

```markdown
# H1 Header (largest)
## H2 Header (medium)
### H3 Header (small)

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered item
2. Another item

[Link text](https://example.com)
```

## Why No Formatting Buttons?

The editor is designed for markdown (like GitHub, Reddit, etc.). Benefits:
- Faster to type
- No mouse needed
- Clean, portable format
- Works everywhere

## Want a Rich Text Editor?

If you prefer buttons for formatting (like Word), I can add a rich text editor with:
- Bold/Italic buttons
- Header dropdown
- Link insertion
- Image upload
- Live preview

Let me know if you want this!

## Testing

After editing your article with markdown:

1. Save/Publish
2. Go to blog page
3. Click your article
4. Check:
   - ✅ Hero image shows at top
   - ✅ Headers are large and bold
   - ✅ Lists are formatted
   - ✅ Bold text is bold

## Common Mistakes

### Mistake 1: Forgetting the Space
❌ `##Header` (no space)
✅ `## Header` (space after ##)

### Mistake 2: Not Using Markdown
❌ Just typing "Introduction" 
✅ Typing "## Introduction"

### Mistake 3: Wrong Image URL
❌ `https://unsplash.com/photos/abc123`
✅ `https://images.unsplash.com/photo-abc123?w=1200`

## Full Markdown Guide

See `MARKDOWN_FORMATTING_GUIDE.md` for complete guide with examples!

## Summary

**To fix your article:**
1. Edit it in admin
2. Add `##` before headers
3. Add `**` around bold words
4. Check featured image URL
5. Publish
6. View on blog

**The editor doesn't have buttons** - you type markdown syntax directly. This is by design and is how many modern blogging platforms work (Medium, Dev.to, etc.).
