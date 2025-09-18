import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Search, 
  Filter,
  ShoppingCart,
  Eye,
  Star,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const InvestorDashboard = () => {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [selectedToken, setSelectedToken] = useState(null)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('yield')
  const [showInvestModal, setShowInvestModal] = useState(false)
  const [investmentStep, setInvestmentStep] = useState(1)
  const [portfolio, setPortfolio] = useState([])
  const [totalInvested, setTotalInvested] = useState(0)
  const [totalReturns, setTotalReturns] = useState(0)

  // Load tokens from localStorage (created by insurance companies)
  const [availableTokens, setAvailableTokens] = useState([])

  // Load marketplace tokens on mount
  useEffect(() => {
    const loadTokens = () => {
      const savedTokens = localStorage.getItem('nextblock_marketplace_tokens')
      if (savedTokens) {
        setAvailableTokens(JSON.parse(savedTokens))
      } else {
        // Default tokens if none exist
        setAvailableTokens([
          {
            id: 'NBIP-001',
            name: 'European Property Portfolio 2025',
            type: 'Property & Casualty',
            price: 15.12,
            yield: 8.5,
            riskScore: 7.2,
            rating: 'A-',
            available: 750000,
            marketCap: 15120000,
            volume24h: 125000,
            change24h: 0.8,
            issuer: 'Allianz Europe',
            description: 'Diversified European property insurance portfolio covering residential and commercial properties across Germany, France, Italy, and Spain.',
            geography: ['Germany', 'France', 'Italy', 'Spain'],
            minInvestment: 15,
            featured: true
          },
          {
            id: 'NBIP-002',
            name: 'US Auto Insurance Bundle',
            type: 'Auto Insurance',
            price: 25.80,
            yield: 9.2,
            riskScore: 6.8,
            rating: 'A',
            available: 500000,
            marketCap: 12900000,
            volume24h: 89000,
            change24h: -0.3,
            issuer: 'State Farm',
            description: 'Comprehensive US auto insurance portfolio with focus on safe driver demographics and advanced telematics.',
            geography: ['United States'],
            minInvestment: 25,
            featured: false
          }
        ])
      }
    }

    loadTokens()
    
    // Refresh tokens every 5 seconds to show new portfolios created by insurance companies
    const interval = setInterval(loadTokens, 5000)
    return () => clearInterval(interval)
  }, [])

  // Filter and sort tokens
  const filteredTokens = availableTokens
    .filter(token => {
      const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           token.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === 'all' || token.type === filterType
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
        case 'volume':
          return b.volume24h - a.volume24h
        default:
          return 0
      }
    })

  // Investment process
  const handleInvest = (token) => {
    setSelectedToken(token)
    setShowInvestModal(true)
    setInvestmentStep(1)
  }

  const processInvestment = () => {
    if (investmentStep < 4) {
      setInvestmentStep(investmentStep + 1)
    } else {
      // Complete investment
      const tokensToAdd = Math.floor(parseFloat(investmentAmount) / selectedToken.price)
      const newInvestment = {
        id: selectedToken.id,
        name: selectedToken.name,
        tokens: tokensToAdd,
        investedAmount: parseFloat(investmentAmount),
        currentValue: tokensToAdd * selectedToken.price,
        yield: selectedToken.yield,
        purchaseDate: new Date().toISOString(),
        performance: 0
      }
      
      setPortfolio([...portfolio, newInvestment])
      setTotalInvested(totalInvested + parseFloat(investmentAmount))
      setShowInvestModal(false)
      setInvestmentAmount('')
      setInvestmentStep(1)
    }
  }

  // Calculate portfolio stats
  useEffect(() => {
    const currentValue = portfolio.reduce((sum, inv) => sum + inv.currentValue, 0)
    setTotalReturns(currentValue - totalInvested)
  }, [portfolio, totalInvested])

  const portfolioStats = {
    totalValue: portfolio.reduce((sum, inv) => sum + inv.currentValue, 0),
    totalReturn: totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0,
    activePositions: portfolio.length,
    monthlyYield: portfolio.reduce((sum, inv) => sum + (inv.currentValue * inv.yield / 100 / 12), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img 
                src="/nextblock_logo_full_text_variant2(1).png" 
                alt="NextBlock" 
                className="h-8"
              />
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-3xl font-bold text-gray-900">
                Investor Dashboard
              </h1>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <span>Home</span>
            </button>
          </div>
          <p className="text-gray-600">
            Investi in portafogli assicurativi tokenizzati e diversifica il tuo portfolio
          </p>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${portfolioStats.totalValue.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total Return</span>
            </div>
            <div className={`text-2xl font-bold ${portfolioStats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioStats.totalReturn >= 0 ? '+' : ''}{portfolioStats.totalReturn.toFixed(1)}%
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Positions</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {portfolioStats.activePositions}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Monthly Yield</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${portfolioStats.monthlyYield.toFixed(0)}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8">
          {[
            { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
            { id: 'portfolio', label: 'My Portfolio', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tokens or issuers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="Property & Casualty">Property & Casualty</option>
                  <option value="Auto Insurance">Auto Insurance</option>
                  <option value="Life Insurance">Life Insurance</option>
                  <option value="Marine Insurance">Marine Insurance</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="yield">Sort by Yield</option>
                  <option value="price">Sort by Price</option>
                  <option value="risk">Sort by Risk</option>
                  <option value="volume">Sort by Volume</option>
                </select>
              </div>
            </div>

            {/* Token Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map((token) => (
                <motion.div
                  key={token.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Token Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">{token.id}</span>
                        {token.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        {token.name}
                      </h3>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {token.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        ${token.price}
                      </div>
                      <div className={`text-sm flex items-center ${
                        token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {token.change24h >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(token.change24h)}%
                      </div>
                    </div>
                  </div>

                  {/* Token Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Yield</div>
                      <div className="text-lg font-semibold text-green-600">
                        {token.yield}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Risk Score</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {token.riskScore}/10
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Rating</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {token.rating}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Volume 24h</div>
                      <div className="text-sm font-medium text-gray-900">
                        ${token.volume24h.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Issuer */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Issuer</div>
                    <div className="text-sm font-medium text-gray-900">
                      {token.issuer}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInvest(token)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Invest</span>
                    </button>
                    <button
                      onClick={() => setSelectedToken(token)}
                      className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {portfolio.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Investments Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start investing in tokenized insurance portfolios to build your diversified portfolio.
                </p>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {portfolio.map((investment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {investment.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {investment.tokens} tokens • {investment.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${investment.currentValue.toLocaleString()}
                        </div>
                        <div className={`text-sm ${
                          investment.performance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {investment.performance >= 0 ? '+' : ''}{investment.performance.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Invested</div>
                        <div className="font-medium">${investment.investedAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Yield</div>
                        <div className="font-medium text-green-600">{investment.yield}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Purchase Date</div>
                        <div className="font-medium">
                          {new Date(investment.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Investment Modal */}
        <AnimatePresence>
          {showInvestModal && selectedToken && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Step 1: Investment Amount */}
                {investmentStep === 1 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Invest in {selectedToken.id}
                    </h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Investment Amount (USD)
                      </label>
                      <input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        placeholder={`Min: $${selectedToken.minInvestment}`}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {investmentAmount && (
                        <p className="text-sm text-gray-600 mt-2">
                          You will receive ~{Math.floor(parseFloat(investmentAmount) / selectedToken.price)} tokens
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowInvestModal(false)}
                        className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={processInvestment}
                        disabled={!investmentAmount || parseFloat(investmentAmount) < selectedToken.minInvestment}
                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Review Investment */}
                {investmentStep === 2 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Review Investment
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Token</span>
                        <span className="font-medium">{selectedToken.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-medium">${parseFloat(investmentAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tokens</span>
                        <span className="font-medium">{Math.floor(parseFloat(investmentAmount) / selectedToken.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Yield</span>
                        <span className="font-medium text-green-600">{selectedToken.yield}% APY</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setInvestmentStep(1)}
                        className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={processInvestment}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Processing */}
                {investmentStep === 3 && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Processing Investment
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Please wait while we process your investment...
                    </p>
                    <button
                      onClick={processInvestment}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* Step 4: Success */}
                {investmentStep === 4 && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Investment Successful!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You have successfully invested ${parseFloat(investmentAmount).toLocaleString()} in {selectedToken.id}
                    </p>
                    <button
                      onClick={processInvestment}
                      className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default InvestorDashboard

