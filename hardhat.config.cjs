require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
      url: process.env.ETHEREUM_RPC_URL || "https://eth.llamarpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1,
      gasPrice: "auto",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: "auto",
    },
    hyperliquid: {
      url: process.env.HYPERLIQUID_RPC_URL || "https://rpc.hyperliquid.xyz/evm",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 998,
      gasPrice: 1000000000, // 1 gwei - ultra low fees
    },
    hyperliquidTestnet: {
      url: process.env.HYPERLIQUID_TESTNET_RPC_URL || "https://rpc.hyperliquid-testnet.xyz/evm",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 999,
      gasPrice: 1000000000, // 1 gwei
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      hyperliquid: "no-api-key-needed",
      hyperliquidTestnet: "no-api-key-needed",
    },
    customChains: [
      {
        network: "hyperliquid",
        chainId: 998,
        urls: {
          apiURL: "https://hypurrscan.io/api",
          browserURL: "https://hypurrscan.io",
        },
      },
      {
        network: "hyperliquidTestnet",
        chainId: 999,
        urls: {
          apiURL: "https://hypurrscan-testnet.io/api",
          browserURL: "https://hypurrscan-testnet.io",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  mocha: {
    timeout: 40000,
  },
};
