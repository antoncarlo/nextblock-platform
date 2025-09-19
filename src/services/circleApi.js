// Circle API Service for NEXTBLOCK Platform
// Handles all Circle Mint API interactions for fiat-to-USDC conversion

class CircleApiService {
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.circle.com' 
      : 'https://api-sandbox.circle.com'
    this.apiKey = process.env.REACT_APP_CIRCLE_API_KEY
  }

  // Helper method for API calls
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('Circle API Error:', error)
      throw error
    }
  }

  // Create a payment intent for fiat-to-USDC conversion
  async createPaymentIntent(paymentData) {
    const {
      amount,
      currency,
      paymentMethod,
      destinationWallet,
      metadata = {}
    } = paymentData

    const payload = {
      amount: {
        amount: amount.toString(),
        currency: currency
      },
      settlementCurrency: 'USD', // Circle Mint settles in USD, converts to USDC
      paymentMethods: [paymentMethod],
      metadata: {
        ...metadata,
        platform: 'NEXTBLOCK',
        investmentType: 'insurance_tokenization'
      }
    }

    return this.makeRequest('/v1/paymentIntents', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Get payment intent status
  async getPaymentIntent(paymentIntentId) {
    return this.makeRequest(`/v1/paymentIntents/${paymentIntentId}`)
  }

  // Create a business account transfer (for institutional clients)
  async createBusinessTransfer(transferData) {
    const {
      amount,
      currency,
      destinationType,
      destinationAddress,
      sourceWalletId
    } = transferData

    const payload = {
      source: {
        type: 'wallet',
        id: sourceWalletId
      },
      destination: {
        type: destinationType, // 'blockchain' for crypto wallets
        address: destinationAddress,
        currency: 'USDC'
      },
      amount: {
        amount: amount.toString(),
        currency: currency
      }
    }

    return this.makeRequest('/v1/businessAccount/transfers', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Get business account balances
  async getBusinessBalances() {
    return this.makeRequest('/v1/businessAccount/balances')
  }

  // Create a wire transfer for large institutional deposits
  async createWireTransfer(wireData) {
    const {
      amount,
      currency,
      beneficiaryBank,
      beneficiaryAccount,
      reference
    } = wireData

    const payload = {
      amount: {
        amount: amount.toString(),
        currency: currency
      },
      beneficiaryBank: {
        name: beneficiaryBank.name,
        swiftCode: beneficiaryBank.swiftCode,
        routingNumber: beneficiaryBank.routingNumber,
        address: beneficiaryBank.address
      },
      beneficiary: {
        name: beneficiaryAccount.name,
        accountNumber: beneficiaryAccount.number,
        address: beneficiaryAccount.address
      },
      reference: reference || 'NEXTBLOCK Insurance Investment'
    }

    return this.makeRequest('/v1/businessAccount/wireTransfers', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Get supported countries for Circle Mint
  async getSupportedCountries() {
    return this.makeRequest('/v1/businessAccount/configuration/countries')
  }

  // Get supported currencies
  async getSupportedCurrencies() {
    return this.makeRequest('/v1/businessAccount/configuration/currencies')
  }

  // Create a crypto payout (USDC to external wallet)
  async createCryptoPayout(payoutData) {
    const {
      amount,
      destinationAddress,
      blockchain = 'ETH', // Default to Ethereum
      memo = ''
    } = payoutData

    const payload = {
      amount: {
        amount: amount.toString(),
        currency: 'USD'
      },
      destination: {
        type: 'blockchain',
        address: destinationAddress,
        currency: 'USDC',
        chain: blockchain
      },
      metadata: {
        beneficiaryEmail: payoutData.beneficiaryEmail,
        memo: memo
      }
    }

    return this.makeRequest('/v1/businessAccount/payouts', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Get payout status
  async getPayout(payoutId) {
    return this.makeRequest(`/v1/businessAccount/payouts/${payoutId}`)
  }

  // Create a deposit address for crypto deposits
  async createDepositAddress(currency = 'USDC', blockchain = 'ETH') {
    const payload = {
      currency: currency,
      chain: blockchain
    }

    return this.makeRequest('/v1/businessAccount/wallets/addresses/deposit', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Get transaction history
  async getTransactionHistory(filters = {}) {
    const queryParams = new URLSearchParams()
    
    if (filters.from) queryParams.append('from', filters.from)
    if (filters.to) queryParams.append('to', filters.to)
    if (filters.pageBefore) queryParams.append('pageBefore', filters.pageBefore)
    if (filters.pageAfter) queryParams.append('pageAfter', filters.pageAfter)
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize)

    const endpoint = `/v1/businessAccount/transfers?${queryParams.toString()}`
    return this.makeRequest(endpoint)
  }

  // Verify webhook signature (for security)
  verifyWebhookSignature(payload, signature, secret) {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  }

  // Get exchange rates for fiat currencies
  async getExchangeRates(baseCurrency = 'USD') {
    // Note: Circle doesn't provide direct exchange rate API
    // This would typically integrate with a third-party service
    // For demo purposes, using static rates
    const rates = {
      'USD': 1.00,
      'EUR': 0.92,
      'GBP': 0.79,
      'USDC': 1.00
    }
    
    return {
      data: {
        baseCurrency,
        rates,
        timestamp: new Date().toISOString()
      }
    }
  }

  // Calculate fees for a transaction
  calculateFees(amount, currency, paymentMethod) {
    // Fee structure based on Circle Mint pricing
    const feeRates = {
      'bank_transfer': 0.005, // 0.5%
      'sepa_instant': 0.008,  // 0.8%
      'wire_transfer': 0.010, // 1.0%
      'ach': 0.003           // 0.3%
    }

    const rate = feeRates[paymentMethod] || 0.005
    const fee = parseFloat(amount) * rate
    const total = parseFloat(amount) + fee

    return {
      amount: parseFloat(amount),
      fee: fee,
      total: total,
      currency: currency,
      feeRate: rate * 100 // Convert to percentage
    }
  }

  // Validate payment data before submission
  validatePaymentData(paymentData) {
    const errors = []

    if (!paymentData.amount || paymentData.amount < 100000) {
      errors.push('Minimum investment amount is €100,000')
    }

    if (!paymentData.currency || !['EUR', 'USD', 'GBP'].includes(paymentData.currency)) {
      errors.push('Unsupported currency')
    }

    if (!paymentData.paymentMethod) {
      errors.push('Payment method is required')
    }

    if (!paymentData.destinationWallet) {
      errors.push('Destination wallet address is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Export singleton instance
export default new CircleApiService()
