#!/bin/bash

echo "📤 Upload Monitoring Files ke VPS"
echo ""

VPS_IP="159.65.134.137"  # Ganti dengan IP VPS Anda
VPS_PATH="/root/Aura-V.1.1"

echo "Uploading ke: root@$VPS_IP:$VPS_PATH"
echo ""

# Backend files
echo "📦 Backend files..."
scp "Aura-V.1.0 /backend/websocket_server.py" root@$VPS_IP:$VPS_PATH/backend/
scp "Aura-V.1.0 /backend/block_monitor.py" root@$VPS_IP:$VPS_PATH/backend/
scp "Aura-V.1.0 /backend/monitoring_routes.py" root@$VPS_IP:$VPS_PATH/backend/
scp "Aura-V.1.0 /backend/monitor_runner.py" root@$VPS_IP:$VPS_PATH/backend/
scp "Aura-V.1.0 /backend/requirements-monitoring.txt" root@$VPS_IP:$VPS_PATH/backend/

# Frontend files
echo "📦 Frontend files..."
scp "Aura-V.1.0 /frontend/src/services/websocketService.js" root@$VPS_IP:$VPS_PATH/frontend/src/services/
scp "Aura-V.1.0 /frontend/src/components/LiveDashboard.jsx" root@$VPS_IP:$VPS_PATH/frontend/src/components/
scp "Aura-V.1.0 /frontend/src/App.js" root@$VPS_IP:$VPS_PATH/frontend/src/

# Docker compose
echo "📦 Docker compose..."
scp "Aura-V.1.0 /docker-compose.production.yml" root@$VPS_IP:$VPS_PATH/

echo ""
echo "✅ Upload selesai!"
echo ""
echo "Sekarang SSH ke VPS dan jalankan:"
echo "  ssh root@$VPS_IP"
echo "  cd $VPS_PATH"
echo "  systemctl start docker"
echo "  docker-compose -f docker-compose.production.yml up -d --build"
