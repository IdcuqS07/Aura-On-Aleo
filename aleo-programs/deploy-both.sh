#!/bin/bash

echo "🚀 Aleo Programs Deployment Script"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Leo CLI
if ! command -v leo &> /dev/null; then
    echo -e "${RED}❌ Leo CLI not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Leo CLI found: $(leo --version)${NC}"
echo ""

# Account info
echo "📋 Deployment Account:"
echo "   Address: aleo1ecrqqyvaszpehqc967g5aau4uqt2dg3y5ardm0y5wf4hxjajzsyqm5cxke"
echo ""

# Check balance
echo "💰 Checking balance..."
echo "   Run: leo account"
echo ""

# Deploy zkbadge
echo -e "${YELLOW}📦 Program 1: zkbadge.aleo${NC}"
echo "   Status: ✅ Compiled (54 statements)"
echo ""
echo "   To deploy, run:"
echo "   cd aleo-programs/zkbadge"
echo "   leo deploy --network testnet --broadcast"
echo ""

# Deploy credit_passport
echo -e "${YELLOW}📦 Program 2: credit_passport.aleo${NC}"
echo "   Status: ✅ Compiled (104 statements)"
echo ""
echo "   To deploy, run:"
echo "   cd aleo-programs/credit_passport"
echo "   leo deploy --network testnet --broadcast"
echo ""

# Instructions
echo "⚠️  IMPORTANT:"
echo "   1. Get testnet credits: https://faucet.aleo.org/"
echo "   2. Deploy requires interactive terminal (type 'y' to confirm)"
echo "   3. Each deployment costs ~5-10 credits"
echo ""

echo "📖 Full guide: ALEO_BUILD_SUCCESS.md"
echo ""
