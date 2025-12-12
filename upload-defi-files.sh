#!/bin/bash
# Upload DeFi files to VPS

echo "📤 Uploading DeFi files to VPS..."

scp backend/defi_routes.py root@159.65.134.137:/root/Aura-Protocol-V.1-main/backend/
scp backend/defi_indexer.py root@159.65.134.137:/root/Aura-Protocol-V.1-main/backend/
scp backend/redis_cache.py root@159.65.134.137:/root/Aura-Protocol-V.1-main/backend/

echo "✅ Files uploaded. Now SSH and restart:"
echo "   ssh root@159.65.134.137"
echo "   systemctl restart aura-backend"
