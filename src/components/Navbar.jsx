import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Wallet, LogOut, Home, Network } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

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
  const { t } = useTranslation()
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src="/nextblock-logo.svg" 
              alt="NextBlock Logo" 
              className="h-10 w-auto"
            />
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Home Button - Show only when not on homepage */}
            {!isHomePage && (
              <motion.button
                whileHover={{ 
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-slate-400 hover:text-slate-100 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-slate-800"
              >
                <Home className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Home</span>
              </motion.button>
            )}

            {/* Analytics Button */}
            <motion.button
              whileHover={{ 
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/analytics')}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200"
            >
              Analytics
            </motion.button>

            {/* Connectivity Test Button */}
            {onShowConnectivityTest && (
              <motion.button
                whileHover={{ 
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onShowConnectivityTest}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 flex items-center space-x-1"
              >
                <Network className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Test</span>
              </motion.button>
            )}

            {/* Network Indicator */}
            {isConnected && chainId && (
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getNetworkColor(chainId)}`}></div>
                <span className="text-sm text-slate-400 hidden sm:inline">
                  {networkName}
                </span>
              </div>
            )}

            {/* Network Switch Buttons */}
            {isConnected && (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ 
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSwitchToEthereum}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                    chainId === 1 || chainId === 11155111
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  ETH
                </motion.button>
                <motion.button
                  whileHover={{ 
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSwitchToHyperLiquid}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                    chainId === 998 || chainId === 999
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  HL
                </motion.button>
              </div>
            )}

            {/* Language Selector */}
            <LanguageSelector />

            {/* Wallet Connection */}
            {!isConnected ? (
              <motion.button
                whileHover={{ 
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onConnect}
                disabled={isConnecting}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet className="w-4 h-4" strokeWidth={1.5} />
                <span>{isConnecting ? 'Connessione...' : 'Connetti Wallet'}</span>
              </motion.button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-100">
                    {formatAddress(account)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ 
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDisconnect}
                  className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-800"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-2 rounded-lg text-sm flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              onClick={onClearError}
              className="text-red-400 hover:text-red-300 ml-2 transition-colors duration-200"
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
