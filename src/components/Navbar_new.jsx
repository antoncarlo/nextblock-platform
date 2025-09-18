import { useState } from 'react'
import { motion } from 'framer-motion'

const Navbar = ({ isConnected, account, onConnect, isConnecting }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/nextblock-logo-icon.png" 
                alt="NextBlock" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">
                NEXTBLOCK
              </span>
            </div>
          </motion.div>

          {/* Connect Wallet Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConnect}
            disabled={isConnecting}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : isConnected ? (
              formatAddress(account)
            ) : (
              'Connect Wallet'
            )}
          </motion.button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

