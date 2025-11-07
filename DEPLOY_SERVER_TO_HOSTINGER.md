# 🚀 Deploy Server to Hostinger - Complete Guide

## 🎯 Current Situation
- ✅ **Frontend**: Fixed and pointing to `https://skilltude.com/server/api/blog/articles`
- ❌ **Backend**: Not deployed to Hostinger yet
- 📁 **Server folder**: Contains all the API code including blog routes

## 🔧 Server Deployment Steps

### 1. Prepare Server for Deployment
Your server has these API endpoints:
- `/api/health` - Health check
- `/api/blog/articles` - Blog articles (what we need!)
- `/api/cv/*` - CV upload functionality
- `/api/admin/*` - Admin functionality

### 2. Upload Server to Hostinger

**Upload these server files to Hostinger:**
```
/home/u931066387/public_html/server/
├── index.ts (or index.js if compiled)
├── package.json
├── .env
├── routes/
├── services/
├── middleware/
├── config/
└── all other server files
```

### 3. Install Dependencies on Hostinger
```bash
cd /home/u931066387/public_html/server
npm install
```

### 4. Start the Server
```bash
# Option 1: Direct start
node index.js

# Option 2: Using PM2 (recommended)
pm2 start index.js --name "skilltude-server"

# Option 3: Using npm
npm start
```

### 5. Configure Hostinger Node.js App
1. **Go to Hostinger Control Panel**
2. **Navigate to Node.js Apps**
3. **Create new Node.js application**
4. **Set startup file**: `index.js`
5. **Set application root**: `/public_html/server`

## 🔧 Alternative: Quick Fix - Update API URL

If deploying the server is complex, we can temporarily update the frontend to use a different API URL:

### Option A: Root Level API
If your server runs at root level:
```env
VITE_API_URL=https://skilltude.com
```

### Option B: Different Port
If your server runs on a different port:
```env
VITE_API_URL=https://skilltude.com:3001
```

### Option C: Subdomain
If you set up a subdomain:
```env
VITE_API_URL=https://api.skilltude.com
```

## 🚀 Quick Test After Deployment
Once server is deployed, test these URLs:
- `https://skilltude.com/server/api/health` (should return JSON status)
- `https://skilltude.com/server/api/blog/articles` (should return blog articles)

## 📋 Deployment Checklist
- [ ] Upload server folder to Hostinger
- [ ] Install Node.js dependencies
- [ ] Configure environment variables (.env file)
- [ ] Start the Node.js application
- [ ] Test API endpoints
- [ ] Verify blog articles load on frontend

## 🎯 Expected Result
After deployment:
- Frontend: `https://skilltude.com/blog` ✅
- Backend: `https://skilltude.com/server/api/blog/articles` ✅
- Blog articles display properly ✅

The server code is ready - it just needs to be deployed and running on Hostinger!