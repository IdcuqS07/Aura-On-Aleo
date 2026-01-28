#!/bin/bash

echo "🚀 Deploying ZK Badge to Aleo Testnet..."

cd aleo-programs/zkbadge

# Check if Leo is installed
if ! command -v leo &> /dev/null; then
    echo "❌ Leo not installed. Please run: ./aleo-programs/install-aleo.sh"
    exit 1
fi

# Build program
echo "📦 Building program..."
leo build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Deploy to testnet
echo "🌐 Deploying to Aleo testnet..."
leo deploy --network testnet3

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "📝 Program deployed: zkbadge.aleo"
else
    echo "❌ Deployment failed"
    exit 1
fi
