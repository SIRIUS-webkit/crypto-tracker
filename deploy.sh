#!/bin/bash

# 🚀 Crypto Trading Tracker - Vercel Deployment Script

echo "🚀 Crypto Trading Tracker - Vercel Deployment"
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI"
        echo "Please install manually: npm install -g vercel"
        exit 1
    fi
    echo "✅ Vercel CLI installed successfully"
else
    echo "✅ Vercel CLI found"
fi

# Check if user is logged in to Vercel
echo ""
echo "🔐 Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Vercel"
    echo "Please login first:"
    vercel login
    if [ $? -ne 0 ]; then
        echo "❌ Failed to login to Vercel"
        exit 1
    fi
else
    echo "✅ Already logged in to Vercel: $(vercel whoami)"
fi

# Check if MongoDB Atlas connection string is set
echo ""
echo "🗄️ Checking MongoDB configuration..."
if [ -f ".env" ]; then
    if grep -q "MONGODB_URI=mongodb+srv://" .env; then
        echo "✅ MongoDB Atlas connection string found in .env"
    elif grep -q "MONGODB_URI=mongodb://localhost" .env; then
        echo "⚠️  Local MongoDB detected in .env"
        echo ""
        echo "🔄 For Vercel deployment, you need MongoDB Atlas (cloud database)"
        echo ""
        echo "Steps to set up MongoDB Atlas:"
        echo "1. Go to: https://www.mongodb.com/atlas"
        echo "2. Create a free cluster"
        echo "3. Get your connection string"
        echo "4. Update MONGODB_URI in .env file"
        echo ""
        read -p "Have you set up MongoDB Atlas? (y/n): " atlas_ready
        if [[ $atlas_ready != "y" && $atlas_ready != "Y" ]]; then
            echo "❌ Please set up MongoDB Atlas first, then run this script again"
            echo "📖 See DEPLOYMENT.md for detailed instructions"
            exit 1
        fi
    else
        echo "❌ MONGODB_URI not found in .env file"
        echo "Please create .env file with your MongoDB Atlas connection string"
        exit 1
    fi
else
    echo "❌ .env file not found"
    echo "Please create .env file with MONGODB_URI"
    exit 1
fi

# Run deployment
echo ""
echo "🚀 Starting deployment to Vercel..."
echo ""

# Deploy to Vercel
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Set environment variables in Vercel dashboard:"
    echo "   - Go to your project settings"
    echo "   - Add MONGODB_URI environment variable"
    echo "   - Value: your MongoDB Atlas connection string"
    echo ""
    echo "2. Test your deployment:"
    echo "   - Visit your Vercel URL"
    echo "   - Test /api/health endpoint"
    echo "   - Try adding a transaction"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
    echo ""
    echo "🔗 Useful links:"
    echo "   - Vercel Dashboard: https://vercel.com/dashboard"
    echo "   - MongoDB Atlas: https://cloud.mongodb.com/"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Please check the error message above and try again"
    echo "📖 See DEPLOYMENT.md for troubleshooting"
fi
