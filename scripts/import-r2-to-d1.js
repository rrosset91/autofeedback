#!/usr/bin/env node

/**
 * Import Europe car data from R2 JSON files into D1 database
 * 
 * Usage:
 *   node scripts/import-r2-to-d1.js
 * 
 * Requires:
 *   - data/europe-brands.json
 *   - data/europe-models.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'europe-import.sql');

console.log('🚀 Starting R2 to D1 import process...\n');

// Read brands
let brands = [];
const brandsPath = path.join(DATA_DIR, 'europe-brands.json');
if (fs.existsSync(brandsPath)) {
  console.log('📦 Reading brands from:', brandsPath);
  const brandsData = fs.readFileSync(brandsPath, 'utf8');
  brands = JSON.parse(brandsData);
  console.log(`   Found ${brands.length} brands\n`);
} else {
  console.error('❌ Brands file not found:', brandsPath);
  process.exit(1);
}

// Read models
let models = [];
const modelsPath = path.join(DATA_DIR, 'europe-models.json');
if (fs.existsSync(modelsPath)) {
  console.log('📦 Reading models from:', modelsPath);
  const modelsData = fs.readFileSync(modelsPath, 'utf8');
  models = JSON.parse(modelsData);
  console.log(`   Found ${models.length} models\n`);
} else {
  console.error('❌ Models file not found:', modelsPath);
  process.exit(1);
}

// Generate SQL
console.log('📝 Generating SQL...\n');

let sql = `-- Imported from R2 cardataapi bucket (Europe data)
-- Generated on ${new Date().toISOString()}
-- Brands: ${brands.length}
-- Models: ${models.length}

-- Clear existing data (optional - comment out if you want to keep seed data)
-- DELETE FROM models;
-- DELETE FROM brands;

-- Insert Brands
`;

brands.forEach(brand => {
  const name = brand.name.replace(/'/g, "''");
  const slug = brand.slug || brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const country = brand.country ? `'${brand.country.replace(/'/g, "''")}'` : 'NULL';
  const logo = brand.logo_url ? `'${brand.logo_url.replace(/'/g, "''")}'` : 'NULL';
  
  sql += `INSERT OR IGNORE INTO brands (id, name, slug, country, logo_url) VALUES (${brand.id}, '${name}', '${slug}', ${country}, ${logo});\n`;
});

sql += '\n-- Insert Models\n';

models.forEach(model => {
  const name = model.name.replace(/'/g, "''");
  const slug = model.slug || model.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const bodyType = model.body_type ? `'${model.body_type.replace(/'/g, "''")}'` : 'NULL';
  const fuelTypes = model.fuel_types ? `'${JSON.stringify(model.fuel_types).replace(/'/g, "''")}'` : 'NULL';
  const prodStart = model.production_start || 'NULL';
  const prodEnd = model.production_end || 'NULL';
  
  sql += `INSERT OR IGNORE INTO models (id, brand_id, name, slug, body_type, fuel_types, production_start, production_end) VALUES (${model.id}, ${model.brand_id}, '${name}', '${slug}', ${bodyType}, ${fuelTypes}, ${prodStart}, ${prodEnd});\n`;
});

// Write SQL file
console.log('💾 Writing SQL to:', OUTPUT_FILE);
fs.writeFileSync(OUTPUT_FILE, sql, 'utf8');

console.log('\n✅ Done!');
console.log('\n📊 Summary:');
console.log(`   Brands: ${brands.length}`);
console.log(`   Models: ${models.length}`);
console.log(`   Output: ${OUTPUT_FILE}`);
console.log('\n🚀 Next step:');
console.log('   npx wrangler d1 execute autofeedback-db --remote --file=data/europe-import.sql');
console.log('');
