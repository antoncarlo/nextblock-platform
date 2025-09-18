import "@nomicfoundation/hardhat-ethers";

/** @type import('hardhat/config').HardhatUserConfig */
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
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // HyperEVM Testnet
    hyperevm_testnet: {
      url: "https://api.hyperliquid-testnet.xyz/evm",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

