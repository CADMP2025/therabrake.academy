#!/bin/bash
set -e
echo "🔧 ========================================"
echo "🔧 TheraBrake Academy Package Update"
echo "🔧 ========================================"
echo ""
echo "📦 Creating backups..."
cp package.json package.json.backup
[ -f next.config.js ] && cp next.config.js next.config.js.backup || echo "No existing next.config.js found"
echo "✅ Backups created"
echo ""
echo "📝 Updating package.json..."
cat > package.json << 'EOF'
{
  "name": "therabrake.academy",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "security:audit": "npm audit --production",
    "security:scan": "snyk test",
    "dev:main": "next dev -p 3000",
    "dev:test": "next dev -p 3001",
    "test:seed": "tsx tests/setup/seed-test-data.ts",
    "test:run": "npx playwright test",
    "test:cleanup": "tsx tests/setup/cleanup-test-data.ts",
    "db:generate-types": "supabase gen types typescript --project-id ravirhdxznhgurysumrt > types/supabase.ts"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@meilisearch/instant-meilisearch": "^0.28.0",
    "@react-pdf/renderer": "^3.4.2",
    "@sentry/nextjs": "^8.34.0",
    "@stripe/stripe-js": "^7.9.0",
    "@supabase/ssr": "^0.7.0",
    "@supabase/supabase-js": "^2.58.0",
    "@tiptap/extension-code-block": "^3.6.2",
    "@tiptap/extension-color": "^3.6.2",
    "@tiptap/extension-document": "^3.6.2",
    "@tiptap/extension-highlight": "^3.6.2",
    "@tiptap/extension-image": "^3.6.2",
    "@tiptap/extension-link": "^3.6.2",
    "@tiptap/extension-placeholder": "^3.6.2",
    "@tiptap/extension-table": "^3.6.2",
    "@tiptap/extension-table-cell": "^3.6.2",
    "@tiptap/extension-table-header": "^3.6.2",
    "@tiptap/extension-table-row": "^3.6.2",
    "@tiptap/extension-text-align": "^3.6.2",
    "@tiptap/extension-text-style": "^3.6.2",
    "@tiptap/extension-underline": "^3.6.2",
    "@tiptap/extension-youtube": "^3.6.2",
    "@tiptap/pm": "^3.6.2",
    "@tiptap/react": "^3.6.2",
    "@tiptap/starter-kit": "^3.6.2",
    "bcryptjs": "^2.4.3",
    "canvas": "^2.11.2",
    "clsx": "^2.1.1",
    "crypto-js": "^4.2.0",
    "date-fns": "^4.1.0",
    "dompurify": "^3.2.7",
    "file-type": "^19.6.0",
    "helmet": "^8.0.0",
    "html-to-text": "^9.0.5",
    "ioredis": "^5.4.1",
    "isomorphic-dompurify": "^2.28.0",
    "jose": "^5.9.6",
    "jspdf": "^2.5.2",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.378.0",
    "mammoth": "^1.8.0",
    "meilisearch": "^0.53.0",
    "mime-types": "^2.1.35",
    "next": "^14.2.33",
    "next-secure-headers": "^2.2.0",
    "node-forge": "^1.3.1",
    "otplib": "^12.0.1",
    "pdf-lib": "^1.17.1",
    "pino": "^9.5.0",
    "pino-pretty": "^11.2.2",
    "qrcode": "^1.5.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.6.0",
    "reading-time": "^1.5.0",
    "resend": "^6.1.2",
    "sanitize-html": "^2.13.1",
    "sharp": "^0.33.5",
    "speakeasy": "^2.0.0",
    "stripe": "^18.5.0",
    "tailwind-merge": "^2.6.0",
    "ts-node": "^10.9.2",
    "use-debounce": "^10.0.6",
    "uuid": "^13.0.0",
    "validator": "^13.12.0",
    "winston": "^3.17.0",
    "zod": "^4.1.11"
  },
  "devDependencies": {
    "@faker-js/faker": "^10.0.0",
    "@playwright/test": "^1.55.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/crypto-js": "^4.2.2",
    "@types/dompurify": "^3.2.0",
    "@types/jest": "^29.5.14",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/mime-types": "^2.1.4",
    "@types/node": "^20.19.21",
    "@types/qrcode": "^1.5.5",
    "@types/react": "^18.2.79",
    "@types/react-dom": "18.2.25",
    "@types/sanitize-html": "^2.13.0",
    "@types/speakeasy": "^2.0.10",
    "@types/stripe": "^8.0.416",
    "@types/uuid": "^11.0.0",
    "@types/validator": "^13.12.2",
    "autoprefixer": "^10.4.19",
    "dotenv": "^17.2.3",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.3",
    "eslint-plugin-security": "^3.0.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "^8.4.38",
    "puppeteer": "^24.23.0",
    "snyk": "^1.1293.1",
    "tailwindcss": "^3.4.1",
    "tsx": "^4.20.6",
    "typescript": "^5.4.5"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
EOF
echo "✅ package.json updated"
echo ""
echo "📥 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""
echo "⚙️  Configuring next.config.js..."
cat > next.config.js << 'NEXTCONFIG'
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ];
  },
  images: {
    domains: ['ravirhdxznhgurysumrt.supabase.co'],
    formats: ['image/avif', 'image/webp']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false, crypto: false };
    }
    return config;
  }
};

const sentryOptions = {
  org: process.env.SENTRY_ORG || 'therabrake-academy',
  project: process.env.SENTRY_PROJECT || 'lms-web',
  silent: true,
  hideSourceMaps: true,
  disableServerWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
  disableClientWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN
};

module.exports = withSentryConfig(nextConfig, sentryOptions);
NEXTCONFIG
echo "✅ next.config.js configured"
echo ""
cat > sentry.client.config.ts << 'SENTRYCLIENT'
import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  environment: process.env.NODE_ENV
});
SENTRYCLIENT
cat > sentry.server.config.ts << 'SENTRYSERVER'
import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  environment: process.env.NODE_ENV
});
SENTRYSERVER
cat > sentry.edge.config.ts << 'SENTRYEDGE'
import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  environment: process.env.NODE_ENV
});
SENTRYEDGE
echo "✅ Sentry config files created"
echo ""
if ! grep -q ".sentryclirc" .gitignore 2>/dev/null; then
  echo -e "\n# Sentry\n.sentryclirc\nsentry.properties\n.sentry" >> .gitignore
  echo "✅ .gitignore updated"
fi
echo ""
echo "✅ ========================================"
echo "✅ Setup Complete!"
echo "✅ ========================================"
echo ""
echo "📦 Added 25+ security & production packages"
echo "⚙️  Configured Sentry error tracking"
echo "🔐 Security headers enabled"
echo "💾 Backups: package.json.backup, next.config.js.backup"
echo ""
echo "🚀 Ready to commit!"
