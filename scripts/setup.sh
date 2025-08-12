#!/bin/bash

echo "🚀 Budget Pacing Tool - Quick Setup Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your Google Sheets API credentials"
else
    echo "✅ .env.local already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. 📝 Update .env.local with your Google Sheets API credentials:"
echo "   - GOOGLE_SHEETS_API_KEY=your_api_key"
echo "   - GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id"
echo ""
echo "2. 🌐 Deploy to Vercel: npm install -g vercel && vercel"
echo ""
echo "3. 🗄️  Set up Supabase database (see DEPLOYMENT.md)"
echo ""
echo "4. 🔐 Configure environment variables in Vercel dashboard"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🚀 To start development server: npm run dev"
