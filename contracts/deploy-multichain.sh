#!/bin/bash
# Multi-Chain Deployment Script
# Deploys Aura Protocol contracts to multiple testnets

set -e

echo "🚀 Aura Protocol Multi-Chain Deployment"
echo "========================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Networks to deploy
NETWORKS=("sepolia" "bscTestnet" "arbitrumTestnet" "optimismTestnet")

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

# Function to deploy to a network
deploy_to_network() {
    local network=$1
    echo ""
    echo -e "${BLUE}📡 Deploying to $network...${NC}"
    
    # Deploy contracts
    npx hardhat run scripts/deploy-multichain.js --network $network
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $network deployment successful${NC}"
        
        # Verify contracts
        echo -e "${BLUE}🔍 Verifying contracts on $network...${NC}"
        npx hardhat run scripts/verify-multichain.js --network $network
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ $network verification successful${NC}"
        else
            echo -e "${RED}⚠️  $network verification failed${NC}"
        fi
    else
        echo -e "${RED}❌ $network deployment failed${NC}"
        return 1
    fi
}

# Main deployment loop
echo ""
echo "Networks to deploy:"
for network in "${NETWORKS[@]}"; do
    echo "  - $network"
done
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

# Deploy to each network
for network in "${NETWORKS[@]}"; do
    deploy_to_network $network
    sleep 5  # Wait between deployments
done

echo ""
echo -e "${GREEN}🎉 Multi-chain deployment complete!${NC}"
echo ""
echo "📊 Deployment Summary:"
npx hardhat run scripts/deployment-summary.js

echo ""
echo "Next steps:"
echo "1. Update frontend with new contract addresses"
echo "2. Test contracts on each network"
echo "3. Update documentation"
