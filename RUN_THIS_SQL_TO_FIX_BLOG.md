# 🚨 FIX BLANK BLOG PAGE - ONE STEP

## The Problem
Your blog page is blank because the `blog_articles` table doesn't exist in your database.

## The Solution
Run the SQL file below in phpMyAdmin.

---

## 📋 STEP 1: Copy the SQL File

**File:** `FIX_BLANK_PAGE_SIMPLE.sql`

This file contains:
- ✅ CREATE TABLE statement (no foreign keys)
- ✅ 7 sample blog articles
- ✅ All articles are published and ready to display

---

## 📋 STEP 2: Run in phpMyAdmin

1. **Log into Hostinger control panel**
2. **Open phpMyAdmin**
3. **Select database:** `u931066387_skilltude`
4. **Click "SQL" tab**
5. **Open the file:** `FIX_BLANK_PAGE_SIMPLE.sql`
6. **Copy ALL the SQL**
7. **Paste into phpMyAdmin**
8. **Click "Go"**

---

## 📋 STEP 3: Restart Backend

```bash
# Stop backend (Ctrl+C)
# Then restart:
npm run server:dev
```

---

## 📋 STEP 4: Test

```bash
node diagnose-blog.js
```

You should see:
```
✅ PASS: Found 7 articles
```

---

## 📋 STEP 5: Refresh Browser

Go to: **http://localhost:5173/blog**

You should now see 7 blog articles! 🎉

---

## ✅ What You'll See

After running the SQL:

- **Welcome to SkillTude Blog** (Company News)
- **The Future of AI in Recruitment** (Technology)
- **10 Tips for Writing a Winning CV** (Career)
- **Understanding the Modern Hiring Process** (Industry)
- **Top Skills Employers Look For in 2024** (Career)
- **How to Ace Your Next Job Interview** (Career)
- **The Rise of Remote Work** (Industry)

All articles have:
- ✅ Title, excerpt, and full content
- ✅ Featured images from Unsplash
- ✅ Categories and tags
- ✅ Published status
- ✅ Proper formatting

---

## 🐛 If It Still Doesn't Work

### Check 1: Table Created?
```sql
SHOW TABLES LIKE 'blog_articles';
```
Should return 1 row.

### Check 2: Articles Inserted?
```sql
SELECT COUNT(*) FROM blog_articles WHERE status = 'published';
```
Should return 7.

### Check 3: Backend Running?
```bash
curl http://localhost:3001/api/blog/articles
```
Should return JSON with articles.

### Check 4: Frontend Connected?
Check `.env` file has:
```
VITE_API_URL=http://localhost:3001
```

---

## 💡 Why This Happened

The blog feature requires a `blog_articles` table in the database. This table wasn't created during initial setup, so the API returns a 500 error when trying to fetch articles.

The SQL script creates this table and adds sample data so you can test the blog feature immediately.

---

## 🎯 Next Steps After Fix

Once the blog is working:

1. ✅ Test search functionality
2. ✅ Test category filters
3. ✅ Click on articles to read them
4. ✅ Check view count increments
5. ✅ Test on mobile devices

---

**Need help?** Check `TROUBLESHOOT_BLANK_PAGE.md` for detailed troubleshooting.
