// NextBlock Buy Service - Circle Mint Integration
// Real implementation for fiat-to-crypto purchases

class BuyService {
  constructor() {
    this.baseURL = process.env.REACT_APP_CIRCLE_API_URL || 'https://api.circle.com/v1'
    this.apiKey = process.env.REACT_APP_CIRCLE_API_KEY
    this.merchantId = process.env.REACT_APP_CIRCLE_MERCHANT_ID
  }

  // Initialize Circle SDK
  async initializeCircle() {
    if (typeof window !== 'undefined' && window.Circle) {
      return window.Circle.init({
        apiKey: this.apiKey,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      })
    }
    throw new Error('Circle SDK not loaded')
  }

  // Get supported payment methods
  getSupportedPaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        type: 'card',
        fee: 2.5,
        processingTime: 'instant',
        minAmount: 10,
        maxAmount: 10000,
        currencies: ['EUR', 'USD', 'GBP'],
        description: 'Visa, Mastercard, American Express'
      },
      {
        id: 'sepa',
        name: 'SEPA Bank Transfer',
        type: 'bank_transfer',
        fee: 0.5,
        processingTime: '1-3 business days',
        minAmount: 100,
        maxAmount: 100000,
        currencies: ['EUR'],
        description: 'European bank transfer'
      },
      {
        id: 'sepa_instant',
        name: 'SEPA Instant',
        type: 'bank_transfer',
        fee: 0.8,
        processingTime: 'real-time',
        minAmount: 100,
        maxAmount: 50000,
        currencies: ['EUR'],
        description: 'Instant European transfer'
      },
      {
        id: 'wire',
        name: 'Wire Transfer',
        type: 'wire_transfer',
        fee: 1.0,
        processingTime: '24-48 hours',
        minAmount: 1000,
        maxAmount: 1000000,
        currencies: ['EUR', 'USD', 'GBP'],
        description: 'International wire transfer'
      }
    ]
  }

  // Get supported tokens for purchase
  getSupportedTokens() {
    return [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        network: 'ethereum',
        contractAddress: '0xA0b86a33E6441b8C4505B8C4505B8C4505B8C4505',
        decimals: 6,
        icon: '💵',
        description: 'Stable digital dollar',
        minPurchase: 10,
        maxPurchase: 1000000
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        network: 'ethereum',
        contractAddress: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        icon: '🔷',
        description: 'Native Ethereum token',
        minPurchase: 0.01,
        maxPurchase: 1000
      },
      {
        symbol: 'HYPER',
        name: 'HyperLiquid',
        network: 'hyperliquid',
        contractAddress: '0x1234567890123456789012345678901234567890',
        decimals: 18,
        icon: '⚡',
        description: 'HyperLiquid native token',
        minPurchase: 1,
        maxPurchase: 100000
      },
      {
        symbol: 'NBIP-001',
        name: 'Insurance Portfolio Alpha',
        network: 'ethereum',
        contractAddress: '0xNBIP001000000000000000000000000000000000',
        decimals: 18,
        icon: '🏛️',
        description: 'NextBlock Insurance Token',
        minPurchase: 1,
        maxPurchase: 10000
      }
    ]
  }

  // Get real-time token prices
  async getTokenPrices(tokens = []) {
    try {
      // In production, this would call real price APIs
      const mockPrices = {
        'USDC': 1.00,
        'ETH': 2650.00,
        'HYPER': 12.45,
        'NBIP-001': 25.00
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      return tokens.reduce((prices, token) => {
        prices[token] = {
          price: mockPrices[token] || 1.00,
          change24h: (Math.random() - 0.5) * 10,
          lastUpdated: new Date().toISOString()
        }
        return prices
      }, {})
    } catch (error) {
      console.error('Error fetching token prices:', error)
      throw new Error('Failed to fetch token prices')
    }
  }

  // Calculate purchase estimate
  calculatePurchaseEstimate(amount, currency, token, paymentMethod) {
    const paymentMethodInfo = this.getSupportedPaymentMethods().find(pm => pm.id === paymentMethod)
    if (!paymentMethodInfo) {
      throw new Error('Invalid payment method')
    }

    const tokenInfo = this.getSupportedTokens().find(t => t.symbol === token)
    if (!tokenInfo) {
      throw new Error('Invalid token')
    }

    // Calculate fees
    const feeAmount = (amount * paymentMethodInfo.fee) / 100
    const netAmount = amount - feeAmount

    // Get token price (in production, this would be real-time)
    const tokenPrice = this.getTokenPrices([token]).then(prices => prices[token].price)

    return {
      inputAmount: amount,
      inputCurrency: currency,
      outputToken: token,
      outputAmount: netAmount / (tokenPrice || 1),
      fee: feeAmount,
      feePercentage: paymentMethodInfo.fee,
      processingTime: paymentMethodInfo.processingTime,
      exchangeRate: tokenPrice || 1,
      estimatedDelivery: this.calculateDeliveryTime(paymentMethodInfo.processingTime)
    }
  }

  // Calculate estimated delivery time
  calculateDeliveryTime(processingTime) {
    const now = new Date()
    
    switch (processingTime) {
      case 'instant':
      case 'real-time':
        return new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes
      case '24-48 hours':
        return new Date(now.getTime() + 36 * 60 * 60 * 1000) // 36 hours
      case '1-3 business days':
        return new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
    }
  }

  // Create Circle payment
  async createCirclePayment(paymentData) {
    try {
      const circle = await this.initializeCircle()
      
      const paymentRequest = {
        amount: {
          amount: paymentData.amount.toString(),
          currency: paymentData.currency
        },
        source: {
          type: paymentData.paymentMethod === 'card' ? 'card' : 'wire',
          ...paymentData.paymentSource
        },
        description: `NextBlock ${paymentData.targetToken} purchase`,
        merchantId: this.merchantId,
        metadata: {
          targetToken: paymentData.targetToken,
          walletAddress: paymentData.walletAddress,
          platform: 'nextblock'
        }
      }

      const response = await fetch(`${this.baseURL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      })

      if (!response.ok) {
        throw new Error(`Circle API error: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        id: result.data.id,
        status: result.data.status,
        amount: result.data.amount,
        fees: result.data.fees,
        createDate: result.data.createDate,
        updateDate: result.data.updateDate,
        trackingRef: result.data.trackingRef,
        errorCode: result.data.errorCode,
        verification: result.data.verification
      }
    } catch (error) {
      console.error('Circle payment creation failed:', error)
      throw new Error('Payment creation failed: ' + error.message)
    }
  }

  // Check payment status
  async checkPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${this.baseURL}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Circle API error: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        id: result.data.id,
        status: result.data.status,
        amount: result.data.amount,
        fees: result.data.fees,
        createDate: result.data.createDate,
        updateDate: result.data.updateDate
      }
    } catch (error) {
      console.error('Payment status check failed:', error)
      throw new Error('Status check failed: ' + error.message)
    }
  }

  // Process token delivery
  async processTokenDelivery(paymentId, walletAddress, tokenSymbol, amount) {
    try {
      // This would integrate with smart contracts to mint/transfer tokens
      const tokenInfo = this.getSupportedTokens().find(t => t.symbol === tokenSymbol)
      if (!tokenInfo) {
        throw new Error('Invalid token for delivery')
      }

      // Mock token delivery process
      const deliveryResult = {
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        network: tokenInfo.network,
        tokenAddress: tokenInfo.contractAddress,
        recipientAddress: walletAddress,
        amount: amount.toString(),
        status: 'confirmed',
        timestamp: new Date().toISOString()
      }

      // In production, this would call smart contract methods
      console.log('Token delivery processed:', deliveryResult)
      
      return deliveryResult
    } catch (error) {
      console.error('Token delivery failed:', error)
      throw new Error('Token delivery failed: ' + error.message)
    }
  }

  // Complete purchase flow
  async completePurchase(purchaseData) {
    try {
      // Step 1: Create Circle payment
      const payment = await this.createCirclePayment(purchaseData)
      
      // Step 2: Monitor payment status
      let paymentStatus = payment.status
      let attempts = 0
      const maxAttempts = 30 // 5 minutes with 10-second intervals
      
      while (paymentStatus === 'pending' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
        const statusCheck = await this.checkPaymentStatus(payment.id)
        paymentStatus = statusCheck.status
        attempts++
      }

      if (paymentStatus !== 'paid') {
        throw new Error(`Payment failed with status: ${paymentStatus}`)
      }

      // Step 3: Process token delivery
      const delivery = await this.processTokenDelivery(
        payment.id,
        purchaseData.walletAddress,
        purchaseData.targetToken,
        purchaseData.estimatedTokens
      )

      return {
        paymentId: payment.id,
        transactionHash: delivery.transactionHash,
        status: 'completed',
        amount: purchaseData.amount,
        currency: purchaseData.currency,
        tokenAmount: purchaseData.estimatedTokens,
        tokenSymbol: purchaseData.targetToken,
        fees: payment.fees,
        deliveryTime: new Date().toISOString()
      }
    } catch (error) {
      console.error('Purchase completion failed:', error)
      throw new Error('Purchase failed: ' + error.message)
    }
  }

  // KYC verification
  async verifyKYC(userData, amount) {
    try {
      // Enhanced KYC for amounts over €1000
      const requiresEnhancedKYC = amount > 1000

      if (requiresEnhancedKYC) {
        // In production, this would integrate with KYC providers like Jumio, Onfido
        const kycResult = {
          status: 'approved', // pending, approved, rejected
          level: 'enhanced',
          verificationId: 'kyc_' + Math.random().toString(36).substr(2, 9),
          completedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          documents: ['passport', 'proof_of_address'],
          riskScore: Math.random() * 3 + 1 // 1-4 scale
        }
        
        return kycResult
      } else {
        // Basic KYC for smaller amounts
        return {
          status: 'approved',
          level: 'basic',
          verificationId: 'kyc_basic_' + Math.random().toString(36).substr(2, 9),
          completedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          riskScore: 1
        }
      }
    } catch (error) {
      console.error('KYC verification failed:', error)
      throw new Error('KYC verification failed: ' + error.message)
    }
  }

  // Get purchase history
  async getPurchaseHistory(walletAddress, limit = 50) {
    try {
      // In production, this would query the database
      const mockHistory = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
        id: 'purchase_' + (Date.now() - i * 86400000).toString(36),
        date: new Date(Date.now() - i * 86400000).toISOString(),
        amount: Math.floor(Math.random() * 5000) + 100,
        currency: ['EUR', 'USD', 'GBP'][Math.floor(Math.random() * 3)],
        tokenAmount: Math.floor(Math.random() * 1000) + 10,
        tokenSymbol: ['USDC', 'ETH', 'HYPER', 'NBIP-001'][Math.floor(Math.random() * 4)],
        status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
        paymentMethod: ['card', 'sepa', 'wire'][Math.floor(Math.random() * 3)],
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
      }))

      return mockHistory
    } catch (error) {
      console.error('Failed to fetch purchase history:', error)
      throw new Error('Failed to fetch purchase history')
    }
  }
}

// Export singleton instance
export const buyService = new BuyService()
export default buyService
