#!/bin/bash

# Auto Update VPS OAuth with Password Prompt

VPS="root@159.65.134.137"

echo "🔧 Auto Update VPS OAuth (Port 9002)"
echo "====================================="
echo ""
echo "Enter VPS password when prompted..."
echo ""

sshpass -p "$(read -sp 'VPS Password: ' pwd; echo $pwd)" ssh -o StrictHostKeyChecking=no $VPS << 'ENDSSH'

echo ""
echo "✅ Connected to VPS"
echo ""

# Find backend directory
if [ -d "/root/Aura-Protocol-V.1-main/backend" ]; then
    cd /root/Aura-Protocol-V.1-main/backend
elif [ -d "/root/aura-protocol/backend" ]; then
    cd /root/aura-protocol/backend
elif [ -d "/root/backend" ]; then
    cd /root/backend
else
    echo "❌ Backend directory not found!"
    exit 1
fi

echo "📂 Working directory: $(pwd)"
echo ""

# Backup
echo "💾 Backing up .env..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

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

echo "✅ OAuth credentials added"
echo ""

# Restart backend
echo "🔄 Restarting backend on port 9002..."
pkill -f "uvicorn.*9002" 2>/dev/null
pkill -f "python.*server.*9002" 2>/dev/null
sleep 2

# Check systemd service
if systemctl list-units --type=service 2>/dev/null | grep -q aura-backend; then
    systemctl restart aura-backend
    echo "✅ Systemd service restarted"
else
    # Manual restart
    source venv/bin/activate 2>/dev/null || true
    nohup uvicorn server:app --host 0.0.0.0 --port 9002 > server.log 2>&1 &
    echo "✅ Backend restarted (PID: $!)"
fi

sleep 3

# Verify
echo ""
echo "🧪 Testing endpoints..."
if curl -s http://localhost:9002/api/poh/callback > /dev/null 2>&1; then
    echo "✅ OAuth callback endpoint responding"
else
    echo "⚠️  Endpoint not responding yet (may need more time)"
fi

echo ""
echo "📊 Recent logs:"
tail -10 server.log 2>/dev/null || journalctl -u aura-backend -n 10 --no-pager 2>/dev/null

echo ""
echo "✅ Update complete!"

ENDSSH

echo ""
echo "🎉 VPS OAuth Updated Successfully!"
echo ""
echo "🧪 Test OAuth flow:"
echo "   https://www.aurapass.xyz/proof-of-humanity"
echo ""
