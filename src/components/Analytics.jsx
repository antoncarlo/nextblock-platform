import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  DollarSign, 
  Globe, 
  BarChart3,
  Users,
  Shield,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  PieChart,
  LineChart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts'

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('1Y')

  // Mock global market data
  const marketStats = {
    totalMarketSize: 16000000000000, // $16T
    tokenizedValue: 124000000000, // $124B
    totalPortfolios: 1247,
    activeInvestors: 8934,
    averageYield: 14.2,
    totalTransactions: 45678,
    monthlyGrowth: 23.5,
    liquidityRatio: 0.85
  }

  // Market performance data
  const marketPerformance = [
    { month: 'Jan 2024', value: 100, volume: 2.1 },
    { month: 'Feb 2024', value: 105, volume: 2.3 },
    { month: 'Mar 2024', value: 112, volume: 2.8 },
    { month: 'Apr 2024', value: 108, volume: 2.5 },
    { month: 'May 2024', value: 118, volume: 3.2 },
    { month: 'Jun 2024', value: 125, volume: 3.8 },
    { month: 'Jul 2024', value: 132, volume: 4.1 },
    { month: 'Aug 2024', value: 128, volume: 3.9 },
    { month: 'Sep 2024', value: 135, volume: 4.5 },
    { month: 'Oct 2024', value: 142, volume: 4.8 },
    { month: 'Nov 2024', value: 138, volume: 4.6 },
    { month: 'Dec 2024', value: 145, volume: 5.2 }
  ]

  // Portfolio type distribution
  const portfolioTypes = [
    { name: 'Property & Casualty', value: 45, color: '#3B82F6', count: 561 },
    { name: 'Life Insurance', value: 30, color: '#8B5CF6', count: 374 },
    { name: 'Health Insurance', value: 15, color: '#10B981', count: 187 },
    { name: 'Catastrophic Risks', value: 10, color: '#EF4444', count: 125 }
  ]

  // Geographic distribution
  const geographicData = [
    { region: 'North America', value: 40, growth: 18.5 },
    { region: 'Europe', value: 35, growth: 22.1 },
    { region: 'Asia Pacific', value: 20, growth: 31.2 },
    { region: 'Others', value: 5, growth: 15.8 }
  ]

  // Risk vs Yield analysis
  const riskYieldData = [
    { risk: 1, yield: 5.2, portfolios: 45 },
    { risk: 2, yield: 7.1, portfolios: 78 },
    { risk: 3, yield: 9.3, portfolios: 156 },
    { risk: 4, yield: 11.8, portfolios: 234 },
    { risk: 5, yield: 14.2, portfolios: 298 },
    { risk: 6, yield: 16.9, portfolios: 187 },
    { risk: 7, yield: 19.5, portfolios: 134 },
    { risk: 8, yield: 22.8, portfolios: 89 },
    { risk: 9, yield: 26.4, portfolios: 56 },
    { risk: 10, yield: 31.2, portfolios: 23 }
  ]

  // Top performing portfolios
  const topPortfolios = [
    {
      name: "European Catastrophic Pool",
      company: "European Insurance Group",
      yield: 28.5,
      volume: 45000000,
      change: 12.3,
      type: "CATASTROFALI"
    },
    {
      name: "Asian Property Bundle",
      company: "Asia Pacific Insurance",
      yield: 24.7,
      volume: 32000000,
      change: 8.9,
      type: "DANNI"
    },
    {
      name: "US Health Insurance Pool",
      company: "American Health Corp",
      yield: 22.1,
      volume: 67000000,
      change: 15.6,
      type: "SALUTE"
    },
    {
      name: "Global Life Portfolio",
      company: "Global Life Insurance",
      yield: 19.8,
      volume: 89000000,
      change: 6.7,
      type: "VITA"
    }
  ]

  const formatCurrency = (amount) => {
    if (amount >= 1e12) {
      return `$${(amount / 1e12).toFixed(1)}T`
    } else if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(1)}B`
    } else if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(1)}M`
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'DANNI': return 'bg-blue-600'
      case 'VITA': return 'bg-purple-600'
      case 'CATASTROFALI': return 'bg-red-600'
      case 'SALUTE': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Global Insurance Tokenization Analytics
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Real-time insights into the tokenized insurance market. Track performance, 
              analyze trends, and discover opportunities in the $16 trillion insurance sector.
            </p>
          </div>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Market Size</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(marketStats.totalMarketSize)}</p>
                </div>
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Global insurance market
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Tokenized Value</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(marketStats.tokenizedValue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-xs text-green-400 flex items-center mt-2">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +{marketStats.monthlyGrowth}% this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Portfolios</p>
                  <p className="text-2xl font-bold text-white">{marketStats.totalPortfolios.toLocaleString()}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-xs text-blue-400 mt-2">
                Across {portfolioTypes.length} categories
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Investors</p>
                  <p className="text-2xl font-bold text-white">{marketStats.activeInvestors.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-xs text-green-400 flex items-center mt-2">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +1,234 this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                Market Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
                Performance
              </TabsTrigger>
              <TabsTrigger value="distribution" className="data-[state=active]:bg-blue-600">
                Distribution
              </TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-blue-600">
                Insights
              </TabsTrigger>
            </TabsList>

            {/* Market Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Market Performance Chart */}
                <div className="lg:col-span-2">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Market Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={marketPerformance}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3B82F6" 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Metrics */}
                <div className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Average Yield</span>
                        <span className="text-green-400 font-semibold">{marketStats.averageYield}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Liquidity Ratio</span>
                        <span className="text-blue-400 font-semibold">{(marketStats.liquidityRatio * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Total Transactions</span>
                        <span className="text-white font-semibold">{marketStats.totalTransactions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Monthly Growth</span>
                        <span className="text-green-400 font-semibold flex items-center">
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                          {marketStats.monthlyGrowth}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Market Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Market Active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm">High Volume</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm">On Target Growth</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Top Performing Portfolios */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Portfolios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Portfolio</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Company</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Yield</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Volume</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPortfolios.map((portfolio, index) => (
                          <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                            <td className="py-3 px-4 text-white font-medium">{portfolio.name}</td>
                            <td className="py-3 px-4 text-slate-300">{portfolio.company}</td>
                            <td className="py-3 px-4">
                              <Badge className={getTypeColor(portfolio.type)}>
                                {portfolio.type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-green-400 font-semibold">
                              {portfolio.yield}%
                            </td>
                            <td className="py-3 px-4 text-white">
                              {formatCurrency(portfolio.volume)}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-green-400 font-medium flex items-center">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                {portfolio.change}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Trading Volume */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Trading Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBarChart data={marketPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`${value}B`, 'Volume']}
                        />
                        <Bar dataKey="volume" fill="#3B82F6" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Risk vs Yield Analysis */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Risk vs Yield Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLineChart data={riskYieldData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="risk" stroke="#9CA3AF" label={{ value: 'Risk Rating', position: 'insideBottom', offset: -5 }} />
                        <YAxis stroke="#9CA3AF" label={{ value: 'Yield %', angle: -90, position: 'insideLeft' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                          formatter={(value, name) => [
                            name === 'yield' ? `${value}%` : value,
                            name === 'yield' ? 'Yield' : 'Portfolios'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="yield" 
                          stroke="#10B981" 
                          strokeWidth={3}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Distribution Tab */}
            <TabsContent value="distribution" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Portfolio Type Distribution */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Portfolio Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col lg:flex-row items-center">
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                          <Pie
                            data={portfolioTypes}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {portfolioTypes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 lg:mt-0 lg:ml-6 space-y-3">
                        {portfolioTypes.map((item, index) => (
                          <div key={index} className="flex items-center justify-between min-w-[200px]">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="text-sm text-slate-300">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-white font-medium">{item.value}%</div>
                              <div className="text-xs text-slate-400">{item.count} portfolios</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Geographic Distribution */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {geographicData.map((region, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">{region.region}</span>
                            <div className="text-right">
                              <span className="text-white font-semibold">{region.value}%</span>
                              <span className="text-green-400 text-sm ml-2">+{region.growth}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${region.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Market Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-700">
                      <h4 className="text-blue-400 font-semibold mb-2">Growth Opportunity</h4>
                      <p className="text-slate-300 text-sm">
                        Catastrophic risk portfolios show 31% higher yields but represent only 10% of the market, 
                        indicating significant growth potential.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-900/20 border border-green-700">
                      <h4 className="text-green-400 font-semibold mb-2">Market Stability</h4>
                      <p className="text-slate-300 text-sm">
                        Life insurance portfolios maintain consistent 12-15% yields with low volatility, 
                        making them ideal for conservative investors.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-700">
                      <h4 className="text-purple-400 font-semibold mb-2">Regional Trends</h4>
                      <p className="text-slate-300 text-sm">
                        Asia Pacific shows the highest growth rate at 31.2%, driven by emerging market 
                        insurance penetration and digital adoption.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Market Predictions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-700">
                      <h4 className="text-yellow-400 font-semibold mb-2">2025 Outlook</h4>
                      <p className="text-slate-300 text-sm">
                        Expected 40% growth in tokenized insurance value, reaching $174B by end of 2025, 
                        driven by institutional adoption.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-900/20 border border-red-700">
                      <h4 className="text-red-400 font-semibold mb-2">Risk Factors</h4>
                      <p className="text-slate-300 text-sm">
                        Regulatory changes and climate events may impact catastrophic risk portfolios. 
                        Diversification across regions recommended.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-cyan-900/20 border border-cyan-700">
                      <h4 className="text-cyan-400 font-semibold mb-2">Technology Impact</h4>
                      <p className="text-slate-300 text-sm">
                        HyperLiquid integration reduces transaction costs by 85% and settlement time 
                        to under 1 second, improving market efficiency.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics

