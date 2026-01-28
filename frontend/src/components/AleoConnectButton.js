import React from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';

export const AleoConnectButton = () => {
  const { publicKey, connected } = useWallet();

  return (
    <div>
      <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 !text-white !rounded-lg !font-medium hover:!shadow-lg hover:!shadow-purple-500/50 !transition-all !px-6 !py-2" />
      
      {connected && publicKey && (
        <div className="mt-2 text-xs text-gray-400">
          Connected: {publicKey.slice(0, 10)}...{publicKey.slice(-8)}
        </div>
      )}
    </div>
  );
};
