#!/bin/bash

echo "🚀 Budget Pacing Tool Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the budgetpacer-frontend directory"
    exit 1
fi

echo "✅ Current directory: $(pwd)"
echo "✅ Package.json found"
echo ""

# Check git status
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run: git init"
    exit 1
fi

echo "✅ Git repository initialized"
echo ""

# Show current git status
echo "📊 Current Git Status:"
git status --short
echo ""

echo "📝 Next Steps:"
echo "1. Create a GitHub repository at: https://github.com/new"
echo "2. Repository name: budget-pacing-tool"
echo "3. Make it Public"
echo "4. Don't initialize with README"
echo "5. Copy the repository URL"
echo ""
echo "6. Then run these commands:"
echo "   git remote add origin YOUR_REPOSITORY_URL"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "7. Deploy to Vercel:"
echo "   - Go to: https://vercel.com/new"
echo "   - Import your GitHub repository"
echo "   - Framework: Next.js"
echo "   - Root Directory: budgetpacer-frontend"
echo "   - Deploy!"
echo ""
echo "🎯 Your app will be live in under 10 minutes!"
