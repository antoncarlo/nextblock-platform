import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  TrendingUp, 
  DollarSign, 
  Euro, 
  PoundSterling,
  Wallet,
  Target,
  Globe,
  CheckCircle
} from 'lucide-react'

const TreasuryManagementSimple = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {t('treasury.loading')}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('treasury.title')}
              </h1>
              <p className="text-xl text-slate-300">
                {t('treasury.subtitle')}
              </p>
            </div>
          </div>
        </motion.div>

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
              €47,500,000
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
              <span className="text-sm text-purple-400">4</span>
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
              Compliance
            </div>
            <div className="text-sm text-slate-300">
              {t('treasury.metrics.complianceScore')}
            </div>
          </div>
        </motion.div>

        {/* Currency Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            {t('treasury.currencies.title')}
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Euro className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">€25.0M</div>
                <div className="text-sm text-slate-400">EUR (52.6%)</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">$15.0M</div>
                <div className="text-sm text-slate-400">USD (31.6%)</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <PoundSterling className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">£5.5M</div>
                <div className="text-sm text-slate-400">GBP (11.6%)</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white">2.0M</div>
                <div className="text-sm text-slate-400">USDC (4.2%)</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TreasuryManagementSimple
