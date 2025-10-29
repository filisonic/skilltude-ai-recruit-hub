# Hostinger Deployment - Quick Reference Card

## 🚀 Your Workflow

### 1️⃣ Build Locally
```bash
# From project root: D:\client websites\skilltude\skilltude-ai-recruit-hub

# Install dependencies
npm install

# Build frontend (React/Vite)
npm run build

# Build backend (Node.js server)
npm run server:build
```
✅ Creates `dist/` (frontend) and `server/dist/` (backend)

### 2️⃣ Prepare .env
```bash
cp server/.env.production server/.env
nano server/.env
```
✅ Fill in production values (database, email, secrets)

### 3️⃣ Upload to Hostinger
**Via File Manager:**

**Frontend (from root `dist/`):**
- Upload `dist/*` → `public_html/` (index.html, assets/, etc.)

**Backend (from `server/`):**
- Upload `server/dist/` → `public_html/server/dist/`
- Upload `server/node_modules/` → `public_html/server/node_modules/`
- Upload `server/package.json`, `server/.env` → `public_html/server/`

### 4️⃣ Database (phpMyAdmin)
```sql
-- Run these in order:
1. complete_database_schema.sql (cv_submissions table)
2. add_cv_analysis_columns.sql
3. add_email_queue_fields.sql
```

### 5️⃣ Node.js Config (hPanel)
- **Path:** Advanced → Node.js → Create Application
- **Root:** `public_html/server`
- **Entry:** `dist/index.js`
- **Version:** 18.x
- **Add all environment variables from .env**

### 6️⃣ SSL (hPanel)
- **Path:** Security → SSL → Install
- **Add .htaccess to force HTTPS**

### 7️⃣ Cron Job (hPanel)
- **Path:** Advanced → Cron Jobs
- **Schedule:** `*/5 * * * *`
- **Command:** `cd /home/USERNAME/public_html/server && /usr/bin/node dist/jobs/processEmailQueue.js`

### 8️⃣ Test
```bash
curl https://yourdomain.com/api/health
```

---

## 📁 File Structure

```
public_html/
├── index.html          ← Frontend (from root dist/)
├── assets/             ← Frontend assets (from root dist/)
├── *.js, *.css        ← Frontend files (from root dist/)
├── server/
│   ├── dist/          ← Backend compiled code (from server/dist/)
│   ├── node_modules/  ← Backend dependencies
│   ├── package.json
│   └── .env          ← Production config
├── uploads/cvs/       ← Create, set 755
└── logs/              ← Create, set 755
```

---

## 🔑 Critical Environment Variables

```env
NODE_ENV=production
DB_HOST=localhost
DB_NAME=u931066387_skilltude
DB_USER=u931066387_management
DB_PASSWORD=Skilly@skilltude1
UPLOAD_DIR=/home/u931066387/public_html/uploads/cvs
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_key
JWT_SECRET=generate_64_char_random
SESSION_SECRET=generate_64_char_random
FRONTEND_URL=https://yourdomain.com
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| `server/docs/HOSTINGER_QUICK_START.md` | Step-by-step guide |
| `server/HOSTINGER_DEPLOYMENT_CHECKLIST.md` | Complete checklist |
| `server/docs/HOSTINGER_PRODUCTION_SETUP.md` | Detailed guide |
| `server/TASK_20.1_PRODUCTION_SETUP_SUMMARY.md` | Implementation summary |

---

## 🔧 Quick Fixes

**App won't start?**
- Check Node.js logs in hPanel
- Verify `dist/index.js` exists

**Database error?**
- Test credentials in phpMyAdmin
- Check DB_HOST=localhost

**Upload fails?**
- Set permissions: 755 on `uploads/cvs`
- Check disk space in hPanel

**Email not sending?**
- Verify SendGrid API key
- Check cron job is running

---

## ✅ Verification Checklist

- [ ] `npm run build` successful (frontend)
- [ ] `npm run server:build` successful (backend)
- [ ] `server/.env` configured with production values
- [ ] Frontend files uploaded to `public_html/`
- [ ] Backend files uploaded to `public_html/server/`
- [ ] Database tables created in phpMyAdmin
- [ ] Node.js app configured and running in hPanel
- [ ] SSL certificate installed and active
- [ ] Cron job created for email queue
- [ ] Test: `https://yourdomain.com` loads frontend
- [ ] Test: `https://yourdomain.com/api/health` returns 200
- [ ] Test CV upload works
- [ ] Email delivery working

---

## 🆘 Support

- **Hostinger:** https://www.hostinger.com/support
- **Docs:** `server/docs/`
- **Logs:** File Manager → `public_html/logs/`

---

**Ready to deploy? Start with:** `server/docs/HOSTINGER_QUICK_START.md`
