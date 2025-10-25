#!/bin/bash

# 🚀 Quick Deploy Script for GDGC GGV Backend

echo "🎯 GDGC GGV Backend - GitHub Push Script"
echo "========================================="
echo ""

# Step 1: Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Step 2: Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    echo "🌿 Creating main branch..."
    git checkout -b main
else
    echo "✅ Current branch: $CURRENT_BRANCH"
fi

# Step 3: Add remote (if not exists)
REMOTE_EXISTS=$(git remote -v | grep "fixedbackend")
if [ -z "$REMOTE_EXISTS" ]; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/divyanshu-iitian/fixedbackend.git
    echo "✅ Remote added"
else
    echo "✅ Remote already exists"
fi

# Step 4: Stage all files
echo "📝 Staging files..."
git add .
echo "✅ Files staged"

# Step 5: Commit
echo "💾 Committing changes..."
git commit -m "Deploy GDGC GGV Backend - Auto-scraping leaderboard API"
echo "✅ Changes committed"

# Step 6: Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main --force
echo ""
echo "🎉 SUCCESS! Code pushed to GitHub!"
echo ""
echo "📍 Next steps:"
echo "1. Go to https://render.com/dashboard"
echo "2. Create New Web Service"
echo "3. Connect: divyanshu-iitian/fixedbackend"
echo "4. Configure build & deploy (see RENDER_DEPLOY_GUIDE.md)"
echo "5. Deploy!"
echo ""
echo "📚 Full guide: RENDER_DEPLOY_GUIDE.md"
