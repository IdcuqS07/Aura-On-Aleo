#!/bin/bash

cd aleo-programs/zkbadge

echo "🚀 Deploying zkbadge.aleo..."
echo ""

# Auto-confirm deployment
printf "y\ny\n" | ~/.cargo/bin/leo deploy --network testnet

echo ""
echo "✅ Deployment complete!"
