#!/bin/bash

echo "🕐 Aleo Off-Peak Deployment"
echo "=========================="
echo ""

# Check current UTC time
CURRENT_HOUR=$(date -u +%H)
echo "Current UTC time: $(date -u)"
echo "Current hour: ${CURRENT_HOUR}"
echo ""

# Optimal hours: 02:00 - 06:00 UTC
if [ $CURRENT_HOUR -ge 2 ] && [ $CURRENT_HOUR -le 6 ]; then
    echo "✅ OPTIMAL TIME - Network should be less congested"
else
    echo "⚠️  NOT OPTIMAL - Best time: 02:00-06:00 UTC"
    echo "Current time may have high network load"
    echo ""
    read -p "Continue anyway? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        echo "Aborted. Try again during 02:00-06:00 UTC"
        exit 0
    fi
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

cd badge_minimal

# Deploy with retries
MAX_RETRIES=3
RETRY=0

while [ $RETRY -lt $MAX_RETRIES ]; do
    echo "Attempt $((RETRY + 1))/$MAX_RETRIES"
    
    leo deploy --network testnet --broadcast --consensus-version 12
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ DEPLOYMENT SUCCESS!"
        exit 0
    else
        RETRY=$((RETRY + 1))
        if [ $RETRY -lt $MAX_RETRIES ]; then
            echo "Failed. Waiting 30 seconds before retry..."
            sleep 30
        fi
    fi
done

echo ""
echo "❌ All attempts failed"
echo "Try again during 02:00-06:00 UTC"
