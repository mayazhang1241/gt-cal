# Fixing Vercel Deployment Styling Issues

## What We Just Fixed

1. **Created `vercel.json`**: Ensures proper routing and font caching
2. **Updated `vite.config.js`**: Explicitly tells Vite to copy public directory to build

## Step-by-Step Fix

### 1. Commit the Changes

```bash
cd /Users/mayazhang/gt-cal
git add frontend/vercel.json frontend/vite.config.js
git commit -m "Fix font loading and public assets for Vercel deployment"
git push origin main
```

### 2. Vercel Will Auto-Redeploy

- Go to https://vercel.com/dashboard
- Your project will automatically start rebuilding
- Wait 2-3 minutes for deployment to complete

### 3. Clear Browser Cache & Test

After Vercel finishes deploying:

1. Open your deployed app: `https://gt-cal.vercel.app`
2. **Hard refresh** to clear cache:
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`
3. Check if fonts load correctly

---

## Debugging Checklist

If fonts still don't load, check these:

### Check Browser Console (F12)

Look for errors like:
```
Failed to load resource: /fonts/Rubik-Regular.ttf (404)
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Filter by "font"
5. Check if font files show **200** (success) or **404** (failed)

### Check Vercel Build Logs

1. Go to Vercel Dashboard
2. Click your project
3. Click latest deployment
4. Check "Build Logs"
5. Look for any errors during build

---

## Alternative Fix: Move Fonts to src/assets

If the public folder approach still doesn't work, try this:

### 1. Move Font Files

```bash
cd /Users/mayazhang/gt-cal/frontend
mkdir -p src/assets/fonts
cp public/fonts/*.ttf src/assets/fonts/
```

### 2. Update App.css

Change the font paths from:
```css
src: url('/fonts/Rubik-Regular.ttf') format('truetype');
```

To:
```css
src: url('./assets/fonts/Rubik-Regular.ttf') format('truetype');
```

### 3. Rebuild and Deploy

```bash
npm run build
# Check dist folder to ensure fonts are included
ls -la dist/assets/fonts/

# Then commit and push
git add .
git commit -m "Move fonts to src/assets"
git push origin main
```

---

## Expected Results After Fix

✅ Custom Rubik font loads properly
✅ Headers are bold (weight 500)
✅ Body text is regular (weight 400)
✅ All styling matches localhost

---

## Common Issues & Solutions

### Issue 1: Fonts show 404

**Solution**: The `vercel.json` and `vite.config.js` updates should fix this.

### Issue 2: Build doesn't include public folder

**Solution**: Check Vercel build logs. The `copyPublicDir: true` setting ensures public assets are copied.

### Issue 3: Cache is preventing updates

**Solution**: 
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Or open in incognito/private window

### Issue 4: Fonts load but look different

**Solution**: Check if font-weight is applied correctly. Inspect element in DevTools and verify `font-family: "Rubik"` is active.

---

## Verify Fonts Are Loading

### Method 1: DevTools

1. Right-click any text
2. Select "Inspect"
3. Look at "Computed" tab
4. Check "font-family" - should show "Rubik"

### Method 2: Network Tab

1. F12 → Network tab
2. Refresh page
3. Filter by "font"
4. Should see:
   - `Rubik-Regular.ttf` (200 OK)
   - `Rubik-Medium.ttf` (200 OK)

---

## Quick Test Script

Run this locally to ensure build works:

```bash
cd /Users/mayazhang/gt-cal/frontend
npm run build
cd dist
python3 -m http.server 8080
```

Then open `http://localhost:8080` and check if fonts load.

If they load locally but not on Vercel, it's a Vercel configuration issue (the files we just updated should fix this).

---

## Need More Help?

Share these with me:
1. Screenshot of browser console (F12 → Console tab)
2. Screenshot of network tab showing font requests
3. Vercel build logs (any errors)

And I'll help you troubleshoot further!

