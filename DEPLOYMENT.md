# 🚀 AutoFeedback - Deployment Guide

## Quick Start Checklist

### ✅ Already Done (Automatic)
- [x] GitHub repository connected to Cloudflare Pages
- [x] Auto-deploy on push to `master` branch
- [x] Build command: `npm run build`
- [x] Build output directory: `.svelte-kit/cloudflare`
- [x] Node.js compatibility enabled in `wrangler.toml`

### 🔧 Manual Configuration Required

You need to configure **2 things** in the Cloudflare Pages dashboard:

---

## Step 1: Configure D1 Database Binding

1. Go to **Cloudflare Dashboard** → **Pages** → **autofeedback**
2. Click **Settings** tab
3. Click **Functions** in the left sidebar
4. Scroll to **D1 database bindings**
5. Click **Add binding**
6. Configure:
   - **Variable name**: `DB`
   - **D1 database**: Select `autofeedback-db` from dropdown
7. Click **Save**

---

## Step 2: Add Environment Variables

1. Still in **Settings** → **Functions**
2. Scroll to **Environment variables**
3. Click **Add variable** for each of the following:

### Required Variables

**⚠️ Important**: Use the actual values from your `.env` file (not shown here for security)

```
CARDATA_API_URL=https://carmodelsapi-workers.rrosset91.workers.dev
CARDATA_API_KEY=<your_cardata_api_key>
TURNSTILE_SECRET_KEY=<your_turnstile_secret>
PUBLIC_TURNSTILE_SITE_KEY=<your_turnstile_site_key>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_REDIRECT_URI=https://auto-feedback.com/api/auth/google/callback
```

**📝 Note**: All values are in your local `.env` file. Copy them exactly as they appear.

### For Each Variable:
1. Paste the **Variable name** (left side)
2. Paste the **Value** (right side)
3. Choose **Environment**: Production (and optionally Preview)
4. Click **Add variable**

---

## Step 3: Verify Deployment

After saving both configurations:

1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest deployment
   - OR: Push a new commit to trigger auto-deploy
3. Wait for build to complete (~2 minutes)
4. Click **Visit site** to test

---

## ✅ Testing Checklist

Visit your site and test these features:

- [ ] Homepage loads correctly
- [ ] Language switcher works (en, pt, fr, es)
- [ ] Brands page loads and displays brands
- [ ] Click a brand → models page loads
- [ ] Click a model → reviews page loads
- [ ] Register new account (email/password)
- [ ] Login with account
- [ ] Google OAuth login works
- [ ] Write a review (must be logged in)
- [ ] View "My Reviews" page
- [ ] Delete a review
- [ ] Logout

---

## 🔍 Troubleshooting

### "Database not available" Error
**Cause**: D1 binding not configured  
**Fix**: Complete Step 1 above

### "Failed to load brands" Error
**Cause**: CarData API environment variables missing  
**Fix**: Add `CARDATA_API_URL` and `CARDATA_API_KEY` in Step 2

### Google OAuth Returns Error
**Cause**: OAuth redirect URI mismatch  
**Fix**: Ensure `GOOGLE_REDIRECT_URI` matches your production domain

### Turnstile CAPTCHA Not Loading
**Cause**: Public key not exposed to client  
**Fix**: Ensure `PUBLIC_TURNSTILE_SITE_KEY` is added (note the `PUBLIC_` prefix)

### Build Fails with "nodejs_compat required"
**Cause**: Compatibility flag missing  
**Fix**: Check `wrangler.toml` has `compatibility_flags = ["nodejs_compat"]`

---

## 📊 Analytics & Monetization Setup

### Google Analytics (Already Configured)
- Property ID: **G-36NLGRHHQM**
- Tracking code is in `app.html`
- No additional setup needed
- View reports at: https://analytics.google.com

### Google AdSense (Configured, Pending Approval)
- Publisher ID: **pub-2683103629918727**
- Ad code is in `app.html`
- `ads.txt` file is in `/static/ads.txt`
- **Next Steps**:
  1. Wait for Google AdSense approval (can take 1-3 days)
  2. Once approved, create ad units in AdSense dashboard
  3. Use `<AdSense slot="YOUR_SLOT_ID" />` component to place ads

### Example Ad Placement
```svelte
<script>
  import AdSense from '$lib/components/AdSense.svelte';
</script>

<!-- Between content -->
<AdSense slot="1234567890" format="auto" />
```

---

## 🌐 Custom Domain Setup (Optional)

If you want to use `auto-feedback.com` instead of `*.pages.dev`:

1. Go to **Settings** → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `auto-feedback.com`
4. Follow DNS configuration instructions
5. Also add: `www.auto-feedback.com`
6. Enable **Always use HTTPS**
7. Update `GOOGLE_REDIRECT_URI` to use new domain

---

## 🗄️ Database Management

### View Database Contents
```bash
# Local database
npx wrangler d1 execute autofeedback-db --local --command "SELECT * FROM users"

# Production database
npx wrangler d1 execute autofeedback-db --remote --command "SELECT * FROM users"
```

### Useful Queries
```sql
-- Count users
SELECT COUNT(*) FROM users;

-- Count reviews
SELECT COUNT(*) FROM reviews;

-- Top rated models
SELECT brand_id, model_id, avg_overall, review_count 
FROM aggregates_cache 
ORDER BY avg_overall DESC 
LIMIT 10;

-- Recent reviews
SELECT * FROM reviews 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔄 Continuous Deployment

Every push to `master` branch automatically:
1. Triggers Cloudflare Pages build
2. Runs `npm install`
3. Runs `npm run build`
4. Deploys to production
5. Updates live site (~2 minutes total)

**No manual deployment needed!**

---

## 📝 Important URLs

- **Live Site**: https://caad685d.autofeedback.pages.dev (or your custom domain)
- **GitHub Repo**: https://github.com/rrosset91/autofeedback
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Google Analytics**: https://analytics.google.com
- **Google AdSense**: https://adsense.google.com
- **Sitemap**: https://your-domain.com/sitemap.xml
- **Robots.txt**: https://your-domain.com/robots.txt
- **Ads.txt**: https://your-domain.com/ads.txt

---

## 🎯 Post-Deployment Tasks

### Immediate (Required)
- [ ] Complete Step 1: D1 binding
- [ ] Complete Step 2: Environment variables
- [ ] Test all features (checklist above)
- [ ] Verify Google Analytics tracking
- [ ] Submit sitemap to Google Search Console

### Soon (Recommended)
- [ ] Create legal pages (Privacy Policy, Terms)
- [ ] Monitor AdSense approval status
- [ ] Set up Google Search Console
- [ ] Configure custom domain
- [ ] Add more content/reviews

### Later (Optional)
- [ ] Set up email notifications
- [ ] Add more languages
- [ ] Create blog for SEO content
- [ ] Add social media links
- [ ] Create comparison tools

---

## 🆘 Support

If you encounter issues:

1. Check Cloudflare Pages build logs
2. Check browser console for errors
3. Verify environment variables are set
4. Test API endpoints directly
5. Check D1 database has data

**All code is in GitHub**: https://github.com/rrosset91/autofeedback

---

**Last Updated**: 2026-02-10  
**Status**: ✅ Ready for Production
