import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';

const MultiChainContracts = () => {
  const [contracts, setContracts] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const contractNames = ['SimpleZKBadge', 'CreditPassport', 'ProofRegistry'];
      const data = {};

      for (const name of contractNames) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contracts/${name}`);
        const result = await response.json();
        if (result.success) {
          data[name] = result.addresses;
        }
      }

      setContracts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setLoading(false);
    }
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pt-24 px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4">Loading contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Multi-Chain Contracts
          </h1>
          <p className="text-gray-400 text-lg">
            Aura Protocol deployed across 5 blockchain networks
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(contracts).map(([contractName, networks]) => (
            <div key={contractName} className="bg-slate-900/50 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">{contractName}</h2>
              
              <div className="grid gap-4">
                {Object.entries(networks).map(([networkKey, networkData]) => (
                  <div key={networkKey} className="bg-slate-800/50 border border-purple-500/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {networkData.chain_id === 80002 && '🟣 Polygon Amoy'}
                          {networkData.chain_id === 11155111 && '⟠ Ethereum Sepolia'}
                          {networkData.chain_id === 97 && '🟡 BSC Testnet'}
                          {networkData.chain_id === 421614 && '🔵 Arbitrum Sepolia'}
                          {networkData.chain_id === 11155420 && '🔴 Optimism Sepolia'}
                        </h3>
                        <p className="text-sm text-gray-400">Chain ID: {networkData.chain_id}</p>
                      </div>
                      <a
                        href={networkData.explorer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3">
                      <code className="text-sm text-gray-300 font-mono flex-1 break-all">
                        {networkData.address}
                      </code>
                      <button
                        onClick={() => copyAddress(networkData.address)}
                        className="text-gray-400 hover:text-white transition flex-shrink-0"
                      >
                        {copied === networkData.address ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Deployment Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">5</div>
              <div className="text-sm text-gray-400">Networks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">15</div>
              <div className="text-sm text-gray-400">Contracts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">100%</div>
              <div className="text-sm text-gray-400">Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">✓</div>
              <div className="text-sm text-gray-400">Verified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiChainContracts;
