import React, { useState } from 'react';
import { X } from 'lucide-react';

const WalletSelector = ({ isOpen, onClose, onSelectWallet }) => {
  if (!isOpen) return null;

  const wallets = [
    {
      id: 'aleo',
      name: 'Aleo Wallet',
      description: 'Leo Wallet or Puzzle Wallet',
      icon: '🔷',
      type: 'aleo'
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Polygon & EVM chains',
      icon: '🦊',
      type: 'evm'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-purple-500/30 p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => onSelectWallet(wallet.type)}
              className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{wallet.icon}</span>
                <div>
                  <div className="text-white font-semibold">{wallet.name}</div>
                  <div className="text-sm text-gray-400">{wallet.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default WalletSelector;
