-- Brands and Models tables for local car database
-- Migrated from R2 cardataapi (Europe only)

CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT,
  logo_url TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_name ON brands(name);

CREATE TABLE IF NOT EXISTS models (
  id INTEGER PRIMARY KEY,
  brand_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  body_type TEXT,
  fuel_types TEXT, -- JSON array
  production_start INTEGER,
  production_end INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
  UNIQUE(brand_id, slug)
);

CREATE INDEX idx_models_brand_id ON models(brand_id);
CREATE INDEX idx_models_slug ON models(slug);
CREATE INDEX idx_models_name ON models(name);
