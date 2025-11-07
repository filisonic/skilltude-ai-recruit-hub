# 🎯 Hybrid Solution - Keep CV on Render, Blog on Hostinger

## ✅ Perfect Solution!
This keeps your CV upload service on Render untouched while creating a simple blog API on Hostinger.

## 🔧 What I've Done

### 1. **Updated Frontend Configuration**
- **CV/Upload APIs**: Still use Render (`https://skilltude-ai-recruit-hub.onrender.com`)
- **Blog APIs**: Now use simple PHP on Hostinger (`https://skilltude.com`)

### 2. **Created Simple PHP Blog API**
- `api/blog/articles.php` - Lists all blog articles
- `api/blog/article.php` - Gets single article by slug

## 🚀 Deployment Steps

### Step 1: Upload PHP Files to Hostinger
Upload these files to your Hostinger public_html:
```
public_html/
├── api/
│   └── blog/
│       ├── articles.php
│       └── article.php
└── (your existing frontend files)
```

### Step 2: Upload New Frontend Build
Upload the new `dist` folder contents to replace your current frontend files.

### Step 3: Test
- **Blog**: `https://skilltude.com/api/blog/articles.php` (should return JSON)
- **CV Upload**: Still works on Render (unchanged)

## 🎯 Result
- ✅ **CV functionality**: Unchanged on Render
- ✅ **Blog functionality**: Simple PHP API on Hostinger
- ✅ **Your 7 blog articles**: Will display properly
- ✅ **No disruption**: CV upload service continues working

## 📋 Files to Upload
1. **PHP API files**: `api/blog/articles.php` and `api/blog/article.php`
2. **New frontend build**: Contents of `dist` folder

Your blog will work with the database articles you added, and CV functionality stays exactly as it was!