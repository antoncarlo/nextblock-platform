import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Copy,
  ExternalLink,
  Zap,
  Shield,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const PortfolioManager = ({ 
  isConnected, 
  walletAddress, 
  chainId, 
  networkName,
  onSwitchNetwork 
}) => {
  const [balances, setBalances] = useState({})
  const [loading, setLoading] = useState(false)
  const [showBalances, setShowBalances] = useState(true)
  const [totalValue, setTotalValue] = useState(0)
  const [priceChanges, setPriceChanges] = useState({})

  // Mock data per demo - in produzione si collegherebbe alle API reali
  const mockBalances = {
    1: { // Ethereum Mainnet
      ETH: { balance: 2.45, price: 2650, change24h: 3.2 },
      USDC: { balance: 15420.50, price: 1.00, change24h: 0.1 },
      USDT: { balance: 8750.25, price: 1.00, change24h: -0.05 },
      WBTC: { balance: 0.125, price: 67500, change24h: 2.8 }
    },
    998: { // HyperLiquid Mainnet
      HYPER: { balance: 1250.75, price: 12.45, change24h: 8.5 },
      USDC: { balance: 5680.30, price: 1.00, change24h: 0.1 },
      ETH: { balance: 0.85, price: 2650, change24h: 3.2 }
    },
    11155111: { // Sepolia Testnet
      ETH: { balance: 5.0, price: 2650, change24h: 3.2 },
      USDC: { balance: 1000.0, price: 1.00, change24h: 0.1 }
    },
    999: { // HyperLiquid Testnet
      HYPER: { balance: 100.0, price: 12.45, change24h: 8.5 },
      USDC: { balance: 500.0, price: 1.00, change24h: 0.1 }
    }
  }

  const networkIcons = {
    1: '🔷', // Ethereum
    998: '⚡', // HyperLiquid
    11155111: '🔶', // Sepolia
    999: '⚡' // HyperLiquid Testnet
  }

  const tokenIcons = {
    ETH: '🔷',
    HYPER: '⚡',
    USDC: '💵',
    USDT: '💰',
    WBTC: '₿'
  }

  useEffect(() => {
    if (isConnected && chainId) {
      fetchBalances()
    }
  }, [isConnected, chainId, walletAddress])

  const fetchBalances = async () => {
    setLoading(true)
    
    // Simula chiamata API
    setTimeout(() => {
      const networkBalances = mockBalances[chainId] || {}
      setBalances(networkBalances)
      
      // Calcola valore totale
      const total = Object.entries(networkBalances).reduce((sum, [token, data]) => {
        return sum + (data.balance * data.price)
      }, 0)
      setTotalValue(total)
      
      setLoading(false)
    }, 1500)
  }

  const formatBalance = (balance) => {
    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(2)}M`
    } else if (balance >= 1000) {
      return `${(balance / 1000).toFixed(2)}K`
    }
    return balance.toFixed(4)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    // In produzione, mostrare un toast di conferma
  }

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center"
      >
        <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400">Connect your wallet to view your portfolio and start trading</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Portfolio</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>{networkIcons[chainId]} {networkName}</span>
                <button
                  onClick={copyAddress}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalances(!showBalances)}
              className="text-gray-400 hover:text-white"
            >
              {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchBalances}
              disabled={loading}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Total Value */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {showBalances ? formatPrice(totalValue) : '••••••'}
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+12.5% (24h)</span>
          </div>
        </div>
      </div>

      {/* Network Switcher */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Networks</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 1, name: 'Ethereum', icon: '🔷', color: 'from-blue-500 to-blue-600' },
            { id: 998, name: 'HyperLiquid', icon: '⚡', color: 'from-purple-500 to-purple-600' },
            { id: 11155111, name: 'Sepolia', icon: '🔶', color: 'from-orange-500 to-orange-600' },
            { id: 999, name: 'HL Testnet', icon: '⚡', color: 'from-violet-500 to-violet-600' }
          ].map((network) => (
            <motion.button
              key={network.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSwitchNetwork(network.id)}
              className={`p-3 rounded-xl border transition-all ${
                chainId === network.id
                  ? 'border-white/30 bg-gradient-to-r ' + network.color
                  : 'border-white/10 bg-black/20 hover:border-white/20'
              }`}
            >
              <div className="text-2xl mb-1">{network.icon}</div>
              <div className="text-xs text-white font-medium">{network.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Token Balances */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Assets</h3>
          <div className="text-sm text-gray-400">
            {Object.keys(balances).length} tokens
          </div>
        </div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-black/20 rounded-xl animate-pulse">
                  <div className="w-10 h-10 bg-gray-600 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-600 rounded w-20 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-16" />
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-600 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-16" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {Object.entries(balances).map(([token, data], index) => (
                <motion.div
                  key={token}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-lg">
                    {tokenIcons[token] || '💎'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{token}</span>
                      {token === 'HYPER' && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                          HyperLiquid
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {showBalances ? `${formatBalance(data.balance)} ${token}` : '••••••'}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      {showBalances ? formatPrice(data.balance * data.price) : '••••••'}
                    </div>
                    <div className={`text-sm flex items-center space-x-1 ${
                      data.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {data.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{Math.abs(data.change24h).toFixed(2)}%</span>
                    </div>
                  </div>
                  
                  <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {Object.keys(balances).length === 0 && !loading && (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No assets found on this network</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl text-white font-semibold flex items-center justify-center space-x-2"
        >
          <TrendingUp className="w-5 h-5" />
          <span>Buy Crypto</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl text-white font-semibold flex items-center justify-center space-x-2"
        >
          <Zap className="w-5 h-5" />
          <span>Trade</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-purple-500 to-violet-500 p-4 rounded-xl text-white font-semibold flex items-center justify-center space-x-2"
        >
          <Shield className="w-5 h-5" />
          <span>Stake</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PortfolioManager
