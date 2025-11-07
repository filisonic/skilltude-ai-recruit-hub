# Deploy Scroll Fix

## What Was Fixed

The CV upload page now scrolls to the top when you visit it (instead of opening halfway down).

## Deploy the Fix

### Step 1: Rebuild Frontend

```bash
npm run build
```

### Step 2: Upload to Hostinger

Upload everything from the `dist/` folder to `public_html/` on Hostinger.

### Step 3: Test

1. Go to https://skilltude.com/upload-cv
2. Page should load at the top ✅

---

**That's it!** The scroll issue is fixed.
