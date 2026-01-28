import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const LeoWalletDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    leoWalletExists: false,
    puzzleWalletExists: false,
    leoWalletType: null,
    windowKeys: [],
    connectionAttempt: null,
    error: null
  });

  const checkWallet = () => {
    const info = {
      leoWalletExists: typeof window.leoWallet !== 'undefined',
      puzzleWalletExists: typeof window.puzzleWallet !== 'undefined',
      leoWalletType: typeof window.leoWallet,
      puzzleWalletType: typeof window.puzzleWallet,
      windowKeys: Object.keys(window).filter(key => 
        key.toLowerCase().includes('leo') || 
        key.toLowerCase().includes('aleo') || 
        key.toLowerCase().includes('puzzle')
      ),
      leoWalletObject: window.leoWallet ? Object.keys(window.leoWallet) : null,
      puzzleWalletObject: window.puzzleWallet ? Object.keys(window.puzzleWallet) : null,
    };
    
    setDebugInfo(info);
    console.log('🔍 Wallet Debug Info:', info);
  };

  const testConnection = async () => {
    try {
      console.log('🧪 Testing Leo Wallet connection...');
      
      if (window.leoWallet) {
        console.log('✅ window.leoWallet found');
        console.log('Methods:', Object.keys(window.leoWallet));
        
        const result = await window.leoWallet.connect();
        console.log('Connection result:', result);
        
        setDebugInfo(prev => ({
          ...prev,
          connectionAttempt: 'success',
          connectionResult: result,
          error: null
        }));
      } else if (window.puzzleWallet) {
        console.log('✅ window.puzzleWallet found');
        const result = await window.puzzleWallet.connect();
        console.log('Connection result:', result);
        
        setDebugInfo(prev => ({
          ...prev,
          connectionAttempt: 'success',
          connectionResult: result,
          error: null
        }));
      } else {
        setDebugInfo(prev => ({
          ...prev,
          connectionAttempt: 'failed',
          error: 'No wallet found'
        }));
      }
    } catch (error) {
      console.error('❌ Connection error:', error);
      setDebugInfo(prev => ({
        ...prev,
        connectionAttempt: 'error',
        error: error.message
      }));
    }
  };

  useEffect(() => {
    checkWallet();
    
    // Check again after 2 seconds (wallet might load late)
    const timer = setTimeout(checkWallet, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/50 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">🔍 Leo Wallet Debug</h1>
          
          <div className="space-y-4 mb-6">
            {/* Leo Wallet Status */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
              {debugInfo.leoWalletExists ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <div className="text-white font-semibold">Leo Wallet</div>
                <div className="text-sm text-gray-400">
                  {debugInfo.leoWalletExists ? 'Detected ✅' : 'Not Found ❌'}
                  {debugInfo.leoWalletType && ` (${debugInfo.leoWalletType})`}
                </div>
              </div>
            </div>

            {/* Puzzle Wallet Status */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
              {debugInfo.puzzleWalletExists ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <div className="text-white font-semibold">Puzzle Wallet</div>
                <div className="text-sm text-gray-400">
                  {debugInfo.puzzleWalletExists ? 'Detected ✅' : 'Not Found ❌'}
                  {debugInfo.puzzleWalletType && ` (${debugInfo.puzzleWalletType})`}
                </div>
              </div>
            </div>

            {/* Window Keys */}
            {debugInfo.windowKeys.length > 0 && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-white font-semibold mb-2">Related Window Keys:</div>
                <div className="text-sm text-purple-400 font-mono">
                  {debugInfo.windowKeys.join(', ')}
                </div>
              </div>
            )}

            {/* Leo Wallet Methods */}
            {debugInfo.leoWalletObject && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-white font-semibold mb-2">Leo Wallet Methods:</div>
                <div className="text-sm text-green-400 font-mono">
                  {debugInfo.leoWalletObject.join(', ')}
                </div>
              </div>
            )}

            {/* Puzzle Wallet Methods */}
            {debugInfo.puzzleWalletObject && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-white font-semibold mb-2">Puzzle Wallet Methods:</div>
                <div className="text-sm text-green-400 font-mono">
                  {debugInfo.puzzleWalletObject.join(', ')}
                </div>
              </div>
            )}

            {/* Connection Result */}
            {debugInfo.connectionAttempt && (
              <div className={`p-4 rounded-lg ${
                debugInfo.connectionAttempt === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="text-white font-semibold mb-2">Connection Test:</div>
                <pre className="text-sm text-gray-300 overflow-auto">
                  {JSON.stringify(debugInfo.connectionResult || debugInfo.error, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={checkWallet}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Check
            </button>
            
            <button
              onClick={testConnection}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Test Connection
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <div className="font-semibold mb-2">Troubleshooting:</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Install Leo Wallet from <a href="https://leo.app/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">leo.app</a></li>
                  <li>Refresh this page after installation</li>
                  <li>Make sure Leo Wallet is unlocked</li>
                  <li>Check browser console (F12) for errors</li>
                  <li>Try disabling other wallet extensions</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Console Log */}
          <div className="mt-4 text-sm text-gray-400">
            💡 Check browser console (F12) for detailed logs
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeoWalletDebug;
