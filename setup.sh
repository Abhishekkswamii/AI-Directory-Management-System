#!/bin/bash

echo "🌟 LUMINA Installation Script"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.11+ first."
    exit 1
fi

echo "✅ Python $(python3 --version) found"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo ""
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo ""
echo "📦 Installing server dependencies..."
cd server
python3 -m pip install -r requirements.txt
cd ..

# Create .env files if they don't exist
echo ""
echo "⚙️ Setting up configuration..."

if [ ! -f "server/.env" ]; then
    echo "Creating server/.env from example..."
    cp server/.env.example server/.env
    echo "⚠️ Don't forget to add your OPENAI_API_KEY to server/.env"
fi

if [ ! -f "client/.env" ]; then
    echo "Creating client/.env from example..."
    cp client/.env.example client/.env
fi

echo ""
echo "✨ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your OPENAI_API_KEY"
echo "2. Run 'npm run dev' to start both servers"
echo "3. Visit http://localhost:3000"
echo ""
echo "Enjoy LUMINA! 🚀"
