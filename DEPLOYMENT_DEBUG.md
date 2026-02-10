# 🔍 Deployment Debugging Guide

## Current Situation
- ✅ Build works locally (`npm run build` succeeds)
- ✅ Latest code pushed to GitHub (`master` branch)
- ❌ Live site (auto-feedback.com) shows old/outdated version

## Quick Diagnostic Checklist

### 1️⃣ Check Latest Deployment
Go to: https://dash.cloudflare.com → Pages → autofeedback → **Deployments** tab

**Look for:**
- When was the last deployment?
- What is the deployment status? (Success / Failed / In Progress)
- What commit hash is deployed? (should be `6b804df` or newer)

### 2️⃣ View Build Logs
Click on the latest deployment → **View build log**

**Common issues:**
- ❌ "Module not found" errors → Missing dependencies
- ❌ "Database not available" → D1 binding not configured
- ❌ "Environment variable undefined" → Missing env vars
- ✅ "Build completed successfully" → Check if it's actually live

### 3️⃣ Verify D1 Binding
Settings → Functions → **D1 database bindings**

**Must have:**
```
Variable name: DB
D1 database: autofeedback-db
```

**If missing:**
1. Click "Add binding"
2. Variable name: `DB`
3. Select: `autofeedback-db`
4. Click "Save"
5. Go to Deployments → Retry latest deployment

### 4️⃣ Verify Environment Variables
Settings → Functions → **Environment variables** → Production

**Required variables:**
```
CARDATA_API_URL
CARDATA_API_KEY
TURNSTILE_SECRET_KEY
PUBLIC_TURNSTILE_SITE_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
```

**To add:**
1. Click "Add variable"
2. Enter name + value (from your local `.env` file)
3. Select: "Production" environment
4. Click "Save"
5. Repeat for all 7 variables

### 5️⃣ Check Custom Domain
Settings → **Custom domains**

**Verify:**
- `auto-feedback.com` is listed
- `www.auto-feedback.com` redirects to main domain
- SSL/TLS certificate is "Active"

**If domain points to old deployment:**
- Could be DNS caching (wait 5-10 minutes)
- Could be CDN caching (purge cache if available)

### 6️⃣ Force Fresh Deployment

**Option A: Retry existing deployment**
1. Deployments tab
2. Click latest deployment
3. Click "Retry deployment"
4. Wait ~2 minutes

**Option B: Trigger new deployment**
- Already done (empty commit `6b804df`)
- Should auto-deploy within minutes

**Option C: Manual deploy via CLI**
```bash
npx wrangler pages deploy .svelte-kit/cloudflare --project-name=autofeedback
```

## Expected Deployment Output

**When deployment succeeds, you should see:**
1. Build output shows all pages compiled
2. "Deployment complete!" message
3. Preview URL shows new version
4. Production URL updates within 1-2 minutes

**Current build output should include:**
```
✓ 237 modules transformed (SSR)
✓ 188 modules transformed (client)
✓ built in X seconds
Using @sveltejs/adapter-cloudflare
```

## How to Verify New Version is Live

Visit: https://auto-feedback.com/en

**New version has:**
- ✅ Header with navigation (Home, Brands, Login/Register or User dropdown)
- ✅ Footer with language flags (not emojis)
- ✅ Hero section with gradient background
- ✅ Three feature cards with SVG icons
- ✅ Cookie consent banner at bottom (on first visit)

**Old version has:**
- ❌ Simple homepage with emojis
- ❌ "Phase 2 In Progress!" status card
- ❌ Language selector with flag emojis
- ❌ No header/footer navigation

## Troubleshooting Specific Errors

### ✅ Error: "Cannot find module @rollup/rollup-linux-x64-gnu" (FIXED!)
**Issue:** npm bug with optional dependencies
**Fix:** Add `.npmrc` file with:
```
node-linker=hoisted
optional=true
```
**Status:** ✅ Fixed in commit `e37ce45`

### Error: "Database not available"
**Fix:** D1 binding not configured
- Go to Settings → Functions → D1 database bindings
- Add: `DB` → `autofeedback-db`
- Retry deployment

### Error: "CARDATA_API_KEY is not defined"
**Fix:** Environment variables missing
- Go to Settings → Functions → Environment variables
- Add all 7 required variables
- Retry deployment

### Error: "Failed to build"
**Fix:** Check build log for specific error
- Most likely: missing dependency or syntax error
- But build works locally, so probably config issue

### Site shows 404 / blank page
**Fix:** Build output directory wrong
- Should be: `.svelte-kit/cloudflare`
- Check Settings → Builds & deployments → Build output directory

### Site shows old version even after new deployment
**Fix:** Browser/CDN caching
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Wait 5 minutes for CDN to update
- Try incognito/private window

## Quick Win: Test Preview URL

Every deployment gets a preview URL like:
`https://[commit-hash].autofeedback.pages.dev`

**Test this first:**
1. Go to Deployments tab
2. Click latest deployment
3. Click "View deployment" or copy the URL
4. If preview works but production doesn't → DNS/domain issue
5. If preview also shows old version → deployment didn't actually deploy new code

## Next Steps After Deployment Works

1. ✅ Test all features:
   - User registration
   - Login (email + Google OAuth)
   - Browse brands
   - View model reviews
   - Submit a review
   - Delete review

2. ✅ Verify integrations:
   - Google Analytics tracking (check Real-Time in GA dashboard)
   - Turnstile CAPTCHA loading
   - Vehicle images loading from Wikimedia
   - Cookie consent banner appears

3. ✅ Performance check:
   - Lighthouse score (aim for 90+ on mobile)
   - Core Web Vitals
   - Page load times

4. 📊 Submit to Google Search Console:
   - Add property: `auto-feedback.com`
   - Submit sitemap: `https://auto-feedback.com/sitemap.xml`
   - Request indexing for homepage

---

**Last code update:** 2026-02-10  
**Latest commit:** `e37ce45` - Fix Rollup build error  
**Build status:** ✅ Working locally + Cloudflare build fixed  
**Deployment status:** 🔄 In progress (check Cloudflare Pages dashboard)
