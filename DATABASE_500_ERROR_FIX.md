# Fix 500 Error - Database Connection Issue

## Good News! 🎉
The 403 error is FIXED! The request is now getting through to your backend.

## Current Issue
**Error:** "Failed to save submission to database"
**Status:** 500 Internal Server Error

This means your Render backend can't connect to your Hostinger MySQL database.

## Root Cause
Your Render backend is missing the database environment variables. It needs your Hostinger MySQL credentials.

## Solution: Add Database Variables to Render

### Step 1: Get Your Hostinger MySQL Credentials

1. Log into **Hostinger hPanel**
2. Go to **Databases** section
3. Find your MySQL database
4. Note down these values:
   - **Database Host** (e.g., `mysql123.hostinger.com`)
   - **Database Name** (e.g., `u123456789_skilltude`)
   - **Database Username** (e.g., `u123456789_admin`)
   - **Database Password** (the password you set)
   - **Port** (usually `3306`)

### Step 2: Add Environment Variables to Render

Go to your Render dashboard and add these environment variables:

#### Required Database Variables:

1. **DB_HOST**
   - Value: Your Hostinger MySQL host (e.g., `mysql123.hostinger.com`)

2. **DB_NAME**
   - Value: Your database name (e.g., `u123456789_skilltude`)

3. **DB_USER**
   - Value: Your database username (e.g., `u123456789_admin`)

4. **DB_PASSWORD**
   - Value: Your database password

5. **DB_PORT**
   - Value: `3306`

### Step 3: How to Add Variables on Render

1. Go to https://dashboard.render.com
2. Select your backend service (skilltude-ai-recruit-hub)
3. Click **Environment** tab
4. Click **Add Environment Variable** for each one
5. Click **Save Changes**
6. Wait for automatic redeployment (~2-3 minutes)

## Example Configuration

```
DB_HOST=mysql123.hostinger.com
DB_NAME=u123456789_skilltude
DB_USER=u123456789_admin
DB_PASSWORD=your_secure_password_here
DB_PORT=3306
```

## Important Notes

⚠️ **Security:** Make sure your Hostinger MySQL allows remote connections from Render's IP addresses.

To enable remote access on Hostinger:
1. Go to Hostinger hPanel → Databases
2. Click on your database
3. Look for "Remote MySQL" or "Remote Database Access"
4. Add `%` to allow all IPs (or add Render's specific IPs if available)

## Testing After Configuration

Once you've added the database variables and Render has redeployed:

1. Go to your website
2. Try uploading a CV again
3. Should work completely! ✅

## Verification Checklist

- [ ] Got MySQL credentials from Hostinger
- [ ] Added all 5 database environment variables to Render
- [ ] Enabled remote MySQL access on Hostinger
- [ ] Waited for Render to redeploy
- [ ] Tested CV upload - should work!

## If Still Getting Errors

1. **Check Render Logs:**
   - Go to Render dashboard → Your service → Logs
   - Look for database connection errors
   - Check if credentials are correct

2. **Test Database Connection:**
   - Use a MySQL client to test connection from your computer
   - Host: Your DB_HOST
   - Port: 3306
   - Username: Your DB_USER
   - Password: Your DB_PASSWORD

3. **Check Hostinger Firewall:**
   - Make sure remote connections are allowed
   - Check if there's an IP whitelist

## What Happens After Fix

Once database is connected:
- ✅ CV uploads will be saved to database
- ✅ Analysis results will be stored
- ✅ Emails will be queued
- ✅ Admin dashboard will show submissions
- ✅ Full system functionality!

## Progress So Far

- ✅ 403 CORS error - FIXED
- ⏳ 500 Database error - Need to add DB credentials to Render
