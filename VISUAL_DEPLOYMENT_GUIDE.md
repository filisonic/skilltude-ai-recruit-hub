# Visual Deployment Guide 🎨

## 📍 Your Current Location
```
D:\client websites\skilltude\skilltude-ai-recruit-hub\
```

## 🏗️ Build Process

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Build Frontend                                     │
│  Command: npm run build                                     │
│  Location: Project Root                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │   dist/       │
                    │  - index.html │
                    │  - assets/    │
                    │  - *.js, *.css│
                    └───────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Step 2: Build Backend                                      │
│  Command: npm run server:build                              │
│  Location: Project Root                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │ server/dist/  │
                    │  - index.js   │
                    │  - config/    │
                    │  - routes/    │
                    │  - services/  │
                    └───────────────┘
```

## 📤 Upload to Hostinger

```
Local Machine                          Hostinger
─────────────────                      ─────────────────

dist/                    ────────────► public_html/
├── index.html                         ├── index.html
├── assets/                            ├── assets/
│   ├── index-abc.js                   │   ├── index-abc.js
│   └── index-xyz.css                  │   └── index-xyz.css
└── ...                                └── ...


server/                  ────────────► public_html/server/
├── dist/                              ├── dist/
│   ├── index.js                       │   ├── index.js
│   ├── config/                        │   ├── config/
│   ├── routes/                        │   ├── routes/
│   └── services/                      │   └── services/
├── node_modules/                      ├── node_modules/
├── package.json                       ├── package.json
└── .env                               └── .env
```

## 🎯 Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    LOCAL MACHINE                             │
│  D:\client websites\skilltude\skilltude-ai-recruit-hub\     │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ npm run build
                            ↓
                    ┌───────────────┐
                    │   Frontend    │
                    │   dist/       │
                    └───────────────┘
                            │
                            │ npm run server:build
                            ↓
                    ┌───────────────┐
                    │   Backend     │
                    │ server/dist/  │
                    └───────────────┘
                            │
                            │ Upload via File Manager
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    HOSTINGER SERVER                          │
│                    public_html/                              │
├──────────────────────────────────────────────────────────────┤
│  Frontend Files                                              │
│  ├── index.html                                              │
│  └── assets/                                                 │
│                                                              │
│  Backend Files                                               │
│  └── server/                                                 │
│      ├── dist/          ← Node.js runs this                 │
│      ├── node_modules/                                       │
│      └── .env                                                │
│                                                              │
│  Storage                                                     │
│  ├── uploads/cvs/       ← CV files                          │
│  └── logs/              ← Application logs                  │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ Node.js App Running
                            ↓
                    ┌───────────────┐
                    │   Live Site   │
                    │ yourdomain.com│
                    └───────────────┘
```

## 🔄 Request Flow

```
User Browser
     │
     │ https://yourdomain.com
     ↓
┌─────────────────┐
│  Hostinger SSL  │
│   (Port 443)    │
└─────────────────┘
     │
     ├─────────────────────────────────────┐
     │                                     │
     │ Frontend Request                    │ API Request
     │ (/, /about, etc.)                   │ (/api/*)
     ↓                                     ↓
┌─────────────────┐              ┌─────────────────┐
│  Static Files   │              │   Node.js App   │
│  public_html/   │              │ server/dist/    │
│  - index.html   │              │  - index.js     │
│  - assets/      │              │  - routes/      │
└─────────────────┘              │  - services/    │
                                 └─────────────────┘
                                          │
                                          │ Database Query
                                          ↓
                                 ┌─────────────────┐
                                 │  MySQL Database │
                                 │  phpMyAdmin     │
                                 └─────────────────┘
```

## 📋 Step-by-Step Visual Checklist

```
┌─────────────────────────────────────────────────────────────┐
│ □ 1. Build Frontend                                         │
│     npm run build                                           │
│     ✓ Creates: dist/                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 2. Build Backend                                          │
│     npm run server:build                                    │
│     ✓ Creates: server/dist/                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 3. Configure Environment                                  │
│     cd server                                               │
│     cp .env.production .env                                 │
│     Edit .env with production values                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 4. Install Production Dependencies                        │
│     npm ci --production                                     │
│     ✓ Creates: server/node_modules/                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 5. Upload Frontend to Hostinger                           │
│     dist/* → public_html/                                   │
│     Via File Manager or FTP                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 6. Upload Backend to Hostinger                            │
│     server/dist/ → public_html/server/dist/                 │
│     server/node_modules/ → public_html/server/node_modules/ │
│     server/.env → public_html/server/.env                   │
│     server/package.json → public_html/server/package.json   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 7. Set Up Database (phpMyAdmin)                           │
│     Run: complete_database_schema.sql                       │
│     Run: add_cv_analysis_columns.sql                        │
│     Run: add_email_queue_fields.sql                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 8. Configure Node.js (hPanel)                             │
│     Advanced → Node.js → Create Application                 │
│     Root: public_html/server                                │
│     Entry: dist/index.js                                    │
│     Add environment variables                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 9. Enable SSL (hPanel)                                    │
│     Security → SSL → Install                                │
│     Add .htaccess for HTTPS redirect                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 10. Set Up Cron Job (hPanel)                              │
│     Advanced → Cron Jobs                                    │
│     Schedule: */5 * * * *                                   │
│     Command: cd /home/.../server && node dist/jobs/...      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ □ 11. Test Everything                                       │
│     ✓ Frontend: https://yourdomain.com                      │
│     ✓ Backend: https://yourdomain.com/api/health            │
│     ✓ Upload CV and verify                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │   🎉 LIVE!    │
                    └───────────────┘
```

## 🎨 Color-Coded File Types

```
Frontend Files (Blue)
├── 🔵 index.html
├── 🔵 assets/
│   ├── 🔵 *.js
│   ├── 🔵 *.css
│   └── 🔵 images/

Backend Files (Green)
├── 🟢 server/dist/
│   ├── 🟢 index.js
│   ├── 🟢 config/
│   ├── 🟢 routes/
│   └── 🟢 services/
├── 🟢 server/node_modules/
└── 🟢 server/.env

Configuration Files (Yellow)
├── 🟡 server/package.json
├── 🟡 server/package-lock.json
└── 🟡 server/.env

Storage (Purple)
├── 🟣 uploads/cvs/
└── 🟣 logs/
```

## 📊 Size Reference

```
Typical Build Sizes:

Frontend (dist/)
├── index.html          ~5 KB
├── assets/
│   ├── index-*.js      ~500 KB (minified)
│   ├── index-*.css     ~50 KB (minified)
│   └── images/         ~varies
└── Total:              ~1-2 MB

Backend (server/dist/)
├── Compiled JS         ~500 KB
└── Total:              ~500 KB

Backend Dependencies (server/node_modules/)
└── Total:              ~50-100 MB
```

## 🚀 Quick Commands

```bash
# Build everything
npm run build && npm run server:build

# Test locally
npm run dev              # Frontend: http://localhost:5173
npm run server:dev       # Backend: http://localhost:3001

# Production dependencies
cd server && npm ci --production
```

## 📞 Need Help?

```
Documentation Files:
├── BUILD_COMMANDS.md                    ← Command reference
├── DEPLOYMENT_BUILD_GUIDE.md            ← Complete guide
├── HOSTINGER_DEPLOYMENT_QUICK_REFERENCE.md
└── server/docs/HOSTINGER_QUICK_START.md ← Step-by-step
```

---

**Remember:** Build from root, upload to Hostinger! 🎯
