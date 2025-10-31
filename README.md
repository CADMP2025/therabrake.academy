# TheraBrake Academy - Monorepo

**Professional Continuing Education & Personal Development Platform**

> Pause, Process, Progress™

## 🏗️ Architecture

This is a **monorepo** containing multiple apps and shared packages using **NPM Workspaces**.

### Applications

- **apps/web** - Next.js 14 web application (production)
- **apps/mobile** - Expo/React Native mobile app (in development)

### Shared Packages

- **@therabrake/shared-types** - TypeScript types and interfaces
- **@therabrake/api-client** - Shared API client (Supabase + REST)
- **@therabrake/config** - Configuration and constants

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x
- npm 10.x or higher
- Git

### Installation

```bash
# Install all workspace dependencies
npm install

# Start web app (default port 3001)
npm run dev:web

# Start mobile app (Expo)
npm run dev:mobile

# Start both
npm run dev:all
```

## 📱 Development

### Web App

```bash
cd apps/web
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm test           # Run tests
```

### Mobile App

```bash
cd apps/mobile
npm run start      # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
```

### Shared Packages

```bash
# Type check all packages
npm run type-check

# Lint all packages
npm run lint

# Test all packages
npm run test
```

## 📦 Adding Dependencies

### To a specific app:
```bash
npm install <package> --workspace=apps/web
npm install <package> --workspace=apps/mobile
```

### To a shared package:
```bash
npm install <package> --workspace=packages/shared-types
```

## 🏗️ Project Structure

```
therabrake.academy/
├── apps/
│   ├── web/                    # Next.js web app
│   │   ├── app/                # Next.js App Router
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities & helpers
│   │   ├── public/             # Static assets
│   │   └── package.json
│   │
│   └── mobile/                 # Expo mobile app
│       ├── app/                # Expo Router
│       ├── components/         # React Native components
│       ├── assets/             # Images, fonts, etc.
│       └── package.json
│
├── packages/
│   ├── shared-types/           # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── common.ts       # Common interfaces
│   │   │   ├── api.ts          # API types
│   │   │   └── database.types.ts
│   │   └── package.json
│   │
│   ├── api-client/             # Shared API client
│   │   ├── src/
│   │   │   ├── auth.ts         # Auth API
│   │   │   ├── courses.ts      # Courses API
│   │   │   ├── progress.ts     # Progress API
│   │   │   └── supabase.ts     # Supabase client
│   │   └── package.json
│   │
│   └── config/                 # Shared configuration
│       ├── src/
│       │   ├── constants.ts    # App constants
│       │   └── env.ts          # Env helpers
│       └── package.json
│
├── package.json                # Root workspace config
├── MONOREPO_SETUP.md          # Detailed setup guide
└── README.md                   # This file
```

## 🔧 Technology Stack

### Web (Next.js)
- **Framework:** Next.js 14.2 (App Router)
- **UI:** React 18, Tailwind CSS, Radix UI
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Payments:** Stripe
- **Email:** Resend
- **Search:** MeiliSearch
- **Monitoring:** Sentry

### Mobile (Expo)
- **Framework:** Expo SDK 51+
- **Navigation:** Expo Router
- **UI:** React Native Paper / Custom
- **Video:** Expo Video
- **Storage:** AsyncStorage
- **Backend:** Shared Supabase client

### Shared
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Types:** TypeScript 5.4+

## 📚 Documentation

- [Monorepo Setup Guide](./MONOREPO_SETUP.md) - Complete migration and setup instructions
- [Web App README](./apps/web/README.md) - Web-specific documentation
- [Mobile App README](./apps/mobile/README.md) - Mobile-specific documentation

## 🚢 Deployment

### Web App
- Platform: **Vercel**
- Branch: `main` → Production
- Branch: `feature/*` → Preview deployments

### Mobile App
- Platform: **EAS (Expo Application Services)**
- iOS: App Store
- Android: Google Play Store

## 🧪 Testing

```bash
# Run all tests
npm test

# Web app e2e tests
npm run test:e2e --workspace=apps/web

# Type checking
npm run type-check
```

## 🔐 Environment Variables

### Web App (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
```

### Mobile App (.env)
```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=
```

## 🤝 Contributing

1. Create feature branch from `feature/course-builder`
2. Make changes
3. Test locally
4. Commit with conventional commits
5. Push and create PR

## 📄 License

Proprietary - TheraBrake Academy © 2025

## 📞 Support

- **Email:** support@therabrake.academy
- **Phone:** 1-800-THERABRAKE

---

**Built with ❤️ for mental health professionals**
