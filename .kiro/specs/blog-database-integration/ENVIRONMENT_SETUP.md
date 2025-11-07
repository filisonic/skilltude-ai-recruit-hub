# Blog Database Integration - Environment Setup Guide

## Overview

This guide explains how to configure the `VITE_API_URL` environment variable for the blog database integration feature. This variable is essential for the frontend to communicate with the backend API to fetch blog articles.

## Environment Variable: VITE_API_URL

### Purpose

The `VITE_API_URL` environment variable tells the frontend React application where to find the backend API server. It's used by:

- Blog article listing page (`/blog`)
- Blog article detail page (`/blog/:slug`)
- Blog categories fetching
- CV upload functionality
- Admin dashboard operations

### Configuration Files

#### Development Environment

**File:** `.env` (project root)

```env
VITE_API_URL=http://localhost:3001
```

This points to your local backend server running on port 3001.

#### Production Environment

**File:** `.env.production` (project root)

```env
VITE_API_URL=https://yourdomain.com
```

Or if your API is on a subdomain:

```env
VITE_API_URL=https://api.yourdomain.com
```

#### Example Template

**File:** `.env.example` (project root)

```env
VITE_API_URL=http://localhost:3001
```

This serves as a template for other developers.

## How It Works

### Build Time vs Runtime

**Important:** Vite environment variables are embedded at **build time**, not runtime.

```typescript
// src/lib/api.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

This means:
1. When you run `npm run build`, Vite reads `.env.production`
2. The value of `VITE_API_URL` is embedded into the JavaScript bundle
3. If you change the variable, you **must rebuild** the frontend

### Usage in Code

The API URL is centralized in `src/lib/api.ts`:

```typescript
export const blogApi = {
  getArticles: () => `${API_URL}/api/blog/articles`,
  getArticle: (slug: string) => `${API_URL}/api/blog/articles/${slug}`,
  getCategories: () => `${API_URL}/api/blog/categories`,
};
```

## Setup Instructions

### For Development

1. **Verify `.env` exists** in project root:
   ```bash
   type .env
   ```

2. **Check VITE_API_URL is set**:
   ```bash
   type .env | findstr VITE_API_URL
   ```
   
   Should show: `VITE_API_URL=http://localhost:3001`

3. **Start backend server**:
   ```bash
   cd server
   npm run dev
   ```
   
   Backend should be running on http://localhost:3001

4. **Start frontend**:
   ```bash
   npm run dev
   ```
   
   Frontend should be running on http://localhost:5173

5. **Test the connection**:
   - Visit http://localhost:5173/blog
   - Open browser DevTools → Network tab
   - You should see requests to `http://localhost:3001/api/blog/articles`

### For Production

1. **Create/update `.env.production`**:
   ```bash
   echo VITE_API_URL=https://yourdomain.com > .env.production
   ```
   
   Or manually edit the file.

2. **Build frontend with production config**:
   ```bash
   npm run build
   ```
   
   This creates the `dist/` folder with the embedded API URL.

3. **Verify the build**:
   ```bash
   # Check that the API URL is embedded in the bundle
   type dist\assets\index-*.js | findstr "yourdomain.com"
   ```

4. **Deploy**:
   - Upload `dist/` contents to your hosting provider
   - Ensure backend is running and accessible at the URL you specified

## Troubleshooting

### Issue: Blog articles not loading

**Symptoms:**
- Blog page shows loading spinner indefinitely
- Console shows network errors
- 404 or CORS errors in DevTools

**Solutions:**

1. **Check API URL is correct**:
   ```javascript
   // In browser console
   console.log(import.meta.env.VITE_API_URL)
   ```

2. **Verify backend is running**:
   ```bash
   curl http://localhost:3001/api/blog/articles
   ```
   
   Should return JSON with articles.

3. **Check CORS configuration**:
   Backend must allow requests from frontend URL. In `server/.env`:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

4. **Rebuild if you changed the variable**:
   ```bash
   npm run build
   ```

### Issue: API URL is undefined

**Symptoms:**
- Console shows `undefined/api/blog/articles`
- API calls fail with invalid URL

**Solutions:**

1. **Ensure variable is prefixed with VITE_**:
   ```env
   # ✅ Correct
   VITE_API_URL=http://localhost:3001
   
   # ❌ Wrong - won't be exposed to client
   API_URL=http://localhost:3001
   ```

2. **Restart dev server** after changing `.env`:
   ```bash
   # Stop dev server (Ctrl+C)
   npm run dev
   ```

3. **Check the variable is loaded**:
   ```javascript
   // In browser console
   console.log(import.meta.env)
   ```

### Issue: Production build uses wrong URL

**Symptoms:**
- Production site tries to connect to localhost
- API calls fail in production

**Solutions:**

1. **Check `.env.production` exists and is correct**:
   ```bash
   type .env.production
   ```

2. **Rebuild with production config**:
   ```bash
   npm run build
   ```

3. **Verify the correct URL is embedded**:
   ```bash
   type dist\assets\index-*.js | findstr "localhost"
   ```
   
   Should NOT find localhost in production build.

## Testing Checklist

### Development Testing

- [ ] `.env` file exists with `VITE_API_URL=http://localhost:3001`
- [ ] Backend server is running on port 3001
- [ ] Frontend dev server is running on port 5173
- [ ] Blog page loads articles from backend
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows requests to `http://localhost:3001/api/blog/articles`

### Production Testing

- [ ] `.env.production` file exists with correct production URL
- [ ] Frontend built with `npm run build`
- [ ] `dist/` folder contains built files
- [ ] Production build does not contain localhost references
- [ ] Backend is accessible at production URL
- [ ] CORS is configured to allow frontend domain
- [ ] Blog page loads articles in production
- [ ] SSL certificate is valid (HTTPS)

## Additional Resources

- **API Configuration:** `src/lib/api.ts`
- **Blog Routes:** `server/routes/blog.routes.ts`
- **Blog Service:** `server/services/BlogService.ts`
- **Vite Environment Variables:** https://vitejs.dev/guide/env-and-mode.html
- **Main README:** `README.md` (Environment Configuration section)
- **Deployment Guide:** `DEPLOYMENT_BUILD_GUIDE.md`

## Quick Commands Reference

```bash
# Check environment variable
type .env | findstr VITE_API_URL

# Start development servers
npm run dev                    # Frontend
cd server && npm run dev       # Backend

# Build for production
npm run build                  # Uses .env.production

# Test API endpoint
curl http://localhost:3001/api/blog/articles

# Test production API
curl https://yourdomain.com/api/blog/articles
```

## Summary

The `VITE_API_URL` environment variable is:
- ✅ Configured in `.env` for development
- ✅ Configured in `.env.production` for production
- ✅ Documented in `.env.example` as a template
- ✅ Documented in `README.md`
- ✅ Documented in `DEPLOYMENT_BUILD_GUIDE.md`
- ✅ Used in `src/lib/api.ts` for all API calls
- ✅ Embedded at build time by Vite
- ✅ Requires rebuild if changed

This ensures the frontend can successfully communicate with the backend API in all environments.
