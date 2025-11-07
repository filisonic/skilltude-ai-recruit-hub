# Deploy the Fix NOW - Simple Steps

## Good News! ✅
Your Render backend already has `FRONTEND_URL=https://www.skilltude.com` set correctly.

The backend automatically handles both www and non-www versions, so you're all set on that end.

## What You Need to Do

### Upload New Frontend Build to Hostinger

The frontend has been rebuilt with the fix. Just upload the `dist` folder:

#### Option 1: Hostinger File Manager
1. Log into Hostinger control panel
2. Go to **File Manager**
3. Navigate to `public_html` (or your website root)
4. **Delete old files** (keep `.htaccess` if you have one)
5. **Upload all files** from the `dist` folder in your project

#### Option 2: FTP
1. Connect via FTP (FileZilla, etc.)
2. Navigate to your website root
3. Delete old files
4. Upload all files from `dist` folder

### Files to Upload from `dist/`:
```
dist/
├── index.html
├── assets/
│   ├── index-BGM_dKBw.js       (NEW - has the fix)
│   ├── index-BgHIxqRN.css
│   ├── vendor-64fz9BH2.js
│   ├── router-DYaVzJ5O.js
│   └── LazyImage-BuYOElsJ.js
└── (other files)
```

## Test It

After uploading:

1. Go to https://www.skilltude.com
2. Navigate to CV upload section
3. Fill out the form
4. Upload a test CV
5. Should work! ✅

## What Was Fixed

The frontend now sends this header with every CV upload request:
```
X-Requested-With: XMLHttpRequest
```

This tells the backend's CSRF protection that the request is legitimate.

## If It Still Doesn't Work

1. **Hard refresh your browser:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache**
3. **Check browser console** (F12) for any errors
4. **Check Render logs** for any backend errors

But it should work! The fix is solid. 🎉
