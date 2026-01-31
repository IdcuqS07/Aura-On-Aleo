#!/bin/bash

cd "$(dirname "$0")/badge_minimal"

echo "🚀 Deploying badge_minimal.aleo"
echo "================================"
echo ""

# Deploy
(echo "y" | leo deploy --network testnet --broadcast) 2>&1

echo ""
echo "✅ Deployment command executed"
