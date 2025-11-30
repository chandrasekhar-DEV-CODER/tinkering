#!/bin/bash

# My School Ride - Firebase + MongoDB Installation Script
# This script installs the required dependencies for Firebase and MongoDB integration

echo "🚀 My School Ride - Firebase + MongoDB Installation"
echo "=================================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install Node.js and npm first"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Navigate to project directory
cd /workspace/app-7wscx5suxq0x || exit 1

echo "📦 Installing Firebase SDK..."
npm install firebase --save

if [ $? -eq 0 ]; then
    echo "✅ Firebase SDK installed successfully"
else
    echo "❌ Failed to install Firebase SDK"
    exit 1
fi

echo ""
echo "📦 Installing MongoDB driver..."
npm install mongodb --save

if [ $? -eq 0 ]; then
    echo "✅ MongoDB driver installed successfully"
else
    echo "❌ Failed to install MongoDB driver"
    exit 1
fi

echo ""
echo "=================================================="
echo "✅ Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Follow the instructions in FIREBASE_MONGODB_INTEGRATION.md"
echo "2. Set up Firebase Authentication in Firebase Console"
echo "3. Create MongoDB database and collections in MongoDB Atlas"
echo "4. Create initial admin account"
echo "5. Test the application"
echo ""
echo "For detailed instructions, see:"
echo "  - FIREBASE_MONGODB_INTEGRATION.md"
echo "  - INSTALLATION_STEPS.md"
echo ""
echo "Happy coding! 🎉"
