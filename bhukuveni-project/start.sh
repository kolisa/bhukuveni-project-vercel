#!/bin/bash

# Bhukuveni Facility Manager - Quick Start Script
# For Mac/Linux

echo "🏥 Bhukuveni Facility Manager - Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo "⏳ This may take a few minutes..."
    echo ""
    npm install
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Dependencies installed successfully!"
    else
        echo ""
        echo "❌ Failed to install dependencies"
        echo "💡 Try running: npm install --legacy-peer-deps"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting development server..."
echo "📱 The app will open at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
