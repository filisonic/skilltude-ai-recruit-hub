# Fix Remote MySQL Access on Hostinger

## The Problem

Your Render backend has all the correct database credentials, but Hostinger is blocking the connection because remote MySQL access is not enabled.

## Solution: Enable Remote MySQL on Hostinger

### Step 1: Log into Hostinger hPanel

Go to: https://hpanel.hostinger.com

### Step 2: Navigate to Databases

1. Click on **Databases** in the left sidebar
2. Find your database: `u931066387_skilltude`

### Step 3: Enable Remote MySQL

Look for one of these options:
- **"Remote MySQL"**
- **"Remote Database Access"**
- **"Manage"** → **"Remote MySQL"**

### Step 4: Add Allowed Host

You have two options:

#### Option A: Allow All IPs (Easier, Less Secure)
Add this host:
```
%
```
This allows connections from any IP address.

#### Option B: Allow Specific Render IPs (More Secure)
Render uses dynamic IPs, so you'll need to allow a range. Check Render's documentation for their IP ranges, or use Option A for now.

### Step 5: Save Changes

Click **Save** or **Add** to apply the changes.

## Alternative: Check Current Database Host

Your `.env` file shows two different database hosts:

1. `server/.env`: `DB_HOST=localhost` (This won't work from Render!)
2. `.env`: `DB_HOST=auth-db878.hstgr.io`
3. `render.env`: `DB_HOST=srv878.hstgr.io`

Make sure Render is using the correct external host: **`srv878.hstgr.io`** or **`auth-db878.hstgr.io`**

### To Verify on Render:

1. Go to Render dashboard
2. Click on your service
3. Go to **Environment** tab
4. Check that `DB_HOST` is set to `srv878.hstgr.io` (NOT `localhost`)

## Testing the Connection

### Option 1: Check Render Logs

1. Go to Render dashboard
2. Click on your service
3. Click **Logs** tab
4. Look for database connection errors
5. You should see specific error messages like:
   - "Access denied" = Wrong credentials
   - "Connection refused" = Remote access blocked
   - "Unknown database" = Database doesn't exist
   - "Can't connect to MySQL server" = Wrong host or port

### Option 2: Test from Your Computer

Use a MySQL client to test the connection:

```bash
mysql -h srv878.hstgr.io -P 3306 -u u931066387_management -p u931066387_skilltude
```

Enter password: `Skilly@skilltude1`

If this works from your computer, then remote access is enabled.
If it doesn't work, you need to enable remote MySQL on Hostinger.

## Common Issues

### Issue 1: "Access denied for user"
**Solution:** Check that the username and password are correct in Render's environment variables.

### Issue 2: "Can't connect to MySQL server"
**Solution:** 
- Enable remote MySQL access on Hostinger
- Verify the DB_HOST is correct (should be `srv878.hstgr.io`, not `localhost`)

### Issue 3: "Unknown database"
**Solution:** Make sure the database `u931066387_skilltude` exists in Hostinger.

### Issue 4: "Table 'cv_submissions' doesn't exist"
**Solution:** Run the database migrations to create the tables.

## After Enabling Remote Access

1. Wait a few minutes for Hostinger to apply the changes
2. Go to your website: https://skilltude.com
3. Try uploading a CV again
4. Should work! ✅

## If Still Not Working

Check Render logs for the specific error message and share it. The error will tell us exactly what's wrong:
- Connection refused = Remote access issue
- Access denied = Credentials issue
- Unknown database = Database doesn't exist
- Table doesn't exist = Need to run migrations

## Quick Checklist

- [ ] Logged into Hostinger hPanel
- [ ] Found Databases section
- [ ] Located database: u931066387_skilltude
- [ ] Enabled Remote MySQL access
- [ ] Added `%` as allowed host
- [ ] Saved changes
- [ ] Verified DB_HOST on Render is `srv878.hstgr.io` (not localhost)
- [ ] Waited 2-3 minutes
- [ ] Tested CV upload
