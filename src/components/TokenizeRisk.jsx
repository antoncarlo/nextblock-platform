import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Shield,
  DollarSign,
  BarChart3,
  Clock,
  ArrowRight,
  ArrowLeft,
  Zap,
  Globe,
  Users,
  Award
} from 'lucide-react'

const TokenizeRisk = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    portfolioName: '',
    riskType: '',
    totalValue: '',
    duration: '',
    expectedReturn: '',
    description: '',
    geography: [],
    documents: [],
    riskAssessment: null,
    contractAddress: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const steps = [
    { id: 1, title: 'Portfolio Information', icon: FileText },
    { id: 2, title: 'Risk Assessment', icon: BarChart3 },
    { id: 3, title: 'Documentation', icon: Upload },
    { id: 4, title: 'Deploy Contract', icon: Zap }
  ]

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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGeographyChange = (country) => {
    setFormData(prev => ({
      ...prev,
      geography: prev.geography.includes(country)
        ? prev.geography.filter(c => c !== country)
        : [...prev.geography, country]
    }))
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      type: file.type,
      uploaded: true
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const simulateRiskAssessment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      const assessment = {
        riskScore: (Math.random() * 3 + 5).toFixed(1), // 5.0 - 8.0
        confidenceLevel: Math.floor(Math.random() * 15 + 80), // 80-95%
        rating: ['A+', 'A', 'A-', 'BBB+'][Math.floor(Math.random() * 4)],
        recommendations: [
          'Consider geographic diversification to reduce concentration risk',
          'Historical claims data shows strong performance',
          'Regulatory environment is stable and favorable'
        ]
      }
      setFormData(prev => ({ ...prev, riskAssessment: assessment }))
      setIsProcessing(false)
    }, 3000)
  }

  const simulateContractDeployment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      const contractAddress = '0x' + Math.random().toString(16).substr(2, 40)
      setFormData(prev => ({ ...prev, contractAddress }))
      setIsProcessing(false)
    }, 5000)
  }

  const nextStep = () => {
    if (currentStep === 2 && !formData.riskAssessment) {
      simulateRiskAssessment()
      return
    }
    if (currentStep === 4 && !formData.contractAddress) {
      simulateContractDeployment()
      return
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.portfolioName && formData.riskType && formData.totalValue && 
               formData.duration && formData.expectedReturn && formData.description
      case 2:
        return formData.riskAssessment !== null
      case 3:
        return uploadedFiles.length >= 3
      case 4:
        return formData.contractAddress !== ''
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tokenize Risk Portfolio
          </h1>
          <p className="text-gray-600">
            Transform your insurance portfolio into tradeable digital assets
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      Step {step.id}
                    </div>
                    <div className={`text-xs ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          {/* Step 1: Portfolio Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Portfolio Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Name *
                  </label>
                  <input
                    type="text"
                    value={formData.portfolioName}
                    onChange={(e) => handleInputChange('portfolioName', e.target.value)}
                    placeholder="e.g., European Property Portfolio 2025"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Type *
                  </label>
                  <select
                    value={formData.riskType}
                    onChange={(e) => handleInputChange('riskType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    value={formData.totalValue}
                    onChange={(e) => handleInputChange('totalValue', e.target.value)}
                    placeholder="15000000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (months) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="12"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Return (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.expectedReturn}
                    onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                    placeholder="8.5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        checked={formData.geography.includes(country)}
                        onChange={() => handleGeographyChange(country)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{country}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  placeholder="Describe your portfolio, coverage details, and key characteristics..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 2: Risk Assessment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                AI Risk Assessment
              </h2>
              
              {!formData.riskAssessment && !isProcessing && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready for Risk Assessment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our AI will analyze your portfolio data and provide a comprehensive risk assessment
                  </p>
                  <button
                    onClick={simulateRiskAssessment}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                  >
                    Start Assessment
                  </button>
                </div>
              )}
              
              {isProcessing && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Analyzing Portfolio...
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Historical claims data analysis</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Geographic risk distribution</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Market conditions analysis</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Portfolio correlation check</span>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.riskAssessment && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <Shield className="w-8 h-8" />
                        <span className="text-sm opacity-80">Risk Score</span>
                      </div>
                      <div className="text-3xl font-bold">
                        {formData.riskAssessment.riskScore}/10
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-8 h-8" />
                        <span className="text-sm opacity-80">Confidence</span>
                      </div>
                      <div className="text-3xl font-bold">
                        {formData.riskAssessment.confidenceLevel}%
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <Award className="w-8 h-8" />
                        <span className="text-sm opacity-80">Rating</span>
                      </div>
                      <div className="text-3xl font-bold">
                        {formData.riskAssessment.rating}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-2">
                          AI Recommendations
                        </h4>
                        <ul className="space-y-1 text-sm text-yellow-700">
                          {formData.riskAssessment.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Documentation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upload Documentation
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Portfolio Documents
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-medium cursor-pointer transition-colors"
                >
                  Choose Files
                </label>
              </div>
              
              {uploadedFiles.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Actuarial Report',
                    'Policy Portfolio Details',
                    'Compliance Certificate',
                    'Risk Assessment Report',
                    'Regulatory Approval Letter'
                  ].map((docType, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <FileText className="w-6 h-6 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{docType}</div>
                        <div className="text-sm text-gray-500">Required</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
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
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">
                          Compliance Check Passed
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Document integrity verified</li>
                          <li>• Regulatory compliance confirmed</li>
                          <li>• Data format validation successful</li>
                          <li>• Digital signatures verified</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Deploy Contract */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Deploy Smart Contract
              </h2>
              
              {!formData.contractAddress && !isProcessing && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Deploy
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Deploy your tokenized portfolio smart contract to the Ethereum blockchain
                  </p>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto">
                    <h4 className="font-semibold text-gray-900 mb-4">Contract Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Network:</span>
                        <span className="font-medium">Ethereum Mainnet</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Token Symbol:</span>
                        <span className="font-medium">NBIP-{String(Date.now()).slice(-3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Supply:</span>
                        <span className="font-medium">1,000,000 tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Initial Price:</span>
                        <span className="font-medium">${(parseFloat(formData.totalValue || 0) / 1000000).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Gas Fee:</span>
                        <span className="font-medium">~$45.50</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={simulateContractDeployment}
                    className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                  >
                    Deploy Contract
                  </button>
                </div>
              )}
              
              {isProcessing && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Deploying Contract...
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Contract compilation</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Bytecode generation</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Network submission</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Block confirmation</span>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.contractAddress && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🎉 Token Successfully Deployed!
                  </h3>
                  
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white mb-6 max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div>
                        <div className="text-sm opacity-80 mb-1">Token Symbol</div>
                        <div className="font-bold">NBIP-{String(Date.now()).slice(-3)}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-80 mb-1">Total Supply</div>
                        <div className="font-bold">1,000,000 tokens</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-80 mb-1">Initial Price</div>
                        <div className="font-bold">${(parseFloat(formData.totalValue || 0) / 1000000).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-80 mb-1">Market Cap</div>
                        <div className="font-bold">${parseFloat(formData.totalValue || 0).toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-green-400">
                      <div className="text-sm opacity-80 mb-1">Contract Address</div>
                      <div className="font-mono text-sm bg-green-600 rounded px-3 py-2">
                        {formData.contractAddress}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-colors">
                      View on Etherscan
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-medium transition-colors">
                      Go to Marketplace
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 py-3 px-6 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={nextStep}
            disabled={!canProceed() || isProcessing}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-medium transition-colors"
          >
            <span>
              {currentStep === 4 && formData.contractAddress ? 'Complete' : 
               currentStep === 4 ? 'Deploy Contract' :
               currentStep === 2 && !formData.riskAssessment ? 'Start Assessment' :
               'Continue'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TokenizeRisk

