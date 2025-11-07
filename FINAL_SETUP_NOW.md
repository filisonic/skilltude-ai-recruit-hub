# Final Setup - Do This Now

## ✅ What You've Done

- [x] Enabled "Any Host" on Hostinger MySQL
- [x] Set Render `FRONTEND_URL=https://skilltude.com`

## 🚀 Last Step: Add UPLOAD_DIR on Render

### Go to Render Dashboard

1. Visit: https://dashboard.render.com
2. Click your service: **skilltude-ai-recruit-hub**
3. Click **"Environment"** tab (left sidebar)

### Add This Variable

Click "Add Environment Variable" and add:

```
Key: UPLOAD_DIR
Value: /tmp/uploads/cvs
```

### Save

1. Click **"Save Changes"**
2. Wait 2-3 minutes for automatic redeploy
3. Watch the "Logs" tab

## 🧪 Test CV Upload

After Render redeploys:

1. Go to: https://skilltude.com/upload-cv
2. Fill out the form
3. Upload a test PDF
4. Click submit
5. Should work! ✅

## 📊 Check Render Logs

You should see:

```
✅ Server is ready to accept connections
✅ Frontend: https://skilltude.com
✅ File Operation - STORE: [filename], Success: true
✅ CV upload processed successfully
```

**No more:**
```
❌ Access denied for user
❌ ENOENT: no such file or directory
```

## 🌐 Set Up www Redirect (Optional but Recommended)

To make `www.skilltude.com` redirect to `skilltude.com`:

### On Hostinger

1. Go to hPanel → Domains
2. Click your domain
3. Click "Redirects" or "DNS/Nameservers"
4. Add redirect:
   - From: `www.skilltude.com`
   - To: `https://skilltude.com`
   - Type: 301 (Permanent)

Or add this to your `.htaccess` file in `public_html/`:

```apache
# Redirect www to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.skilltude\.com$ [NC]
RewriteRule ^(.*)$ https://skilltude.com/$1 [R=301,L]
```

## ✅ Complete Checklist

- [x] Hostinger: "Any Host" enabled
- [x] Render: `FRONTEND_URL=https://skilltude.com`
- [ ] Render: `UPLOAD_DIR=/tmp/uploads/cvs` (do this now!)
- [ ] Test: Upload a CV
- [ ] Optional: Set up www redirect

## 🎉 That's It!

Once you add `UPLOAD_DIR` and Render redeploys, CV upload will work!

**Time:** 2 minutes

**Then test and you're done!** 🚀
