#!/bin/bash

set -e

echo "🚀 Smart Deployment: badge_minimal.aleo"
echo "========================================"

cd "$(dirname "$0")/badge_minimal"

# Build
echo "📦 Building..."
leo build || { echo "❌ Build failed"; exit 1; }
echo "✅ Build success"

# Get address
ADDR=$(grep "PRIVATE_KEY" .env | cut -d'=' -f2 | xargs leo account import | grep "Address" | awk '{print $2}')
echo "📍 Address: $ADDR"

# Deploy with fee estimation
echo ""
echo "🌐 Deploying to testnet..."
echo "⏳ This may take 2-3 minutes..."

leo deploy --network testnet --broadcast --priority-fee 0 2>&1 | tee deploy.log

# Check result
if grep -q "✅" deploy.log || grep -q "successfully" deploy.log; then
    echo ""
    echo "✅ DEPLOYMENT SUCCESS!"
    echo "Program: badge_minimal.aleo"
    echo "Network: Aleo Testnet"
    rm -f deploy.log
    exit 0
else
    echo ""
    echo "⚠️  Deployment may have failed. Check deploy.log"
    exit 1
fi
