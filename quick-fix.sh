#!/bin/bash
# TheraBrake Academy - Immediate Fix Commands

echo "🔧 TheraBrake Academy - Immediate Fixes"
echo "========================================"
echo ""

# Step 1: Update npm
echo "📦 Step 1: Updating npm to latest version..."
npm install -g npm@latest
echo "✅ npm updated"
echo ""

# Step 2: Install Vercel CLI
echo "🌐 Step 2: Installing Vercel CLI..."
npm install -g vercel
echo "✅ Vercel CLI installed"
echo ""

# Step 3: Fix TypeScript error
echo "🔨 Step 3: Fixing certificate webhook TypeScript error..."
cat > app/api/webhooks/certificate-generated/route.ts << 'WEBHOOK_EOF'
// app/api/webhooks/certificate-generated/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { certificate_id } = body

    if (!certificate_id) {
      return NextResponse.json(
        { error: 'Certificate ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: certificate, error } = await supabase
      .from('certificates')
      .select(`
        *,
        user:profiles!certificates_user_id_fkey (
          email,
          full_name
        ),
        course:courses!certificates_course_id_fkey (
          title,
          ce_hours
        )
      `)
      .eq('id', certificate_id)
      .single()

    if (error || !certificate) {
      console.error('Certificate fetch error:', error)
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    if (!certificate.user || !certificate.course) {
      return NextResponse.json(
        { error: 'Invalid certificate data' },
        { status: 400 }
      )
    }

    // TODO: Implement email service
    // await emailService.sendCertificate(...)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Certificate webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
WEBHOOK_EOF
echo "✅ Certificate webhook fixed"
echo ""

# Step 4: Create deployment script
echo "📝 Step 4: Creating deployment script..."
cat > deploy-production.sh << 'DEPLOY_EOF'
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
DEPLOY_EOF

chmod +x deploy-production.sh
echo "✅ Deployment script created"
echo ""

# Step 5: Create .env.production template
if [ ! -f .env.production ]; then
    echo "📝 Step 5: Creating .env.production template..."
    cat > .env.production << 'ENV_EOF'
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://therabrake.academy

# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=https://zjoncglqxfcmmljwmoma.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqb25jZ2xxeGZjbW1sandtb21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTY5NDUsImV4cCI6MjA3NDEzMjk0NX0.9X7CCpBNAm-ltWfd9_oBk7wdgPwBtVh1dx8KmvEswvA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqb25jZ2xxeGZjbW1sandtb21hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU1Njk0NSwiZXhwIjoyMDc0MTMyOTQ1fQ.G4dzq86ObgRd-fBdGykfyq5VIFIC0B7LDAS5FNus7Ng

# Stripe - FILL IN YOUR LIVE KEYS!
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_35oJ3vQgtEbOitwW41CeIraj00KUmvRsuS
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Security - Generate with: openssl rand -base64 32
AUTH_SECRET=YOUR_AUTH_SECRET_HERE
JWT_SECRET=YOUR_JWT_SECRET_HERE
ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY_HERE

# Email
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
SENDGRID_FROM_EMAIL=noreply@therabrake.academy
CERTIFICATE_FROM_EMAIL=certificates@therabrake.academy

# Texas LPC
PROVIDER_NUMBER=YOUR_TEXAS_LPC_PROVIDER_NUMBER
PROVIDER_NAME=TheraBrake Academy

# Settings
SESSION_TIMEOUT=1800000
RATE_LIMIT_LOGIN=5
PASSWORD_MIN_LENGTH=12
NEXT_PUBLIC_VERIFICATION_URL=https://therabrake.academy/verify
ENV_EOF
    echo "✅ .env.production template created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.production and fill in:"
    echo "   - STRIPE_SECRET_KEY (your live secret key)"
    echo "   - STRIPE_WEBHOOK_SECRET (from Stripe dashboard)"
    echo "   - AUTH_SECRET, JWT_SECRET, ENCRYPTION_KEY (generate with openssl)"
    echo "   - SENDGRID_API_KEY (if using SendGrid)"
    echo "   - PROVIDER_NUMBER (your Texas LPC provider number)"
    echo ""
else
    echo "✅ .env.production already exists"
    echo ""
fi

# Step 6: Create health check endpoint
echo "🏥 Step 6: Creating health check endpoint..."
mkdir -p app/api/health
cat > app/api/health/route.ts << 'HEALTH_EOF'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').select('id').limit(1)
    
    if (error) {
      return NextResponse.json(
        { status: 'unhealthy', database: 'disconnected', error: error.message },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Internal server error' },
      { status: 503 }
    )
  }
}
HEALTH_EOF
echo "✅ Health check endpoint created"
echo ""

# Step 7: Test build
echo "🧹 Step 7: Testing build..."
npm install
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ================================"
    echo "🎉 All Fixes Applied Successfully!"
    echo "🎉 ================================"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Edit .env.production and fill in missing values"
    echo "   2. Generate secrets: openssl rand -base64 32"
    echo "   3. Run: vercel login"
    echo "   4. Run: ./deploy-production.sh"
    echo ""
else
    echo ""
    echo "❌ Build failed. Check errors above."
    exit 1
fi
