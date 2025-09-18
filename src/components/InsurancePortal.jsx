import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Upload, 
  FileText, 
  Shield, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  Settings,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  MapPin,
  Award,
  Zap
} from 'lucide-react'

const InsurancePortal = ({ account }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)
  
  const [portfolioForm, setPortfolioForm] = useState({
    name: '',
    type: '',
    totalValue: '',
    expectedYield: '',
    riskRating: '',
    description: '',
    geography: [],
    duration: '',
    documents: []
  })

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [createdPortfolios, setCreatedPortfolios] = useState([])
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Allianz Europe',
    email: 'contact@allianz-europe.com',
    phone: '+39 02 1234 5678',
    address: 'Via Milano 123, 20121 Milano, Italy',
    notifications: true,
    autoApproval: false,
    riskThreshold: 7.5
  })

  // Load portfolios from localStorage on mount
  useEffect(() => {
    const savedPortfolios = localStorage.getItem('nextblock_portfolios')
    if (savedPortfolios) {
      setCreatedPortfolios(JSON.parse(savedPortfolios))
    }
  }, [])

  // Save portfolios to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nextblock_portfolios', JSON.stringify(createdPortfolios))
    
    // Also update the global marketplace tokens
    const marketplaceTokens = createdPortfolios.map(portfolio => ({
      id: `NBIP-${portfolio.id.toString().padStart(3, '0')}`,
      name: portfolio.name,
      type: portfolio.type,
      price: parseFloat(portfolio.totalValue) / 1000000,
      yield: parseFloat(portfolio.expectedYield),
      riskScore: parseFloat(portfolio.riskRating),
      rating: getRatingFromScore(parseFloat(portfolio.riskRating)),
      available: 1000000,
      marketCap: parseFloat(portfolio.totalValue),
      volume24h: Math.floor(Math.random() * 200000) + 50000,
      change24h: (Math.random() - 0.5) * 4,
      issuer: companySettings.companyName,
      description: portfolio.description,
      geography: portfolio.geography,
      minInvestment: Math.max(15, Math.floor(parseFloat(portfolio.totalValue) / 1000000)),
      featured: Math.random() > 0.5,
      createdAt: portfolio.createdAt
    }))
    
    localStorage.setItem('nextblock_marketplace_tokens', JSON.stringify(marketplaceTokens))
  }, [createdPortfolios, companySettings.companyName])

  const getRatingFromScore = (score) => {
    if (score >= 8.5) return 'A+'
    if (score >= 7.5) return 'A'
    if (score >= 6.5) return 'A-'
    if (score >= 5.5) return 'BBB+'
    return 'BBB'
  }

  // Mock data for insurance company
  const companyData = {
    totalPortfolios: createdPortfolios.length,
    totalValue: createdPortfolios.reduce((sum, p) => sum + parseFloat(p.totalValue || 0), 0),
    avgYield: createdPortfolios.length > 0 
      ? createdPortfolios.reduce((sum, p) => sum + parseFloat(p.expectedYield || 0), 0) / createdPortfolios.length 
      : 0,
    activeTokens: createdPortfolios.filter(p => p.status === 'active').length,
    pendingApprovals: createdPortfolios.filter(p => p.status === 'pending').length,
    monthlyRevenue: 125000,
    totalInvestors: 1247,
    riskScore: 7.2
  }

  const riskTypes = [
    'Property & Casualty',
    'Auto Insurance', 
    'Life Insurance',
    'Health Insurance',
    'Marine Insurance',
    'Aviation Insurance',
    'Cyber Insurance',
    'Professional Liability'
  ]

  const geographyOptions = [
    'Italy', 'Spain', 'Germany', 'France', 'United Kingdom',
    'United States', 'Canada', 'Japan', 'Singapore', 'Australia'
  ]

  const handleInputChange = (field, value) => {
    setPortfolioForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGeographyChange = (country) => {
    setPortfolioForm(prev => ({
      ...prev,
      geography: prev.geography.includes(country)
        ? prev.geography.filter(c => c !== country)
        : [...prev.geography, country]
    }))
  }

  const handleCreatePortfolio = () => {
    if (!portfolioForm.name || !portfolioForm.type || !portfolioForm.totalValue) {
      alert('Please fill in all required fields')
      return
    }

    const newPortfolio = {
      ...portfolioForm,
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString(),
      tokenSymbol: `NBIP-${String(Date.now()).slice(-3)}`,
      contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
      investors: Math.floor(Math.random() * 50) + 10,
      totalInvested: Math.floor(parseFloat(portfolioForm.totalValue) * (Math.random() * 0.3 + 0.1))
    }

    setCreatedPortfolios(prev => [...prev, newPortfolio])
    setPortfolioForm({
      name: '',
      type: '',
      totalValue: '',
      expectedYield: '',
      riskRating: '',
      description: '',
      geography: [],
      duration: '',
      documents: []
    })
    setIsCreateModalOpen(false)
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      type: file.type,
      uploadedAt: new Date().toISOString(),
      portfolioId: selectedPortfolio?.id
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleDeletePortfolio = (portfolioId) => {
    if (confirm('Are you sure you want to delete this portfolio?')) {
      setCreatedPortfolios(prev => prev.filter(p => p.id !== portfolioId))
    }
  }

  const getPortfolioAnalytics = (portfolio) => {
    return {
      totalInvestors: portfolio.investors || 0,
      totalInvested: portfolio.totalInvested || 0,
      avgInvestment: portfolio.totalInvested / (portfolio.investors || 1),
      performanceScore: (Math.random() * 2 + 7).toFixed(1),
      monthlyGrowth: (Math.random() * 10 + 5).toFixed(1),
      riskAdjustedReturn: (parseFloat(portfolio.expectedYield) * 0.85).toFixed(1)
    }
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
                Insurance Portal
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
            Manage your insurance portfolios and tokenization process
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total Portfolios</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {companyData.totalPortfolios}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${companyData.totalValue.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Avg Yield</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {companyData.avgYield.toFixed(1)}%
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Active Tokens</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {companyData.activeTokens}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border-slate-700 backdrop-blur-sm rounded-xl border py-6 shadow-sm mb-8"
        >
          <div className="px-6 mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
          </div>
          <div className="flex flex-col gap-6 px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Portfolio</span>
              </button>
              
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-white/20"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Documents</span>
              </button>
              
              <button
                onClick={() => setIsAnalyticsModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-white/20"
              >
                <BarChart3 className="w-5 h-5" />
                <span>View Analytics</span>
              </button>
              
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-white/20"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Portfolios List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Your Portfolios</h3>
          </div>
          
          {createdPortfolios.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Portfolios Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first insurance portfolio to start tokenizing your risk assets.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
              >
                Create Portfolio
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {createdPortfolios.map((portfolio) => (
                  <motion.div
                    key={portfolio.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {portfolio.name}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Shield className="w-4 h-4" />
                            <span>{portfolio.type}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(portfolio.createdAt).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>{getRatingFromScore(parseFloat(portfolio.riskRating))}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          portfolio.status === 'active' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {portfolio.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedPortfolio(portfolio)
                            setIsAnalyticsModalOpen(true)
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePortfolio(portfolio.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Total Value</div>
                        <div className="font-semibold text-gray-900">
                          ${parseFloat(portfolio.totalValue).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Expected Yield</div>
                        <div className="font-semibold text-green-600">
                          {portfolio.expectedYield}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Investors</div>
                        <div className="font-semibold text-gray-900">
                          {portfolio.investors || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Token Symbol</div>
                        <div className="font-semibold text-blue-600">
                          {portfolio.tokenSymbol}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      {portfolio.description}
                    </div>
                    
                    {portfolio.geography && portfolio.geography.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {portfolio.geography.map(country => (
                            <span key={country} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Create Portfolio Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
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
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Create New Portfolio
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Name *
                      </label>
                      <input
                        type="text"
                        value={portfolioForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., European Property Portfolio 2025"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Risk Type *
                      </label>
                      <select
                        value={portfolioForm.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select risk type</option>
                        {riskTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Value (USD) *
                      </label>
                      <input
                        type="number"
                        value={portfolioForm.totalValue}
                        onChange={(e) => handleInputChange('totalValue', e.target.value)}
                        placeholder="15000000"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Yield (%) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={portfolioForm.expectedYield}
                        onChange={(e) => handleInputChange('expectedYield', e.target.value)}
                        placeholder="8.5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Risk Rating (1-10) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        value={portfolioForm.riskRating}
                        onChange={(e) => handleInputChange('riskRating', e.target.value)}
                        placeholder="7.2"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (months)
                      </label>
                      <input
                        type="number"
                        value={portfolioForm.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        placeholder="12"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Geographic Coverage
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {geographyOptions.map(country => (
                        <label key={country} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={portfolioForm.geography.includes(country)}
                            onChange={() => handleGeographyChange(country)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{country}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={portfolioForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      placeholder="Describe your portfolio, coverage details, and key characteristics..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePortfolio}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Create Portfolio
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Documents Modal */}
        <AnimatePresence>
          {isUploadModalOpen && (
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
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Upload Documents
                </h3>
                
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Upload Portfolio Documents
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Drag and drop files here or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="document-upload"
                      accept=".pdf,.doc,.docx,.xlsx,.xls"
                    />
                    <label
                      htmlFor="document-upload"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl font-medium cursor-pointer transition-colors"
                    >
                      Choose Files
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Uploaded Files</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                              <div className="font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.size}</div>
                            </div>
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            Verified
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analytics Modal */}
        <AnimatePresence>
          {isAnalyticsModalOpen && (
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
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Portfolio Analytics
                  {selectedPortfolio && (
                    <span className="text-lg font-normal text-gray-600 ml-2">
                      - {selectedPortfolio.name}
                    </span>
                  )}
                </h3>
                
                {selectedPortfolio ? (
                  <div className="space-y-6">
                    {(() => {
                      const analytics = getPortfolioAnalytics(selectedPortfolio)
                      return (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                              <div className="flex items-center justify-between mb-4">
                                <Users className="w-8 h-8" />
                                <span className="text-sm opacity-80">Total Investors</span>
                              </div>
                              <div className="text-3xl font-bold">
                                {analytics.totalInvestors}
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                              <div className="flex items-center justify-between mb-4">
                                <DollarSign className="w-8 h-8" />
                                <span className="text-sm opacity-80">Total Invested</span>
                              </div>
                              <div className="text-3xl font-bold">
                                ${analytics.totalInvested.toLocaleString()}
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                              <div className="flex items-center justify-between mb-4">
                                <TrendingUp className="w-8 h-8" />
                                <span className="text-sm opacity-80">Performance</span>
                              </div>
                              <div className="text-3xl font-bold">
                                {analytics.performanceScore}/10
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-2xl p-6">
                              <h4 className="font-semibold text-gray-900 mb-4">Key Metrics</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Average Investment</span>
                                  <span className="font-medium">${analytics.avgInvestment.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Monthly Growth</span>
                                  <span className="font-medium text-green-600">+{analytics.monthlyGrowth}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Risk-Adjusted Return</span>
                                  <span className="font-medium">{analytics.riskAdjustedReturn}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Token Symbol</span>
                                  <span className="font-medium text-blue-600">{selectedPortfolio.tokenSymbol}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-2xl p-6">
                              <h4 className="font-semibold text-gray-900 mb-4">Portfolio Details</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Risk Type</span>
                                  <span className="font-medium">{selectedPortfolio.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Value</span>
                                  <span className="font-medium">${parseFloat(selectedPortfolio.totalValue).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Expected Yield</span>
                                  <span className="font-medium text-green-600">{selectedPortfolio.expectedYield}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Risk Rating</span>
                                  <span className="font-medium">{selectedPortfolio.riskRating}/10</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a Portfolio
                    </h4>
                    <p className="text-gray-600">
                      Choose a portfolio from your list to view detailed analytics
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => {
                      setIsAnalyticsModalOpen(false)
                      setSelectedPortfolio(null)
                    }}
                    className="py-3 px-6 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {isSettingsModalOpen && (
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
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Account Settings
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={companySettings.companyName}
                          onChange={(e) => setCompanySettings(prev => ({...prev, companyName: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={companySettings.email}
                          onChange={(e) => setCompanySettings(prev => ({...prev, email: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={companySettings.phone}
                          onChange={(e) => setCompanySettings(prev => ({...prev, phone: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Risk Threshold
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={companySettings.riskThreshold}
                          onChange={(e) => setCompanySettings(prev => ({...prev, riskThreshold: parseFloat(e.target.value)}))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={companySettings.address}
                        onChange={(e) => setCompanySettings(prev => ({...prev, address: e.target.value}))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h4>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={companySettings.notifications}
                          onChange={(e) => setCompanySettings(prev => ({...prev, notifications: e.target.checked}))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Enable email notifications</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={companySettings.autoApproval}
                          onChange={(e) => setCompanySettings(prev => ({...prev, autoApproval: e.target.checked}))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Auto-approve low-risk investments</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save settings logic here
                      setIsSettingsModalOpen(false)
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default InsurancePortal

