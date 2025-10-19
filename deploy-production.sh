#!/bin/bash
set -e

echo "🚀 TheraBrake Academy - Production Deployment"
echo "=============================================="
echo ""

if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production not found"
    echo "Please create it first"
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci

echo "🔍 Running type checks..."
npm run type-check

echo "🏗️  Building..."
NODE_ENV=production npm run build

echo "🌐 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
