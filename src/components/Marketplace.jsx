import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  Shield,
  DollarSign,
  Calendar,
  Users,
  Star,
  ShoppingCart,
  Eye,
  BarChart3
} from 'lucide-react'

const Marketplace = ({ account, userRole, onDisconnect }) => {
  const navigate = useNavigate()
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('yield')

  // Mock token data
  useEffect(() => {
    const mockTokens = [
      {
        id: 1,
        symbol: 'NBIP-001',
        name: 'European Property Portfolio',
        type: 'Property & Casualty',
        price: 10.25,
        change24h: 2.5,
        yield: 8.5,
        riskScore: 7.2,
        totalValue: 15000000,
        availableTokens: 750000,
        rating: 'A-',
        issuer: 'Allianz Europe',
        duration: 12,
        icon: '🏠'
      },
      {
        id: 2,
        symbol: 'NBIP-002',
        name: 'US Life Insurance Bundle',
        type: 'Life Insurance',
        price: 25.80,
        change24h: -1.2,
        yield: 12.3,
        riskScore: 6.8,
        totalValue: 25000000,
        availableTokens: 500000,
        rating: 'A+',
        issuer: 'MetLife USA',
        duration: 24,
        icon: '👥'
      },
      {
        id: 3,
        symbol: 'NBIP-003',
        name: 'Asian Catastrophic Risks',
        type: 'Catastrophic',
        price: 15.60,
        change24h: 5.8,
        yield: 18.7,
        riskScore: 8.9,
        totalValue: 8000000,
        availableTokens: 300000,
        rating: 'B+',
        issuer: 'Swiss Re Asia',
        duration: 6,
        icon: '🌪️'
      },
      {
        id: 4,
        symbol: 'NBIP-004',
        name: 'Global Health Portfolio',
        type: 'Health Insurance',
        price: 18.45,
        change24h: 1.8,
        yield: 9.2,
        riskScore: 6.5,
        totalValue: 12000000,
        availableTokens: 650000,
        rating: 'A',
        issuer: 'Axa Global',
        duration: 18,
        icon: '🏥'
      },
      {
        id: 5,
        symbol: 'NBIP-005',
        name: 'Marine Insurance Pool',
        type: 'Specialty',
        price: 22.10,
        change24h: 3.2,
        yield: 11.5,
        riskScore: 7.8,
        totalValue: 6000000,
        availableTokens: 200000,
        rating: 'A-',
        issuer: 'Lloyd\'s London',
        duration: 12,
        icon: '🚢'
      }
    ]

    setTimeout(() => {
      setTokens(mockTokens)
      setLoading(false)
    }, 1000)
  }, [])

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatLargeNumber = (num) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    }
    return `$${num}`
  }

  const filteredTokens = tokens
    .filter(token => {
      const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = selectedFilter === 'all' || token.type.toLowerCase().includes(selectedFilter.toLowerCase())
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'yield':
          return b.yield - a.yield
        case 'price':
          return a.price - b.price
        case 'risk':
          return a.riskScore - b.riskScore
        default:
          return 0
      }
    })

  const handleBuyToken = (token) => {
    // Simulate purchase
    alert(`Purchasing ${token.symbol} tokens. This would integrate with smart contracts in production.`)
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
              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Marketplace
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

      {/* Filters and Search */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="property">Property & Casualty</option>
                <option value="life">Life Insurance</option>
                <option value="health">Health Insurance</option>
                <option value="catastrophic">Catastrophic</option>
                <option value="specialty">Specialty</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="yield">Highest Yield</option>
                <option value="price">Lowest Price</option>
                <option value="risk">Lowest Risk</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Market Cap</p>
                <p className="text-2xl font-bold text-gray-900">$66M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{tokens.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Yield</p>
                <p className="text-2xl font-bold text-green-600">12.0%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">24h Volume</p>
                <p className="text-2xl font-bold text-gray-900">$2.4M</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Token Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTokens.map((token, index) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{token.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{token.symbol}</h3>
                      <p className="text-sm text-gray-600">{token.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(token.price)}
                    </div>
                    <div className={`text-sm flex items-center ${
                      token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {token.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(token.change24h)}%
                    </div>
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-2">{token.name}</h4>
                <p className="text-sm text-gray-600 mb-4">Issued by {token.issuer}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Annual Yield:</span>
                    <span className="font-medium text-green-600">{token.yield}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Risk Score:</span>
                    <span className="font-medium">{token.riskScore}/10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{token.duration} months</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium">{token.availableTokens.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{token.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatLargeNumber(token.totalValue)} total
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBuyToken(token)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buy</span>
                  </button>
                  <button
                    onClick={() => navigate(`/token/${token.id}`)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredTokens.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tokens found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Marketplace

