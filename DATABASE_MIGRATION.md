# Database Migration Guide

## Migrating from CarData API to Local D1 Database

### Current Status
✅ Code updated to use D1 database  
⏳ Need to populate database with Europe data from R2

### Steps to Complete Migration

#### 1. Run Database Migrations

```bash
# Apply the new schema
npx wrangler d1 execute autofeedback-db --remote --file=migrations/0002_brands_models.sql
```

#### 2. Populate with Seed Data (Temporary)

```bash
# Load sample European brands/models
npx wrangler d1 execute autofeedback-db --remote --file=scripts/seed-europe-brands.sql
```

This adds:
- 25 European brands (VW, BMW, Mercedes, Audi, Renault, Peugeot, etc.)
- ~100 popular models

#### 3. Import from R2 (Production Data)

**Option A: Download from R2 and import**
```bash
# Download Europe data from R2
wrangler r2 object get cardataapi/europe-brands.json --file=data/brands.json
wrangler r2 object get cardataapi/europe-models.json --file=data/models.json

# Convert JSON to SQL and import
node scripts/import-r2-data.js
```

**Option B: Use existing R2 data directly**
If you have CSV/SQL exports from the cardataapi bucket, import them:
```bash
npx wrangler d1 execute autofeedback-db --remote --file=data/europe-import.sql
```

#### 4. Verify Data

```bash
# Check brand count
npx wrangler d1 execute autofeedback-db --remote --command="SELECT COUNT(*) FROM brands"

# Check model count
npx wrangler d1 execute autofeedback-db --remote --command="SELECT COUNT(*) FROM models"

# List sample brands
npx wrangler d1 execute autofeedback-db --remote --command="SELECT name FROM brands ORDER BY name LIMIT 10"
```

#### 5. Remove Old API Dependencies

After migration is complete and tested:

**Remove from `wrangler.toml`:**
```toml
# Delete these lines
CARDATA_API_URL = "..."
CARDATA_API_KEY = "..."
```

**Delete old file:**
```bash
rm src/lib/server/cardata.ts
```

### Database Schema

```sql
-- Brands table
CREATE TABLE brands (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT,
  logo_url TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Models table
CREATE TABLE models (
  id INTEGER PRIMARY KEY,
  brand_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  body_type TEXT,
  fuel_types TEXT,
  production_start INTEGER,
  production_end INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  UNIQUE(brand_id, slug)
);
```

### Updated Files

All these files now use `cardata-db.ts` instead of `cardata.ts`:

- ✅ `src/routes/[lang]/search/+page.server.ts`
- ✅ `src/routes/[lang]/brands/+page.server.ts`
- ✅ `src/routes/[lang]/[brandSlug]/+page.server.ts`
- ✅ `src/routes/[lang]/[brandSlug]/[modelSlug]/+page.server.ts`
- ✅ `src/routes/[lang]/[brandSlug]/[modelSlug]/review/+page.server.ts`
- ✅ `src/routes/api/models/[brandId]/+server.ts`

### Testing

After migration:

1. Visit `/search` - should show all brands
2. Select a brand - should load models
3. View a model page - should show reviews
4. Submit a review - should work normally

### Rollback Plan

If issues occur, revert to API:

```bash
git revert HEAD
```

Or temporarily update imports:
```ts
// Change this:
import { getCarDataDB } from '$lib/server/cardata-db';

// Back to this:
import { getCarDataClient } from '$lib/server/cardata';
```
