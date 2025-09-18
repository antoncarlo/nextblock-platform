import { motion } from 'framer-motion'
import { Wallet, LogOut, Home, Network } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({ 
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
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getNetworkColor = (chainId) => {
    switch (chainId) {
      case 1: return 'bg-blue-500'
      case 11155111: return 'bg-yellow-500'
      case 998: return 'bg-purple-500'
      case 999: return 'bg-purple-300'
      default: return 'bg-gray-500'
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                NEXTBLOCK
              </span>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Home Button - Show only when not on homepage */}
            {!isHomePage && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </motion.button>
            )}

            {/* Analytics Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/analytics')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Analytics
            </motion.button>

            {/* Connectivity Test Button */}
            {onShowConnectivityTest && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowConnectivityTest}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-1"
              >
                <Network className="w-4 h-4" />
                <span className="hidden sm:inline">Test</span>
              </motion.button>
            )}

            {/* Network Indicator */}
            {isConnected && chainId && (
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getNetworkColor(chainId)}`}></div>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {networkName}
                </span>
              </div>
            )}

            {/* Network Switch Buttons */}
            {isConnected && (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSwitchToEthereum}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    chainId === 1 || chainId === 11155111
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ETH
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSwitchToHyperLiquid}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    chainId === 998 || chainId === 999
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  HL
                </motion.button>
              </div>
            )}

            {/* Wallet Connection */}
            {!isConnected ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConnect}
                disabled={isConnecting}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-500 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </motion.button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {formatAddress(account)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onDisconnect}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              onClick={onClearError}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ×
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
