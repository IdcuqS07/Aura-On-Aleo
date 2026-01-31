#!/bin/bash

echo "🚀 Aleo Local Devnet Deployment"
echo "================================"

cd badge_minimal

# Deploy to local devnet instead of testnet
echo "📦 Building..."
leo build

echo ""
echo "🌐 Deploying to LOCAL devnet..."
leo deploy --network devnet --broadcast

echo ""
echo "✅ Local deployment complete"
echo "Program: badge_minimal.aleo"
echo "Network: devnet (local)"
