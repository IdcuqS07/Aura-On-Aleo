#!/bin/bash
set -e

echo "🔧 Aura PoH Fix Deployment Script"
echo "=================================="

VPS_IP="159.65.134.137"
VPS_USER="root"

# Step 1: Update backend .env di VPS
echo ""
echo "📝 Step 1: Updating backend .env on VPS..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
cd /opt/aura/backend

# Backup current .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Add OAuth credentials if not exists
grep -q "GITHUB_CLIENT_ID" .env || echo "GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV" >> .env
grep -q "GITHUB_CLIENT_SECRET" .env || echo "GITHUB_CLIENT_SECRET=1c3fd4c78d4978e929c8a733808ab1a3b00e32a8" >> .env
grep -q "TWITTER_CLIENT_ID" .env || echo "TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ" >> .env
grep -q "TWITTER_CLIENT_SECRET" .env || echo "TWITTER_CLIENT_SECRET=VNq-wJUUCs7Zj2dUnnFgGr_gjg9L6wCNa4xRHCdGoAee9QRWn6" >> .env

echo "✅ Backend .env updated"
cat .env | grep -E "GITHUB|TWITTER"
EOF

# Step 2: Restart backend
echo ""
echo "🔄 Step 2: Restarting backend..."
ssh ${VPS_USER}@${VPS_IP} "systemctl restart aura-backend && sleep 3 && systemctl status aura-backend --no-pager | head -20"

# Step 3: Build frontend for production
echo ""
echo "🏗️  Step 3: Building frontend for production..."
cd frontend

# Update .env for production
cat > .env.production << 'ENVEOF'
REACT_APP_BACKEND_URL=https://api.aurapass.xyz
REACT_APP_SUBGRAPH_URL=https://api.studio.thegraph.com/query/1716185/aura-protocol/v0.1.0
REACT_APP_GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV
REACT_APP_TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ
ENVEOF

# Build
yarn build

echo "✅ Frontend built successfully"

# Step 4: Backup current production build
echo ""
echo "💾 Step 4: Backing up current production build..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
cd /opt/aura/frontend
tar -czf ~/frontend-build-backup-$(date +%Y%m%d_%H%M%S).tar.gz build/
echo "✅ Backup created"
EOF

# Step 5: Deploy new build
echo ""
echo "🚀 Step 5: Deploying new build to VPS..."
rsync -avz --delete build/ ${VPS_USER}@${VPS_IP}:/opt/aura/frontend/build/

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Test PoH at: https://www.aurapass.xyz/verify"
echo "🔗 Backend health: https://api.aurapass.xyz/api/poh/"
echo ""
echo "📊 Next steps:"
echo "1. Clear browser cache (Cmd+Shift+R)"
echo "2. Test GitHub OAuth"
echo "3. Test Twitter OAuth"
echo "4. Test badge minting"
