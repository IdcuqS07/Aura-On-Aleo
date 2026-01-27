/**
 * Multi-Chain Network Configuration
 * Supports: Ethereum Sepolia, BSC Testnet, Arbitrum Testnet, Optimism Testnet, Polygon Amoy
 */

const networks = {
  // Polygon Amoy (Current)
  polygonAmoy: {
    chainId: 80002,
    name: "Polygon Amoy Testnet",
    rpc: "https://rpc-amoy.polygon.technology",
    explorer: "https://amoy.polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    deployed: true,
    contracts: {
      SimpleZKBadge: "0x9e6343BB504Af8a39DB516d61c4Aa0aF36c54678",
      CreditPassport: "0x1112373c9954B9bbFd91eb21175699b609A1b551",
      ProofRegistry: "0x296DB144E62C8C826bffA4503Dc9Fbf29F25D44B"
    }
  },

  // Ethereum Sepolia
  sepolia: {
    chainId: 11155111,
    name: "Ethereum Sepolia",
    rpc: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    explorer: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "ETH",
      decimals: 18
    },
    deployed: false,
    contracts: {}
  },

  // BSC Testnet
  bscTestnet: {
    chainId: 97,
    name: "BSC Testnet",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorer: "https://testnet.bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    deployed: false,
    contracts: {}
  },

  // Arbitrum Testnet
  arbitrumTestnet: {
    chainId: 421614,
    name: "Arbitrum Sepolia",
    rpc: "https://sepolia-rollup.arbitrum.io/rpc",
    explorer: "https://sepolia.arbiscan.io",
    nativeCurrency: {
      name: "Arbitrum ETH",
      symbol: "ETH",
      decimals: 18
    },
    deployed: false,
    contracts: {}
  },

  // Optimism Testnet
  optimismTestnet: {
    chainId: 11155420,
    name: "Optimism Sepolia",
    rpc: "https://sepolia.optimism.io",
    explorer: "https://sepolia-optimism.etherscan.io",
    nativeCurrency: {
      name: "Optimism ETH",
      symbol: "ETH",
      decimals: 18
    },
    deployed: false,
    contracts: {}
  }
};

// Helper functions
const getNetworkByChainId = (chainId) => {
  return Object.values(networks).find(n => n.chainId === chainId);
};

const getDeployedNetworks = () => {
  return Object.entries(networks)
    .filter(([_, config]) => config.deployed)
    .map(([key, config]) => ({ key, ...config }));
};

const getAllNetworks = () => {
  return Object.entries(networks).map(([key, config]) => ({ key, ...config }));
};

module.exports = {
  networks,
  getNetworkByChainId,
  getDeployedNetworks,
  getAllNetworks
};
