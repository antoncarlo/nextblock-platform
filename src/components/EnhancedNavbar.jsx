import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedNavbar = ({ 
  isConnected, 
  account, 
  chainId, 
  networkName, 
  onConnect, 
  onDisconnect, 
  onSwitchToEthereum, 
  onSwitchToHyperLiquid,
  isConnecting,
  error,
  onClearError,
  onShowConnectivityTest
}) => {
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const getNetworkColor = (chainId) => {
    switch (chainId) {
      case 1: return 'bg-blue-500'; // Ethereum
      case 11155111: return 'bg-yellow-500'; // Sepolia
      case 998: return 'bg-purple-500'; // HyperLiquid
      case 999: return 'bg-purple-400'; // HyperLiquid Testnet
      default: return 'bg-gray-500';
    }
  };

  const getNetworkIcon = (chainId) => {
    switch (chainId) {
      case 1: case 11155111: return 'ETH';
      case 998: case 999: return 'HL';
      default: return '?';
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-white text-xl font-bold">NEXTBLOCK</span>
          </motion.div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="#solution" 
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              Solution
            </motion.a>
            <motion.a 
              href="#features" 
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#roadmap" 
              className="text-gray-300 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              Roadmap
            </motion.a>
            
            {/* Connectivity Test Button */}
            <motion.button
              onClick={onShowConnectivityTest}
              className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center space-x-1"
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🔧</span>
              <span>Test</span>
            </motion.button>
          </div>

          {/* Right Side - Wallet Connection */}
          <div className="flex items-center space-x-4">
            {/* Network Selector */}
            {isConnected && (
              <div className="relative">
                <motion.button
                  onClick={() => setShowNetworkMenu(!showNetworkMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white text-sm font-medium ${getNetworkColor(chainId)}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{getNetworkIcon(chainId)}</span>
                  <span className="hidden sm:inline">{networkName}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {showNetworkMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 py-2"
                    >
                      <button
                        onClick={() => {
                          onSwitchToEthereum();
                          setShowNetworkMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Ethereum</span>
                      </button>
                      <button
                        onClick={() => {
                          onSwitchToHyperLiquid();
                          setShowNetworkMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center space-x-2"
                      >
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>HyperLiquid</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Wallet Connection Button */}
            {!isConnected ? (
              <motion.button
                onClick={onConnect}
                disabled={isConnecting}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                {isConnecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  'Connect Wallet'
                )}
              </motion.button>
            ) : (
              <div className="relative">
                <motion.button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 border border-gray-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>{formatAddress(account)}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {showAccountMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-700 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-700">
                        <div className="text-sm text-gray-400">Connected Account</div>
                        <div className="text-white font-mono text-sm">{account}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          Network: <span className="text-white">{networkName}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(account);
                          setShowAccountMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        📋 Copy Address
                      </button>
                      
                      <button
                        onClick={onShowConnectivityTest}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        🔧 Test Connectivity
                      </button>
                      
                      <div className="border-t border-gray-700 mt-2 pt-2">
                        <button
                          onClick={() => {
                            onDisconnect();
                            setShowAccountMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-gray-800"
                        >
                          🚪 Disconnect
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-900/50 border-b border-red-700"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">⚠️</span>
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
                <button
                  onClick={onClearError}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <div className="md:hidden absolute right-4 top-4">
        <motion.button
          className="text-white p-2"
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      </div>
    </nav>
  );
};

export default EnhancedNavbar;
