#!/bin/bash

VPS="root@159.65.134.137"

echo "🔄 Sync Backend Files to VPS"
echo "============================="
echo ""

# Upload updated files
echo "📤 Uploading poh_routes.py..."
scp backend/poh_routes.py $VPS:/root/Aura-Protocol-V.1-main/backend/

echo "📤 Uploading github_service.py..."
scp backend/github_service.py $VPS:/root/Aura-Protocol-V.1-main/backend/

echo "📤 Uploading twitter_service.py..."
scp backend/twitter_service.py $VPS:/root/Aura-Protocol-V.1-main/backend/

echo ""
echo "🔄 Restarting backend..."
ssh -t $VPS << 'ENDSSH'
cd /root/Aura-Protocol-V.1-main/backend
pkill -f "uvicorn.*9002"
sleep 2
source venv/bin/activate
nohup uvicorn server:app --host 0.0.0.0 --port 9002 > server.log 2>&1 &
echo "✅ Backend restarted"
sleep 3
tail -15 server.log
ENDSSH

echo ""
echo "✅ Done! Test: https://www.aurapass.xyz/proof-of-humanity"
