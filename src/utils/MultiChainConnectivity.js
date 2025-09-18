// Multi-Chain Connectivity Test Suite for NEXTBLOCK
import { ethers } from 'ethers';

export class MultiChainConnectivityTester {
  constructor() {
    this.networks = {
      ethereum: {
        chainId: 1,
        name: 'Ethereum Mainnet',
        rpc: 'https://eth.llamarpc.com',
        explorer: 'https://etherscan.io',
        currency: 'ETH'
      },
      sepolia: {
        chainId: 11155111,
        name: 'Sepolia Testnet',
        rpc: 'https://rpc.sepolia.org',
        explorer: 'https://sepolia.etherscan.io',
        currency: 'ETH'
      },
      hyperliquid: {
        chainId: 998,
        name: 'HyperLiquid Mainnet',
        rpc: 'https://rpc.hyperliquid.xyz/evm',
        explorer: 'https://hypurrscan.io',
        currency: 'ETH'
      },
      hyperliquidTestnet: {
        chainId: 999,
        name: 'HyperLiquid Testnet',
        rpc: 'https://rpc.hyperliquid-testnet.xyz/evm',
        explorer: 'https://hypurrscan-testnet.io',
        currency: 'ETH'
      }
    };
    
    this.testResults = {};
  }

  /**
   * Test wallet connection and network detection
   */
  async testWalletConnection() {
    console.log('🔍 Testing Wallet Connection...');
    
    const results = {
      hasMetaMask: false,
      isConnected: false,
      currentNetwork: null,
      accounts: [],
      error: null
    };

    try {
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && window.ethereum) {
        results.hasMetaMask = true;
        console.log('✅ MetaMask detected');

        // Get current network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const networkInfo = this.getNetworkByChainId(parseInt(chainId, 16));
        results.currentNetwork = networkInfo;
        
        console.log(`📡 Current Network: ${networkInfo?.name || 'Unknown'} (${chainId})`);

        // Check if connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        results.accounts = accounts;
        results.isConnected = accounts.length > 0;

        if (results.isConnected) {
          console.log(`👤 Connected Account: ${accounts[0]}`);
        } else {
          console.log('⚠️ Wallet not connected');
        }

      } else {
        results.error = 'MetaMask not installed';
        console.log('❌ MetaMask not detected');
      }

    } catch (error) {
      results.error = error.message;
      console.error('❌ Wallet connection test failed:', error);
    }

