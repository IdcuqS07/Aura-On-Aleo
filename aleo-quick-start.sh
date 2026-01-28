#!/bin/bash

echo "🚀 Aleo Integration Quick Start"
echo "================================"
echo ""

# Check if Leo is installed
if command -v leo &> /dev/null; then
    echo "✅ Leo compiler found: $(leo --version)"
else
    echo "❌ Leo compiler not found"
    echo "📦 Installing Leo..."
    curl -L https://raw.githubusercontent.com/AleoHQ/leo/mainnet/install.sh | bash
    export PATH="$HOME/.aleo/bin:$PATH"
    
    if command -v leo &> /dev/null; then
        echo "✅ Leo installed successfully"
    else
        echo "❌ Leo installation failed"
        echo "Please install manually: https://developer.aleo.org/leo/installation"
        exit 1
    fi
fi

echo ""
echo "📦 Building Aleo programs..."
echo ""

# Build zkbadge
echo "Building zkbadge.aleo..."
cd aleo-programs/zkbadge
leo build
if [ $? -eq 0 ]; then
    echo "✅ zkbadge built successfully"
else
    echo "❌ zkbadge build failed"
    exit 1
fi

cd ../..

# Build credit_passport
echo ""
echo "Building credit_passport.aleo..."
cd aleo-programs/credit_passport
leo build
if [ $? -eq 0 ]; then
    echo "✅ credit_passport built successfully"
else
    echo "❌ credit_passport build failed"
    exit 1
fi

cd ../..

echo ""
echo "✅ All programs built successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Start backend: cd backend && python server.py"
echo "   2. Start frontend: cd frontend && yarn start"
echo "   3. Test API: curl http://localhost:9000/api/aleo/status"
echo "   4. Deploy to testnet: ./aleo-programs/deploy-aleo.sh"
echo ""
echo "📚 Documentation:"
echo "   - ALEO_INTEGRATION_COMPLETE.md"
echo "   - ALEO_TESTING_GUIDE.md"
echo ""
