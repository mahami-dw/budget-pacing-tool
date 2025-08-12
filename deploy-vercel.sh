#!/bin/bash

echo "🚀 Deploying Budget Pacing Tool to Vercel"
echo "=========================================="

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

echo "🌐 Your GitHub Repository:"
echo "   https://github.com/mahami-dw/budget-pacing-tool"
echo ""

echo "🚀 Deploy to Vercel:"
echo "1. Go to: https://vercel.com/new"
echo "2. Click 'Import Git Repository'"
echo "3. Find and select: mahami-dw/budget-pacing-tool"
echo "4. Click 'Import'"
echo "5. Configure:"
echo "   - Framework: Next.js (auto-detected)"
echo "   - Root Directory: budgetpacer-frontend"
echo "   - Project Name: budget-pacing-tool"
echo "6. Click 'Deploy'"
echo ""
echo "⏱️  Deployment will take 2-5 minutes"
echo "🎯 Your app will be live at: https://budget-pacing-tool-xxxxx.vercel.app"
echo ""
echo "📝 After deployment, set environment variables:"
echo "   - GOOGLE_SHEETS_API_KEY"
echo "   - GOOGLE_SHEETS_SPREADSHEET_ID"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "🎉 Ready to deploy! Open https://vercel.com/new in your browser"