    this.testResults.walletConnection = results;
    return results;
  }

  /**
   * Test network switching capabilities
   */
  async testNetworkSwitching() {
    console.log('🔄 Testing Network Switching...');
    
    const results = {
      supportedNetworks: [],
      switchingResults: {},
      error: null
    };

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not available');
      }

      // Test switching to each supported network
      for (const [networkKey, network] of Object.entries(this.networks)) {
        console.log(`Testing switch to ${network.name}...`);
        
        try {
          const switchResult = await this.switchToNetwork(network);
          results.switchingResults[networkKey] = {
            success: switchResult.success,
            error: switchResult.error,
            chainId: network.chainId
          };
          
          if (switchResult.success) {
            results.supportedNetworks.push(networkKey);
            console.log(`✅ Successfully switched to ${network.name}`);
          } else {
            console.log(`⚠️ Failed to switch to ${network.name}: ${switchResult.error}`);
          }

          // Wait a bit between switches
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          results.switchingResults[networkKey] = {
            success: false,
            error: error.message,
            chainId: network.chainId
          };
          console.log(`❌ Error switching to ${network.name}: ${error.message}`);
        }
      }

    } catch (error) {
      results.error = error.message;
      console.error('❌ Network switching test failed:', error);
    }

    this.testResults.networkSwitching = results;
    return results;
  }

  /**
   * Test RPC connectivity for all networks
   */
  async testRPCConnectivity() {
    console.log('🌐 Testing RPC Connectivity...');
    
    const results = {
      networkStatus: {},
      totalTested: 0,
      successfulConnections: 0,
      error: null
    };

    try {
      for (const [networkKey, network] of Object.entries(this.networks)) {
        console.log(`Testing RPC for ${network.name}...`);
        results.totalTested++;

        try {
          const provider = new ethers.JsonRpcProvider(network.rpc);
          
          // Test basic connectivity
          const startTime = Date.now();
          const blockNumber = await provider.getBlockNumber();
          const latency = Date.now() - startTime;

          // Test network info
          const networkInfo = await provider.getNetwork();
          
          results.networkStatus[networkKey] = {
            success: true,
            blockNumber: blockNumber,
            latency: latency,
            chainId: Number(networkInfo.chainId),
            name: networkInfo.name,
            error: null
          };

          results.successfulConnections++;
          console.log(`✅ ${network.name}: Block ${blockNumber}, Latency: ${latency}ms`);

        } catch (error) {
          results.networkStatus[networkKey] = {
            success: false,
            blockNumber: null,
            latency: null,
            chainId: network.chainId,
            name: network.name,
            error: error.message
          };
          console.log(`❌ ${network.name}: ${error.message}`);
        }
      }

      console.log(`📊 RPC Test Summary: ${results.successfulConnections}/${results.totalTested} networks accessible`);

    } catch (error) {
      results.error = error.message;
      console.error('❌ RPC connectivity test failed:', error);
    }

    this.testResults.rpcConnectivity = results;
    return results;
  }

  /**
   * Test balance retrieval across networks
   */
  async testBalanceRetrieval() {
    console.log('💰 Testing Balance Retrieval...');
    
    const results = {
      balances: {},
      totalBalance: '0',
      error: null
    };

    try {
      const walletTest = await this.testWalletConnection();
      
      if (!walletTest.isConnected || walletTest.accounts.length === 0) {
        throw new Error('Wallet not connected');
      }

      const userAddress = walletTest.accounts[0];
      let totalBalanceWei = ethers.getBigInt(0);

      for (const [networkKey, network] of Object.entries(this.networks)) {
        console.log(`Getting balance for ${network.name}...`);

        try {
          const provider = new ethers.JsonRpcProvider(network.rpc);
          const balance = await provider.getBalance(userAddress);
          const balanceEth = ethers.formatEther(balance);

          results.balances[networkKey] = {
            success: true,
            balance: balanceEth,
            balanceWei: balance.toString(),
            network: network.name,
            currency: network.currency,
            error: null
          };

          totalBalanceWei += balance;
          console.log(`✅ ${network.name}: ${balanceEth} ${network.currency}`);

        } catch (error) {
          results.balances[networkKey] = {
            success: false,
            balance: '0',
            balanceWei: '0',
            network: network.name,
            currency: network.currency,
            error: error.message
          };
          console.log(`❌ ${network.name}: ${error.message}`);
        }
      }

      results.totalBalance = ethers.formatEther(totalBalanceWei);
      console.log(`💎 Total Balance Across All Networks: ${results.totalBalance} ETH`);

    } catch (error) {
      results.error = error.message;
      console.error('❌ Balance retrieval test failed:', error);
    }

    this.testResults.balanceRetrieval = results;
    return results;
  }

  /**
   * Test transaction capabilities
   */
  async testTransactionCapabilities() {
    console.log('📝 Testing Transaction Capabilities...');
    
    const results = {
      gasEstimation: {},
      transactionSigning: {},
      error: null
    };

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not available');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Test gas estimation for different networks
      for (const [networkKey, network] of Object.entries(this.networks)) {
        console.log(`Testing gas estimation for ${network.name}...`);

        try {
          // Switch to network first
          await this.switchToNetwork(network);
          
          // Create a simple transaction
          const tx = {
            to: userAddress, // Send to self
            value: ethers.parseEther('0'), // 0 ETH
            data: '0x'
          };

          const gasEstimate = await provider.estimateGas(tx);
          const gasPrice = await provider.getFeeData();

          results.gasEstimation[networkKey] = {
            success: true,
            gasLimit: gasEstimate.toString(),
            gasPrice: gasPrice.gasPrice?.toString() || '0',
            maxFeePerGas: gasPrice.maxFeePerGas?.toString() || '0',
            network: network.name,
            error: null
          };

          console.log(`✅ ${network.name}: Gas ${gasEstimate.toString()}`);

        } catch (error) {
          results.gasEstimation[networkKey] = {
            success: false,
            gasLimit: '0',
            gasPrice: '0',
            maxFeePerGas: '0',
            network: network.name,
            error: error.message
          };
          console.log(`❌ ${network.name}: ${error.message}`);
        }
      }

    } catch (error) {
      results.error = error.message;
      console.error('❌ Transaction capabilities test failed:', error);
    }

    this.testResults.transactionCapabilities = results;
    return results;
  }

  /**
   * Run comprehensive connectivity test suite
   */
  async runFullTestSuite() {
    console.log('🚀 Starting NEXTBLOCK Multi-Chain Connectivity Test Suite...\n');
    
    const startTime = Date.now();
    const testSuite = {
      startTime: new Date().toISOString(),
      tests: {},
      summary: {},
      duration: 0
    };

    try {
      // Run all tests
      testSuite.tests.walletConnection = await this.testWalletConnection();
      testSuite.tests.rpcConnectivity = await this.testRPCConnectivity();
      testSuite.tests.balanceRetrieval = await this.testBalanceRetrieval();
      testSuite.tests.networkSwitching = await this.testNetworkSwitching();
      testSuite.tests.transactionCapabilities = await this.testTransactionCapabilities();

      // Generate summary
      testSuite.summary = this.generateTestSummary();
      testSuite.duration = Date.now() - startTime;

      console.log('\n🎉 Test Suite Completed!');
      console.log(`⏱️ Total Duration: ${testSuite.duration}ms`);
      console.log('📊 Summary:', testSuite.summary);

    } catch (error) {
      console.error('❌ Test suite failed:', error);
      testSuite.error = error.message;
    }

    return testSuite;
  }

  /**
   * Generate test summary
   */
  generateTestSummary() {
    const summary = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      networkCompatibility: {},
      recommendations: []
    };

    // Analyze results
    Object.entries(this.testResults).forEach(([testName, results]) => {
      summary.totalTests++;
      
      if (results.error) {
        summary.failedTests++;
      } else {
        summary.passedTests++;
      }
    });

    // Network compatibility analysis
    if (this.testResults.rpcConnectivity) {
      Object.entries(this.testResults.rpcConnectivity.networkStatus).forEach(([network, status]) => {
        summary.networkCompatibility[network] = {
          accessible: status.success,
          latency: status.latency,
          blockHeight: status.blockNumber
        };
      });
    }

    // Generate recommendations
    if (summary.failedTests > 0) {
      summary.recommendations.push('Some tests failed - check network connectivity');
    }
    
    if (this.testResults.walletConnection?.hasMetaMask === false) {
      summary.recommendations.push('Install MetaMask for full functionality');
    }

    if (summary.passedTests === summary.totalTests) {
      summary.recommendations.push('All systems operational - ready for production');
    }

    return summary;
  }

  /**
   * Helper: Switch to specific network
   */
  async switchToNetwork(network) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });
      return { success: true, error: null };
    } catch (error) {
      if (error.code === 4902) {
        // Network not added, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${network.chainId.toString(16)}`,
              chainName: network.name,
              rpcUrls: [network.rpc],
              blockExplorerUrls: [network.explorer],
              nativeCurrency: {
                name: network.currency,
                symbol: network.currency,
                decimals: 18
              }
            }]
          });
          return { success: true, error: null };
        } catch (addError) {
          return { success: false, error: addError.message };
        }
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Helper: Get network info by chain ID
   */
  getNetworkByChainId(chainId) {
    return Object.values(this.networks).find(network => network.chainId === chainId);
  }

  /**
   * Export test results
   */
  exportResults() {
    return {
      timestamp: new Date().toISOString(),
      platform: 'NEXTBLOCK',
      version: '1.0.0',
      results: this.testResults
    };
  }
}

// Export singleton instance
export const connectivityTester = new MultiChainConnectivityTester();

// Utility functions for React components
export const useMultiChainTest = () => {
  const runQuickTest = async () => {
    const tester = new MultiChainConnectivityTester();
    return await tester.runFullTestSuite();
  };

  const testWalletOnly = async () => {
    const tester = new MultiChainConnectivityTester();
    return await tester.testWalletConnection();
  };

  const testNetworkSwitch = async (networkKey) => {
    const tester = new MultiChainConnectivityTester();
    const network = tester.networks[networkKey];
    if (!network) throw new Error('Network not found');
    return await tester.switchToNetwork(network);
  };

  return {
    runQuickTest,
    testWalletOnly,
    testNetworkSwitch,
    networks: new MultiChainConnectivityTester().networks
  };
};
