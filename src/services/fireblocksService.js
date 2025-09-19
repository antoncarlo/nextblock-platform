// Fireblocks Service for NEXTBLOCK Platform
// Handles institutional-grade custody and wallet management

class FireblocksService {
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.fireblocks.io' 
      : 'https://sandbox-api.fireblocks.io'
    this.apiKey = process.env.REACT_APP_FIREBLOCKS_API_KEY
    this.privateKey = process.env.REACT_APP_FIREBLOCKS_PRIVATE_KEY
  }

  // Generate JWT token for Fireblocks API authentication
  generateJWT(path, bodyJson = '') {
    const crypto = require('crypto')
    const jwt = require('jsonwebtoken')
    
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      uri: path,
      nonce: now,
      iat: now,
      exp: now + 55, // Token expires in 55 seconds
      sub: this.apiKey,
      bodyHash: crypto.createHash('sha256').update(bodyJson).digest('hex')
    }

    return jwt.sign(payload, this.privateKey, { algorithm: 'RS256' })
  }

  // Helper method for API calls
  async makeRequest(endpoint, options = {}) {
    const path = endpoint
    const bodyJson = options.body || ''
    const token = this.generateJWT(path, bodyJson)
    
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Key': this.apiKey,
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
      console.error('Fireblocks API Error:', error)
      throw error
    }
  }

  // Create a new vault account (wallet)
  async createVaultAccount(name, customerRefId = null) {
    const payload = {
      name: name,
      customerRefId: customerRefId || `nextblock_${Date.now()}`,
      autoFuel: true // Automatically manage gas fees
    }

    return this.makeRequest('/v1/vault/accounts', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Get all vault accounts
  async getVaultAccounts() {
    return this.makeRequest('/v1/vault/accounts')
  }

  // Get specific vault account
  async getVaultAccount(vaultAccountId) {
    return this.makeRequest(`/v1/vault/accounts/${vaultAccountId}`)
  }

  // Create a new asset wallet within a vault account
  async createAssetWallet(vaultAccountId, assetId = 'USDC') {
    return this.makeRequest(`/v1/vault/accounts/${vaultAccountId}/${assetId}`, {
      method: 'POST'
    })
  }

  // Get asset balance for a vault account
  async getAssetBalance(vaultAccountId, assetId = 'USDC') {
    return this.makeRequest(`/v1/vault/accounts/${vaultAccountId}/${assetId}`)
  }

  // Create a transaction
  async createTransaction(transactionData) {
    const {
      assetId = 'USDC',
      source,
      destination,
      amount,
      fee,
      note = '',
      customerRefId = null
    } = transactionData

    const payload = {
      assetId: assetId,
      source: source,
      destination: destination,
      amount: amount.toString(),
      fee: fee || undefined,
      note: note,
      customerRefId: customerRefId || `tx_${Date.now()}`,
      treatAsGrossAmount: false,
      forceSweep: false,
      feeLevel: 'MEDIUM' // LOW, MEDIUM, HIGH
    }

    return this.makeRequest('/v1/transactions', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Get transaction by ID
  async getTransaction(txId) {
    return this.makeRequest(`/v1/transactions/${txId}`)
  }

  // Get transaction history
  async getTransactions(filters = {}) {
    const queryParams = new URLSearchParams()
    
    if (filters.before) queryParams.append('before', filters.before)
    if (filters.after) queryParams.append('after', filters.after)
    if (filters.status) queryParams.append('status', filters.status)
    if (filters.limit) queryParams.append('limit', filters.limit)
    if (filters.orderBy) queryParams.append('orderBy', filters.orderBy)
    if (filters.sort) queryParams.append('sort', filters.sort)

    const endpoint = `/v1/transactions?${queryParams.toString()}`
    return this.makeRequest(endpoint)
  }

  // Cancel a transaction
  async cancelTransaction(txId) {
    return this.makeRequest(`/v1/transactions/${txId}/cancel`, {
      method: 'POST'
    })
  }

  // Get supported assets
  async getSupportedAssets() {
    return this.makeRequest('/v1/supported_assets')
  }

  // Get network fee for a transaction
  async estimateNetworkFee(assetId, amount, source, destination) {
    const payload = {
      assetId: assetId,
      amount: amount.toString(),
      source: source,
      destination: destination
    }

    return this.makeRequest('/v1/estimate_network_fee', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Create a deposit address
  async createDepositAddress(vaultAccountId, assetId = 'USDC') {
    return this.makeRequest(`/v1/vault/accounts/${vaultAccountId}/${assetId}/addresses`, {
      method: 'POST'
    })
  }

  // Get deposit addresses
  async getDepositAddresses(vaultAccountId, assetId = 'USDC') {
    return this.makeRequest(`/v1/vault/accounts/${vaultAccountId}/${assetId}/addresses`)
  }

  // Validate an address
  async validateAddress(assetId, address) {
    return this.makeRequest(`/v1/transactions/validate_address/${assetId}/${address}`)
  }

  // Get exchange accounts (for trading)
  async getExchangeAccounts() {
    return this.makeRequest('/v1/exchange_accounts')
  }

  // Transfer between vault and exchange
  async transferToExchange(source, destination, assetId, amount) {
    const payload = {
      assetId: assetId,
      source: source,
      destination: destination,
      amount: amount.toString()
    }

    return this.makeRequest('/v1/transactions', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Get gas station info
  async getGasStationInfo() {
    return this.makeRequest('/v1/gas_station')
  }

  // Set gas station configuration
  async setGasStationConfiguration(config) {
    return this.makeRequest('/v1/gas_station/configuration', {
      method: 'PUT',
      body: JSON.stringify(config)
    })
  }

  // Get webhook notifications
  async getWebhooks() {
    return this.makeRequest('/v1/webhooks')
  }

  // Create webhook
  async createWebhook(url, events) {
    const payload = {
      url: url,
      events: events // Array of event types
    }

    return this.makeRequest('/v1/webhooks', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Multi-signature operations
  async createMultiSigWallet(name, signers, threshold) {
    const payload = {
      name: name,
      signers: signers, // Array of signer public keys
      threshold: threshold, // Required signatures
      customerRefId: `multisig_${Date.now()}`
    }

    return this.makeRequest('/v1/vault/accounts', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Sign a transaction (for multi-sig)
  async signTransaction(txId, signature) {
    const payload = {
      signature: signature
    }

    return this.makeRequest(`/v1/transactions/${txId}/sign`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Get pending transactions requiring signature
  async getPendingTransactions(vaultAccountId = null) {
    const filters = {
      status: 'SUBMITTED,PENDING_SIGNATURE,PENDING_AUTHORIZATION',
      limit: 50
    }

    if (vaultAccountId) {
      // Filter by vault account if specified
      const transactions = await this.getTransactions(filters)
      return transactions.filter(tx => 
        tx.source?.id === vaultAccountId || tx.destination?.id === vaultAccountId
      )
    }

    return this.getTransactions(filters)
  }

  // Treasury management functions
  async getTreasuryOverview() {
    try {
      const accounts = await this.getVaultAccounts()
      let totalBalance = 0
      const walletBalances = []

      for (const account of accounts) {
        try {
          const balance = await this.getAssetBalance(account.id, 'USDC')
          const balanceAmount = parseFloat(balance.available || 0)
          totalBalance += balanceAmount
          
          walletBalances.push({
            id: account.id,
            name: account.name,
            balance: balanceAmount,
            status: account.status
          })
        } catch (error) {
          console.warn(`Could not fetch balance for account ${account.id}:`, error)
        }
      }

      return {
        totalBalance,
        walletBalances,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching treasury overview:', error)
      throw error
    }
  }

  // Risk management
  async setTransactionLimits(vaultAccountId, limits) {
    const payload = {
      dailyLimit: limits.daily,
      monthlyLimit: limits.monthly,
      transactionLimit: limits.transaction
    }

    return this.makeRequest(`/v1/vault/accounts/${vaultAccountId}/set_customer_ref_id`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Compliance and reporting
  async generateComplianceReport(startDate, endDate) {
    const transactions = await this.getTransactions({
      after: startDate,
      before: endDate,
      limit: 1000
    })

    return {
      period: { startDate, endDate },
      totalTransactions: transactions.length,
      totalVolume: transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0),
      transactions: transactions.map(tx => ({
        id: tx.id,
        timestamp: tx.createdAt,
        amount: tx.amount,
        asset: tx.assetId,
        source: tx.source,
        destination: tx.destination,
        status: tx.status
      }))
    }
  }

  // Emergency functions
  async freezeAccount(vaultAccountId) {
    return this.makeRequest(`/v1/vault/accounts/${vaultAccountId}/freeze`, {
      method: 'POST'
    })
  }

  async unfreezeAccount(vaultAccountId) {
    return this.makeRequest(`/v1/vault/accounts/${vaultAccountId}/unfreeze`, {
      method: 'POST'
    })
  }
}

// Export singleton instance
export default new FireblocksService()
