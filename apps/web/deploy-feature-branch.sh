#!/bin/bash
set -e

echo "🚀 TheraBrake Academy - Feature Branch Deployment"
echo "=================================================="
echo "Branch: feature/course-builder"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Error: Vercel CLI not found"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci

echo "🔍 Running type checks..."
npm run type-check

echo "🏗️  Building..."
npm run build

echo "🌐 Deploying to Vercel preview environment..."
echo "This will create a unique URL for the feature/course-builder branch"
echo ""

# Deploy to Vercel preview (not production)
vercel --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Your preview URL will be displayed above"
echo "💡 This deployment is tied to the feature/course-builder branch"
echo "💡 To promote to production, merge to main and run deploy-production.sh"
