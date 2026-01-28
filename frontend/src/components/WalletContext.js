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

  // Auto-detect Leo Wallet connection
  useEffect(() => {
    if (window.leoWallet && !isConnected) {
      const checkConnection = () => {
        if (window.leoWallet.publicKey && window.leoWallet.permission) {
          console.log('✅ Leo Wallet auto-detected as connected');
          setAddress(window.leoWallet.publicKey);
          setIsConnected(true);
          setWalletType('aleo');
        }
      };
      
      checkConnection();
      const interval = setInterval(checkConnection, 2000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

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
          console.log('Available methods:', Object.keys(window.leoWallet));
          console.log('Current publicKey:', window.leoWallet.publicKey);
          console.log('Current permission:', window.leoWallet.permission);
          console.log('Current network:', window.leoWallet.network);
          
          try {
            // Check if Leo Wallet is connected
            if (!window.leoWallet.publicKey || !window.leoWallet.permission) {
              console.log('⚠️ Leo Wallet not connected to this site');
              
              // Leo Wallet connect() has issues, instruct user to connect manually
              setError('Please open Leo Wallet extension and click "Connect" for this website, then try again');
              setIsConnecting(false);
              return;
            }
            
            // Check network
            const expectedNetwork = 'testnet';
            if (window.leoWallet.network && window.leoWallet.network !== expectedNetwork) {
              setError(`Please switch Leo Wallet to ${expectedNetwork}. Current: ${window.leoWallet.network}`);
              setIsConnecting(false);
              return;
            }
            
            const walletAddress = window.leoWallet.publicKey;
            
            if (walletAddress) {
              setAddress(walletAddress);
              setIsConnected(true);
              setWalletType('aleo');
              setError(null);
              console.log('✅ Connected to Leo Wallet:', walletAddress);
            } else {
              setError('Please connect Leo Wallet from the extension');
            }
          } catch (walletError) {
            try {
              console.error('❌ Leo Wallet error:', walletError.message || 'Unknown error');
            } catch {
              console.error('❌ Leo Wallet error occurred');
            }
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
    
    // Poll Leo Wallet for account changes
    if (window.leoWallet && walletType === 'aleo') {
      const interval = setInterval(() => {
        const newAddress = window.leoWallet.publicKey;
        if (newAddress && newAddress !== address) {
          setAddress(newAddress);
          console.log('Leo Wallet account changed:', newAddress);
        } else if (!newAddress && isConnected) {
          disconnectWallet();
        }
      }, 2000);
      
      return () => {
        clearInterval(interval);
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', () => {});
          window.ethereum.removeListener('chainChanged', () => {});
        }
      };
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [walletType, address, isConnected]);

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
