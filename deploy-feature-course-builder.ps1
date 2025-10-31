# Deploy feature/course-builder branch to Vercel
Write-Host "Deploying feature/course-builder branch to Vercel..." -ForegroundColor Cyan

# Check if we're on the correct branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "feature/course-builder") {
    Write-Host "Error: You must be on the feature/course-builder branch to deploy" -ForegroundColor Red
    Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow
    Write-Host "Run: git checkout feature/course-builder" -ForegroundColor Yellow
    exit 1
}

# Check if there are uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Warning: You have uncommitted changes" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Yellow
    $response = Read-Host "Do you want to commit and push them first? (y/n)"
    if ($response -eq "y") {
        git add -A
        $commitMsg = Read-Host "Enter commit message"
        git commit -m $commitMsg
        git push origin feature/course-builder
        Write-Host "Changes committed and pushed" -ForegroundColor Green
    }
}

# Deploy to Vercel preview
Write-Host "`nStarting Vercel deployment..." -ForegroundColor Cyan
Write-Host "This will create a preview deployment for the feature/course-builder branch`n" -ForegroundColor Yellow

# Deploy with Vercel CLI
vercel --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDeployment successful!" -ForegroundColor Green
    Write-Host "`nYour preview URL will be displayed above" -ForegroundColor Cyan
    Write-Host "This is a preview deployment - not production" -ForegroundColor Yellow
} else {
    Write-Host "`nDeployment failed" -ForegroundColor Red
    Write-Host "Check the error messages above for details" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "To deploy to production, run: vercel --prod" -ForegroundColor Cyan
