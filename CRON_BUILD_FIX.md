# Fix Cron Job Build Error

## Problem
Build fails with: `Cannot find type definition file for 'node'`

## Solution
Update the **Build Command** in your Render cron job settings.

## Steps

1. Go to your cron job in Render dashboard
2. Click **"Settings"** or edit the cron job
3. Find **"Build Command"**
4. Change from:
   ```bash
   npm install && npm run server:build
   ```
   
   To:
   ```bash
   npm install --include=dev && npm run server:build
   ```

5. Click **"Save Changes"**
6. Trigger a new build

## Why This Works
- `@types/node` is in devDependencies
- Render's production environment skips devDependencies by default
- `--include=dev` forces installation of dev dependencies needed for TypeScript compilation

## Alternative (if above doesn't work)
Change build command to:
```bash
npm ci && npm run server:build
```

This uses `npm ci` which installs all dependencies including dev.
