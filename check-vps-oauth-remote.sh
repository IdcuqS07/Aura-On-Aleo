#!/bin/bash

# Check VPS OAuth Configuration Remotely
# This will show you what's configured on production

echo "🔍 Checking Production VPS OAuth Configuration"
echo "=============================================="
echo ""

VPS="root@159.65.134.137"

echo "📡 Connecting to VPS..."
echo ""
echo "Please enter VPS password when prompted:"
echo ""

ssh -t $VPS << 'ENDSSH'
echo "✅ Connected to VPS"
echo ""
echo "📄 Checking backend .env for OAuth credentials:"
echo "-----------------------------------------------"

cd /root/Aura-Protocol-V.1-main/backend 2>/dev/null || cd /root/aura-protocol/backend 2>/dev/null || cd /root/backend 2>/dev/null

if [ -f .env ]; then
    echo "✅ .env file found"
    echo ""
    
    if grep -q "GITHUB_CLIENT_ID" .env; then
        echo "✅ GitHub OAuth configured:"
        grep "GITHUB_CLIENT_ID" .env | sed 's/=.*/=***HIDDEN***/'
        grep "GITHUB_REDIRECT_URI" .env 2>/dev/null
    else
        echo "❌ GitHub OAuth NOT configured"
    fi
    
    echo ""
    
    if grep -q "TWITTER_CLIENT_ID" .env; then
        echo "✅ Twitter OAuth configured:"
        grep "TWITTER_CLIENT_ID" .env | sed 's/=.*/=***HIDDEN***/'
        grep "TWITTER_REDIRECT_URI" .env 2>/dev/null
    else
        echo "❌ Twitter OAuth NOT configured"
    fi
else
    echo "❌ .env file not found!"
fi

echo ""
echo "🔧 Backend Service Status:"
echo "-------------------------"
systemctl status aura-backend --no-pager -l 2>/dev/null | head -10 || echo "Service not found, checking process..."
ps aux | grep -E "python.*server|uvicorn" | grep -v grep | head -3

echo ""
echo "📊 Recent Logs (OAuth related):"
echo "-------------------------------"
journalctl -u aura-backend -n 50 --no-pager 2>/dev/null | grep -i "oauth\|github\|twitter\|poh" | tail -10 || tail -20 /root/backend.log 2>/dev/null | grep -i "oauth\|github\|twitter\|poh"

ENDSSH

echo ""
echo "✅ Check complete!"
echo ""
