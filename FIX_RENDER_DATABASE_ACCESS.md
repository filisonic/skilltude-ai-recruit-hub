# Fix Render Database Access - URGENT

## 🚨 Critical Issues Found

From your Render logs:

```
Database error: Access denied for user 'u931066387_management'@'74.220.52.2' (using password: YES)
```

**Problem:** Hostinger MySQL is blocking connections from Render's IP address `74.220.52.2`

## ✅ Quick Fix Steps

### Step 1: Allow Remote MySQL Access on Hostinger

1. **Log in to Hostinger hPanel**
   - Go to https://hpanel.hostinger.com

2. **Navigate to MySQL Databases**
   - Click "Databases" → "MySQL Databases"

3. **Find Remote MySQL**
   - Look for "Remote MySQL" section
   - Or go to "Advanced" → "Remote MySQL"

4. **Add Render's IP to Whitelist**
   
   **Option A: Allow All IPs (Quick but less secure)**
   ```
   Host: %
   ```
   
   **Option B: Allow Specific Render IPs (More secure)**
   ```
   Add these IPs one by one:
   74.220.52.2
   216.24.57.1
   216.24.57.253
   ```

5. **Save Changes**

### Step 2: Update Render Environment Variables

Go to Render Dashboard → Your Service → Environment

**Fix these variables:**

```env
# Change from:
FRONTEND_URL=https://www.skilltude.com

# To (remove www):
FRONTEND_URL=https://skilltude.com

# Verify database credentials:
DB_HOST=srv878.hstgr.io
DB_PORT=3306
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1

# Add upload directory:
UPLOAD_DIR=/tmp/uploads/cvs
```

### Step 3: Fix File Storage Path

The issue is that Render uses `/tmp` for temporary storage, not relative paths.

**On Render, add this environment variable:**
```env
UPLOAD_DIR=/tmp/uploads/cvs
```

### Step 4: Redeploy Render Service

After updating environment variables:
1. Render will automatically redeploy
2. Wait 2-3 minutes for deployment
3. Check logs for errors

## 🧪 Test the Fix

### Test 1: Check Database Connection
```bash
# From Render logs, you should see:
# "Server is ready to accept connections"
# WITHOUT any database errors
```

### Test 2: Try CV Upload Again
1. Go to https://skilltude.com/upload-cv
2. Upload a test CV
3. Should work now!

## 📋 Detailed Hostinger MySQL Setup

### Method 1: Via hPanel (Recommended)

1. **Login to hPanel**
   - https://hpanel.hostinger.com

2. **Go to Databases**
   - Click "Databases" in left menu
   - Click "Remote MySQL"

3. **Add Remote Host**
   - Click "Add Remote MySQL Host"
   - Enter: `%` (allows all IPs)
   - Or enter specific Render IPs
   - Click "Add Host"

### Method 2: Via phpMyAdmin

1. **Login to phpMyAdmin**
   - hPanel → Databases → phpMyAdmin

2. **Go to User Accounts**
   - Click "User accounts" tab

3. **Edit User**
   - Find user: `u931066387_management`
   - Click "Edit privileges"

4. **Change Host**
   - Change from `localhost` to `%`
   - Or add new user with host `%`

5. **Grant Privileges**
   ```sql
   GRANT ALL PRIVILEGES ON u931066387_skilltude.* 
   TO 'u931066387_management'@'%' 
   IDENTIFIED BY 'Skilly@skilltude1';
   
   FLUSH PRIVILEGES;
   ```

## ⚠️ Security Note

**Option 1: Allow All IPs (`%`)**
- ✅ Quick and easy
- ❌ Less secure
- ⚠️ Use strong password

**Option 2: Whitelist Specific IPs**
- ✅ More secure
- ❌ Render IPs may change
- ✅ Recommended for production

**Render's IP Ranges:**
```
74.220.52.0/24
216.24.57.0/24
```

## 🔍 Verify the Fix

### Check 1: Render Logs
```bash
# Should see:
✅ "Server is ready to accept connections"
✅ No database errors
✅ CV upload successful
```

### Check 2: Test Upload
```bash
# Try uploading a CV
# Should see in logs:
✅ "File Operation - STORE: [filename], Success: true"
✅ "CV upload processed successfully"
✅ No "Access denied" errors
```

### Check 3: Check Database
```sql
-- In phpMyAdmin:
SELECT * FROM cv_submissions 
ORDER BY submitted_at DESC 
LIMIT 1;

-- Should see your test submission
```

## 🆘 If Still Not Working

### Issue: Still Getting "Access Denied"

**Check:**
1. Remote MySQL is enabled on Hostinger
2. IP whitelist includes `%` or Render IPs
3. Database credentials are correct
4. User has proper privileges

**Try:**
```sql
-- Create new user with remote access
CREATE USER 'u931066387_management'@'%' 
IDENTIFIED BY 'Skilly@skilltude1';

GRANT ALL PRIVILEGES ON u931066387_skilltude.* 
TO 'u931066387_management'@'%';

FLUSH PRIVILEGES;
```

### Issue: File Upload Still Failing

**Check Render environment:**
```env
UPLOAD_DIR=/tmp/uploads/cvs
```

**Note:** Render's `/tmp` is cleared on each deployment. Files are temporary.

### Issue: CORS Errors

**Fix FRONTEND_URL on Render:**
```env
# Must be exactly:
FRONTEND_URL=https://skilltude.com

# NOT:
FRONTEND_URL=https://www.skilltude.com  ❌
```

## 📝 Summary of Changes Needed

### On Hostinger:
- [ ] Enable Remote MySQL
- [ ] Add `%` or Render IPs to whitelist
- [ ] Grant privileges to user

### On Render:
- [ ] Change `FRONTEND_URL` to `https://skilltude.com`
- [ ] Add `UPLOAD_DIR=/tmp/uploads/cvs`
- [ ] Verify database credentials
- [ ] Wait for automatic redeploy

### Test:
- [ ] Check Render logs for errors
- [ ] Try CV upload
- [ ] Verify database record created

---

**Priority:** 🔴 CRITICAL - Do this first!

**Estimated Time:** 5-10 minutes

**Once fixed, CV upload will work!** 🎉
