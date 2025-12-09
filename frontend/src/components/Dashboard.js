import React from 'react';
import { useWallet } from '../components/WalletContext';
import DeFiPositions from '../components/DeFiPositions';
import RealtimeAnalytics from '../components/RealtimeAnalytics';
import { Shield, TrendingUp, Activity } from 'lucide-react';

const Dashboard = () => {
  const { address, isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-16 px-4 py-8">
        <div className="max-w-6xl mx-auto text-center py-20">
          <Shield className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Connect Wallet</h1>
          <p className="text-gray-400">Connect your wallet to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Your complete DeFi portfolio and real-time analytics</p>
        </div>

        {/* Protocol Analytics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Protocol Analytics
            </h2>
            <div className="text-sm text-gray-400">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Data
              </span>
            </div>
          </div>
          <RealtimeAnalytics />
        </div>

        {/* DeFi Positions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              Your DeFi Positions
            </h2>
          </div>
          <DeFiPositions walletAddress={address} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
