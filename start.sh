#!/bin/bash

# 🚀 Crypto Trading Tracker Quick Start Script

echo "📊 Crypto Trading Tracker Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/crypto-tracker
PORT=3000
NODE_ENV=development
EOL
    echo "✅ .env file created with default MongoDB settings"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔧 Setup Options:"
echo "1. Use MongoDB Atlas (Cloud - Recommended for beginners)"
echo "2. Install MongoDB locally"
echo "3. Continue with current setup"
echo ""

read -p "Choose an option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🌐 MongoDB Atlas Setup:"
        echo "1. Go to: https://www.mongodb.com/atlas"
        echo "2. Create a free account and cluster"
        echo "3. Get your connection string"
        echo "4. Update MONGODB_URI in .env file"
        echo ""
        echo "Example connection string:"
        echo "mongodb+srv://username:password@cluster.mongodb.net/crypto-tracker"
        echo ""
        read -p "Press Enter when you've updated the .env file..."
        ;;
    2)
        echo ""
        echo "💻 Local MongoDB Installation:"
        
        # Detect operating system
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "🍎 macOS detected. Install MongoDB with:"
            echo "brew tap mongodb/brew"
            echo "brew install mongodb-community"
            echo "brew services start mongodb/brew/mongodb-community"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            echo "🐧 Linux detected. Install MongoDB with:"
            echo "sudo apt-get update"
            echo "sudo apt-get install -y mongodb-org"
            echo "sudo systemctl start mongod"
        else
            echo "Please install MongoDB manually: https://docs.mongodb.com/manual/installation/"
        fi
        
        echo ""
        read -p "Press Enter when MongoDB is installed and running..."
        ;;
    3)
        echo "▶️ Continuing with current setup..."
        ;;
    *)
        echo "❌ Invalid option. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🚀 Starting the Crypto Trading Tracker..."
echo "📍 The application will be available at: http://localhost:3000"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""

# Start the server
npm start
