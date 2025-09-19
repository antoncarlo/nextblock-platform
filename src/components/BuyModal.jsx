import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  X, 
  CreditCard, 
  Building2, 
  Zap, 
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Euro,
  DollarSign,
  PoundSterling,
  ArrowRight,
  Info,
  Loader2,
  ExternalLink
} from 'lucide-react'

const BuyModal = ({ isOpen, onClose, targetToken = 'USDC', walletAddress }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1) // 1: Amount, 2: Payment, 3: KYC, 4: Processing, 5: Complete
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [selectedToken, setSelectedToken] = useState(targetToken)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [estimatedTokens, setEstimatedTokens] = useState(0)
  const [fees, setFees] = useState(0)
  const [kycStatus, setKycStatus] = useState('pending') // pending, approved, rejected
  const [paymentStatus, setPaymentStatus] = useState('idle') // idle, processing, completed, failed

  // Supported currencies
  const currencies = [
    { code: 'EUR', symbol: '€', icon: Euro, name: 'Euro', flag: '🇪🇺' },
    { code: 'USD', symbol: '$', icon: DollarSign, name: 'US Dollar', flag: '🇺🇸' },
    { code: 'GBP', symbol: '£', icon: PoundSterling, name: 'British Pound', flag: '🇬🇧' }
  ]

  // Payment methods with fees and processing times
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      fee: 2.5,
      time: 'Instant',
      description: 'Visa, Mastercard, American Express',
      minAmount: 10,
      maxAmount: 10000,
      available: true
    },
    {
      id: 'sepa',
      name: 'SEPA Bank Transfer',
      icon: Building2,
      fee: 0.5,
      time: '1-3 business days',
      description: 'European bank transfer',
      minAmount: 100,
      maxAmount: 100000,
      available: true
    },
    {
      id: 'sepa_instant',
      name: 'SEPA Instant',
      icon: Zap,
      fee: 0.8,
      time: 'Real-time',
      description: 'Instant European transfer',
      minAmount: 100,
      maxAmount: 50000,
      available: true
    },
    {
      id: 'wire',
      name: 'Wire Transfer',
      icon: Globe,
      fee: 1.0,
      time: '24-48 hours',
      description: 'International wire transfer',
      minAmount: 1000,
      maxAmount: 1000000,
      available: true
    }
  ]

  // Available tokens for purchase
  const availableTokens = [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '💵',
      price: 1.00,
      network: 'Ethereum',
      description: 'Stable digital dollar'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '🔷',
      price: 2650.00,
      network: 'Ethereum',
      description: 'Native Ethereum token'
    },
    {
      symbol: 'HYPER',
      name: 'HyperLiquid',
      icon: '⚡',
      price: 12.45,
      network: 'HyperLiquid',
      description: 'HyperLiquid native token'
    },
    {
      symbol: 'NBIP-001',
      name: 'Insurance Portfolio Alpha',
      icon: '🏛️',
      price: 25.00,
      network: 'Ethereum',
      description: 'NextBlock Insurance Token'
    }
  ]

  // Get selected currency info
  const selectedCurrency = currencies.find(c => c.code === currency)
  const selectedPaymentMethod = paymentMethods.find(p => p.id === paymentMethod)
  const selectedTokenInfo = availableTokens.find(t => t.symbol === selectedToken)

  // Calculate estimates
  useEffect(() => {
    if (amount && selectedTokenInfo && selectedPaymentMethod) {
      const numAmount = parseFloat(amount)
      const feeAmount = (numAmount * selectedPaymentMethod.fee) / 100
      const netAmount = numAmount - feeAmount
      const tokens = netAmount / selectedTokenInfo.price
      
      setFees(feeAmount)
      setEstimatedTokens(tokens)
    }
  }, [amount, selectedToken, paymentMethod])

  // Simulate Circle Mint API integration
  const processCircleMintPayment = async (paymentData) => {
    // This would integrate with actual Circle Mint API
    const mockResponse = {
      id: 'payment_' + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      amount: paymentData.amount,
      currency: paymentData.currency,
      targetToken: paymentData.targetToken,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
    
    return mockResponse
  }

  // Handle KYC verification
  const handleKYCVerification = async () => {
    setIsProcessing(true)
    
    // Simulate KYC process
    setTimeout(() => {
      if (parseFloat(amount) > 1000) {
        // Amounts over €1000 require enhanced KYC
        setKycStatus('approved') // In real implementation, this would be pending
      } else {
        setKycStatus('approved')
      }
      setIsProcessing(false)
      setStep(4)
    }, 2000)
  }

  // Handle payment processing
  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus('processing')
    
    try {
      const paymentData = {
        amount: parseFloat(amount),
        currency,
        paymentMethod,
        targetToken: selectedToken,
        walletAddress,
        fees: fees
      }
      
      const result = await processCircleMintPayment(paymentData)
      setTransactionId(result.id)
      
      // Simulate payment processing
      setTimeout(() => {
        setPaymentStatus('completed')
        setIsProcessing(false)
        setStep(5)
      }, 3000)
      
    } catch (error) {
      setPaymentStatus('failed')
      setIsProcessing(false)
    }
  }

  // Reset modal state
  const resetModal = () => {
    setStep(1)
    setAmount('')
    setPaymentMethod('card')
    setSelectedToken(targetToken)
    setIsProcessing(false)
    setTransactionId('')
    setKycStatus('pending')
    setPaymentStatus('idle')
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t('buy.title', 'Buy Crypto')}
                </h2>
                <p className="text-sm text-gray-600">
                  Step {step} of 5
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum < step ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 5 && (
                    <div className={`w-8 h-1 mx-2 ${
                      stepNum < step ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Amount</span>
              <span>Payment</span>
              <span>KYC</span>
              <span>Process</span>
              <span>Complete</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {/* Step 1: Amount Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Amount and Token
                  </h3>
                  
                  {/* Currency Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => setCurrency(curr.code)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            currency === curr.code
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{curr.flag}</div>
                            <div className="text-sm font-medium">{curr.code}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <selectedCurrency.icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>Min: {selectedCurrency.symbol}10</span>
                      <span>Max: {selectedCurrency.symbol}100,000</span>
                    </div>
                  </div>

                  {/* Token Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Token to Buy
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableTokens.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => setSelectedToken(token.symbol)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedToken === token.symbol
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{token.icon}</div>
                            <div>
                              <div className="font-medium">{token.symbol}</div>
                              <div className="text-sm text-gray-600">{token.name}</div>
                              <div className="text-xs text-gray-500">
                                {selectedCurrency.symbol}{token.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimate */}
                  {amount && estimatedTokens > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Estimate</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>{selectedCurrency.symbol}{parseFloat(amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>You'll receive:</span>
                          <span className="font-medium">
                            {estimatedTokens.toFixed(4)} {selectedToken}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!amount || parseFloat(amount) < 10}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Choose Payment Method
                  </h3>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        disabled={!method.available}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === method.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <method.icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                              <div className="text-xs text-gray-500">
                                {method.fee}% fee • {method.time}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {selectedCurrency.symbol}{((parseFloat(amount) * method.fee) / 100).toFixed(2)} fee
                            </div>
                            <div className="text-xs text-gray-500">
                              {selectedCurrency.symbol}{method.minAmount} - {selectedCurrency.symbol}{method.maxAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span>{selectedCurrency.symbol}{parseFloat(amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fee ({selectedPaymentMethod?.fee}%):</span>
                        <span>{selectedCurrency.symbol}{fees.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-medium">
                        <span>You'll receive:</span>
                        <span>{estimatedTokens.toFixed(4)} {selectedToken}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Processing time:</span>
                        <span>{selectedPaymentMethod?.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: KYC Verification */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Identity Verification
                  </h3>
                  
                  {parseFloat(amount) > 1000 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Enhanced KYC Required</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Purchases over {selectedCurrency.symbol}1,000 require enhanced identity verification for regulatory compliance.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">Basic Verification</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Your purchase amount qualifies for simplified verification.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Secure & Compliant</div>
                        <div className="text-sm text-gray-600">
                          Your data is encrypted and stored securely
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Quick Process</div>
                        <div className="text-sm text-gray-600">
                          Verification typically takes 1-2 minutes
                        </div>
                      </div>
                    </div>
                  </div>

                  {kycStatus === 'pending' && (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Ready for Verification</h4>
                      <p className="text-gray-600 mb-6">
                        Click below to start the secure verification process
                      </p>
                    </div>
                  )}

                  {kycStatus === 'approved' && (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Verification Complete</h4>
                      <p className="text-gray-600">
                        Your identity has been successfully verified
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  {kycStatus === 'pending' ? (
                    <button
                      onClick={handleKYCVerification}
                      disabled={isProcessing}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          <span>Start Verification</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => setStep(4)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Processing */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Processing Payment
                  </h3>
                  
                  {paymentStatus === 'idle' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Ready to Process</h4>
                      <p className="text-gray-600 mb-6">
                        Review your order and confirm payment
                      </p>
                      
                      {/* Final Summary */}
                      <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto">
                        <h5 className="font-medium text-gray-900 mb-4">Order Summary</h5>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span>{selectedCurrency.symbol}{parseFloat(amount).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payment method:</span>
                            <span>{selectedPaymentMethod?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fee:</span>
                            <span>{selectedCurrency.symbol}{fees.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Token:</span>
                            <span>{selectedToken}</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between font-medium">
                            <span>You'll receive:</span>
                            <span>{estimatedTokens.toFixed(4)} {selectedToken}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentStatus === 'processing' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Processing Payment</h4>
                      <p className="text-gray-600 mb-4">
                        Please wait while we process your payment...
                      </p>
                      {transactionId && (
                        <div className="text-xs text-gray-500">
                          Transaction ID: {transactionId}
                        </div>
                      )}
                    </div>
                  )}

                  {paymentStatus === 'failed' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Failed</h4>
                      <p className="text-gray-600 mb-6">
                        There was an issue processing your payment. Please try again.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(3)}
                    disabled={paymentStatus === 'processing'}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  {paymentStatus === 'idle' && (
                    <button
                      onClick={handlePayment}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm Payment</span>
                    </button>
                  )}
                  {paymentStatus === 'failed' && (
                    <button
                      onClick={() => setPaymentStatus('idle')}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 5: Complete */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Purchase Successful!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your {selectedToken} tokens will be delivered to your wallet shortly
                  </p>
                  
                  {/* Success Details */}
                  <div className="bg-green-50 rounded-xl p-6 text-left max-w-md mx-auto mb-6">
                    <h5 className="font-medium text-green-900 mb-4">Transaction Details</h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Amount paid:</span>
                        <span className="font-medium">{selectedCurrency.symbol}{parseFloat(amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Tokens purchased:</span>
                        <span className="font-medium">{estimatedTokens.toFixed(4)} {selectedToken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Transaction ID:</span>
                        <span className="font-mono text-xs">{transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Delivery time:</span>
                        <span>{selectedPaymentMethod?.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => window.open(`https://etherscan.io/tx/${transactionId}`, '_blank')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View on Blockchain</span>
                    </button>
                    
                    <button
                      onClick={handleClose}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BuyModal
