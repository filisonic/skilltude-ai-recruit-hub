# Render.com Deployment Guide

Complete guide to deploy your CV Analysis System backend to Render.com (free tier).

## 📋 Prerequisites

- ✅ Code pushed to GitHub (Done!)
- ✅ Hostinger MySQL database set up
- ✅ GitHub account
- ✅ Render.com account (free)

## 🚀 Step-by-Step Deployment

### Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with your GitHub account (recommended for easy integration)

### Step 2: Create a New Web Service

1. Once logged in, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Click **"Connect account"** if not already connected
   - Find and select: `filisonic/skilltude-ai-recruit-hub`
   - Click **"Connect"**

### Step 3: Configure the Web Service

Fill in the following settings:

#### Basic Settings:
- **Name**: `skilltude-backend` (or any name you prefer)
- **Region**: Choose closest to your users (e.g., Frankfurt for Europe)
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`

#### Build & Deploy Settings:
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```

- **Start Command**:
  ```bash
  node dist/index.js
  ```

#### Instance Type:
- Select **"Free"** (0.1 CPU, 512 MB RAM)
- Note: Free tier sleeps after 15 min of inactivity

### Step 4: Add Environment Variables

Click **"Advanced"** and add these environment variables:

```env
NODE_ENV=production
PORT=10000

# Database (Your Hostinger MySQL)
DB_HOST=your_hostinger_db_host
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=noreply@skilltude.com

# Admin Credentials
ADMIN_EMAIL=admin@skilltude.com
ADMIN_PASSWORD=your_secure_admin_password

# JWT Secret (generate a random string)
JWT_SECRET=your_random_jwt_secret_here_make_it_long_and_secure

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS (Your Hostinger frontend URL)
CORS_ORIGIN=https://skilltude.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- For `DB_HOST`: Get this from Hostinger's phpMyAdmin or database settings
- For `SMTP_PASS`: Use Gmail App Password (not your regular password)
- For `JWT_SECRET`: Generate a long random string (at least 32 characters)
- For `CORS_ORIGIN`: Use your actual Hostinger domain

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your app
3. Wait 3-5 minutes for the first deployment
4. Watch the logs for any errors

### Step 6: Get Your Backend URL

Once deployed, Render will give you a URL like:
```
https://skilltude-backend.onrender.com
```

Copy this URL - you'll need it for the frontend!

## 🔧 Update Frontend to Use Render Backend

Now update your frontend environment variables:

### On Hostinger:

1. Go to your Hostinger File Manager
2. Navigate to `public_html`
3. Edit or create `.env.production` file:

```env
VITE_API_URL=https://skilltude-backend.onrender.com
```

4. Rebuild your frontend locally:
```bash
npm run build
```

5. Re-upload the `dist` folder to Hostinger's `public_html`

## 📊 Verify Deployment

### Test the API:

1. Open your browser and go to:
   ```
   https://skilltude-backend.onrender.com/health
   ```
   You should see: `{"status":"ok"}`

2. Test CV upload from your frontend:
   - Go to your Hostinger site
   - Try uploading a PDF
   - Check Render logs for any errors

### Check Render Logs:

1. In Render dashboard, click on your service
2. Click **"Logs"** tab
3. Watch for errors or successful requests

## ⚠️ Important: Free Tier Limitations

### Sleep Behavior:
- Free tier services sleep after **15 minutes** of inactivity
- First request after sleep takes **30-60 seconds** to wake up
- Subsequent requests are fast

### Solutions:
1. **Accept the delay** (simplest for low-traffic sites)
2. **Use a ping service** (keep it awake):
   - [UptimeRobot](https://uptimerobot.com) - ping every 5 minutes
   - [Cron-job.org](https://cron-job.org) - scheduled pings
3. **Upgrade to paid tier** ($7/month for always-on)

## 🗄️ Database Connection

Your backend will connect to your **Hostinger MySQL database** remotely.

### Ensure Remote Access is Enabled:

1. Log into Hostinger hPanel
2. Go to **Databases → Remote MySQL**
3. Add Render's IP ranges (or use `%` for any IP - less secure)
4. Test connection from Render logs

## 📁 File Storage

### Uploaded CVs:

On Render's free tier, uploaded files are **ephemeral** (deleted on restart).

### Solutions:

1. **Use Hostinger for file storage** (recommended):
   - Store files on Hostinger via FTP/SFTP
   - Update `FileStorageService.ts` to use remote storage

2. **Use cloud storage**:
   - AWS S3
   - Cloudinary
   - DigitalOcean Spaces

3. **Store in database** (for small files):
   - Convert PDFs to base64
   - Store in MySQL LONGBLOB column

## 🔄 Continuous Deployment

Render automatically redeploys when you push to GitHub!

```bash
# Make changes locally
git add .
git commit -m "Update backend"
git push origin main

# Render automatically deploys! 🎉
```

## 🐛 Troubleshooting

### Build Fails:

**Check:**
- Build logs in Render dashboard
- Ensure `server/package.json` has all dependencies
- Verify `tsconfig.json` is correct

**Common fixes:**
```bash
# Locally test the build
cd server
npm install
npm run build
```

### Database Connection Fails:

**Check:**
- Environment variables are correct
- Hostinger allows remote MySQL connections
- Database credentials are valid

**Test connection:**
```bash
# In Render shell (click "Shell" tab)
node -e "console.log(process.env.DB_HOST)"
```

### CORS Errors:

**Check:**
- `CORS_ORIGIN` matches your frontend URL exactly
- Include protocol: `https://skilltude.com` not `skilltude.com`

**Update in Render:**
1. Go to Environment tab
2. Edit `CORS_ORIGIN`
3. Save (triggers redeploy)

### App Crashes:

**Check Render logs for:**
- Missing environment variables
- Database connection errors
- Port binding issues (use `process.env.PORT`)

## 📈 Monitoring

### Render Dashboard:
- **Metrics**: CPU, Memory, Response times
- **Logs**: Real-time application logs
- **Events**: Deployment history

### Set Up Alerts:
1. Go to service settings
2. Add notification email
3. Get alerts for crashes/failures

## 💰 Cost Breakdown

### Free Tier:
- ✅ 750 hours/month (enough for 24/7)
- ✅ Automatic HTTPS
- ✅ Unlimited bandwidth
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Shared CPU (slower)

### Paid Tier ($7/month):
- ✅ Always on (no sleep)
- ✅ Faster performance
- ✅ More memory
- ✅ Better for production

## 🎯 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Update frontend with Render URL
3. ✅ Test CV upload functionality
4. ✅ Set up database migrations
5. ✅ Configure email service
6. ✅ Test admin dashboard
7. ✅ Set up monitoring/alerts

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **GitHub Issues**: Report bugs in your repo

---

**Your Backend URL**: `https://skilltude-backend.onrender.com`

**Your Frontend URL**: `https://skilltude.com`

**Status**: Ready to deploy! 🚀
