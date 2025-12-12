#!/bin/bash

# Quick OAuth Update Script
# Run this with your VPS credentials

VPS="root@159.65.134.137"

echo "🔧 OAuth Quick Fix for VPS"
echo "=========================="
echo ""

# Prompt for credentials
echo "Enter your OAuth credentials:"
read -p "GitHub Client ID: " GITHUB_ID
read -sp "GitHub Client Secret: " GITHUB_SECRET
echo ""
read -p "Twitter Client ID: " TWITTER_ID  
read -sp "Twitter Client Secret: " TWITTER_SECRET
echo ""
echo ""

# Create remote script
cat > /tmp/update_oauth.sh << EOF
#!/bin/bash
cd /root/Aura-Protocol-V.1-main/backend

# Backup
cp .env .env.backup.\$(date +%Y%m%d_%H%M%S)

# Remove old OAuth config if exists
sed -i '/^GITHUB_CLIENT_ID=/d' .env
sed -i '/^GITHUB_CLIENT_SECRET=/d' .env
sed -i '/^GITHUB_REDIRECT_URI=/d' .env
sed -i '/^TWITTER_CLIENT_ID=/d' .env
sed -i '/^TWITTER_CLIENT_SECRET=/d' .env
sed -i '/^TWITTER_REDIRECT_URI=/d' .env

# Add new OAuth config
cat >> .env << 'ENVEOF'

# OAuth Configuration
GITHUB_CLIENT_ID=${GITHUB_ID}
GITHUB_CLIENT_SECRET=${GITHUB_SECRET}
GITHUB_REDIRECT_URI=https://www.aurapass.xyz/poh/callback

TWITTER_CLIENT_ID=${TWITTER_ID}
TWITTER_CLIENT_SECRET=${TWITTER_SECRET}
TWITTER_REDIRECT_URI=https://www.aurapass.xyz/poh/callback
ENVEOF

echo "✅ OAuth config updated"

# Restart backend
systemctl restart aura-backend
sleep 2

# Check status
if systemctl is-active --quiet aura-backend; then
    echo "✅ Backend restarted successfully"
    journalctl -u aura-backend -n 10 --no-pager
else
    echo "❌ Backend failed to start"
    journalctl -u aura-backend -n 20 --no-pager
fi
EOF

# Upload and execute
echo "📤 Uploading to VPS..."
scp /tmp/update_oauth.sh ${VPS}:/tmp/

echo "🚀 Executing on VPS..."
ssh ${VPS} "bash /tmp/update_oauth.sh"

echo ""
echo "✅ Done! Test at: https://www.aurapass.xyz/proof-of-humanity"
