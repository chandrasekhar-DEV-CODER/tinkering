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
echo "🗺️  Installing Mapbox GL JS..."
npm install mapbox-gl react-map-gl --save
npm install --save-dev @types/mapbox-gl

if [ $? -eq 0 ]; then
    echo "✅ Mapbox packages installed successfully"
else
    echo "❌ Failed to install Mapbox packages"
    exit 1
fi

echo ""
echo "📦 Installing additional map utilities..."
npm install @turf/turf --save

if [ $? -eq 0 ]; then
    echo "✅ Map utilities installed successfully"
else
    echo "⚠️  Warning: Failed to install map utilities (optional)"
fi

echo ""
echo "=================================================="
echo "✅ Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Follow the instructions in FIREBASE_MONGODB_INTEGRATION.md"
echo "2. Set up Firebase Authentication in Firebase Console"
echo "3. Create MongoDB database and collections in MongoDB Atlas"
echo "4. Configure Mapbox settings (see MAPBOX_INTEGRATION.md)"
echo "5. Create initial admin account"
echo "6. Test the application"
echo ""
echo "For detailed instructions, see:"
echo "  - FIREBASE_MONGODB_INTEGRATION.md (Firebase & MongoDB setup)"
echo "  - MAPBOX_INTEGRATION.md (Map integration)"
echo "  - INSTALLATION_STEPS.md (Complete guide)"
echo ""
echo "Happy coding! 🎉"
