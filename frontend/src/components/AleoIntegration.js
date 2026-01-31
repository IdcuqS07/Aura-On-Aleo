import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const AleoIntegration = () => {
  const [leoWallet, setLeoWallet] = useState(null);
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [programInfo, setProgramInfo] = useState(null);

  useEffect(() => {
    // Check for Leo Wallet
    if (window.leoWallet) {
      setLeoWallet(window.leoWallet);
      
      // Auto-detect connection
      const checkConnection = () => {
        if (window.leoWallet.publicKey) {
          setAddress(window.leoWallet.publicKey);
          setIsConnected(true);
        }
      };
      
      checkConnection();
      const interval = setInterval(checkConnection, 2000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    // Fetch program info
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/aleo/program-info`)
      .then(res => res.json())
      .then(data => setProgramInfo(data))
      .catch(console.error);
  }, []);

  const mintBadge = async () => {
    if (!isConnected) {
      alert('Please connect Leo Wallet first');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/aleo/mint-badge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: address,
          badge_type: '1field'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Badge minted successfully!');
      } else {
        alert('Minting failed: ' + result.error);
      }
    } catch (error) {
      console.error('Mint error:', error);
      alert('Minting failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aleo Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Leo Wallet Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">Leo Wallet</span>
            <span className={`px-2 py-1 rounded text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-200'}`}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          {isConnected && (
            <div className="mt-2 text-sm text-gray-600">
              {address.slice(0, 10)}...{address.slice(-8)}
            </div>
          )}
        </div>

        {/* Program Info */}
        {programInfo && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="font-medium mb-2">Program: {programInfo.program_id}</div>
            <div className="text-sm space-y-1">
              <div>Network: {programInfo.network}</div>
              <div>Status: {programInfo.status}</div>
              <div>Statements: {programInfo.statements}</div>
            </div>
          </div>
        )}

        {/* Mint Button */}
        <Button 
          onClick={mintBadge}
          disabled={!isConnected}
          className="w-full"
        >
          Mint Aleo Badge
        </Button>

        {/* Instructions */}
        <div className="text-sm text-gray-600 space-y-1">
          <div>1. Install Leo Wallet from leo.app</div>
          <div>2. Unlock your wallet</div>
          <div>3. Mint badge on Aleo network</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AleoIntegration;
