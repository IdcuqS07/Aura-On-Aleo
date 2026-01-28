import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [walletType, setWalletType] = useState(null); // 'aleo' or 'evm'

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setWalletType('evm');
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  const connectWallet = async (type = 'evm') => {
    setIsConnecting(true);
    setError(null);

    try {
      if (type === 'aleo') {
        console.log('🔗 Attempting to connect Aleo wallet...');
        
        // Connect Leo Wallet
        if (window.leoWallet) {
          console.log('✅ Leo Wallet detected');
          try {
            // Request connection permission
            const response = await window.leoWallet.connect();
            console.log('Leo Wallet response:', response);
            
            if (response && response.address) {
              setAddress(response.address);
              setIsConnected(true);
              setWalletType('aleo');
              setError(null);
              console.log('✅ Connected to Leo Wallet:', response.address);
            } else if (response && Array.isArray(response) && response.length > 0) {
              setAddress(response[0]);
              setIsConnected(true);
              setWalletType('aleo');
              setError(null);
              console.log('✅ Connected to Leo Wallet:', response[0]);
            } else {
              console.error('❌ Invalid response format:', response);
              setError('Failed to get wallet address');
            }
          } catch (walletError) {
            console.error('❌ Leo Wallet error:', walletError);
            setError(walletError.message || 'Failed to connect Leo Wallet');
          }
        } else if (window.puzzleWallet) {
          console.log('✅ Puzzle Wallet detected');
          try {
            const accounts = await window.puzzleWallet.connect();
            console.log('Puzzle Wallet response:', accounts);
            if (accounts && accounts.length > 0) {
              setAddress(accounts[0]);
              setIsConnected(true);
              setWalletType('aleo');
              setError(null);
              console.log('✅ Connected to Puzzle Wallet:', accounts[0]);
            }
          } catch (walletError) {
            console.error('❌ Puzzle Wallet error:', walletError);
            setError(walletError.message || 'Failed to connect Puzzle Wallet');
          }
        } else {
          console.error('❌ No Aleo wallet extension found');
          setError('Please install Leo Wallet or Puzzle Wallet');
        }
      } else {
        // Connect MetaMask
        if (!window.ethereum) {
          setError('Please install MetaMask');
          setIsConnecting(false);
          return;
        }

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setWalletType('evm');
          setError(null);
        }
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      if (err.code === 4001) {
        setError('Please connect to your wallet');
      } else {
        setError('Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    setWalletType(null);
    setError(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setWalletType('evm');
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const value = {
    address,
    isConnected,
    isConnecting,
    error,
    walletType,
    connectWallet,
    disconnectWallet,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
