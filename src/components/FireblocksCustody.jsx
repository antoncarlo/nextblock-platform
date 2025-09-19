import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  Shield, 
  Lock, 
  Key, 
  Users, 
  Eye, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Settings,
  Activity,
  BarChart3
} from 'lucide-react'

const FireblocksCustody = () => {
  const { t } = useTranslation()
  const [custodyData, setCustodyData] = useState({
    totalAssets: 0,
    wallets: [],
    transactions: [],
    securityStatus: 'secure'
  })
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate Fireblocks API data
  useEffect(() => {
    const fetchCustodyData = async () => {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockData = {
        totalAssets: 47500000, // €47.5M
        wallets: [
          {
            id: 'treasury-main',
            name: 'Main Treasury Wallet',
            type: 'multi-sig',
            balance: 35000000,
            currency: 'USDC',
            signers: 5,
            requiredSignatures: 3,
            status: 'active',
            lastActivity: '2025-09-19T08:30:00Z'
          },
          {
            id: 'portfolio-alpha',
            name: 'Insurance Portfolio Alpha',
            type: 'smart-contract',
            balance: 8500000,
            currency: 'USDC',
            signers: 3,
            requiredSignatures: 2,
            status: 'active',
            lastActivity: '2025-09-19T07:15:00Z'
          },
          {
            id: 'liquidity-reserve',
            name: 'Liquidity Reserve',
            type: 'cold-storage',
            balance: 4000000,
            currency: 'USDC',
            signers: 7,
            requiredSignatures: 4,
            status: 'active',
            lastActivity: '2025-09-18T16:45:00Z'
          }
        ],
        transactions: [
          {
            id: 'tx-001',
            type: 'deposit',
            amount: 500000,
            currency: 'USDC',
            from: 'Circle Mint',
            to: 'treasury-main',
            status: 'completed',
            timestamp: '2025-09-19T08:30:00Z',
            signatures: 3,
            requiredSignatures: 3
          },
          {
            id: 'tx-002',
            type: 'transfer',
            amount: 2000000,
            currency: 'USDC',
            from: 'treasury-main',
            to: 'portfolio-alpha',
            status: 'pending',
            timestamp: '2025-09-19T08:00:00Z',
            signatures: 2,
            requiredSignatures: 3
          },
          {
            id: 'tx-003',
            type: 'withdrawal',
            amount: 150000,
            currency: 'USDC',
            from: 'portfolio-alpha',
            to: 'External Wallet',
            status: 'completed',
            timestamp: '2025-09-19T07:15:00Z',
            signatures: 2,
            requiredSignatures: 2
          }
        ],
        securityStatus: 'secure'
      }
      
      setCustodyData(mockData)
      setSelectedWallet(mockData.wallets[0])
      setIsLoading(false)
    }

    fetchCustodyData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'inactive': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getTransactionStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-900/20 text-green-400 border-green-500/30'
      case 'pending': return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
      case 'failed': return 'bg-red-900/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-900/20 text-slate-400 border-slate-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">{t('custody.loading')}</p>
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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('custody.title')}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {t('custody.subtitle')}
            </p>
          </div>

          {/* Security Status Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 rounded-xl bg-green-900/20 border border-green-500/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-green-300">
                    {t('custody.security.status')}
                  </h3>
                  <p className="text-green-400/80">
                    {t('custody.security.description')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  €{custodyData.totalAssets.toLocaleString()}
                </div>
                <div className="text-sm text-green-400">
                  {t('custody.security.totalAssets')}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Wallets List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  {t('custody.wallets.title')}
                </h2>
                
                <div className="space-y-4">
                  {custodyData.wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => setSelectedWallet(wallet)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        selectedWallet?.id === wallet.id
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium">{wallet.name}</div>
                        <div className={`text-xs px-2 py-1 rounded ${getStatusColor(wallet.status)}`}>
                          {wallet.status}
                        </div>
                      </div>
                      <div className="text-sm text-slate-400 mb-2">
                        {wallet.type.replace('-', ' ').toUpperCase()}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-white">
                          €{wallet.balance.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Key className="w-3 h-3" />
                          {wallet.requiredSignatures}/{wallet.signers}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Wallet Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              {selectedWallet && (
                <>
                  {/* Wallet Overview */}
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {selectedWallet.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Lock className="w-4 h-4" />
                            {selectedWallet.type.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {selectedWallet.requiredSignatures} of {selectedWallet.signers} signatures
                          </span>
                        </div>
                      </div>
                      <button className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-slate-400">{t('custody.wallet.balance')}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          €{selectedWallet.balance.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {selectedWallet.currency}
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-slate-400">{t('custody.wallet.security')}</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                          {selectedWallet.requiredSignatures}/{selectedWallet.signers}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Multi-signature
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-slate-400">{t('custody.wallet.lastActivity')}</span>
                        </div>
                        <div className="text-sm font-medium text-white">
                          {new Date(selectedWallet.lastActivity).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(selectedWallet.lastActivity).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {t('custody.transactions.title')}
                    </h3>
                    
                    <div className="space-y-4">
                      {custodyData.transactions
                        .filter(tx => tx.from === selectedWallet.id || tx.to === selectedWallet.id)
                        .map((transaction) => (
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
                                  {transaction.type === 'deposit' ? `From ${transaction.from}` :
                                   transaction.type === 'withdrawal' ? `To ${transaction.to}` :
                                   `${transaction.from} → ${transaction.to}`}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-white">
                                €{transaction.amount.toLocaleString()}
                              </div>
                              <div className={`text-xs px-2 py-1 rounded border ${getTransactionStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Shield,
                title: t('custody.features.multiSig.title'),
                description: t('custody.features.multiSig.description'),
                color: 'text-green-400'
              },
              {
                icon: Lock,
                title: t('custody.features.coldStorage.title'),
                description: t('custody.features.coldStorage.description'),
                color: 'text-blue-400'
              },
              {
                icon: Eye,
                title: t('custody.features.realTime.title'),
                description: t('custody.features.realTime.description'),
                color: 'text-purple-400'
              },
              {
                icon: CheckCircle,
                title: t('custody.features.compliance.title'),
                description: t('custody.features.compliance.description'),
                color: 'text-yellow-400'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
              >
                <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default FireblocksCustody
