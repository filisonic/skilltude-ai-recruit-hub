# Build Commands - Quick Reference

## 🎯 Run These Commands from Project Root

```
D:\client websites\skilltude\skilltude-ai-recruit-hub
```

## 📦 Build Commands

### Build Everything
```bash
# Build frontend (React/Vite)
npm run build

# Build backend (Node.js/TypeScript)
npm run server:build
```

### Build Frontend Only
```bash
npm run build
```
- **Output:** `dist/` folder
- **Contains:** index.html, assets/, JavaScript, CSS
- **Upload to:** `public_html/` on Hostinger

### Build Backend Only
```bash
npm run server:build
```
- **Output:** `server/dist/` folder
- **Contains:** Compiled JavaScript from TypeScript
- **Upload to:** `public_html/server/dist/` on Hostinger

## 🔧 Development Commands

### Run Frontend Dev Server
```bash
npm run dev
```
- Opens: http://localhost:5173

### Run Backend Dev Server
```bash
npm run server:dev
```
- Opens: http://localhost:3001

### Run Both (in separate terminals)
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run server:dev
```

## 📤 Prepare for Hostinger Upload

### Complete Build Process
```bash
# 1. Build frontend
npm run build

# 2. Build backend
npm run server:build

# 3. Configure backend environment
cd server
cp .env.production .env
# Edit .env with production values

# 4. Install production dependencies
npm ci --production

# 5. Go back to root
cd ..
```

### What You'll Have
```
✅ dist/                    → Upload to public_html/
✅ server/dist/             → Upload to public_html/server/dist/
✅ server/node_modules/     → Upload to public_html/server/node_modules/
✅ server/.env              → Upload to public_html/server/.env
✅ server/package.json      → Upload to public_html/server/package.json
```

## 🧪 Test Commands

### Test Frontend Build
```bash
npm run build
npm run preview
```
- Opens: http://localhost:4173

### Test Backend Build
```bash
npm run server:build
npm run server:start
```
- Opens: http://localhost:3001

## 🗑️ Clean Build

### Clean Everything
```bash
# Remove build outputs
rm -rf dist
rm -rf server/dist

# Remove dependencies
rm -rf node_modules
rm -rf server/node_modules

# Reinstall and rebuild
npm install
npm run build
npm run server:build
```

### Clean Frontend Only
```bash
rm -rf dist
npm run build
```

### Clean Backend Only
```bash
rm -rf server/dist
npm run server:build
```

## 📋 Available Scripts (from package.json)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `npm run dev` | Run frontend dev server |
| `build` | `npm run build` | Build frontend for production |
| `preview` | `npm run preview` | Preview frontend build |
| `server:dev` | `npm run server:dev` | Run backend dev server |
| `server:build` | `npm run server:build` | Build backend for production |
| `server:start` | `npm run server:start` | Run built backend |
| `test` | `npm run test` | Run tests |

## ⚠️ Important Notes

1. **Always run from project root** (`D:\client websites\skilltude\skilltude-ai-recruit-hub`)
2. **Build both** frontend and backend before deploying
3. **Configure `.env`** in `server/` folder before uploading
4. **Use production dependencies** for backend: `cd server && npm ci --production`

## 🚀 Quick Deploy Checklist

```bash
# From project root
cd "D:\client websites\skilltude\skilltude-ai-recruit-hub"

# Build
npm run build              # ✅ Creates dist/
npm run server:build       # ✅ Creates server/dist/

# Configure
cd server
cp .env.production .env    # ✅ Edit with production values
npm ci --production        # ✅ Install production deps

# Upload to Hostinger
# ✅ dist/* → public_html/
# ✅ server/dist/* → public_html/server/dist/
# ✅ server/node_modules/ → public_html/server/node_modules/
# ✅ server/.env → public_html/server/.env
# ✅ server/package.json → public_html/server/package.json
```

## 📚 More Information

- **Detailed Guide:** `DEPLOYMENT_BUILD_GUIDE.md`
- **Hostinger Setup:** `server/docs/HOSTINGER_QUICK_START.md`
- **Checklist:** `server/HOSTINGER_DEPLOYMENT_CHECKLIST.md`
- **Quick Reference:** `HOSTINGER_DEPLOYMENT_QUICK_REFERENCE.md`

---

**Remember:** Build from root, upload to Hostinger! 🎉
