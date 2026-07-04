#!/bin/bash
# Build script: copy data to web/public/data, then build frontend
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Copy data to web/public/data for Vite to include in build
rm -rf web/public/data
cp -r data web/public/data

# Build frontend
cd web
npm run build

echo "Build complete: web/dist/"
