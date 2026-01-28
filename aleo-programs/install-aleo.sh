#!/bin/bash

echo "🚀 Installing Aleo Development Environment..."

# Install Leo
echo "📦 Installing Leo compiler..."
curl -L https://raw.githubusercontent.com/AleoHQ/leo/testnet3/install.sh | bash

# Install SnarkVM
echo "📦 Installing SnarkVM..."
curl -L https://raw.githubusercontent.com/AleoHQ/snarkVM/testnet3/install.sh | bash

# Add to PATH
echo "export PATH=\"\$HOME/.aleo/bin:\$PATH\"" >> ~/.zshrc
source ~/.zshrc

# Verify installations
echo ""
echo "✅ Verifying installations..."
leo --version
snarkvm --version

echo ""
echo "✅ Aleo environment setup complete!"
echo "📝 Next steps:"
echo "   1. cd aleo-programs/zkbadge"
echo "   2. leo build"
echo "   3. leo test"
