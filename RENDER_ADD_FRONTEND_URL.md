# How to Add FRONTEND_URL to Render

## Quick Steps

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com

### 2. Select Your Backend Service
Click on: **skilltude-ai-recruit-hub** (or whatever you named your backend)

### 3. Click "Environment" Tab
In the left sidebar, click **Environment**

### 4. Add Environment Variable
Click the **"Add Environment Variable"** button

### 5. Enter the Details

**Key:**
```
FRONTEND_URL
```

**Value:**
```
https://skilltude.com
```
(Replace `skilltude.com` with your actual Hostinger domain)

### 6. Save Changes
Click **"Save Changes"** button

### 7. Wait for Redeployment
Render will automatically redeploy your backend. This takes about 2-3 minutes.

You'll see a progress indicator showing:
- Building...
- Deploying...
- Live ✓

## Important Notes

✅ **Include `https://`** - Don't forget the protocol
❌ **No trailing slash** - Don't add `/` at the end
✅ **Match your domain exactly** - Use the same domain your frontend is hosted on

## Examples

**Correct:**
- `https://skilltude.com`
- `https://www.skilltude.com`
- `https://yourdomain.com`

**Incorrect:**
- `skilltude.com` (missing https://)
- `https://skilltude.com/` (trailing slash)
- `http://skilltude.com` (should be https)

## What This Does

The `FRONTEND_URL` environment variable tells your backend which domain is allowed to make requests to it. This is part of the CORS (Cross-Origin Resource Sharing) and CSRF (Cross-Site Request Forgery) protection.

Without this variable, the backend defaults to `http://localhost:5173`, which is why your production frontend was being blocked.

## After Adding

Once the redeployment is complete:
1. Your backend will accept requests from your Hostinger domain
2. The 403 error should be resolved
3. CV uploads should work

## Verify It's Set

After saving, you should see the variable listed in the Environment tab:

```
FRONTEND_URL = https://skilltude.com
```

## Next Step

After adding this variable and waiting for redeployment, upload your new frontend build to Hostinger (see DEPLOY_CORS_FIX.md).
