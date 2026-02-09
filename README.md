# 🚗 AutoFeedback - Automotive Review Platform

Real car reviews from real owners across Europe. Built with SvelteKit + Cloudflare.

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ installed
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual values

# Run development server
npm run dev
```

Visit http://localhost:5173

### Build

```bash
# Type check
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Tech Stack

- **Framework:** SvelteKit 2.0
- **Styling:** TailwindCSS 3.4 (responsive-first)
- **Language:** TypeScript
- **Deployment:** Cloudflare Pages
- **Database:** Cloudflare D1
- **External API:** CarDataAPI (enterprise tier)

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── server/         # Server-side utilities
│   ├── utils/          # Client utilities
│   ├── i18n/           # Translations (en, pt, fr, es)
│   └── types.ts        # TypeScript types
├── routes/             # SvelteKit routes
│   └── [lang]/         # Language-specific routes
├── params/             # Route matchers
└── app.css             # Global styles
```

## 🌍 Supported Languages

- 🇬🇧 English (default)
- 🇵🇹 Portuguese
- 🇫🇷 French
- 🇪🇸 Spanish

## 🎨 Design System

### Colors
- **Primary Blue:** `#2563EB`
- **Primary Dark:** `#1E40AF`
- **Primary Light:** `#DBEAFE`
- **Accent Orange:** `#F97316`
- **Success Green:** `#10B981`
- **Danger Red:** `#EF4444`

### Breakpoints
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

## 📋 Development Phases

See [CLICKUP_TASKS_SUMMARY.md](./CLICKUP_TASKS_SUMMARY.md) for complete task breakdown.

### Current Phase: ✅ FASE 1 - Foundation & Setup

- [x] Setup SvelteKit Project
- [ ] Setup Cloudflare Infrastructure
- [ ] Database Schema & Migrations
- [ ] CarData API Integration
- [ ] Internationalization (i18n)

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

- `CARDATA_API_URL` - Your CarDataAPI base URL
- `CARDATA_API_KEY` - Enterprise API key
- `PUBLIC_TURNSTILE_SITE_KEY` - Cloudflare Turnstile site key
- `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret

## 🚀 Deployment

Deploying to Cloudflare Pages:

```bash
# Build the project
npm run build

# Deploy with Wrangler
wrangler pages deploy .svelte-kit/cloudflare
```

## 📝 License

Private project - All rights reserved

## 🔗 Links

- **ClickUp Board:** https://app.clickup.com/90152323076/v/b/li/901520985516
- **CarDataAPI:** https://api.car-data-api.com
