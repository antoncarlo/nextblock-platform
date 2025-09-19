import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  CreditCard, 
  Building2, 
  ArrowRight, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Euro,
  DollarSign,
  PoundSterling
} from 'lucide-react'

const FiatGateway = () => {
  const { t } = useTranslation()
  const [selectedCurrency, setSelectedCurrency] = useState('EUR')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [isProcessing, setIsProcessing] = useState(false)
  const [kycStatus, setKycStatus] = useState('pending') // pending, verified, rejected

  const currencies = [
    { code: 'EUR', symbol: '€', icon: Euro, name: 'Euro' },
    { code: 'USD', symbol: '$', icon: DollarSign, name: 'US Dollar' },
    { code: 'GBP', symbol: '£', icon: PoundSterling, name: 'British Pound' }
  ]

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: t('fiatGateway.paymentMethods.bankTransfer'),
      description: t('fiatGateway.paymentMethods.bankTransferDesc'),
      icon: Building2,
      processingTime: '1-3 business days',
      fees: '0.5%'
    },
    {
      id: 'sepa_instant',
      name: t('fiatGateway.paymentMethods.sepaInstant'),
      description: t('fiatGateway.paymentMethods.sepaInstantDesc'),
      icon: Clock,
      processingTime: 'Instant',
      fees: '0.8%'
    },
    {
      id: 'wire_transfer',
      name: t('fiatGateway.paymentMethods.wireTransfer'),
      description: t('fiatGateway.paymentMethods.wireTransferDesc'),
      icon: CreditCard,
      processingTime: '24-48 hours',
      fees: '1.0%'
    }
  ]

  const handleInvestment = async () => {
    if (!amount || parseFloat(amount) < 100000) {
      alert(t('fiatGateway.errors.minimumAmount'))
      return
    }

    if (kycStatus !== 'verified') {
      alert(t('fiatGateway.errors.kycRequired'))
      return
    }

    setIsProcessing(true)

    try {
      // Simulate Circle Mint API call
      const response = await fetch('/api/circle/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: selectedCurrency,
          paymentMethod,
          destinationCurrency: 'USDC'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to Circle payment page
        window.location.href = data.paymentUrl
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Payment creation failed:', error)
      alert(t('fiatGateway.errors.paymentFailed'))
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateUSDC = (fiatAmount) => {
    if (!fiatAmount) return '0'
    // Simulate exchange rate (in real implementation, fetch from Circle API)
    const exchangeRate = selectedCurrency === 'EUR' ? 1.08 : 
                        selectedCurrency === 'GBP' ? 1.25 : 1.00
    return (parseFloat(fiatAmount) * exchangeRate).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('fiatGateway.title')}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {t('fiatGateway.subtitle')}
            </p>
          </div>

          {/* KYC Status Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`mb-8 p-4 rounded-xl border ${
              kycStatus === 'verified' 
                ? 'bg-green-900/20 border-green-500/30 text-green-300'
                : kycStatus === 'pending'
                ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300'
                : 'bg-red-900/20 border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {kycStatus === 'verified' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {kycStatus === 'verified' 
                  ? t('fiatGateway.kyc.verified')
                  : kycStatus === 'pending'
                  ? t('fiatGateway.kyc.pending')
                  : t('fiatGateway.kyc.required')
                }
              </span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Investment Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('fiatGateway.form.title')}
              </h2>

              {/* Currency Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  {t('fiatGateway.form.currency')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {currencies.map((currency) => {
                    const IconComponent = currency.icon
                    return (
                      <button
                        key={currency.code}
                        onClick={() => setSelectedCurrency(currency.code)}
                        className={`p-3 rounded-xl border transition-all ${
                          selectedCurrency === currency.code
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">{currency.code}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  {t('fiatGateway.form.amount')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100,000"
                    min="100000"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-3 text-slate-400">
                    {currencies.find(c => c.code === selectedCurrency)?.symbol}
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  {t('fiatGateway.form.minimumAmount')}: €100,000
                </div>
                {amount && (
                  <div className="mt-2 text-sm text-blue-400">
                    ≈ {calculateUSDC(amount)} USDC
                  </div>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  {t('fiatGateway.form.paymentMethod')}
                </label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          paymentMethod === method.id
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className="w-5 h-5 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-slate-400 mt-1">
                              {method.description}
                            </div>
                            <div className="flex gap-4 mt-2 text-xs">
                              <span className="text-green-400">
                                {t('fiatGateway.form.processingTime')}: {method.processingTime}
                              </span>
                              <span className="text-blue-400">
                                {t('fiatGateway.form.fees')}: {method.fees}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Investment Button */}
              <button
                onClick={handleInvestment}
                disabled={isProcessing || kycStatus !== 'verified' || !amount}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('fiatGateway.form.processing')}
                  </>
                ) : (
                  <>
                    {t('fiatGateway.form.invest')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Information Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Security Features */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  {t('fiatGateway.security.title')}
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {t('fiatGateway.security.circleRegulated')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {t('fiatGateway.security.institutionalGrade')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {t('fiatGateway.security.segregatedFunds')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {t('fiatGateway.security.fullCompliance')}
                  </li>
                </ul>
              </div>

              {/* Process Steps */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4">
                  {t('fiatGateway.process.title')}
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: t('fiatGateway.process.step1.title'),
                      description: t('fiatGateway.process.step1.description')
                    },
                    {
                      step: 2,
                      title: t('fiatGateway.process.step2.title'),
                      description: t('fiatGateway.process.step2.description')
                    },
                    {
                      step: 3,
                      title: t('fiatGateway.process.step3.title'),
                      description: t('fiatGateway.process.step3.description')
                    },
                    {
                      step: 4,
                      title: t('fiatGateway.process.step4.title'),
                      description: t('fiatGateway.process.step4.description')
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="text-sm text-slate-400 mt-1">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-2">
                  {t('fiatGateway.support.title')}
                </h3>
                <p className="text-slate-300 mb-4">
                  {t('fiatGateway.support.description')}
                </p>
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                  {t('fiatGateway.support.contact')}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FiatGateway
