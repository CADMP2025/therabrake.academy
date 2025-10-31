# Fix dynamic server usage errors in API routes
$apiRoutesPath = "apps/web/app/api"
$routeFiles = Get-ChildItem -Path $apiRoutesPath -Filter "route.ts" -Recurse

Write-Host "Found $($routeFiles.Count) API route files"

foreach ($file in $routeFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if it already has export const dynamic
    if ($content -notmatch "export const dynamic") {
        Write-Host "Fixing: $($file.FullName)"
        
        # Find the first export function and add dynamic export before it
        if ($content -match "(?s)(import.*?\n\n)") {
            $newContent = $content -replace "(?s)(import.*?\n\n)", "`$1export const dynamic = 'force-dynamic'`n`n"
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "  ✓ Added dynamic export"
        } elseif ($content -match "(export async function)") {
            $newContent = $content -replace "(export async function)", "export const dynamic = 'force-dynamic'`n`n`$1"
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "  ✓ Added dynamic export"
        } else {
            Write-Host "  ✗ Could not find insertion point"
        }
    } else {
        Write-Host "Skipping (already has dynamic): $($file.FullName)"
    }
}

Write-Host "`nDone!"
