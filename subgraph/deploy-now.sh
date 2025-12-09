#!/bin/bash
# Quick deploy script - paste your deploy key when prompted

echo "🔐 Authenticating with The Graph Studio..."
echo ""
echo "Paste your deploy key from Studio:"
read -s DEPLOY_KEY

graph auth --studio $DEPLOY_KEY

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Authentication successful!"
    echo ""
    echo "🚀 Deploying subgraph..."
    graph deploy --studio aura-protocol
else
    echo "❌ Authentication failed. Check your deploy key."
    exit 1
fi
