#!/bin/bash

VPS="root@159.65.134.137"

echo "🔨 Rebuild Frontend with OAuth Credentials"
echo "==========================================="
echo ""

ssh -t $VPS << 'ENDSSH'

echo "📂 Preparing frontend..."
cd /root/Aura-Protocol-V.1-main/frontend

echo "📝 Updating .env.production..."
cat > .env.production << 'EOF'
REACT_APP_BACKEND_URL=https://api.aurapass.xyz
REACT_APP_GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV
REACT_APP_TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ
REACT_APP_SUBGRAPH_URL=https://api.studio.thegraph.com/query/1716185/aura-protocol/v0.1.0
EOF

echo "✅ .env.production updated"
cat .env.production

echo ""
echo "📦 Installing dependencies (this may take a few minutes)..."
npm install

echo ""
echo "🔨 Building production bundle..."
NODE_ENV=production npm run build

if [ -d "build" ]; then
    echo "✅ Build successful"
    
    echo ""
    echo "📤 Deploying to /var/www/aurapass.xyz..."
    
    # Backup current
    cp -r /var/www/aurapass.xyz /var/www/aurapass.xyz.backup.$(date +%Y%m%d_%H%M%S)
    
    # Deploy new build
    cp -r build/* /var/www/aurapass.xyz/
    
    echo "✅ Deployed successfully"
    
    # Verify
    if grep -q "Ov23liBkJpXGppFuyWWV" /var/www/aurapass.xyz/static/js/*.js; then
        echo "✅ OAuth credentials verified in production"
    else
        echo "⚠️  Credentials not found, checking..."
    fi
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 Done! Test at: https://www.aurapass.xyz/poh"

ENDSSH

echo ""
echo "✅ Frontend rebuilt and deployed!"
