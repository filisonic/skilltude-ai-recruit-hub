# 📁 Exact Upload Instructions

## 🎯 Files to Upload to Hostinger

### 1. PHP API Files (NEW)
**From your computer:** `api/blog/articles.php`
**Upload to:** `/home/u931066387/public_html/api/blog/articles.php`

**From your computer:** `api/blog/article.php`  
**Upload to:** `/home/u931066387/public_html/api/blog/article.php`

### 2. Frontend Files (REPLACE EXISTING)
**From your computer:** Everything inside `dist/` folder
**Upload to:** `/home/u931066387/public_html/` (replace existing files)

## 📂 Hostinger File Structure After Upload
```
/home/u931066387/public_html/
├── api/
│   └── blog/
│       ├── articles.php  ← NEW
│       └── article.php   ← NEW
├── index.html            ← REPLACED
├── assets/               ← REPLACED
│   ├── index-BUWclbb1.js
│   ├── index-CucxP_Mo.css
│   └── (other asset files)
└── (other existing files)
```

## 🚀 Step-by-Step Upload Process

### Step 1: Create API Directory
1. Log into Hostinger File Manager
2. Navigate to `/home/u931066387/public_html/`
3. Create folder: `api`
4. Inside `api`, create folder: `blog`

### Step 2: Upload PHP Files
1. Upload `api/blog/articles.php` to `/home/u931066387/public_html/api/blog/`
2. Upload `api/blog/article.php` to `/home/u931066387/public_html/api/blog/`

### Step 3: Upload Frontend
1. Select ALL files inside your `dist/` folder
2. Upload to `/home/u931066387/public_html/` (overwrite existing)

## ✅ Test After Upload
- Blog API: `https://skilltude.com/api/blog/articles.php`
- Website: `https://skilltude.com/blog`

That's it! Your blog will work and CV functionality stays on Render unchanged.