#!/bin/bash

cd "$(dirname "$0")/zkbadge"

echo "🚀 Deploying zkbadge.aleo to Aleo Testnet..."
echo ""

# Build
echo "📦 Building..."
leo build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build successful"
echo ""
echo "🌐 Deploying to testnet..."
echo ""
echo "⚠️  This requires:"
echo "   - Testnet credits in your account"
echo "   - Interactive terminal for confirmation"
echo ""
echo "Run this command manually:"
echo ""
echo "  cd aleo-programs/zkbadge"
echo "  leo deploy --network testnet --broadcast"
echo ""
