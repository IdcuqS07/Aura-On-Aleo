import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, Calendar, AlertTriangle, Loader } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://api.aurapass.xyz';

const PartnerVerify = () => {
  const [passportId, setPassportId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!passportId.trim()) {
      setError('Please enter a Passport ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/passport/verify/${passportId.trim()}`);
      const data = await response.json();

      if (data.valid) {
        setResult(data);
      } else {
        setError(data.message || 'Passport not found');
      }
    } catch (err) {
      setError('Failed to verify passport. Please try again.');
      console.error('Verify error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'verified' ? 'text-green-400' : 'text-yellow-400';
  };

  const getStatusIcon = (status) => {
    return status === 'verified' ? CheckCircle : AlertTriangle;
  };

  return (
    <div className="min-h-screen pt-16 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center fade-in">
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Partner Verification</h1>
          <p className="text-gray-400">Verify Aura Protocol Passport validity</p>
        </div>

        {/* Verification Form */}
        <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mb-8">
          <label className="block text-white font-medium mb-3">
            Enter Passport ID
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={passportId}
              onChange={(e) => setPassportId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="PASS-A1B2C3D4E5F6"
              className="flex-1 px-4 py-3 bg-slate-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Verify'
              )}
            </button>
          </div>
          {error && (
            <div className="mt-3 flex items-center space-x-2 text-red-400 text-sm">
              <XCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="fade-in">
            {result.valid ? (
              <div className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl border border-green-500/30">
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <h2 className="text-2xl font-bold text-white">Valid Passport</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Passport ID */}
                  <div className="p-4 bg-slate-900/50 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">Passport ID</div>
                    <div className="text-lg font-bold text-white font-mono">{result.passport_id}</div>
                  </div>

                  {/* PoH Status */}
                  <div className="p-4 bg-slate-900/50 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">PoH Status</div>
                    <div className={`flex items-center space-x-2 ${getStatusColor(result.poh_status)}`}>
                      {React.createElement(getStatusIcon(result.poh_status), { className: 'w-5 h-5' })}
                      <span className="text-lg font-bold uppercase">{result.poh_status}</span>
                    </div>
                  </div>

                  {/* Issued Date */}
                  <div className="p-4 bg-slate-900/50 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">Issued Date</div>
                    <div className="flex items-center space-x-2 text-white">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="text-lg font-medium">
                        {new Date(result.issued_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="p-4 bg-slate-900/50 rounded-xl">
                    <div className="text-sm text-gray-400 mb-2">Verification</div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-lg font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-300 mb-1">
                        Need Full Risk Assessment?
                      </div>
                      <div className="text-xs text-gray-400">
                        Get API access to view credit scores, risk levels, and AI-powered recommendations.
                        <a href="/api" className="text-blue-400 hover:text-blue-300 ml-1">
                          Get API Key →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-gradient-to-br from-red-900/30 to-rose-900/30 backdrop-blur-sm rounded-2xl border border-red-500/30">
                <div className="flex items-center space-x-3 mb-4">
                  <XCircle className="w-8 h-8 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Invalid Passport</h2>
                </div>
                <p className="text-gray-300">
                  The passport ID you entered could not be found or is invalid.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!result && (
          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">About Passport Verification</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                • <strong className="text-white">Public Verification</strong>: Check if a passport ID is valid
              </p>
              <p>
                • <strong className="text-white">Privacy Protected</strong>: No personal data or scores are shown
              </p>
              <p>
                • <strong className="text-white">For Partners</strong>: Get API access for full risk assessment data
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerVerify;
