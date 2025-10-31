# TheraBrake Academy - Monorepo Migration Script
# Run this script to migrate from single-app to monorepo structure

Write-Host "TheraBrake Academy - Monorepo Migration" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Run this from the repository root." -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Verified repository root" -ForegroundColor Green

# Step 2: Check if already migrated
if (Test-Path "apps\web\package.json") {
    Write-Host "Warning: apps\web already contains files. Migration may have already been done." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
}

# Step 3: Create backup
Write-Host ""
Write-Host "Step 2: Creating backup..." -ForegroundColor Cyan
git add -A
$timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
$commitMsg = "chore: backup before monorepo migration - $timestamp"
git commit -m $commitMsg -ErrorAction SilentlyContinue
Write-Host "Backup created" -ForegroundColor Green

# Step 4: Move files to apps/web
Write-Host ""
Write-Host "Step 3: Moving files to apps/web..." -ForegroundColor Cyan

# Ensure apps/web exists
if (!(Test-Path "apps\web")) {
    Write-Host "Error: apps\web directory not found. Please run the setup first." -ForegroundColor Red
    exit 1
}

# List of items to exclude from moving
$exclude = @('apps', 'packages', 'node_modules', '.git', '.next', '.vercel', 'package.json.new', '.gitignore.new', 'MONOREPO_SETUP.md', 'MONOREPO_SUMMARY.md', 'QUICK_START.md', 'README.new.md', 'migrate-to-monorepo.ps1')

Write-Host "Moving files to apps/web (this may take a moment)..." -ForegroundColor Yellow

try {
    # Move directories and files
    Get-ChildItem -Path . -Exclude $exclude | ForEach-Object {
        if ($_.Name -notlike ".*" -or $_.Name -eq ".eslintrc.json") {
            Write-Host "  Moving: $($_.Name)" -ForegroundColor Gray
            Move-Item -Path $_.FullName -Destination ".\apps\web\" -Force -ErrorAction Stop
        }
    }

    # Move .env files if they exist
    if (Test-Path ".env.local") {
        Write-Host "  Moving: .env.local" -ForegroundColor Gray
        Move-Item ".env.local" ".\apps\web\" -Force
    }
    if (Test-Path ".env.local.example") {
        Write-Host "  Moving: .env.local.example" -ForegroundColor Gray
        Move-Item ".env.local.example" ".\apps\web\" -Force
    }

    Write-Host "Files moved successfully" -ForegroundColor Green
} catch {
    Write-Host "Error moving files: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Replace package.json
Write-Host ""
Write-Host "Step 4: Updating package.json..." -ForegroundColor Cyan
if (Test-Path "package.json.new") {
    Remove-Item "package.json" -Force
    Rename-Item "package.json.new" "package.json"
    Write-Host "package.json updated" -ForegroundColor Green
} else {
    Write-Host "Error: package.json.new not found" -ForegroundColor Red
    exit 1
}

# Step 6: Replace .gitignore
Write-Host ""
Write-Host "Step 5: Updating .gitignore..." -ForegroundColor Cyan
if (Test-Path ".gitignore.new") {
    Remove-Item ".gitignore" -Force
    Rename-Item ".gitignore.new" ".gitignore"
    Write-Host ".gitignore updated" -ForegroundColor Green
} else {
    Write-Host "Warning: .gitignore.new not found, skipping" -ForegroundColor Yellow
}

# Step 7: Update README
Write-Host ""
Write-Host "Step 6: Updating README..." -ForegroundColor Cyan
if (Test-Path "README.new.md") {
    if (Test-Path "README.md") {
        Move-Item "README.md" "apps\web\README.md" -Force
    }
    Rename-Item "README.new.md" "README.md"
    Write-Host "README updated" -ForegroundColor Green
}

# Step 8: Install dependencies
Write-Host ""
Write-Host "Step 7: Installing workspace dependencies..." -ForegroundColor Cyan
Write-Host "This will take a few minutes..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "Error installing dependencies" -ForegroundColor Red
    exit 1
}

# Step 9: Copy database types
Write-Host ""
Write-Host "Step 8: Copying database types..." -ForegroundColor Cyan
if (Test-Path "apps\web\lib\database.types.ts") {
    Copy-Item "apps\web\lib\database.types.ts" "packages\shared-types\src\database.types.ts" -Force
    Write-Host "Database types copied" -ForegroundColor Green
} else {
    Write-Host "Warning: database.types.ts not found, you'll need to copy it manually" -ForegroundColor Yellow
}

# Step 10: Test web app (skip build for now, just verify structure)
Write-Host ""
Write-Host "Step 9: Verifying web app structure..." -ForegroundColor Cyan
if (Test-Path "apps\web\package.json") {
    Write-Host "Web app structure verified" -ForegroundColor Green
} else {
    Write-Host "Warning: Web app package.json not found" -ForegroundColor Yellow
}

# Step 11: Commit changes
Write-Host ""
Write-Host "Step 10: Committing changes..." -ForegroundColor Cyan
git add -A
$multiLineCommit = @"
feat: migrate to monorepo structure with npm workspaces

- Created apps/web/ for Next.js web application
- Created apps/mobile/ directory for future Expo app
- Created packages/shared-types for shared TypeScript types
- Created packages/api-client for shared API client code
- Created packages/config for shared configuration
- Setup npm workspaces in root package.json
- Updated .gitignore for monorepo structure
"@
git commit -m $multiLineCommit
Write-Host "Changes committed" -ForegroundColor Green

# Final message
Write-Host ""
Write-Host "Migration Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review MONOREPO_SETUP.md for detailed documentation" -ForegroundColor White
Write-Host "2. Test web app: npm run dev:web" -ForegroundColor White
Write-Host "3. Initialize mobile app: cd apps\mobile && npx create-expo-app ." -ForegroundColor White
Write-Host "4. Push changes: git push origin feature/course-builder" -ForegroundColor White
Write-Host ""
Write-Host "Read MONOREPO_SETUP.md for complete instructions" -ForegroundColor Yellow
Write-Host ""
