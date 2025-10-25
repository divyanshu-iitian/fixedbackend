# 🚀 Quick Deploy Script for GDGC GGV Backend (PowerShell)

Write-Host "🎯 GDGC GGV Backend - GitHub Push Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if git is initialized
if (-Not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

# Step 2: Check current branch
$currentBranch = git branch --show-current
if (-Not $currentBranch) {
    Write-Host "🌿 Creating main branch..." -ForegroundColor Yellow
    git checkout -b main
} else {
    Write-Host "✅ Current branch: $currentBranch" -ForegroundColor Green
}

# Step 3: Add remote (if not exists)
$remoteExists = git remote -v | Select-String "fixedbackend"
if (-Not $remoteExists) {
    Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/divyanshu-iitian/fixedbackend.git
    Write-Host "✅ Remote added" -ForegroundColor Green
} else {
    Write-Host "✅ Remote already exists" -ForegroundColor Green
}

# Step 4: Stage all files
Write-Host "📝 Staging files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged" -ForegroundColor Green

# Step 5: Commit
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Deploy GDGC GGV Backend - Auto-scraping leaderboard API"
Write-Host "✅ Changes committed" -ForegroundColor Green

# Step 6: Push to GitHub
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main --force
Write-Host ""
Write-Host "🎉 SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com/dashboard"
Write-Host "2. Create New Web Service"
Write-Host "3. Connect: divyanshu-iitian/fixedbackend"
Write-Host "4. Configure build & deploy (see RENDER_DEPLOY_GUIDE.md)"
Write-Host "5. Deploy!"
Write-Host ""
Write-Host "📚 Full guide: RENDER_DEPLOY_GUIDE.md" -ForegroundColor Cyan
