import React, { FC, useMemo } from 'react';
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { DecryptPermission, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';

// Import CSS
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';

export const AleoWalletProvider = ({ children }) => {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter(),
    ],
    []
  );

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.Testnet}
      autoConnect={false}
    >
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
};
