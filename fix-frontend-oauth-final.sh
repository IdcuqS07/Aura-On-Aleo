#!/bin/bash

VPS="root@159.65.134.137"

echo "🔧 Fixing Frontend OAuth Credentials"
echo "====================================="
echo ""

ssh -t $VPS << 'ENDSSH'

echo "📝 Method 1: Edit JS files directly (fastest)"
cd /var/www/aurapass.xyz/static/js

# Backup
cp main.*.js main.backup.js 2>/dev/null

# Replace credentials
sed -i 's/your_github_client_id_here/Ov23liBkJpXGppFuyWWV/g' *.js
sed -i 's/your_twitter_api_key_here/ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ/g' *.js

echo "✅ Credentials updated in JS files"

# Verify
if grep -q "Ov23liBkJpXGppFuyWWV" *.js; then
    echo "✅ GitHub Client ID found in JS"
else
    echo "❌ GitHub Client ID not found"
fi

if grep -q "ZkNHUnEwSk5STWtKRWk2cW1fQWU6MTpjaQ" *.js; then
    echo "✅ Twitter Client ID found in JS"
else
    echo "❌ Twitter Client ID not found"
fi

echo ""
echo "✅ Done! Test at: https://www.aurapass.xyz/poh"

ENDSSH

echo ""
echo "🎉 Frontend OAuth fixed!"
