# Fix Frontend API URL - Complete Guide

## Problem Fixed
Your frontend was pointing to the old Render URL instead of your Hostinger server.

## Changes Made
✅ Updated `.env` file: `VITE_API_URL=https://skilltude.com/server`
✅ Updated `.env.production` file with correct production URL

## Next Steps - Rebuild and Deploy

### 1. Build Frontend with New API URL
```bash
npm run build
```

### 2. Deploy to Hostinger
Upload the new `dist` folder to your Hostinger public_html directory.

### 3. Verify the Fix
After deployment, your frontend will now fetch from:
✅ `https://skilltude.com/server/api/blog/articles` (correct Hostinger URL)

Instead of:
❌ `https://skilltude-ai-recruit-hub.onrender.com/api/blog/articles` (old Render URL)

## Test the Blog Page
1. Visit: https://skilltude.com/blog
2. You should now see your blog articles loading properly
3. Check browser console - no more API errors

## What This Fixes
- Empty blog page showing "Unable to load articles"
- Frontend connecting to wrong backend server
- Blog articles not displaying despite being in database

The blog articles you added via phpMyAdmin will now display correctly!