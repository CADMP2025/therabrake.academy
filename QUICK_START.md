# 🚀 Quick Start - Monorepo Migration

## ONE COMMAND TO MIGRATE:
```powershell
.\migrate-to-monorepo.ps1
```

## What It Does:
1. ✅ Backs up current code
2. ✅ Moves files to apps/web/
3. ✅ Sets up workspace config
4. ✅ Installs dependencies
5. ✅ Tests web app
6. ✅ Commits changes

## After Migration:

### Start Web App
```powershell
npm run dev:web
```

### Initialize Mobile App
```powershell
cd apps/mobile
npx create-expo-app@latest . --template tabs
npm install
```

### Start Mobile App
```powershell
npm run dev:mobile
```

## Package Structure:
- `@therabrake/shared-types` - Types & interfaces
- `@therabrake/api-client` - API wrapper
- `@therabrake/config` - Constants

## Full Documentation:
- Read `MONOREPO_SETUP.md` for details
- Read `MONOREPO_SUMMARY.md` for overview

## Questions?
All setup is complete - just run the migration script!
