#!/bin/bash

# Aura Protocol Subgraph Deployment Script
# Deploy to The Graph Studio

set -e

echo "🚀 Deploying Aura Protocol Subgraph"
echo "===================================="

# Check if graph CLI is installed
if ! command -v graph &> /dev/null; then
    echo "❌ Graph CLI not found. Installing..."
    npm install -g @graphprotocol/graph-cli
fi

# Check if subgraph name is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy-subgraph.sh <subgraph-name>"
    echo "Example: ./deploy-subgraph.sh aura-protocol"
    exit 1
fi

SUBGRAPH_NAME=$1

echo ""
echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔨 Step 2: Generating types..."
graph codegen

echo ""
echo "🏗️  Step 3: Building subgraph..."
graph build

echo ""
echo "📤 Step 4: Deploying to The Graph Studio..."
echo "Subgraph: $SUBGRAPH_NAME"

# Deploy to Studio
graph deploy --studio $SUBGRAPH_NAME

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 View your subgraph at:"
echo "https://thegraph.com/studio/subgraph/$SUBGRAPH_NAME"
echo ""
echo "🔗 GraphQL endpoint will be available after syncing"
