# Copy These Environment Variables to Render

## Your Database Credentials (From render.env)

You already have all the correct values in your `render.env` file. You just need to copy them to Render's dashboard.

## Step-by-Step Instructions

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com

### 2. Select Your Backend Service
Click on: **skilltude-ai-recruit-hub**

### 3. Click "Environment" Tab
In the left sidebar, click **Environment**

### 4. Add These Variables One by One

Click **"Add Environment Variable"** for each of these:

#### Database Variables:
```
DB_HOST=srv878.hstgr.io
DB_PORT=3306
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
```

#### Email Variables (if not already added):
```
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=careers@skilltude.com
SMTP_PASS=gsqu obzl levs mhbj
EMAIL_FROM_ADDRESS=careers@skilltude.com
EMAIL_FROM_NAME=SkillTude Careers Team
```

#### Other Important Variables:
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://skilltude.com
JWT_SECRET=f1852fe899833aba9afb0f90bbc1051ea8ce47a62fce0177b8c66249961d6112eb12d1c1c6f61ce4d7698280701dc3c7001d4ed46cd2d1cf6223c742bc286dbf
SESSION_SECRET=d5b622ab3e0b4742161a4aafe41677f0740956189286edb20a132085b2ecff896779d5f5d9a4f880d26173c0b5ec6538a5f80449ca78437ace7274763f24fb9d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=5
EMAIL_DELAY_HOURS=24
ADMIN_EMAIL=careers@skilltude.com
ENABLE_MONITORING=true
```

### 5. Save Changes
Click **"Save Changes"** button

### 6. Wait for Redeployment
Render will automatically redeploy your backend. This takes about 2-3 minutes.

## Quick Copy-Paste Format

For easier copying, here's the format Render accepts:

```
Key: DB_HOST
Value: srv878.hstgr.io

Key: DB_PORT
Value: 3306

Key: DB_NAME
Value: u931066387_skilltude

Key: DB_USER
Value: u931066387_management

Key: DB_PASSWORD
Value: Skilly@skilltude1

Key: FRONTEND_URL
Value: https://skilltude.com

Key: EMAIL_PROVIDER
Value: smtp

Key: SMTP_HOST
Value: smtp.gmail.com

Key: SMTP_PORT
Value: 587

Key: SMTP_SECURE
Value: false

Key: SMTP_USER
Value: careers@skilltude.com

Key: SMTP_PASS
Value: gsqu obzl levs mhbj

Key: EMAIL_FROM_ADDRESS
Value: careers@skilltude.com

Key: EMAIL_FROM_NAME
Value: SkillTude Careers Team

Key: JWT_SECRET
Value: f1852fe899833aba9afb0f90bbc1051ea8ce47a62fce0177b8c66249961d6112eb12d1c1c6f61ce4d7698280701dc3c7001d4ed46cd2d1cf6223c742bc286dbf

Key: SESSION_SECRET
Value: d5b622ab3e0b4742161a4aafe41677f0740956189286edb20a132085b2ecff896779d5f5d9a4f880d26173c0b5ec6538a5f80449ca78437ace7274763f24fb9d

Key: UPLOAD_DIR
Value: ./uploads

Key: MAX_FILE_SIZE
Value: 10485760

Key: RATE_LIMIT_WINDOW_MS
Value: 3600000

Key: RATE_LIMIT_MAX_REQUESTS
Value: 5

Key: EMAIL_DELAY_HOURS
Value: 24

Key: ADMIN_EMAIL
Value: careers@skilltude.com

Key: ENABLE_MONITORING
Value: true

Key: NODE_ENV
Value: production

Key: PORT
Value: 10000
```

## Important: Remote Database Access

Make sure your Hostinger database allows remote connections:

1. Log into **Hostinger hPanel**
2. Go to **Databases**
3. Find your database: `u931066387_skilltude`
4. Look for **"Remote MySQL"** or **"Remote Database Access"**
5. Add `%` to allow all IPs (or add Render's specific IPs)

## After Adding Variables

1. Wait for Render to finish redeploying (~2-3 minutes)
2. Go to your website: https://skilltude.com
3. Try uploading a CV
4. Should work completely! ✅

## Verification

Check Render logs after redeployment:
- Should see: "CV Analysis System Server" startup message
- Should NOT see: database connection errors
- Should see: successful database connections

## If Still Having Issues

Check Render logs for specific error messages:
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for any error messages about database connection
