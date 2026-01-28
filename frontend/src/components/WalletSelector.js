import React, { useState } from 'react';
import { X, AlertCircle, ExternalLink } from 'lucide-react';

const WalletSelector = ({ isOpen, onClose, onSelectWallet }) => {
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleWalletSelect = async (type) => {
    setError(null);
    try {
      await onSelectWallet(type);
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const wallets = [
    {
      id: 'aleo',
      name: 'Leo Wallet',
      description: 'Aleo Network (Testnet)',
      icon: '🔷',
      type: 'aleo',
      installUrl: 'https://leo.app/'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pt-20">
      <div className="bg-slate-900 rounded-2xl border border-purple-500/30 p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletSelect(wallet.type)}
              className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{wallet.icon}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold">{wallet.name}</div>
                  <div className="text-sm text-gray-400">{wallet.description}</div>
                </div>
              </div>
              {wallet.installUrl && (
                <a
                  href={wallet.installUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-block"
                >
                  Install {wallet.name} →
                </a>
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By connecting, you agree to our Terms of Service
        </p>
        
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-200">
              <div className="font-semibold mb-1">Leo Wallet Instructions:</div>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Make sure Leo Wallet is installed and unlocked</li>
                <li>Click "Leo Wallet" button above</li>
                <li>App will auto-connect within 2-3 seconds</li>
                <li>If not connected, refresh page and try again</li>
              </ol>
              <p className="mt-2 text-xs text-blue-300">Note: Leo Wallet requires manual unlock. No popup will appear.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSelector;
