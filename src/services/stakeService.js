// Stake Service - Handles staking pool operations
class StakeService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.nextblock.io'
    this.stakingContracts = {
      ethereum: {
        nbipPool: '0x1234567890123456789012345678901234567890',
        nxtbPool: '0x2345678901234567890123456789012345678901',
        ethPool: '0x3456789012345678901234567890123456789012',
        multiAssetPool: '0x4567890123456789012345678901234567890123'
      },
      hyperliquid: {
        hyperValidator: '0x0000000000000000000000000000000000000001'
      }
    }
    this.supportedTokens = new Map([
      ['NBIP', { address: '0x1234567890123456789012345678901234567890', decimals: 18, chain: 'ethereum' }],
      ['NXTB', { address: '0x2345678901234567890123456789012345678901', decimals: 18, chain: 'ethereum' }],
      ['ETH', { address: '0x0000000000000000000000000000000000000000', decimals: 18, chain: 'ethereum' }],
      ['USDC', { address: '0xA0b86a33E6441b8435b662303c0f479c7e1d5916', decimals: 6, chain: 'ethereum' }],
      ['HYPER', { address: '0x0000000000000000000000000000000000000001', decimals: 18, chain: 'hyperliquid' }]
    ])
  }

  // Get all available staking pools
  async getStakingPools() {
    try {
      const pools = [
        {
          id: 'nbip-insurance',
          name: 'NBIP Insurance Pool',
          token: 'NBIP',
          contractAddress: this.stakingContracts.ethereum.nbipPool,
          apy: 14.2,
          tvl: 12500000,
          minStake: 100,
          maxStake: 1000000,
          lockPeriod: 30,
          rewardToken: 'USDC',
          description: 'Stake NBIP tokens to earn insurance premiums',
          features: ['Insurance Premium Rewards', 'Governance Rights', 'Risk Diversification'],
          riskLevel: 'Medium',
          status: 'Active',
          participants: 1247,
          totalStaked: 8750000,
          chain: 'ethereum'
        },
        {
          id: 'nxtb-governance',
          name: 'NXTB Governance Pool',
          token: 'NXTB',
          contractAddress: this.stakingContracts.ethereum.nxtbPool,
          apy: 18.5,
          tvl: 8200000,
          minStake: 50,
          maxStake: 500000,
          lockPeriod: 90,
          rewardToken: 'NXTB',
          description: 'Stake NXTB for governance voting and protocol rewards',
          features: ['Governance Voting', 'Protocol Fees', 'Early Access'],
          riskLevel: 'Low',
          status: 'Active',
          participants: 892,
          totalStaked: 5200000,
          chain: 'ethereum'
        },
        {
          id: 'eth-liquidity',
          name: 'ETH Liquidity Pool',
          token: 'ETH',
          contractAddress: this.stakingContracts.ethereum.ethPool,
          apy: 8.7,
          tvl: 25000000,
          minStake: 0.1,
          maxStake: 100,
          lockPeriod: 0,
          rewardToken: 'ETH',
          description: 'Provide ETH liquidity for trading pairs',
          features: ['Trading Fees', 'Flexible Staking', 'Auto-Compound'],
          riskLevel: 'Low',
          status: 'Active',
          participants: 2156,
          totalStaked: 9450,
          chain: 'ethereum'
        },
        {
          id: 'hyper-validator',
          name: 'HyperLiquid Validator',
          token: 'HYPER',
          contractAddress: this.stakingContracts.hyperliquid.hyperValidator,
          apy: 22.3,
          tvl: 15600000,
          minStake: 1000,
          maxStake: 100000,
          lockPeriod: 180,
          rewardToken: 'HYPER',
          description: 'Stake HYPER to secure the network and earn rewards',
          features: ['Network Security', 'High APY', 'Validator Rewards'],
          riskLevel: 'High',
          status: 'Active',
          participants: 456,
          totalStaked: 1250000,
          chain: 'hyperliquid'
        }
      ]

      return {
        success: true,
        data: pools
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get user's staking positions
  async getUserStakes(walletAddress) {
    try {
      // In production, this would query the blockchain for user's stakes
      const mockStakes = [
        {
          poolId: 'nbip-insurance',
          amount: 2500,
          stakedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
          lockPeriod: 30,
          unlockAt: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days from now
          pendingRewards: 125.50,
          rewardToken: 'USDC',
          apy: 14.2,
          status: 'active'
        },
        {
          poolId: 'nxtb-governance',
          amount: 1250,
          stakedAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
          lockPeriod: 90,
          unlockAt: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 days from now
          pendingRewards: 89.25,
          rewardToken: 'NXTB',
          apy: 18.5,
          status: 'active'
        },
        {
          poolId: 'eth-liquidity',
          amount: 2.45,
          stakedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
          lockPeriod: 0,
          unlockAt: Date.now(), // Can unstake anytime
          pendingRewards: 0.0125,
          rewardToken: 'ETH',
          apy: 8.7,
          status: 'active'
        }
      ]

      return {
        success: true,
        data: mockStakes
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Stake tokens in a pool
  async stake({ poolId, amount, duration, walletAddress }) {
    try {
      // Validate inputs
      if (!poolId || !amount || !walletAddress) {
        throw new Error('Missing required staking parameters')
      }

      if (amount <= 0) {
        throw new Error('Stake amount must be greater than 0')
      }

      // Get pool info
      const poolsResult = await this.getStakingPools()
      if (!poolsResult.success) {
        throw new Error('Failed to fetch pool information')
      }

      const pool = poolsResult.data.find(p => p.id === poolId)
      if (!pool) {
        throw new Error('Pool not found')
      }

      // Validate amount limits
      if (amount < pool.minStake) {
        throw new Error(`Minimum stake amount is ${pool.minStake} ${pool.token}`)
      }

      if (amount > pool.maxStake) {
        throw new Error(`Maximum stake amount is ${pool.maxStake} ${pool.token}`)
      }

      // Simulate staking transaction delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate mock transaction hash
      const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
      
      // Calculate estimated rewards
      const annualRewards = amount * (pool.apy / 100)
      const durationRewards = annualRewards * (duration / 365)

      // Mock successful staking result
      const stakeResult = {
        success: true,
        txHash,
        poolId,
        amount,
        duration,
        apy: pool.apy,
        estimatedRewards: durationRewards,
        unlockAt: Date.now() + duration * 24 * 60 * 60 * 1000,
        timestamp: Date.now(),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        status: 'completed'
      }

      // Store stake in local storage for demo purposes
      const stakes = JSON.parse(localStorage.getItem('nextblock_stakes') || '[]')
      stakes.unshift({
        ...stakeResult,
        stakedAt: Date.now(),
        pendingRewards: 0,
        rewardToken: pool.rewardToken,
        status: 'active'
      })
      localStorage.setItem('nextblock_stakes', JSON.stringify(stakes))

      return stakeResult

    } catch (error) {
      console.error('Staking error:', error)
      throw new Error(error.message || 'Staking failed')
    }
  }

  // Unstake tokens from a pool
  async unstake({ poolId, amount, walletAddress }) {
    try {
      // Validate inputs
      if (!poolId || !amount || !walletAddress) {
        throw new Error('Missing required unstaking parameters')
      }

      // Get user stakes
      const stakesResult = await this.getUserStakes(walletAddress)
      if (!stakesResult.success) {
        throw new Error('Failed to fetch user stakes')
      }

      const stake = stakesResult.data.find(s => s.poolId === poolId)
      if (!stake) {
        throw new Error('No stake found in this pool')
      }

      if (amount > stake.amount) {
        throw new Error('Insufficient staked amount')
      }

      // Check if still locked
      if (stake.unlockAt > Date.now()) {
        const penalty = amount * 0.05 // 5% early withdrawal penalty
        console.warn(`Early withdrawal penalty: ${penalty} tokens`)
      }

      // Simulate unstaking transaction delay
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Generate mock transaction hash
      const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')

      const unstakeResult = {
        success: true,
        txHash,
        poolId,
        amount,
        penalty: stake.unlockAt > Date.now() ? amount * 0.05 : 0,
        timestamp: Date.now(),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        status: 'completed'
      }

      // Update local storage
      const stakes = JSON.parse(localStorage.getItem('nextblock_stakes') || '[]')
      const updatedStakes = stakes.map(s => {
        if (s.poolId === poolId) {
          return {
            ...s,
            amount: s.amount - amount,
            status: s.amount - amount <= 0 ? 'unstaked' : 'active'
          }
        }
        return s
      }).filter(s => s.amount > 0)
      
      localStorage.setItem('nextblock_stakes', JSON.stringify(updatedStakes))

      return unstakeResult

    } catch (error) {
      console.error('Unstaking error:', error)
      throw new Error(error.message || 'Unstaking failed')
    }
  }

  // Claim pending rewards
  async claimRewards({ poolId, walletAddress }) {
    try {
      // Validate inputs
      if (!poolId || !walletAddress) {
        throw new Error('Missing required parameters')
      }

      // Get user stakes
      const stakesResult = await this.getUserStakes(walletAddress)
      if (!stakesResult.success) {
        throw new Error('Failed to fetch user stakes')
      }

      const stake = stakesResult.data.find(s => s.poolId === poolId)
      if (!stake) {
        throw new Error('No stake found in this pool')
      }

      if (stake.pendingRewards <= 0) {
        throw new Error('No rewards to claim')
      }

      // Simulate claiming transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate mock transaction hash
      const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')

      const claimResult = {
        success: true,
        txHash,
        poolId,
        rewardAmount: stake.pendingRewards,
        rewardToken: stake.rewardToken,
        timestamp: Date.now(),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        status: 'completed'
      }

      // Update local storage - reset pending rewards
      const stakes = JSON.parse(localStorage.getItem('nextblock_stakes') || '[]')
      const updatedStakes = stakes.map(s => {
        if (s.poolId === poolId) {
          return {
            ...s,
            pendingRewards: 0,
            lastClaimedAt: Date.now()
          }
        }
        return s
      })
      
      localStorage.setItem('nextblock_stakes', JSON.stringify(updatedStakes))

      // Store claim history
      const claims = JSON.parse(localStorage.getItem('nextblock_claims') || '[]')
      claims.unshift(claimResult)
      localStorage.setItem('nextblock_claims', JSON.stringify(claims.slice(0, 100)))

      return claimResult

    } catch (error) {
      console.error('Claim rewards error:', error)
      throw new Error(error.message || 'Claiming rewards failed')
    }
  }

  // Get staking statistics for a user
  async getStakingStats(walletAddress) {
    try {
      const stakesResult = await this.getUserStakes(walletAddress)
      if (!stakesResult.success) {
        throw new Error('Failed to fetch user stakes')
      }

      const stakes = stakesResult.data
      const claims = JSON.parse(localStorage.getItem('nextblock_claims') || '[]')

      const stats = {
        totalStaked: stakes.reduce((sum, stake) => sum + (stake.amount * 12.45), 0), // Mock USD value
        totalRewards: stakes.reduce((sum, stake) => sum + stake.pendingRewards, 0),
        totalClaimed: claims.reduce((sum, claim) => sum + claim.rewardAmount, 0),
        activeStakes: stakes.filter(stake => stake.status === 'active').length,
        avgApy: stakes.reduce((sum, stake) => sum + stake.apy, 0) / Math.max(stakes.length, 1),
        stakingHistory: stakes.length + claims.length,
        favoritePool: this.getMostStakedPool(stakes)
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get pool performance metrics
  async getPoolMetrics(poolId) {
    try {
      const mockMetrics = {
        'nbip-insurance': {
          performance7d: 2.1,
          performance30d: 8.7,
          performance90d: 24.3,
          volatility: 12.5,
          sharpeRatio: 1.8,
          maxDrawdown: -5.2,
          totalReturns: 156.7,
          riskAdjustedReturn: 14.2
        },
        'nxtb-governance': {
          performance7d: 3.2,
          performance30d: 12.1,
          performance90d: 35.8,
          volatility: 18.3,
          sharpeRatio: 2.1,
          maxDrawdown: -8.1,
          totalReturns: 198.4,
          riskAdjustedReturn: 18.5
        },
        'eth-liquidity': {
          performance7d: 1.5,
          performance30d: 6.2,
          performance90d: 18.9,
          volatility: 8.7,
          sharpeRatio: 1.2,
          maxDrawdown: -3.4,
          totalReturns: 87.3,
          riskAdjustedReturn: 8.7
        },
        'hyper-validator': {
          performance7d: 4.1,
          performance30d: 16.8,
          performance90d: 48.2,
          volatility: 25.6,
          sharpeRatio: 2.4,
          maxDrawdown: -12.3,
          totalReturns: 267.8,
          riskAdjustedReturn: 22.3
        }
      }

      return {
        success: true,
        data: mockMetrics[poolId] || mockMetrics['nbip-insurance']
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Auto-compound rewards
  async autoCompound({ poolId, walletAddress }) {
    try {
      // First claim rewards
      const claimResult = await this.claimRewards({ poolId, walletAddress })
      if (!claimResult.success) {
        throw new Error('Failed to claim rewards for compounding')
      }

      // Then stake the claimed rewards
      const stakeResult = await this.stake({
        poolId,
        amount: claimResult.rewardAmount,
        duration: 30, // Default duration
        walletAddress
      })

      return {
        success: true,
        claimTxHash: claimResult.txHash,
        stakeTxHash: stakeResult.txHash,
        compoundedAmount: claimResult.rewardAmount,
        newTotalStake: stakeResult.amount
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get staking rewards history
  async getRewardsHistory(walletAddress, limit = 50) {
    try {
      const claims = JSON.parse(localStorage.getItem('nextblock_claims') || '[]')
      
      return {
        success: true,
        data: claims.slice(0, limit)
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Helper method to get most staked pool
  getMostStakedPool(stakes) {
    if (stakes.length === 0) return null
    
    const poolAmounts = {}
    stakes.forEach(stake => {
      poolAmounts[stake.poolId] = (poolAmounts[stake.poolId] || 0) + stake.amount
    })

    return Object.entries(poolAmounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null
  }

  // Real-time rewards tracking (WebSocket simulation)
  subscribeToRewards(walletAddress, callback) {
    const interval = setInterval(async () => {
      const stakesResult = await this.getUserStakes(walletAddress)
      if (stakesResult.success) {
        // Simulate small reward increments
        const updatedStakes = stakesResult.data.map(stake => ({
          ...stake,
          pendingRewards: stake.pendingRewards + (stake.amount * stake.apy / 100 / 365 / 24) // Hourly rewards
        }))
        callback(updatedStakes)
      }
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }
}

// Export singleton instance
export const stakeService = new StakeService()
export default stakeService
