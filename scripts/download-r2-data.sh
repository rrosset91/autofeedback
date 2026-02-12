#!/bin/bash

# Download Europe car data from R2 bucket cardataapi
# This script downloads all Europe-specific data for import into D1

echo "Downloading Europe car data from R2..."

# Create data directory
mkdir -p ../data

# Download brands data
echo "Downloading brands..."
wrangler r2 object get cardataapi/europe/brands.json --file=../data/europe-brands.json

# Download models data  
echo "Downloading models..."
wrangler r2 object get cardataapi/europe/models.json --file=../data/europe-models.json

# Alternative: Try different paths
wrangler r2 object get cardataapi/brands-europe.json --file=../data/europe-brands.json
wrangler r2 object get cardataapi/models-europe.json --file=../data/europe-models.json

# Or maybe it's structured differently
wrangler r2 object get cardataapi/europe.json --file=../data/europe-full.json

echo "Done! Check ../data/ folder for downloaded files"
echo "Next: Run node scripts/import-r2-to-d1.js to import into database"
