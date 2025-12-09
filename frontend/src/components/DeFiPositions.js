import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';

const DeFiPositions = ({ walletAddress }) => {
  const [defiData, setDefiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchDefiData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/defi/${walletAddress}`);
        const data = await response.json();
        setDefiData(data.data);
      } catch (error) {
        console.error('Error fetching DeFi data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefiData();
  }, [walletAddress]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!defiData) return null;

  const { summary, protocols } = defiData;
  const aave = protocols?.aave || {};

  const getHealthColor = (healthFactor) => {
    if (healthFactor === 0) return 'text-gray-500';
    if (healthFactor >= 2.0) return 'text-green-500';
    if (healthFactor >= 1.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBadge = (riskScore) => {
    if (riskScore < 40) return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold border border-green-500/30">Low Risk</span>;
    if (riskScore < 70) return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-semibold border border-yellow-500/30">Medium Risk</span>;
    return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold border border-red-500/30">High Risk</span>;
  };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mb-4">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          DeFi Portfolio Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Total Supplied</p>
            <p className="text-2xl font-bold text-green-400">
              ${summary.total_supplied_usd?.toLocaleString() || '0'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Total Borrowed</p>
            <p className="text-2xl font-bold text-orange-400">
              ${summary.total_borrowed_usd?.toLocaleString() || '0'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Net Position</p>
            <p className={`text-2xl font-bold ${summary.net_position_usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${summary.net_position_usd?.toLocaleString() || '0'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Protocols Used</p>
            <p className="text-2xl font-bold text-purple-400">
              {summary.protocols_used || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Aave Position */}
      {aave.total_collateral_usd > 0 && (
        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Aave V3 Position</h3>
            {aave.health_factor > 0 && (
              <span className={`text-sm font-semibold ${getHealthColor(aave.health_factor)}`}>
                Health Factor: {aave.health_factor.toFixed(2)}
              </span>
            )}
          </div>
          <div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Collateral</p>
                  <p className="text-xl font-semibold">${aave.total_collateral_usd.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Debt</p>
                  <p className="text-xl font-semibold">${aave.total_debt_usd.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available to Borrow</p>
                  <p className="text-xl font-semibold">${aave.available_borrow_usd.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">LTV</p>
                  <p className="text-xl font-semibold">{aave.ltv}%</p>
                </div>
              </div>

              {aave.health_factor > 0 && aave.health_factor < 1.5 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Low health factor! Consider adding collateral to avoid liquidation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">DeFi Risk Assessment</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-3">Risk Score</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-white">
                {summary.risk_score || 50}<span className="text-2xl text-gray-500">/100</span>
              </div>
              {getRiskBadge(summary.risk_score || 50)}
            </div>
            <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  (summary.risk_score || 50) < 40 ? 'bg-green-500' : 
                  (summary.risk_score || 50) < 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${summary.risk_score || 50}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-2">Data Source</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50">
              <span className={`w-2 h-2 rounded-full ${defiData.is_real_data ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <p className="text-sm font-medium text-white">
                {defiData.is_real_data ? 'Live On-chain' : 'Mock Data'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeFiPositions;
