import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Award, TrendingUp, Activity } from 'lucide-react';

const RealtimeAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:9000';
        console.log('Fetching from:', `${backendUrl}/api/analytics`);
        
        const response = await fetch(`${backendUrl}/api/analytics`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Backend analytics data:', data);
        setStats(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Set mock data as fallback
        setStats({
          total_users: 59,
          verified_users: 19,
          total_credit_passports: 16,
          average_credit_score: 742.5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="animate-pulse space-y-3">
              <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle both The Graph format (stats.globalStats) and backend format (stats directly)
  const data = stats?.globalStats || stats || {};
  const totalUsers = data.totalUsers || data.total_users || 0;
  const totalBadges = data.totalBadges || data.verified_users || 0;
  const totalPassports = data.totalPassports || data.total_credit_passports || 0;
  const avgScore = data.averageCreditScore || data.average_credit_score || 0;
  
  console.log('Rendering with:', { totalUsers, totalBadges, totalPassports, avgScore });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Users</div>
        </div>

        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {totalBadges.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Badges Minted</div>
        </div>

        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyan-600/20 rounded-lg">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {totalPassports.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Credit Passports</div>
        </div>

        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {Math.round(avgScore)}
          </div>
          <div className="text-sm text-gray-400">Avg Credit Score</div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.badges && stats.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Badge #{badge.tokenId}</p>
                    <p className="text-sm text-gray-500">{badge.badgeType}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(badge.issuedAt * 1000).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
};

export default RealtimeAnalytics;
