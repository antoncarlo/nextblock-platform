import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiChainTest } from '../utils/MultiChainConnectivity';

const ConnectivityTestPanel = ({ isOpen, onClose }) => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [progress, setProgress] = useState(0);
  
  const { runQuickTest, testWalletOnly, testNetworkSwitch, networks } = useMultiChainTest();

  const runFullTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentTest('Initializing...');
    
    try {
      const tests = [
        { name: 'Wallet Connection', weight: 20 },
        { name: 'RPC Connectivity', weight: 30 },
        { name: 'Balance Retrieval', weight: 20 },
        { name: 'Network Switching', weight: 20 },
        { name: 'Transaction Capabilities', weight: 10 }
      ];
      
      let currentProgress = 0;
      
      for (const test of tests) {
        setCurrentTest(test.name);
        await new Promise(resolve => setTimeout(resolve, 500)); // Visual delay
        currentProgress += test.weight;
        setProgress(currentProgress);
      }
      
      const results = await runQuickTest();
      setTestResults(results);
      setCurrentTest('Complete!');
      setProgress(100);
      
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({ error: error.message });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success) => {
    if (success === null) return '⏳';
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success) => {
    if (success === null) return 'text-yellow-400';
    return success ? 'text-green-400' : 'text-red-400';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                🔧 Multi-Chain Connectivity Test
              </h2>
              <p className="text-gray-400">
                Comprehensive testing of NEXTBLOCK's blockchain integrations
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Test Controls */}
          <div className="mb-8">
            <div className="flex gap-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runFullTest}
                disabled={isRunning}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? 'Running Tests...' : 'Run Full Test Suite'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  setIsRunning(true);
                  const result = await testWalletOnly();
                  setTestResults({ tests: { walletConnection: result } });
                  setIsRunning(false);
                }}
                disabled={isRunning}
                className="px-6 py-3 border-2 border-gray-600 text-white rounded-lg font-semibold hover:border-white hover:bg-white/5 disabled:opacity-50"
              >
                Quick Wallet Test
              </motion.button>
            </div>

            {/* Progress Bar */}
            {isRunning && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{currentTest}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Test Results */}
          {testResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Summary */}
              {testResults.summary && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">📊 Test Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {testResults.summary.passedTests}
                      </div>
                      <div className="text-sm text-gray-400">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">
                        {testResults.summary.failedTests}
                      </div>
                      <div className="text-sm text-gray-400">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {testResults.summary.totalTests}
                      </div>
                      <div className="text-sm text-gray-400">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {testResults.duration}ms
                      </div>
                      <div className="text-sm text-gray-400">Duration</div>
                    </div>
                  </div>
                  
                  {testResults.summary.recommendations && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-white mb-2">💡 Recommendations:</h4>
                      <ul className="space-y-1">
                        {testResults.summary.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-300">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Wallet Connection Test */}
              {testResults.tests?.walletConnection && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    {getStatusIcon(!testResults.tests.walletConnection.error)} 
                    <span className="ml-2">Wallet Connection</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">MetaMask Status</div>
                      <div className={`font-semibold ${testResults.tests.walletConnection.hasMetaMask ? 'text-green-400' : 'text-red-400'}`}>
                        {testResults.tests.walletConnection.hasMetaMask ? 'Installed' : 'Not Installed'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Connection Status</div>
                      <div className={`font-semibold ${testResults.tests.walletConnection.isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                        {testResults.tests.walletConnection.isConnected ? 'Connected' : 'Not Connected'}
                      </div>
                    </div>
                    {testResults.tests.walletConnection.currentNetwork && (
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-400">Current Network</div>
                        <div className="font-semibold text-blue-400">
                          {testResults.tests.walletConnection.currentNetwork.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* RPC Connectivity Test */}
              {testResults.tests?.rpcConnectivity && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    {getStatusIcon(!testResults.tests.rpcConnectivity.error)}
                    <span className="ml-2">RPC Connectivity</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(testResults.tests.rpcConnectivity.networkStatus).map(([network, status]) => (
                      <div key={network} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-white">{networks[network]?.name}</span>
                          <span className={getStatusColor(status.success)}>
                            {getStatusIcon(status.success)}
                          </span>
                        </div>
                        {status.success ? (
                          <div className="space-y-1 text-sm">
                            <div className="text-gray-400">
                              Block: <span className="text-white">{status.blockNumber}</span>
                            </div>
                            <div className="text-gray-400">
                              Latency: <span className="text-white">{status.latency}ms</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-red-400">{status.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Balance Retrieval Test */}
              {testResults.tests?.balanceRetrieval && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    {getStatusIcon(!testResults.tests.balanceRetrieval.error)}
                    <span className="ml-2">Balance Retrieval</span>
                  </h3>
                  {testResults.tests.balanceRetrieval.balances && (
                    <div className="space-y-3">
                      {Object.entries(testResults.tests.balanceRetrieval.balances).map(([network, balance]) => (
                        <div key={network} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                          <span className="text-gray-300">{balance.network}</span>
                          <div className="text-right">
                            {balance.success ? (
                              <div>
                                <span className="text-white font-semibold">{balance.balance} {balance.currency}</span>
                                <span className="text-green-400 ml-2">✅</span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-red-400 text-sm">{balance.error}</span>
                                <span className="text-red-400 ml-2">❌</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-gray-600">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-white">Total Balance</span>
                          <span className="text-lg font-bold text-green-400">
                            {testResults.tests.balanceRetrieval.totalBalance} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Network Switching Test */}
              {testResults.tests?.networkSwitching && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    {getStatusIcon(!testResults.tests.networkSwitching.error)}
                    <span className="ml-2">Network Switching</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(testResults.tests.networkSwitching.switchingResults).map(([network, result]) => (
                      <div key={network} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-white">{networks[network]?.name}</span>
                          <span className={getStatusColor(result.success)}>
                            {getStatusIcon(result.success)}
                          </span>
                        </div>
                        {!result.success && (
                          <div className="text-sm text-red-400">{result.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    Supported Networks: {testResults.tests.networkSwitching.supportedNetworks.length}/4
                  </div>
                </div>
              )}

              {/* Export Results */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const dataStr = JSON.stringify(testResults, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `nextblock-connectivity-test-${Date.now()}.json`;
                    link.click();
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600"
                >
                  📥 Export Results
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConnectivityTestPanel;
