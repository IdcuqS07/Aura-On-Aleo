#!/bin/bash

echo "🚀 ZKVerifier Deployment Script"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

# Check if private key is set
if grep -q "your_private_key_here" .env || grep -q "<YOUR_PRIVATE_KEY_HERE>" .env; then
    echo "⚠️  Private key not configured!"
    echo ""
    echo "Please edit contracts/.env and add your private key:"
    echo "PRIVATE_KEY=your_64_character_private_key"
    echo ""
    echo "Get it from MetaMask:"
    echo "1. Click 3 dots → Account Details"
    echo "2. Show Private Key"
    echo "3. Copy (without 0x prefix)"
    echo ""
    exit 1
fi

echo "✅ Configuration found"
echo ""

# Check balance
echo "💰 Checking balance..."
npx hardhat run scripts/check-balance.js --network amoy

echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Deploying ZKVerifier..."
    npx hardhat run scripts/deploy-zk-verifier.js --network amoy
else
    echo "Deployment cancelled"
    exit 0
fi
