#!/bin/bash

VPS="root@159.65.134.137"

echo "📤 Upload & Update VPS OAuth"
echo "============================="
echo ""

# Create temp .env with OAuth credentials
cat > /tmp/oauth_config.txt << 'EOF'

# GitHub OAuth
GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV
GITHUB_CLIENT_SECRET=1c3fd4c78d4978e929c8a733808ab1a3b00e32a8
GITHUB_REDIRECT_URI=https://www.aurapass.xyz/poh/callback

# Twitter OAuth
TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ
TWITTER_CLIENT_SECRET=VNq-wJUUCs7Zj2dUnnFgGr_gjg9L6wCNa4xRHCdGoAee9QRWn6
TWITTER_REDIRECT_URI=https://www.aurapass.xyz/poh/callback
EOF

echo "📤 Uploading OAuth config to VPS..."
scp /tmp/oauth_config.txt $VPS:/tmp/

echo ""
echo "🔧 Updating VPS..."
ssh $VPS << 'ENDSSH'

# Find backend directory
if [ -d "/root/Aura-Protocol-V.1-main/backend" ]; then
    cd /root/Aura-Protocol-V.1-main/backend
elif [ -d "/root/aura-protocol/backend" ]; then
    cd /root/aura-protocol/backend
else
    cd /root/backend
fi

echo "📂 Working in: $(pwd)"

# Backup
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"

# Remove old OAuth
sed -i '/^GITHUB_CLIENT_ID=/d' .env
sed -i '/^GITHUB_CLIENT_SECRET=/d' .env
sed -i '/^GITHUB_REDIRECT_URI=/d' .env
sed -i '/^TWITTER_CLIENT_ID=/d' .env
sed -i '/^TWITTER_CLIENT_SECRET=/d' .env
sed -i '/^TWITTER_REDIRECT_URI=/d' .env

# Append new OAuth
cat /tmp/oauth_config.txt >> .env
echo "✅ OAuth credentials added"

# Restart
echo "🔄 Restarting backend..."
pkill -f "uvicorn.*9002"
sleep 2

source venv/bin/activate 2>/dev/null
nohup uvicorn server:app --host 0.0.0.0 --port 9002 > server.log 2>&1 &
echo "✅ Backend restarted (PID: $!)"

sleep 3

# Test
echo ""
echo "🧪 Testing..."
curl -s http://localhost:9002/api/poh/callback > /dev/null && echo "✅ Endpoint responding" || echo "⚠️  Endpoint not ready"

echo ""
echo "📊 Recent logs:"
tail -10 server.log

ENDSSH

# Cleanup
rm /tmp/oauth_config.txt

echo ""
echo "🎉 Done! Test at: https://www.aurapass.xyz/proof-of-humanity"
