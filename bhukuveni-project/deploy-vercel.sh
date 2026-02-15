#!/bin/bash

# Bhukuveni Facility Manager - Vercel Deployment Script
# For Mac/Linux

echo "🚀 Bhukuveni Facility Manager - Vercel Deployment"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI is not installed!"
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
    
    if [ $? -eq 0 ]; then
        echo "✅ Vercel CLI installed successfully!"
    else
        echo "❌ Failed to install Vercel CLI"
        echo "💡 Try running: npm install -g vercel"
        exit 1
    fi
fi

echo "✅ Vercel CLI is installed"
vercel --version
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo "✅ Dependencies are ready"
echo ""

# Test build locally
echo "🔨 Testing build locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    echo "💡 Fix the errors above before deploying"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Ask for deployment type
echo "Select deployment type:"
echo "1) Preview (test deployment)"
echo "2) Production (live deployment)"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel (Preview)..."
        echo ""
        vercel
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Vercel (Production)..."
        echo ""
        vercel --prod
        ;;
    *)
        echo "Invalid choice. Deploying as preview..."
        vercel
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your app is now live on Vercel!"
echo ""
echo "Next steps:"
echo "1. Visit the URL shown above"
echo "2. Test all features"
echo "3. Share with your team"
echo ""
