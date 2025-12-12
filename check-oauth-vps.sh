#!/bin/bash

# Check OAuth Configuration on VPS

VPS_IP="159.65.134.137"
VPS_USER="root"
BACKEND_PATH="/root/Aura-Protocol-V.1-main/backend"

echo "🔍 Checking OAuth Configuration on VPS"
echo "======================================="
echo ""

ssh ${VPS_USER}@${VPS_IP} bash << 'EOF'
cd /root/Aura-Protocol-V.1-main/backend

echo "📄 Current .env OAuth Configuration:"
echo "-----------------------------------"
if [ -f .env ]; then
    if grep -q "GITHUB_CLIENT_ID" .env; then
        echo "✅ GitHub OAuth configured:"
        grep "GITHUB_CLIENT_ID" .env | sed 's/=.*/=***/'
        grep "GITHUB_REDIRECT_URI" .env
    else
        echo "❌ GitHub OAuth NOT configured"
    fi
    
    echo ""
    
    if grep -q "TWITTER_CLIENT_ID" .env; then
        echo "✅ Twitter OAuth configured:"
        grep "TWITTER_CLIENT_ID" .env | sed 's/=.*/=***/'
        grep "TWITTER_REDIRECT_URI" .env
    else
        echo "❌ Twitter OAuth NOT configured"
    fi
else
    echo "❌ .env file not found!"
fi

echo ""
echo "🔧 Backend Service Status:"
echo "-------------------------"
systemctl status aura-backend --no-pager -l | head -15

echo ""
echo "📊 Recent Backend Logs:"
echo "----------------------"
journalctl -u aura-backend -n 10 --no-pager

echo ""
echo "🧪 Test OAuth Callback Endpoint:"
echo "--------------------------------"
curl -s http://localhost:9000/api/poh/callback 2>&1 | head -5

EOF

echo ""
echo "✅ Check complete!"
echo ""
echo "To fix OAuth configuration, run:"
echo "  ./fix-oauth-vps.sh"
echo ""
