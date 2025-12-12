#!/bin/bash

# Update OAuth Credentials on VPS (Port 9002)

VPS="root@159.65.134.137"

echo "🔧 Updating OAuth on VPS (Port 9002)"
echo "====================================="
echo ""

ssh -t $VPS << 'ENDSSH'
cd /root/Aura-Protocol-V.1-main/backend || cd /root/aura-protocol/backend || cd /root/backend

echo "📄 Backing up .env..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

echo "✏️  Updating OAuth credentials..."

# Remove old OAuth config
sed -i '/^GITHUB_CLIENT_ID=/d' .env
sed -i '/^GITHUB_CLIENT_SECRET=/d' .env
sed -i '/^GITHUB_REDIRECT_URI=/d' .env
sed -i '/^TWITTER_CLIENT_ID=/d' .env
sed -i '/^TWITTER_CLIENT_SECRET=/d' .env
sed -i '/^TWITTER_REDIRECT_URI=/d' .env

# Add new OAuth config
cat >> .env << 'EOF'

# GitHub OAuth
GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV
GITHUB_CLIENT_SECRET=1c3fd4c78d4978e929c8a733808ab1a3b00e32a8
GITHUB_REDIRECT_URI=https://www.aurapass.xyz/poh/callback

# Twitter OAuth
TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ
TWITTER_CLIENT_SECRET=VNq-wJUUCs7Zj2dUnnFgGr_gjg9L6wCNa4xRHCdGoAee9QRWn6
TWITTER_REDIRECT_URI=https://www.aurapass.xyz/poh/callback
EOF

echo "✅ OAuth credentials updated"
echo ""

# Find and restart backend process on port 9002
echo "🔄 Restarting backend (port 9002)..."
pkill -f "uvicorn.*9002" || pkill -f "python.*server.*9002"
sleep 2

# Check if systemd service exists
if systemctl list-units --type=service | grep -q aura-backend; then
    systemctl restart aura-backend
    echo "✅ Systemd service restarted"
else
    # Manual restart
    cd /root/Aura-Protocol-V.1-main/backend || cd /root/aura-protocol/backend
    source venv/bin/activate 2>/dev/null || true
    nohup uvicorn server:app --host 0.0.0.0 --port 9002 > server.log 2>&1 &
    echo "✅ Backend restarted manually"
fi

sleep 3

# Verify
echo ""
echo "🧪 Testing OAuth endpoint..."
curl -s http://localhost:9002/api/poh/callback | head -5

echo ""
echo "✅ Done!"

ENDSSH

echo ""
echo "✅ VPS OAuth updated!"
echo ""
echo "Test: https://www.aurapass.xyz/proof-of-humanity"
