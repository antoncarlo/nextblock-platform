import "@nomicfoundation/hardhat-toolbox";

export default {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    ethereum: {
      url: "https://eth.llamarpc.com",
      chainId: 1,
      gasPrice: "auto",
    },
    sepolia: {
      url: "https://rpc.sepolia.org",
      chainId: 11155111,
      gasPrice: "auto",
    },
    hyperliquid: {
      url: "https://rpc.hyperliquid.xyz/evm",
      chainId: 998,
      gasPrice: 1000000000, // 1 gwei - ultra low fees
    },
    hyperliquidTestnet: {
      url: "https://rpc.hyperliquid-testnet.xyz/evm",
      chainId: 999,
      gasPrice: 1000000000, // 1 gwei
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000,
  },
};
