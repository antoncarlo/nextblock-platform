import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Shield,
  Calendar,
  BarChart3,
  Eye,
  Settings,
  Download
} from 'lucide-react'

const Portfolio = ({ account, userRole, onDisconnect }) => {
  const navigate = useNavigate()
  const [portfolioData, setPortfolioData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalValue, setTotalValue] = useState(0)
  const [totalReturn, setTotalReturn] = useState(0)

  useEffect(() => {
    // Mock portfolio data based on user role
    const mockData = userRole === 'insurance' ? [
      {
        id: 1,
        symbol: 'NBIP-001',
        name: 'European Property Portfolio',
        type: 'Property & Casualty',
        tokensOwned: 1000000,
        currentPrice: 10.25,
        purchasePrice: 10.00,
        value: 10250000,
        return: 2.5,
        yield: 8.5,
        status: 'Active',
        lastUpdate: '2025-01-15'
      },
      {
        id: 2,
        symbol: 'NBIP-005',
        name: 'Marine Insurance Pool',
        type: 'Specialty',
        tokensOwned: 500000,
        currentPrice: 22.10,
        purchasePrice: 20.00,
        value: 11050000,
        return: 10.5,
        yield: 11.5,
        status: 'Active',
        lastUpdate: '2025-01-14'
      }
    ] : [
      {
        id: 1,
        symbol: 'NBIP-002',
        name: 'US Life Insurance Bundle',
        type: 'Life Insurance',
        tokensOwned: 1000,
        currentPrice: 25.80,
        purchasePrice: 25.00,
        value: 25800,
        return: 3.2,
        yield: 12.3,
        status: 'Active',
        lastUpdate: '2025-01-15'
      },
      {
        id: 2,
        symbol: 'NBIP-003',
        name: 'Asian Catastrophic Risks',
        type: 'Catastrophic',
        tokensOwned: 500,
        currentPrice: 15.60,
        purchasePrice: 14.50,
        value: 7800,
        return: 7.6,
        yield: 18.7,
        status: 'Active',
        lastUpdate: '2025-01-14'
      },
      {
        id: 3,
        symbol: 'NBIP-004',
        name: 'Global Health Portfolio',
        type: 'Health Insurance',
        tokensOwned: 2000,
        currentPrice: 18.45,
        purchasePrice: 18.00,
        value: 36900,
        return: 2.5,
        yield: 9.2,
        status: 'Active',
        lastUpdate: '2025-01-13'
      }
    ]

    setTimeout(() => {
      setPortfolioData(mockData)
      const total = mockData.reduce((sum, item) => sum + item.value, 0)
      const totalPurchase = mockData.reduce((sum, item) => sum + (item.tokensOwned * item.purchasePrice), 0)
      setTotalValue(total)
      setTotalReturn(((total - totalPurchase) / totalPurchase) * 100)
      setLoading(false)
    }, 1000)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img 
                src="/assets/nextblock-logo-icon.png" 
                alt="NextBlock" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">NEXTBLOCK</span>
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {userRole === 'insurance' ? 'My Portfolios' : 'My Investments'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {formatAddress(account)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Return</p>
                <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                </p>
              </div>
              {totalReturn >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Positions</p>
                <p className="text-2xl font-bold text-gray-900">{portfolioData.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Portfolio Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {userRole === 'insurance' ? 'Tokenized Portfolios' : 'Investment Holdings'}
              </h2>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Holdings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yield
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolioData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.symbol}
                          </div>
                          <div className="text-sm text-gray-500">{item.name}</div>
                          <div className="text-xs text-gray-400">{item.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.tokensOwned.toLocaleString()} tokens
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${item.currentPrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Avg: ${item.purchasePrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.value)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium flex items-center ${
                          item.return >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.return >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {item.return >= 0 ? '+' : ''}{item.return.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-600 font-medium">
                          {item.yield}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/token/${item.id}`)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate('/analytics')}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  Tokenize New Portfolio
                </h3>
                <p className="text-gray-600 text-sm">
                  Create a new tokenized insurance portfolio
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/analytics')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <BarChart3 className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Performance Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  View detailed portfolio performance metrics
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/marketplace')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Market Overview
                </h3>
                <p className="text-gray-600 text-sm">
                  See how your tokens perform in the market
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
                <DollarSign className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Buy More Tokens
                </h3>
                <p className="text-gray-600 text-sm">
                  Explore new investment opportunities
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/analytics')}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <BarChart3 className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Investment Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  Track your investment performance
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <Calendar className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Yield Calendar
                </h3>
                <p className="text-gray-600 text-sm">
                  View upcoming dividend payments
                </p>
              </motion.button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Portfolio

