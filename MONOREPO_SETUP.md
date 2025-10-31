# TheraBrake Academy - Monorepo Setup Guide

**Created:** October 31, 2025  
**Structure:** NPM Workspaces Monorepo  
**Apps:** Web (Next.js), Mobile (Expo)

## 📁 Directory Structure

```
therabrake.academy/
├── apps/
│   ├── web/              # Next.js web application (to be moved)
│   └── mobile/           # Expo React Native mobile app (to be created)
│
├── packages/
│   ├── shared-types/     # Shared TypeScript types & interfaces
│   ├── api-client/       # Shared API client (Supabase + REST)
│   └── config/           # Shared configuration & constants
│
├── package.json          # Root workspace configuration
└── README.md             # This file
```

## 🚀 Setup Instructions

### Step 1: Backup Current State
```powershell
git add -A
git commit -m "chore: prepare for monorepo conversion"
git push origin feature/course-builder
```

### Step 2: Move Web App to apps/web/

**PowerShell commands:**
```powershell
# Move all web app files to apps/web/
$exclude = @('apps', 'packages', 'node_modules', '.git', '.next', '.vercel')
Get-ChildItem -Path . -Exclude $exclude | Move-Item -Destination .\apps\web\

# Move hidden files
Move-Item .env.local .\apps\web\ -ErrorAction SilentlyContinue
Move-Item .env.local.example .\apps\web\ -ErrorAction SilentlyContinue
Move-Item .eslintrc.json .\apps\web\
Move-Item .gitignore.old .\apps\web\ -ErrorAction SilentlyContinue
```

### Step 3: Replace Root package.json
```powershell
Remove-Item package.json
Rename-Item package.json.new package.json
```

### Step 4: Install Dependencies
```powershell
# Install root workspace dependencies
npm install

# Install all workspace dependencies
npm install --workspaces
```

### Step 5: Initialize Mobile App
```powershell
# Navigate to mobile directory
cd apps/mobile

# Create Expo app with TypeScript + tabs template
npx create-expo-app@latest . --template tabs

# Install additional dependencies
npm install @supabase/supabase-js @react-native-async-storage/async-storage
npm install expo-video expo-router
```

### Step 6: Configure Mobile App

**apps/mobile/package.json** - Add workspace dependencies:
```json
{
  "dependencies": {
    "@therabrake/shared-types": "*",
    "@therabrake/api-client": "*",
    "@therabrake/config": "*"
  }
}
```

### Step 7: Update Web App Configuration

**apps/web/next.config.js** - Keep as-is, webpack alias still works

**apps/web/tsconfig.json** - Add workspace references:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@therabrake/shared-types": ["../../packages/shared-types/src"],
      "@therabrake/api-client": ["../../packages/api-client/src"],
      "@therabrake/config": ["../../packages/config/src"]
    }
  }
}
```

### Step 8: Copy Database Types

```powershell
# Copy existing database types to shared package
Copy-Item apps\web\lib\database.types.ts packages\shared-types\src\database.types.ts
```

### Step 9: Test Setup

```powershell
# From root directory
npm run dev:web      # Start web app on port 3001
npm run dev:mobile   # Start Expo dev server

# Or run both
npm run dev:all
```

## 📦 Workspace Packages

### @therabrake/shared-types
- Database types (from Supabase)
- Common interfaces (User, Course, Lesson, etc.)
- API request/response types

### @therabrake/api-client
- Supabase client initialization
- Auth API (login, register, logout)
- Courses API (list, get, enroll)
- Progress API (update, fetch)
- Certificates API (list, generate, download)

### @therabrake/config
- App constants
- Environment configuration helpers
- Shared settings

## 🔧 Development Workflow

### Running Apps

**Web only:**
```powershell
npm run dev:web
```

**Mobile only:**
```powershell
npm run dev:mobile
```

**Both apps:**
```powershell
npm run dev:all
```

### Building

```powershell
# Build all
npm run build

# Build specific app
npm run build:web
npm run build:mobile
```

### Adding Dependencies

**To a specific app:**
```powershell
npm install <package> --workspace=apps/web
npm install <package> --workspace=apps/mobile
```

**To a shared package:**
```powershell
npm install <package> --workspace=packages/shared-types
```

**To root (affects all):**
```powershell
npm install <package> -w
```

## 🔄 Migration Checklist

- [ ] Backup current state with git commit
- [ ] Move web app files to apps/web/
- [ ] Replace root package.json
- [ ] Install workspace dependencies
- [ ] Initialize Expo mobile app
- [ ] Copy database types to shared-types package
- [ ] Update web app imports (optional - can keep using @/ alias)
- [ ] Test web app still builds and runs
- [ ] Test mobile app initializes
- [ ] Commit monorepo structure

## 📱 Mobile App Features (Planned)

**Phase 1 - MVP:**
- [ ] Authentication (login, register)
- [ ] Browse courses
- [ ] View course details
- [ ] Watch lessons (basic video player)
- [ ] Track progress
- [ ] View certificates

**Phase 2:**
- [ ] Offline course downloads
- [ ] Push notifications
- [ ] Advanced video player
- [ ] In-app purchases

**Phase 3:**
- [ ] Live webinars
- [ ] Community features
- [ ] Instructor tools

## 🐛 Troubleshooting

### "Cannot find module '@therabrake/shared-types'"

**Solution:**
```powershell
# Reinstall workspace dependencies
npm install --workspaces
```

### Web app won't start after moving

**Solution:**
```powershell
cd apps/web
rm -rf .next
npm run build
npm run dev
```

### Module resolution errors

**Solution:**
Ensure tsconfig.json has proper paths configuration.

## 📚 Resources

- [NPM Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Expo Documentation](https://docs.expo.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)

## 🎯 Next Steps

1. Complete monorepo migration
2. Initialize Expo mobile app
3. Setup mobile authentication screens
4. Implement course browsing in mobile
5. Create mobile video player
6. Setup shared Supabase client

---

**Questions?** Review this guide or check the workspace structure.
