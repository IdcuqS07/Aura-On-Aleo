#!/bin/bash

echo "🚀 Aleo Local Execution (No RPC)"
echo "================================"

cd badge_minimal

# Execute locally (no broadcast)
echo "📦 Executing mint function locally..."

leo execute mint \
  "aleo1ecrqqyvaszpehqc967g5aau4uqt2dg3y5ardm0y5wf4hxjajzsyqm5cxke" \
  "1field"

echo ""
echo "✅ Local execution complete"
echo "Program: badge_minimal.aleo"
echo "Function: mint"
echo "Mode: Local (no RPC)"
