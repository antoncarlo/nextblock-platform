import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Euro, 
  PoundSterling,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Globe,
  RefreshCw,
  Settings,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const TreasuryManagement = () => {
  const { t } = useTranslation()
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [selectedCurrency, setSelectedCurrency] = useState('all')
  const [treasuryData, setTreasuryData] = useState({
    totalAUM: 0,
    portfolios: [],
    performance: [],
    allocations: [],
    transactions: []
  })
  const [isLoading, setIsLoading] = useState(true)

  // Currency configurations
  const currencies = [
    { code: 'EUR', symbol: '€', icon: Euro, name: 'Euro', color: '#3B82F6' },
    { code: 'USD', symbol: '$', icon: DollarSign, name: 'US Dollar', color: '#10B981' },
    { code: 'GBP', symbol: '£', icon: PoundSterling, name: 'British Pound', color: '#8B5CF6' },
    { code: 'USDC', symbol: 'USDC', icon: DollarSign, name: 'USD Coin', color: '#F59E0B' }
  ]

  // Simulate treasury data loading
  useEffect(() => {
    const fetchTreasuryData = async () => {
      setIsLoading(true)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockData = {
        totalAUM: 47500000, // €47.5M
        portfolios: [
          {
            id: 'portfolio-alpha',
            name: 'Insurance Portfolio Alpha',
            totalValue: 25000000,
            currency: 'EUR',
            performance24h: 2.3,
            performance7d: 8.7,
            performance30d: 15.2,
            allocation: 52.6,
            riskLevel: 'medium',
            status: 'active'
          },
          {
            id: 'portfolio-beta',
            name: 'Reinsurance Portfolio Beta',
            totalValue: 15000000,
            currency: 'USD',
            performance24h: -0.8,
            performance7d: 5.4,
            performance30d: 12.1,
            allocation: 31.6,
            riskLevel: 'low',
            status: 'active'
          },
          {
            id: 'liquidity-pool',
            name: 'Liquidity Reserve Pool',
            totalValue: 7500000,
            currency: 'USDC',
            performance24h: 0.1,
            performance7d: 0.7,
            performance30d: 2.8,
            allocation: 15.8,
            riskLevel: 'very_low',
            status: 'active'
          }
        ],
        performance: [
          { date: '2025-09-13', value: 45200000, eur: 25000000, usd: 13500000, gbp: 0, usdc: 6700000 },
          { date: '2025-09-14', value: 45800000, eur: 25200000, usd: 13800000, gbp: 0, usdc: 6800000 },
          { date: '2025-09-15', value: 46100000, eur: 25300000, usd: 14000000, gbp: 0, usdc: 6800000 },
          { date: '2025-09-16', value: 46800000, eur: 25600000, usd: 14200000, gbp: 0, usdc: 7000000 },
          { date: '2025-09-17', value: 47200000, eur: 25800000, usd: 14300000, gbp: 0, usdc: 7100000 },
          { date: '2025-09-18', value: 47100000, eur: 25700000, usd: 14300000, gbp: 0, usdc: 7100000 },
          { date: '2025-09-19', value: 47500000, eur: 25000000, usd: 15000000, gbp: 0, usdc: 7500000 }
        ],
        allocations: [
          { name: 'Insurance Portfolios', value: 40000000, percentage: 84.2, color: '#3B82F6' },
          { name: 'Liquidity Reserves', value: 7500000, percentage: 15.8, color: '#10B981' }
        ],
        transactions: [
          {
            id: 'tx-001',
            type: 'deposit',
            amount: 2000000,
            currency: 'EUR',
            portfolio: 'portfolio-alpha',
            timestamp: '2025-09-19T08:30:00Z',
            status: 'completed',
            source: 'Circle Mint'
          },
          {
            id: 'tx-002',
            type: 'rebalance',
            amount: 1500000,
            currency: 'USD',
            portfolio: 'portfolio-beta',
            timestamp: '2025-09-19T07:15:00Z',
            status: 'completed',
            source: 'Internal Transfer'
          },
          {
            id: 'tx-003',
            type: 'withdrawal',
            amount: 500000,
            currency: 'USDC',
            portfolio: 'liquidity-pool',
            timestamp: '2025-09-18T16:45:00Z',
            status: 'completed',
            source: 'Client Redemption'
          }
        ]
      }
      
      setTreasuryData(mockData)
      setIsLoading(false)
    }

    fetchTreasuryData()
  }, [selectedTimeframe])

  const getPerformanceColor = (performance) => {
    if (performance > 0) return 'text-green-400'
    if (performance < 0) return 'text-red-400'
    return 'text-slate-400'
  }

  const getPerformanceIcon = (performance) => {
    if (performance > 0) return ArrowUpRight
    if (performance < 0) return ArrowDownRight
    return null
  }

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'very_low': return 'text-green-300'
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'very_high': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const formatCurrency = (amount, currency) => {
    const currencyConfig = currencies.find(c => c.code === currency)
    if (currency === 'USDC') {
      return `${amount.toLocaleString()} USDC`
    }
    return `${currencyConfig?.symbol || ''}${amount.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">{t('treasury.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('treasury.title')}
              </h1>
              <p className="text-xl text-slate-300">
                {t('treasury.subtitle')}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors">
                <RefreshCw className="w-5 h-5 text-slate-400" />
              </button>
              <button className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
              <button className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                <Download className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 grid md:grid-cols-4 gap-6"
          >
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-8 h-8 text-blue-400" />
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                €{treasuryData.totalAUM.toLocaleString()}
              </div>
              <div className="text-sm text-blue-300">
                {t('treasury.metrics.totalAUM')}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-green-400" />
                <span className="text-sm text-green-400">+8.7%</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                €3.8M
              </div>
              <div className="text-sm text-slate-300">
                {t('treasury.metrics.weeklyReturn')}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <Globe className="w-8 h-8 text-purple-400" />
                <span className="text-sm text-slate-400">3 currencies</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                Multi-Currency
              </div>
              <div className="text-sm text-slate-300">
                {t('treasury.metrics.diversification')}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <span className="text-sm text-green-400">98.5%</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                Compliant
              </div>
              <div className="text-sm text-slate-300">
                {t('treasury.metrics.complianceScore')}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {t('treasury.performance.title')}
                  </h2>
                  <div className="flex gap-2">
                    {['24h', '7d', '30d', '90d'].map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => setSelectedTimeframe(timeframe)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          selectedTimeframe === timeframe
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={treasuryData.performance}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickFormatter={(value) => `€${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F8FAFC'
                        }}
                        formatter={(value) => [`€${value.toLocaleString()}`, 'Total Value']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Portfolio Allocation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  {t('treasury.allocation.title')}
                </h2>

                <div className="h-48 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={treasuryData.allocations}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {treasuryData.allocations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F8FAFC'
                        }}
                        formatter={(value) => [`€${value.toLocaleString()}`, 'Value']}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {treasuryData.allocations.map((allocation, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: allocation.color }}
                        />
                        <span className="text-sm text-slate-300">{allocation.name}</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {allocation.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency Breakdown */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t('treasury.currencies.title')}
                </h3>
                
                <div className="space-y-3">
                  {currencies.filter(c => c.code !== 'GBP').map((currency) => {
                    const IconComponent = currency.icon
                    const latestData = treasuryData.performance[treasuryData.performance.length - 1]
                    const amount = latestData[currency.code.toLowerCase()] || 0
                    const percentage = (amount / treasuryData.totalAUM * 100).toFixed(1)
                    
                    return (
                      <div key={currency.code} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-white">{currency.code}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-white">
                            {formatCurrency(amount, currency.code)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Portfolio Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              {t('treasury.portfolios.title')}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {treasuryData.portfolios.map((portfolio) => {
                const PerformanceIcon = getPerformanceIcon(portfolio.performance24h)
                
                return (
                  <div
                    key={portfolio.id}
                    className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {portfolio.name}
                        </h3>
                        <div className="text-sm text-slate-400">
                          Risk: <span className={getRiskLevelColor(portfolio.riskLevel)}>
                            {portfolio.riskLevel.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        portfolio.status === 'active' 
                          ? 'bg-green-900/20 text-green-400' 
                          : 'bg-slate-900/20 text-slate-400'
                      }`}>
                        {portfolio.status}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-white mb-1">
                        {formatCurrency(portfolio.totalValue, portfolio.currency)}
                      </div>
                      <div className="text-sm text-slate-400">
                        {portfolio.allocation}% of total AUM
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className={`flex items-center justify-center gap-1 text-sm ${getPerformanceColor(portfolio.performance24h)}`}>
                          {PerformanceIcon && <PerformanceIcon className="w-3 h-3" />}
                          {portfolio.performance24h > 0 ? '+' : ''}{portfolio.performance24h}%
                        </div>
                        <div className="text-xs text-slate-400">24h</div>
                      </div>
                      <div>
                        <div className={`text-sm ${getPerformanceColor(portfolio.performance7d)}`}>
                          {portfolio.performance7d > 0 ? '+' : ''}{portfolio.performance7d}%
                        </div>
                        <div className="text-xs text-slate-400">7d</div>
                      </div>
                      <div>
                        <div className={`text-sm ${getPerformanceColor(portfolio.performance30d)}`}>
                          {portfolio.performance30d > 0 ? '+' : ''}{portfolio.performance30d}%
                        </div>
                        <div className="text-xs text-slate-400">30d</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              {t('treasury.transactions.title')}
            </h2>

            <div className="space-y-4">
              {treasuryData.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-400' :
                      transaction.type === 'withdrawal' ? 'bg-red-400' :
                      'bg-blue-400'
                    }`} />
                    <div>
                      <div className="font-medium text-white capitalize">
                        {transaction.type}
                      </div>
                      <div className="text-sm text-slate-400">
                        {transaction.source} • {new Date(transaction.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                    <div className="text-sm text-green-400">
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default TreasuryManagement
