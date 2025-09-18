import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  TrendingUp, 
  Wallet, 
  LogOut, 
  BarChart3, 
  Shield,
  Users,
  DollarSign,
  ArrowRight,
  Activity,
  ArrowUpRight
} from 'lucide-react'
import PortfolioManager from './PortfolioManager'

const Dashboard = ({ 
  account, 
  userRole, 
  onDisconnect, 
  onSelectRole,
  isConnected,
  chainId,
  networkName,
  onSwitchNetwork
}) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalValue: 0,
    activeTokens: 0,
    monthlyReturn: 0,
    riskScore: 0
  })

  // Simulate loading stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalValue: userRole === 'insurance' ? 2450000 : 125000,
        activeTokens: userRole === 'insurance' ? 12 : 8,
        monthlyReturn: userRole === 'insurance' ? 8.5 : 12.3,
        riskScore: userRole === 'insurance' ? 7.2 : 6.8
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [userRole])

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Role Selection Component
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          {/* Header */}
          <div className="bg-white rounded-t-xl p-6 border-b">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src="/nextblock-logo.svg" 
                  alt="NextBlock Logo" 
                  className="h-8 w-auto"
                />
              </button>
              <button
                onClick={onDisconnect}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Connected: {formatAddress(account)}</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="bg-white rounded-b-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to NEXTBLOCK
            </h2>
            <p className="text-gray-600 mb-6">
              Choose your role to access the platform
            </p>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectRole('insurance')
                  navigate('/insurance')
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Insurance Company</div>
                    <div className="text-sm opacity-90">Tokenize your risk portfolios</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectRole('investor')
                  navigate('/investor')
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">Investor</div>
                    <div className="text-sm opacity-90">Invest in tokenized insurance risks</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => navigate('/analytics')}
                className="w-full text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View Public Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/nextblock-logo.svg" 
                alt="NextBlock Logo" 
                className="h-8 w-auto"
              />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                {userRole === 'insurance' ? 'Insurance Portal' : 'Investor Dashboard'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {formatAddress(account)}
              </div>
              <button
                onClick={onDisconnect}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeTokens}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Return</p>
                <p className="text-2xl font-bold text-green-600">+{stats.monthlyReturn}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Risk Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.riskScore}/10</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userRole === 'insurance' ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/tokenize')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <Shield className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tokenize Risk Portfolio
                </h3>
                <p className="text-gray-600 text-sm">
                  Convert your insurance portfolios into tradeable tokens
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/portfolio')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <BarChart3 className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manage Portfolio
                </h3>
                <p className="text-gray-600 text-sm">
                  Monitor and manage your tokenized portfolios
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/analytics')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Market Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  View market trends and performance metrics
                </p>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/marketplace')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <Wallet className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Browse Marketplace
                </h3>
                <p className="text-gray-600 text-sm">
                  Discover and invest in tokenized insurance risks
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/portfolio')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <BarChart3 className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  My Investments
                </h3>
                <p className="text-gray-600 text-sm">
                  Track your investment portfolio performance
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/analytics')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Market Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  Analyze market trends and opportunities
                </p>
              </motion.button>
            </>
          )}
        </div>

        {/* Portfolio Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PortfolioManager
            isConnected={isConnected}
            walletAddress={account}
            chainId={chainId}
            networkName={networkName}
            onSwitchNetwork={onSwitchNetwork}
          />
        </motion.div>
      </main>
    </div>
  )
}

export default Dashboard

