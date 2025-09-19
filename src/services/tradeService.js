// Trade Service - Handles DEX trading operations
class TradeService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.nextblock.io'
    this.dexRouters = {
      ethereum: {
        uniswap: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        sushiswap: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
        curve: '0x99a58482BD75cbab83b27EC03CA68fF489b5788f'
      },
      hyperliquid: {
        native: '0x0000000000000000000000000000000000000001'
      }
    }
    this.supportedTokens = new Map([
      ['USDC', { address: '0xA0b86a33E6441b8435b662303c0f479c7e1d5916', decimals: 6, chain: 'ethereum' }],
      ['NBIP', { address: '0x1234567890123456789012345678901234567890', decimals: 18, chain: 'ethereum' }],
      ['NXTB', { address: '0x2345678901234567890123456789012345678901', decimals: 18, chain: 'ethereum' }],
      ['ETH', { address: '0x0000000000000000000000000000000000000000', decimals: 18, chain: 'ethereum' }],
      ['WBTC', { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, chain: 'ethereum' }],
      ['HYPER', { address: '0x0000000000000000000000000000000000000001', decimals: 18, chain: 'hyperliquid' }]
    ])
  }

  // Get real-time prices from multiple sources
  async getPrices(tokens = []) {
    try {
      // In production, this would aggregate from multiple price feeds
      const mockPrices = {
        'USDC': 1.00,
        'NBIP': 12.45,
        'NXTB': 8.75,
        'ETH': 2650.00,
        'WBTC': 67500.00,
        'HYPER': 15.20
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Add some realistic price volatility
      const prices = {}
      for (const [token, basePrice] of Object.entries(mockPrices)) {
        if (tokens.length === 0 || tokens.includes(token)) {
          const volatility = token === 'USDC' ? 0.001 : 0.02 // USDC is more stable
          const change = (Math.random() - 0.5) * volatility
          prices[token] = basePrice * (1 + change)
        }
      }

      return {
        success: true,
        data: prices,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Error fetching prices:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get trading pairs and liquidity info
  async getTradingPairs() {
    try {
      const pairs = [
        {
          id: 'NBIP-USDC',
          baseToken: 'NBIP',
          quoteToken: 'USDC',
          liquidity: 2450000,
          volume24h: 850000,
          fee: 0.003,
          chain: 'ethereum',
          dex: 'uniswap'
        },
        {
          id: 'NXTB-USDC',
          baseToken: 'NXTB',
          quoteToken: 'USDC',
          liquidity: 1200000,
          volume24h: 420000,
          fee: 0.003,
          chain: 'ethereum',
          dex: 'uniswap'
        },
        {
          id: 'ETH-USDC',
          baseToken: 'ETH',
          quoteToken: 'USDC',
          liquidity: 15000000,
          volume24h: 5200000,
          fee: 0.003,
          chain: 'ethereum',
          dex: 'uniswap'
        },
        {
          id: 'HYPER-USDC',
          baseToken: 'HYPER',
          quoteToken: 'USDC',
          liquidity: 3200000,
          volume24h: 1100000,
          fee: 0.001,
          chain: 'hyperliquid',
          dex: 'native'
        }
      ]

      return {
        success: true,
        data: pairs
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get order book for a trading pair
  async getOrderBook(baseToken, quoteToken) {
    try {
      // Mock order book data
      const spread = 0.001 // 0.1% spread
      const midPrice = 12.45 // Mock mid price for NBIP/USDC
      
      const bids = []
      const asks = []
      
      // Generate realistic order book
      for (let i = 0; i < 10; i++) {
        const bidPrice = midPrice * (1 - spread/2 - i * 0.0005)
        const askPrice = midPrice * (1 + spread/2 + i * 0.0005)
        const bidAmount = Math.random() * 5000 + 500
        const askAmount = Math.random() * 5000 + 500
        
        bids.push({
          price: bidPrice,
          amount: bidAmount,
          total: bidPrice * bidAmount
        })
        
        asks.push({
          price: askPrice,
          amount: askAmount,
          total: askPrice * askAmount
        })
      }

      return {
        success: true,
        data: {
          bids: bids.sort((a, b) => b.price - a.price),
          asks: asks.sort((a, b) => a.price - b.price),
          spread: spread,
          midPrice: midPrice
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Calculate optimal trade route
  async getTradeRoute(fromToken, toToken, amount, slippage = 0.5) {
    try {
      const tokenFrom = this.supportedTokens.get(fromToken)
      const tokenTo = this.supportedTokens.get(toToken)
      
      if (!tokenFrom || !tokenTo) {
        throw new Error('Unsupported token pair')
      }

      // For cross-chain trades, we'd need to use bridges
      const needsBridge = tokenFrom.chain !== tokenTo.chain
      
      let route = []
      let estimatedGas = 150000 // Base gas estimate
      
      if (needsBridge) {
        // Cross-chain route via bridge
        route = [
          {
            step: 1,
            action: 'swap',
            fromToken,
            toToken: 'USDC', // Bridge through USDC
            dex: 'uniswap',
            chain: tokenFrom.chain,
            estimatedOutput: amount * 0.997 // 0.3% fee
          },
          {
            step: 2,
            action: 'bridge',
            fromToken: 'USDC',
            toToken: 'USDC',
            fromChain: tokenFrom.chain,
            toChain: tokenTo.chain,
            bridgeProtocol: 'layerzero',
            estimatedOutput: amount * 0.997 * 0.999 // Additional bridge fee
          },
          {
            step: 3,
            action: 'swap',
            fromToken: 'USDC',
            toToken: tokenTo,
            dex: tokenTo.chain === 'hyperliquid' ? 'native' : 'uniswap',
            chain: tokenTo.chain,
            estimatedOutput: amount * 0.997 * 0.999 * 0.997
          }
        ]
        estimatedGas = 450000 // Higher gas for cross-chain
      } else {
        // Same-chain direct swap
        route = [
          {
            step: 1,
            action: 'swap',
            fromToken: tokenFrom,
            toToken: tokenTo,
            dex: tokenFrom.chain === 'hyperliquid' ? 'native' : 'uniswap',
            chain: tokenFrom.chain,
            estimatedOutput: amount * (1 - slippage / 100) * 0.997
          }
        ]
      }

      return {
        success: true,
        data: {
          route,
          estimatedGas,
          estimatedTime: needsBridge ? '2-5 minutes' : '30 seconds',
          priceImpact: amount > 100000 ? 0.5 : 0.1, // Higher impact for large trades
          minimumReceived: route[route.length - 1].estimatedOutput * (1 - slippage / 100)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Execute trade transaction
  async executeTrade({
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippage,
    tradeType,
    limitPrice = null,
    walletAddress
  }) {
    try {
      // Validate inputs
      if (!fromToken || !toToken || !fromAmount || !walletAddress) {
        throw new Error('Missing required trade parameters')
      }

      if (fromAmount <= 0) {
        throw new Error('Trade amount must be greater than 0')
      }

      // Get trade route
      const routeResult = await this.getTradeRoute(fromToken, toToken, fromAmount, slippage)
      if (!routeResult.success) {
        throw new Error(routeResult.error)
      }

      // Simulate trade execution delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate mock transaction hash
      const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
      
      // Calculate execution price with some slippage
      const executionSlippage = (Math.random() - 0.5) * slippage / 100
      const executionPrice = (toAmount / fromAmount) * (1 + executionSlippage)
      const actualReceived = fromAmount * executionPrice

      // Mock successful trade result
      const tradeResult = {
        success: true,
        txHash,
        fromToken,
        toToken,
        fromAmount,
        toAmount: actualReceived,
        executionPrice,
        slippage: Math.abs(executionSlippage * 100),
        gasFee: routeResult.data.estimatedGas * 0.00002, // Mock gas price
        protocolFee: fromAmount * 0.003,
        timestamp: Date.now(),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        status: tradeType === 'limit' ? 'pending' : 'completed'
      }

      // Store trade in local storage for demo purposes
      const trades = JSON.parse(localStorage.getItem('nextblock_trades') || '[]')
      trades.unshift(tradeResult)
      localStorage.setItem('nextblock_trades', JSON.stringify(trades.slice(0, 100))) // Keep last 100 trades

      return tradeResult

    } catch (error) {
      console.error('Trade execution error:', error)
      throw new Error(error.message || 'Trade execution failed')
    }
  }

  // Get trade history for a wallet
  async getTradeHistory(walletAddress, limit = 50) {
    try {
      // In production, this would query the blockchain and our database
      const trades = JSON.parse(localStorage.getItem('nextblock_trades') || '[]')
      
      return {
        success: true,
        data: trades.slice(0, limit)
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Cancel pending limit order
  async cancelOrder(orderId) {
    try {
      // Mock order cancellation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        success: true,
        message: 'Order cancelled successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get trading statistics
  async getTradingStats(walletAddress) {
    try {
      const trades = JSON.parse(localStorage.getItem('nextblock_trades') || '[]')
      
      const stats = {
        totalTrades: trades.length,
        totalVolume: trades.reduce((sum, trade) => sum + (trade.fromAmount * 12.45), 0), // Mock USD value
        totalFees: trades.reduce((sum, trade) => sum + trade.protocolFee, 0),
        avgSlippage: trades.reduce((sum, trade) => sum + trade.slippage, 0) / Math.max(trades.length, 1),
        successRate: trades.filter(trade => trade.status === 'completed').length / Math.max(trades.length, 1) * 100,
        favoriteTokens: this.getMostTradedTokens(trades)
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

  // Helper method to get most traded tokens
  getMostTradedTokens(trades) {
    const tokenCounts = {}
    
    trades.forEach(trade => {
      tokenCounts[trade.fromToken] = (tokenCounts[trade.fromToken] || 0) + 1
      tokenCounts[trade.toToken] = (tokenCounts[trade.toToken] || 0) + 1
    })

    return Object.entries(tokenCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([token, count]) => ({ token, count }))
  }

  // Real-time price subscription (WebSocket simulation)
  subscribeToPrices(tokens, callback) {
    const interval = setInterval(async () => {
      const priceResult = await this.getPrices(tokens)
      if (priceResult.success) {
        callback(priceResult.data)
      }
    }, 2000)

    return () => clearInterval(interval)
  }
}

// Export singleton instance
export const tradeService = new TradeService()
export default tradeService
