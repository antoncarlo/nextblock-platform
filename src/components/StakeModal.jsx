import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  X, 
  Shield, 
  TrendingUp, 
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Award,
  Lock,
  Unlock,
  Calendar,
  BarChart3,
  Coins,
  Target,
  Zap
} from 'lucide-react'
import { stakeService } from '../services/stakeService'

const StakeModal = ({ isOpen, onClose, walletAddress }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1) // 1: Pools, 2: Stake, 3: Confirm, 4: Complete
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Staking State
  const [selectedPool, setSelectedPool] = useState(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [stakeDuration, setStakeDuration] = useState(30) // days
  const [action, setAction] = useState('stake') // stake, unstake, claim
  
  // Pool Data
  const [stakingPools, setStakingPools] = useState([])
  const [userStakes, setUserStakes] = useState([])
  const [totalRewards, setTotalRewards] = useState(0)
  
  // Transaction State
  const [txHash, setTxHash] = useState('')
  const [rewardAmount, setRewardAmount] = useState(0)

  // Available staking pools
  const mockStakingPools = [
    {
      id: 'nbip-insurance',
      name: 'NBIP Insurance Pool',
      token: 'NBIP',
      icon: '🛡️',
      apy: 14.2,
      tvl: 12500000,
      minStake: 100,
      maxStake: 1000000,
      lockPeriod: 30, // days
      rewardToken: 'USDC',
      description: 'Stake NBIP tokens to earn insurance premiums',
      features: ['Insurance Premium Rewards', 'Governance Rights', 'Risk Diversification'],
      riskLevel: 'Medium',
      status: 'Active',
      participants: 1247,
      nextRewardDistribution: '2025-09-25',
      totalStaked: 8750000,
      userStaked: 2500,
      pendingRewards: 125.50
    },
    {
      id: 'nxtb-governance',
      name: 'NXTB Governance Pool',
      token: 'NXTB',
      icon: '🔷',
      apy: 18.5,
      tvl: 8200000,
      minStake: 50,
      maxStake: 500000,
      lockPeriod: 90, // days
      rewardToken: 'NXTB',
      description: 'Stake NXTB for governance voting and protocol rewards',
      features: ['Governance Voting', 'Protocol Fees', 'Early Access'],
      riskLevel: 'Low',
      status: 'Active',
      participants: 892,
      nextRewardDistribution: '2025-09-22',
      totalStaked: 5200000,
      userStaked: 1250,
      pendingRewards: 89.25
    },
    {
      id: 'eth-liquidity',
      name: 'ETH Liquidity Pool',
      token: 'ETH',
      icon: '⟠',
      apy: 8.7,
      tvl: 25000000,
      minStake: 0.1,
      maxStake: 100,
      lockPeriod: 0, // flexible
      rewardToken: 'ETH',
      description: 'Provide ETH liquidity for trading pairs',
      features: ['Trading Fees', 'Flexible Staking', 'Auto-Compound'],
      riskLevel: 'Low',
      status: 'Active',
      participants: 2156,
      nextRewardDistribution: 'Daily',
      totalStaked: 9450,
      userStaked: 2.45,
      pendingRewards: 0.0125
    },
    {
      id: 'hyper-validator',
      name: 'HyperLiquid Validator',
      token: 'HYPER',
      icon: '⚡',
      apy: 22.3,
      tvl: 15600000,
      minStake: 1000,
      maxStake: 100000,
      lockPeriod: 180, // days
      rewardToken: 'HYPER',
      description: 'Stake HYPER to secure the network and earn rewards',
      features: ['Network Security', 'High APY', 'Validator Rewards'],
      riskLevel: 'High',
      status: 'Active',
      participants: 456,
      nextRewardDistribution: '2025-09-20',
      totalStaked: 1250000,
      userStaked: 1250,
      pendingRewards: 45.75
    },
    {
      id: 'multi-asset',
      name: 'Multi-Asset Pool',
      token: 'LP-TOKEN',
      icon: '🌈',
      apy: 16.8,
      tvl: 6800000,
      minStake: 1,
      maxStake: 50000,
      lockPeriod: 60, // days
      rewardToken: 'MIXED',
      description: 'Diversified staking across multiple insurance tokens',
      features: ['Diversification', 'Auto-Rebalancing', 'Mixed Rewards'],
      riskLevel: 'Medium',
      status: 'Active',
      participants: 734,
      nextRewardDistribution: 'Weekly',
      totalStaked: 425000,
      userStaked: 0,
      pendingRewards: 0
    }
  ]

  useEffect(() => {
    if (isOpen) {
      setStakingPools(mockStakingPools)
      calculateTotalRewards()
    }
  }, [isOpen])

  const calculateTotalRewards = () => {
    const total = mockStakingPools.reduce((sum, pool) => sum + pool.pendingRewards, 0)
    setTotalRewards(total)
  }

  const handlePoolSelect = (pool) => {
    setSelectedPool(pool)
    setStep(2)
  }

  const handleStake = async () => {
    setLoading(true)
    setError('')
    
    try {
      setStep(3) // Confirm step
      
      // Simulate staking transaction
      const stakeResult = await stakeService.stake({
        poolId: selectedPool.id,
        amount: parseFloat(stakeAmount),
        duration: stakeDuration,
        walletAddress
      })
      
      setTxHash(stakeResult.txHash)
      setRewardAmount(stakeResult.estimatedRewards)
      setStep(4) // Complete step
      
    } catch (err) {
      setError(err.message || 'Staking failed')
      setStep(2) // Back to stake
    } finally {
      setLoading(false)
    }
  }

  const handleUnstake = async (poolId, amount) => {
    setLoading(true)
    setError('')
    
    try {
      const unstakeResult = await stakeService.unstake({
        poolId,
        amount,
        walletAddress
      })
      
      setTxHash(unstakeResult.txHash)
      // Refresh pool data
      
    } catch (err) {
      setError(err.message || 'Unstaking failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClaimRewards = async (poolId) => {
    setLoading(true)
    setError('')
    
    try {
      const claimResult = await stakeService.claimRewards({
        poolId,
        walletAddress
      })
      
      setTxHash(claimResult.txHash)
      // Refresh pool data
      
    } catch (err) {
      setError(err.message || 'Claiming rewards failed')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setSelectedPool(null)
    setStakeAmount('')
    setError('')
    setTxHash('')
    setLoading(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t('stake.title', 'Stake & Earn')}
                </h2>
                <p className="text-sm text-gray-600">
                  Step {step} of 4 • Total Rewards: ${totalRewards.toFixed(2)}
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

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">Total Staked</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      ${stakingPools.reduce((sum, pool) => sum + pool.userStaked * 12.45, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Pending Rewards</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      ${totalRewards.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Avg APY</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {(stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-700">Active Pools</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900 mt-1">
                      {stakingPools.filter(pool => pool.userStaked > 0).length}/{stakingPools.length}
                    </p>
                  </div>
                </div>

                {/* Staking Pools */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Staking Pools</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {stakingPools.map(pool => (
                      <motion.div
                        key={pool.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handlePoolSelect(pool)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{pool.icon}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{pool.name}</h4>
                              <p className="text-sm text-gray-600">{pool.token}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{pool.apy}%</div>
                            <div className="text-xs text-gray-500">APY</div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{pool.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">TVL</p>
                            <p className="font-medium">${(pool.tvl / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Lock Period</p>
                            <p className="font-medium">
                              {pool.lockPeriod === 0 ? 'Flexible' : `${pool.lockPeriod} days`}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Min Stake</p>
                            <p className="font-medium">{pool.minStake} {pool.token}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Risk Level</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(pool.riskLevel)}`}>
                              {pool.riskLevel}
                            </span>
                          </div>
                        </div>

                        {pool.userStaked > 0 && (
                          <div className="bg-white rounded-lg p-3 mb-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs text-gray-500">Your Stake</p>
                                <p className="font-medium">{pool.userStaked} {pool.token}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Pending Rewards</p>
                                <p className="font-medium text-green-600">{pool.pendingRewards} {pool.rewardToken}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleClaimRewards(pool.id)
                                }}
                                className="flex-1 bg-green-500 text-white text-xs py-1 px-2 rounded hover:bg-green-600 transition-colors"
                              >
                                Claim
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUnstake(pool.id, pool.userStaked)
                                }}
                                className="flex-1 bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600 transition-colors"
                              >
                                Unstake
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {pool.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && selectedPool && (
              <div className="space-y-6">
                {/* Pool Info */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl">{selectedPool.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedPool.name}</h3>
                      <p className="text-gray-600">{selectedPool.description}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-3xl font-bold text-purple-600">{selectedPool.apy}%</div>
                      <div className="text-sm text-gray-500">APY</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Value Locked</p>
                      <p className="font-semibold">${(selectedPool.tvl / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Participants</p>
                      <p className="font-semibold">{selectedPool.participants.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lock Period</p>
                      <p className="font-semibold">
                        {selectedPool.lockPeriod === 0 ? 'Flexible' : `${selectedPool.lockPeriod} days`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Next Rewards</p>
                      <p className="font-semibold">{selectedPool.nextRewardDistribution}</p>
                    </div>
                  </div>
                </div>

                {/* Staking Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stake Amount ({selectedPool.token})
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          placeholder={`Min: ${selectedPool.minStake}`}
                          min={selectedPool.minStake}
                          max={selectedPool.maxStake}
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <div className="absolute right-3 top-3 text-sm text-gray-500">
                          {selectedPool.token}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Available: {selectedPool.userStaked + 5000} {selectedPool.token}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setStakeAmount((selectedPool.minStake * 2).toString())}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            Min
                          </button>
                          <button
                            onClick={() => setStakeAmount('1000')}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            1K
                          </button>
                          <button
                            onClick={() => setStakeAmount('5000')}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            5K
                          </button>
                          <button
                            onClick={() => setStakeAmount((selectedPool.userStaked + 5000).toString())}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            MAX
                          </button>
                        </div>
                      </div>
                    </div>

                    {selectedPool.lockPeriod > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Staking Duration
                        </label>
                        <select
                          value={stakeDuration}
                          onChange={(e) => setStakeDuration(parseInt(e.target.value))}
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value={selectedPool.lockPeriod}>{selectedPool.lockPeriod} days (Standard)</option>
                          <option value={selectedPool.lockPeriod * 2}>{selectedPool.lockPeriod * 2} days (+20% APY)</option>
                          <option value={selectedPool.lockPeriod * 4}>{selectedPool.lockPeriod * 4} days (+50% APY)</option>
                        </select>
                      </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Staking Terms</h4>
                          <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                            <li>• Minimum stake: {selectedPool.minStake} {selectedPool.token}</li>
                            <li>• Lock period: {selectedPool.lockPeriod === 0 ? 'Flexible withdrawal' : `${stakeDuration} days`}</li>
                            <li>• Rewards paid in: {selectedPool.rewardToken}</li>
                            <li>• Early withdrawal penalty: {selectedPool.lockPeriod > 0 ? '5%' : 'None'}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Rewards Calculator */}
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-medium text-green-900 mb-3">Estimated Rewards</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-green-700">Daily rewards:</span>
                          <span className="font-medium text-green-900">
                            {stakeAmount ? ((parseFloat(stakeAmount) * selectedPool.apy / 100 / 365).toFixed(4)) : '0.0000'} {selectedPool.rewardToken}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Monthly rewards:</span>
                          <span className="font-medium text-green-900">
                            {stakeAmount ? ((parseFloat(stakeAmount) * selectedPool.apy / 100 / 12).toFixed(2)) : '0.00'} {selectedPool.rewardToken}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Annual rewards:</span>
                          <span className="font-medium text-green-900">
                            {stakeAmount ? ((parseFloat(stakeAmount) * selectedPool.apy / 100).toFixed(2)) : '0.00'} {selectedPool.rewardToken}
                          </span>
                        </div>
                        <div className="border-t border-green-200 pt-2">
                          <div className="flex justify-between font-semibold">
                            <span className="text-green-700">Total after {stakeDuration} days:</span>
                            <span className="text-green-900">
                              {stakeAmount ? ((parseFloat(stakeAmount) * (1 + selectedPool.apy / 100 * stakeDuration / 365)).toFixed(2)) : '0.00'} {selectedPool.token}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pool Statistics */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Pool Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Your current stake:</span>
                          <span className="font-medium">{selectedPool.userStaked} {selectedPool.token}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pending rewards:</span>
                          <span className="font-medium text-green-600">{selectedPool.pendingRewards} {selectedPool.rewardToken}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pool utilization:</span>
                          <span className="font-medium">{((selectedPool.totalStaked / selectedPool.tvl) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Your pool share:</span>
                          <span className="font-medium">
                            {stakeAmount ? (((parseFloat(stakeAmount) + selectedPool.userStaked) / selectedPool.totalStaked * 100).toFixed(4)) : '0.0000'}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(selectedPool.riskLevel)}`}>
                          {selectedPool.riskLevel} Risk
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• Smart contract risk: Audited by CertiK</p>
                        <p>• Liquidity risk: High TVL, established pool</p>
                        <p>• Market risk: Token price volatility</p>
                        <p>• Slashing risk: {selectedPool.lockPeriod > 0 ? 'Early withdrawal penalty' : 'None'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back to Pools
                  </button>
                  <button
                    onClick={handleStake}
                    disabled={!stakeAmount || parseFloat(stakeAmount) < selectedPool.minStake || loading}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Stake {selectedPool.token}</span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Stake</h3>
                  <p className="text-gray-600">
                    Please wait while we process your staking transaction...
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pool:</span>
                      <span className="font-medium">{selectedPool?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{stakeAmount} {selectedPool?.token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{stakeDuration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected APY:</span>
                      <span className="font-medium text-green-600">{selectedPool?.apy}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Staking Successful!</h3>
                  <p className="text-gray-600">
                    Your tokens have been staked successfully and are now earning rewards
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-medium text-green-900 mb-3">Staking Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Staked amount:</span>
                      <span className="font-medium text-green-900">{stakeAmount} {selectedPool?.token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Lock period:</span>
                      <span className="font-medium text-green-900">{stakeDuration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">APY:</span>
                      <span className="font-medium text-green-900">{selectedPool?.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Estimated rewards:</span>
                      <span className="font-medium text-green-900">{rewardAmount} {selectedPool?.rewardToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Transaction ID:</span>
                      <span className="font-medium text-green-900 font-mono text-xs">
                        {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-medium text-blue-800">What's Next?</h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Rewards start accruing immediately</li>
                        <li>• Check your dashboard for real-time earnings</li>
                        <li>• Claim rewards anytime (gas fees apply)</li>
                        <li>• Auto-compound available for maximum returns</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    View Transaction
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default StakeModal
