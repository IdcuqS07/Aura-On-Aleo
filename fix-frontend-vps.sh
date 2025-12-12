#!/bin/bash

VPS="root@159.65.134.137"

echo "🔧 Fix Frontend OAuth Credentials on VPS"
echo "========================================="
echo ""

ssh -t $VPS << 'ENDSSH'
cd /root/Aura-Protocol-V.1-main/frontend

echo "📝 Updating .env.production..."

# Backup
cp .env.production .env.production.backup.$(date +%Y%m%d_%H%M%S)

# Update credentials using sed
sed -i 's/REACT_APP_GITHUB_CLIENT_ID=.*/REACT_APP_GITHUB_CLIENT_ID=Ov23liBkJpXGppFuyWWV/' .env.production
sed -i 's/REACT_APP_TWITTER_CLIENT_ID=.*/REACT_APP_TWITTER_CLIENT_ID=ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ/' .env.production

echo "✅ Credentials updated"
echo ""
cat .env.production

echo ""
echo "🔨 Rebuilding frontend..."
npm run build

echo ""
echo "🔄 Restarting frontend..."
# Try different restart methods
if command -v pm2 &> /dev/null; then
    pm2 restart frontend || pm2 restart all
    echo "✅ PM2 restarted"
elif systemctl list-units --type=service | grep -q aura-frontend; then
    systemctl restart aura-frontend
    echo "✅ Systemd service restarted"
else
    echo "⚠️  Please restart frontend manually"
fi

echo ""
echo "✅ Done!"

ENDSSH

echo ""
echo "🎉 Frontend updated! Test: https://www.aurapass.xyz/poh"
