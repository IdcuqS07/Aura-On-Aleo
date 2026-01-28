#!/bin/bash

# Aleo zkbadge Deployment Script

echo "🚀 Deploying zkbadge.aleo to Aleo Testnet"
echo ""
echo "📋 Deployment Info:"
echo "  Program: zkbadge.aleo"
echo "  Network: testnet"
echo "  Address: aleo1ecrqqyvaszpehqc967g5aau4uqt2dg3y5ardm0y5wf4hxjajzsyqm5cxke"
echo ""
echo "⚠️  Prerequisites:"
echo "  1. Get testnet credits from: https://faucet.aleo.org/"
echo "  2. Wait for credits to arrive (check: https://explorer.aleo.org/)"
echo ""
echo "📝 Deployment Steps:"
echo ""
echo "Step 1: Build program"
cd aleo-programs/zkbadge
~/.cargo/bin/leo build

echo ""
echo "Step 2: Deploy to testnet"
echo "Run this command manually in terminal:"
echo ""
echo "  cd aleo-programs/zkbadge"
echo "  leo deploy --network testnet"
echo ""
echo "Step 3: After deployment, save the program ID"
echo ""
echo "✅ Deployment complete! Program will be available at:"
echo "   https://explorer.aleo.org/program/zkbadge.aleo"
