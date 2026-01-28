import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { AleoConnectButton } from '../components/AleoConnectButton';
import aleoAPI from '../services/aleoAPI';

const AleoIntegration = () => {
  const { publicKey, connected } = useWallet();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const data = await aleoAPI.getStatus();
      setStatus(data);
    } catch (error) {
      console.error('Status check failed:', error);
    }
  };

  const issueBadge = async () => {
    if (!connected || !publicKey) {
      alert('Please connect wallet first');
      return;
    }

    setLoading(true);
    try {
      const result = await aleoAPI.issueBadge(
        publicKey,
        1,
        Date.now()
      );
      alert('Badge issued! TX: ' + result.transactionId);
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Aleo Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Status</h3>
            {status ? (
              <div className="text-sm space-y-1">
                <p>Leo Installed: {status.leo_installed ? '✅' : '❌'}</p>
                {status.leo_version && <p>Version: {status.leo_version}</p>}
                <p>Program: {status.program_name}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading...</p>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="space-y-2">
            <AleoConnectButton />
            {connected && publicKey && (
              <div className="p-4 bg-green-50 rounded mt-2">
                <p className="text-sm font-semibold text-green-800">Connected</p>
                <p className="text-xs text-green-600 mt-1 break-all">{publicKey}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {connected && (
            <div className="space-y-2">
              <Button 
                onClick={issueBadge}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Issue ZK Badge'}
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="p-4 bg-blue-50 rounded text-sm">
            <p className="font-semibold text-blue-800 mb-2">Requirements:</p>
            <ul className="list-disc list-inside text-blue-600 space-y-1">
              <li>Leo Wallet or Puzzle Wallet installed</li>
              <li>Aleo testnet credits for fees</li>
              <li>Leo compiler installed on backend</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AleoIntegration;
