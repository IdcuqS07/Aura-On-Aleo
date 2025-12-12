#!/bin/bash

# FINAL: Upload & Update VPS OAuth
# Jalankan di terminal: bash FINAL_UPDATE_VPS.sh

VPS="root@159.65.134.137"

echo "📤 Upload & Update VPS OAuth (Port 9002)"
echo "========================================="
echo ""
echo "Masukkan password VPS saat diminta..."
echo ""

# Upload OAuth config
cat > /tmp/oauth_vps.txt << 'EOF'

# GitHub OAuth
GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV
GITHUB_CLIENT_SECRET=1c3fd4c78d4978e929c8a733808ab1a3b00e32a8
GITHUB_REDIRECT_URI=https://www.aurapass.xyz/poh/callback

# Twitter OAuth
TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ
TWITTER_CLIENT_SECRET=VNq-wJUUCs7Zj2dUnnFgGr_gjg9L6wCNa4xRHCdGoAee9QRWn6
TWITTER_REDIRECT_URI=https://www.aurapass.xyz/poh/callback
EOF

echo "📤 Uploading..."
scp /tmp/oauth_vps.txt $VPS:/tmp/oauth_vps.txt

echo ""
echo "🔧 Updating VPS..."
ssh -t $VPS bash << 'ENDSSH'
cd /root/Aura-Protocol-V.1-main/backend 2>/dev/null || cd /root/aura-protocol/backend 2>/dev/null || cd /root/backend
echo "📂 $(pwd)"
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
sed -i '/^GITHUB_CLIENT/d' .env
sed -i '/^TWITTER_CLIENT/d' .env
cat /tmp/oauth_vps.txt >> .env
echo "✅ OAuth added"
pkill -f "uvicorn.*9002"
sleep 2
source venv/bin/activate
nohup uvicorn server:app --host 0.0.0.0 --port 9002 > server.log 2>&1 &
echo "✅ Backend restarted"
sleep 3
curl -s http://localhost:9002/api/poh/callback > /dev/null && echo "✅ Endpoint OK" || echo "⚠️ Check logs"
tail -10 server.log
ENDSSH

rm /tmp/oauth_vps.txt
echo ""
echo "🎉 Done! Test: https://www.aurapass.xyz/proof-of-humanity"
