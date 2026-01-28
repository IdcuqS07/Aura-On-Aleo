import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const NETWORKS = [
  { id: 'aleo_testnet', name: 'Aleo Testnet', chainId: 'testnet3', icon: '🔷' },
  { id: 'polygon_amoy', name: 'Polygon Amoy', chainId: 80002, icon: '🟣' },
  { id: 'ethereum_sepolia', name: 'Ethereum Sepolia', chainId: 11155111, icon: '⟠' },
  { id: 'bsc_testnet', name: 'BSC Testnet', chainId: 97, icon: '🟡' },
  { id: 'arbitrum_sepolia', name: 'Arbitrum Sepolia', chainId: 421614, icon: '🔵' },
  { id: 'optimism_sepolia', name: 'Optimism Sepolia', chainId: 11155420, icon: '🔴' }
];

const NetworkSelector = ({ onNetworkChange, currentNetwork = 'aleo_testnet' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentNetwork);

  const selectedNetwork = NETWORKS.find(n => n.id === selected);

  const handleSelect = (networkId) => {
    setSelected(networkId);
    setIsOpen(false);
    if (onNetworkChange) {
      const network = NETWORKS.find(n => n.id === networkId);
      onNetworkChange(network);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-purple-500/30 rounded-lg hover:border-purple-500 transition-all"
      >
        <span className="text-xl">{selectedNetwork?.icon}</span>
        <span className="text-white font-medium">{selectedNetwork?.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-gray-800 border border-purple-500/30 rounded-lg shadow-xl z-50">
          {NETWORKS.map((network) => (
            <button
              key={network.id}
              onClick={() => handleSelect(network.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-500/10 transition-colors ${
                selected === network.id ? 'bg-purple-500/20' : ''
              }`}
            >
              <span className="text-2xl">{network.icon}</span>
              <div className="text-left">
                <div className="text-white font-medium">{network.name}</div>
                <div className="text-xs text-gray-400">Chain ID: {network.chainId}</div>
              </div>
              {selected === network.id && (
                <span className="ml-auto text-purple-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;
