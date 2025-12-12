#!/bin/bash

# Fix OAuth Configuration on VPS
# This script updates .env file on VPS with OAuth credentials

VPS_IP="159.65.134.137"
VPS_USER="root"
BACKEND_PATH="/root/Aura-Protocol-V.1-main/backend"

echo "🔧 Fix OAuth Configuration on VPS"
echo "=================================="
echo ""

# Check if we can connect to VPS
echo "📡 Testing VPS connection..."
if ! ssh -o ConnectTimeout=5 ${VPS_USER}@${VPS_IP} "echo 'Connected'" &>/dev/null; then
    echo "❌ Cannot connect to VPS at ${VPS_IP}"
    echo "Please check your SSH connection"
    exit 1
fi
echo "✅ VPS connection OK"
echo ""

# Prompt for OAuth credentials
echo "📝 Enter OAuth Credentials:"
echo ""
read -p "GitHub Client ID: " GITHUB_CLIENT_ID
read -p "GitHub Client Secret: " GITHUB_CLIENT_SECRET
echo ""
read -p "Twitter Client ID: " TWITTER_CLIENT_ID
read -p "Twitter Client Secret: " TWITTER_CLIENT_SECRET
echo ""

# Confirm
echo "Will update VPS with:"
echo "  GitHub Client ID: ${GITHUB_CLIENT_ID:0:10}..."
echo "  Twitter Client ID: ${TWITTER_CLIENT_ID:0:10}..."
echo ""
read -p "Continue? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ Cancelled"
    exit 0
fi

echo ""
echo "🚀 Updating VPS configuration..."

# Create update script
ssh ${VPS_USER}@${VPS_IP} bash << EOF
cd ${BACKEND_PATH}

# Backup current .env
if [ -f .env ]; then
    cp .env .env.backup.\$(date +%Y%m%d_%H%M%S)
    echo "✅ Backed up existing .env"
fi

# Check if OAuth vars already exist
if grep -q "GITHUB_CLIENT_ID" .env 2>/dev/null; then
    # Update existing
    sed -i "s|GITHUB_CLIENT_ID=.*|GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}|g" .env
    sed -i "s|GITHUB_CLIENT_SECRET=.*|GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}|g" .env
    sed -i "s|TWITTER_CLIENT_ID=.*|TWITTER_CLIENT_ID=${TWITTER_CLIENT_ID}|g" .env
    sed -i "s|TWITTER_CLIENT_SECRET=.*|TWITTER_CLIENT_SECRET=${TWITTER_CLIENT_SECRET}|g" .env
    echo "✅ Updated existing OAuth credentials"
else
    # Append new
    cat >> .env << 'ENVEOF'

# OAuth Configuration
GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
GITHUB_REDIRECT_URI=https://www.aurapass.xyz/poh/callback

TWITTER_CLIENT_ID=${TWITTER_CLIENT_ID}
TWITTER_CLIENT_SECRET=${TWITTER_CLIENT_SECRET}
TWITTER_REDIRECT_URI=https://www.aurapass.xyz/poh/callback
ENVEOF
    echo "✅ Added OAuth credentials to .env"
fi

# Show current .env (without secrets)
echo ""
echo "📄 Current .env configuration:"
grep -E "GITHUB_CLIENT_ID|TWITTER_CLIENT_ID|REDIRECT_URI" .env | sed 's/=.*/=***/'

# Restart backend
echo ""
echo "🔄 Restarting backend..."
systemctl restart aura-backend
sleep 3

# Check status
if systemctl is-active --quiet aura-backend; then
    echo "✅ Backend restarted successfully"
else
    echo "⚠️  Backend restart failed, checking logs..."
    journalctl -u aura-backend -n 20 --no-pager
fi

EOF

echo ""
echo "✅ OAuth configuration updated on VPS!"
echo ""
echo "🧪 Test OAuth endpoints:"
echo "  curl https://api.aurapass.xyz/api/poh/callback"
echo ""
echo "📊 Check backend logs:"
echo "  ssh ${VPS_USER}@${VPS_IP} 'journalctl -u aura-backend -f'"
echo ""
