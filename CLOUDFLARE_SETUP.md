# 🚀 Cloudflare Pages Setup Guide

## GitHub Repository
✅ **Created:** https://github.com/rrosset91/autofeedback

---

## Cloudflare Pages Deployment

### Step 1: Create Pages Project

1. Go to: https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Pages** tab
3. Click **"Create application"**
4. Select **"Connect to Git"**
5. Choose **GitHub** and authorize Cloudflare
6. Select repository: **`rrosset91/autofeedback`**
7. Click **"Begin setup"**

---

### Step 2: Build Configuration

```
Project name: autofeedback
Production branch: master

Framework preset: SvelteKit
Build command: npm run build
Build output directory: .svelte-kit/cloudflare
Root directory: (leave empty)
```

---

### Step 3: Environment Variables

Add these environment variables:

#### Standard Variables:
```
CARDATA_API_URL = https://carmodelsapi-workers.rrosset91.workers.dev
CARDATA_API_KEY = (get from your .env file)
TURNSTILE_SECRET_KEY = (get from your .env file)
GOOGLE_CLIENT_ID = (get from your .env file)
GOOGLE_CLIENT_SECRET = (get from your .env file)
```

#### Public Variables:
```
PUBLIC_TURNSTILE_SITE_KEY = (get from your .env file)
```

**Note:** Copy values from your local `.env` file. Never commit secrets to Git!

---

### Step 4: D1 Database Binding

After initial deployment:

1. Go to **Settings** → **Functions**
2. Scroll to **"D1 database bindings"**
3. Click **"Add binding"**
4. Configure:
   ```
   Variable name: DB
   D1 database: autofeedback-db
   ```
5. Click **"Save"**

---

### Step 5: Deploy

1. Click **"Save and Deploy"**
2. Wait for build (~2-3 minutes)
3. You'll get a URL: `https://autofeedback-xxx.pages.dev`

---

## Post-Deployment Configuration

### Update Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://autofeedback-xxx.pages.dev/api/auth/google/callback
   ```
   (Replace `xxx` with your actual Pages URL)
5. Save

---

## Custom Domain Setup (When Ready)

### In Cloudflare Pages:

1. Go to **Settings** → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter: `auto-feedback.com` (or your domain)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (~5-10 minutes)

### Update Google OAuth Again:

Add custom domain to redirect URIs:
```
https://auto-feedback.com/api/auth/google/callback
```

---

## Troubleshooting

### Build Fails?
- Check build logs in Pages dashboard
- Verify environment variables are set correctly
- Ensure D1 binding is configured

### Site Not Working?
- Verify D1 database binding is active
- Check that all env vars are present
- Review Functions logs in Pages dashboard

### Google OAuth Not Working?
- Verify redirect URI matches exactly
- Check that Google OAuth credentials are correct
- Ensure HTTPS is working (Pages provides it automatically)

---

## Useful Commands

### Deploy Manually (if needed):
```bash
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare
```

### Check D1 Database:
```bash
npx wrangler d1 execute autofeedback-db --remote --command "SELECT name FROM sqlite_master WHERE type='table'"
```

---

## Links

- **GitHub Repo:** https://github.com/rrosset91/autofeedback
- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Pages URL:** Will be available after deployment

---

**Ready to deploy! 🚀**
