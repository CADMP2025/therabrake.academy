# Deploy Feature Branch to Vercel
# This PowerShell script deploys the feature/course-builder branch to a Vercel preview environment

Write-Host "TheraBrake Academy - Feature Branch Deployment" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Branch: feature/course-builder" -ForegroundColor Yellow
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Error: Vercel CLI not found" -ForegroundColor Red
    Write-Host "Install it with: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "Installing dependencies..." -ForegroundColor Green
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm ci failed" -ForegroundColor Red
    exit 1
}

Write-Host "Running type checks..." -ForegroundColor Green
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "Type check failed" -ForegroundColor Red
    exit 1
}

Write-Host "Building..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deploying to Vercel preview environment..." -ForegroundColor Green
Write-Host "This will create a unique URL for the feature/course-builder branch" -ForegroundColor Cyan
Write-Host ""

# Deploy to Vercel preview (not production)
vercel --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your preview URL is displayed above" -ForegroundColor Cyan
    Write-Host "This deployment is tied to the feature/course-builder branch" -ForegroundColor Yellow
    Write-Host "To promote to production, merge to main and run deploy-production.ps1" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Deployment failed" -ForegroundColor Red
    exit 1
}
