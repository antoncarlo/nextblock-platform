import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  X, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Activity
} from 'lucide-react'
import { tradeService } from '../services/tradeService'

const TradeModal = ({ isOpen, onClose, walletAddress }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(1) // 1: Setup, 2: Review, 3: Execute, 4: Complete
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Trading State
  const [fromToken, setFromToken] = useState('USDC')
  const [toToken, setToToken] = useState('NBIP')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [tradeType, setTradeType] = useState('market') // market, limit
  const [limitPrice, setLimitPrice] = useState('')
  
  // Market Data
  const [prices, setPrices] = useState({})
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] })
  const [tradingPairs, setTradingPairs] = useState([])
  const [liquidityPools, setLiquidityPools] = useState([])
  
  // Transaction State
  const [txHash, setTxHash] = useState('')
  const [executionPrice, setExecutionPrice] = useState(0)
  const [gasFee, setGasFee] = useState(0)
  const [protocolFee, setProtocolFee] = useState(0)

  // Available tokens for trading
  const availableTokens = [
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', balance: 15420.50, chain: 'Ethereum' },
    { symbol: 'NBIP', name: 'NextBlock Insurance Pool', icon: '🛡️', balance: 2500.75, chain: 'Ethereum' },
    { symbol: 'NXTB', name: 'NextBlock Token', icon: '🔷', balance: 1250.00, chain: 'Ethereum' },
    { symbol: 'ETH', name: 'Ethereum', icon: '⟠', balance: 2.45, chain: 'Ethereum' },
    { symbol: 'HYPER', name: 'HyperLiquid', icon: '⚡', balance: 1250.75, chain: 'HyperLiquid' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', balance: 0.125, chain: 'Ethereum' }
  ]

  // Mock market data
  useEffect(() => {
    if (isOpen) {
      // Simulate real-time price updates
      const interval = setInterval(() => {
        setPrices({
          'USDC': 1.00,
          'NBIP': 12.45 + (Math.random() - 0.5) * 0.5,
          'NXTB': 8.75 + (Math.random() - 0.5) * 0.3,
          'ETH': 2650 + (Math.random() - 0.5) * 50,
          'HYPER': 15.20 + (Math.random() - 0.5) * 0.8,
          'WBTC': 67500 + (Math.random() - 0.5) * 1000
        })
        
        // Mock orderbook
        setOrderbook({
          bids: [
            { price: 12.42, amount: 1500, total: 18630 },
            { price: 12.41, amount: 2300, total: 28543 },
            { price: 12.40, amount: 1800, total: 22320 },
            { price: 12.39, amount: 3200, total: 39648 },
            { price: 12.38, amount: 2100, total: 25998 }
          ],
          asks: [
            { price: 12.46, amount: 1200, total: 14952 },
            { price: 12.47, amount: 1900, total: 23693 },
            { price: 12.48, amount: 2500, total: 31200 },
            { price: 12.49, amount: 1600, total: 19984 },
            { price: 12.50, amount: 2800, total: 35000 }
          ]
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isOpen])

  // Calculate trade amounts
  useEffect(() => {
    if (fromAmount && fromToken && toToken && prices[fromToken] && prices[toToken]) {
      const fromPrice = prices[fromToken]
      const toPrice = prices[toToken]
      const calculatedAmount = (parseFloat(fromAmount) * fromPrice / toPrice) * (1 - slippage / 100)
      setToAmount(calculatedAmount.toFixed(6))
      
      // Calculate fees
      const tradingFee = parseFloat(fromAmount) * 0.003 // 0.3% trading fee
      setProtocolFee(tradingFee)
      setGasFee(0.015) // ~$40 gas fee
    }
  }, [fromAmount, fromToken, toToken, prices, slippage])

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleTrade = async () => {
    setLoading(true)
    setError('')
    
    try {
      setStep(3) // Execute step
      
      // Simulate trade execution
      const tradeResult = await tradeService.executeTrade({
        fromToken,
        toToken,
        fromAmount: parseFloat(fromAmount),
        toAmount: parseFloat(toAmount),
        slippage,
        tradeType,
        limitPrice: tradeType === 'limit' ? parseFloat(limitPrice) : null,
        walletAddress
      })
      
      setTxHash(tradeResult.txHash)
      setExecutionPrice(tradeResult.executionPrice)
      setStep(4) // Complete step
      
    } catch (err) {
      setError(err.message || 'Trade execution failed')
      setStep(2) // Back to review
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep(1)
    setFromAmount('')
    setToAmount('')
    setError('')
    setTxHash('')
    setLoading(false)
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
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t('trade.title', 'Trade Crypto')}
                </h2>
                <p className="text-sm text-gray-600">
                  Step {step} of 4 • {tradeType === 'market' ? 'Market Order' : 'Limit Order'}
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
                {/* Trade Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Order Type
                  </label>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setTradeType('market')}
                      className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                        tradeType === 'market'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span className="font-medium">Market</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Execute immediately</p>
                    </button>
                    <button
                      onClick={() => setTradeType('limit')}
                      className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                        tradeType === 'limit'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span className="font-medium">Limit</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Set target price</p>
                    </button>
                  </div>
                </div>

                {/* Trading Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Trade Setup */}
                  <div className="space-y-4">
                    {/* From Token */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700">From</label>
                        <span className="text-xs text-gray-500">
                          Balance: {availableTokens.find(t => t.symbol === fromToken)?.balance || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <select
                          value={fromToken}
                          onChange={(e) => setFromToken(e.target.value)}
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {availableTokens.map(token => (
                            <option key={token.symbol} value={token.symbol}>
                              {token.icon} {token.symbol} - {token.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-32 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          ${prices[fromToken] ? (parseFloat(fromAmount || 0) * prices[fromToken]).toFixed(2) : '0.00'}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setFromAmount((availableTokens.find(t => t.symbol === fromToken)?.balance * 0.25).toString())}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            25%
                          </button>
                          <button
                            onClick={() => setFromAmount((availableTokens.find(t => t.symbol === fromToken)?.balance * 0.5).toString())}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            50%
                          </button>
                          <button
                            onClick={() => setFromAmount((availableTokens.find(t => t.symbol === fromToken)?.balance * 0.75).toString())}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            75%
                          </button>
                          <button
                            onClick={() => setFromAmount(availableTokens.find(t => t.symbol === fromToken)?.balance.toString())}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            MAX
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleSwapTokens}
                        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                      >
                        <ArrowUpDown className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>

                    {/* To Token */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700">To</label>
                        <span className="text-xs text-gray-500">
                          Balance: {availableTokens.find(t => t.symbol === toToken)?.balance || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <select
                          value={toToken}
                          onChange={(e) => setToToken(e.target.value)}
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {availableTokens.filter(token => token.symbol !== fromToken).map(token => (
                            <option key={token.symbol} value={token.symbol}>
                              {token.icon} {token.symbol} - {token.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={toAmount}
                          readOnly
                          placeholder="0.00"
                          className="w-32 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-600"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          ${prices[toToken] ? (parseFloat(toAmount || 0) * prices[toToken]).toFixed(2) : '0.00'}
                        </span>
                        <span className="text-xs text-green-600">
                          Rate: 1 {fromToken} = {prices[fromToken] && prices[toToken] ? (prices[fromToken] / prices[toToken]).toFixed(6) : '0'} {toToken}
                        </span>
                      </div>
                    </div>

                    {/* Limit Price (if limit order) */}
                    {tradeType === 'limit' && (
                      <div className="bg-yellow-50 rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Limit Price ({toToken} per {fromToken})
                        </label>
                        <input
                          type="number"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          placeholder={prices[toToken] ? (prices[toToken] / prices[fromToken]).toFixed(6) : '0'}
                          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Current market price: {prices[fromToken] && prices[toToken] ? (prices[toToken] / prices[fromToken]).toFixed(6) : '0'}
                        </p>
                      </div>
                    )}

                    {/* Slippage Settings */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slippage Tolerance
                      </label>
                      <div className="flex space-x-2">
                        {[0.1, 0.5, 1.0].map(value => (
                          <button
                            key={value}
                            onClick={() => setSlippage(value)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              slippage === value
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            {value}%
                          </button>
                        ))}
                        <input
                          type="number"
                          value={slippage}
                          onChange={(e) => setSlippage(parseFloat(e.target.value))}
                          step="0.1"
                          min="0.1"
                          max="50"
                          className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center"
                        />
                        <span className="text-sm text-gray-500 self-center">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Market Data */}
                  <div className="space-y-4">
                    {/* Price Chart Placeholder */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{fromToken}/{toToken} Chart</h3>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">
                            ${prices[toToken]?.toFixed(4) || '0.0000'}
                          </span>
                        </div>
                      </div>
                      <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">TradingView Chart Integration</p>
                      </div>
                    </div>

                    {/* Order Book */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Order Book</h3>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 grid grid-cols-3 gap-2">
                          <span>Price ({fromToken})</span>
                          <span className="text-right">Amount ({toToken})</span>
                          <span className="text-right">Total</span>
                        </div>
                        
                        {/* Asks (Sell Orders) */}
                        {orderbook.asks.slice(0, 3).reverse().map((order, index) => (
                          <div key={`ask-${index}`} className="text-xs grid grid-cols-3 gap-2 text-red-600">
                            <span>{order.price.toFixed(2)}</span>
                            <span className="text-right">{order.amount.toLocaleString()}</span>
                            <span className="text-right">${order.total.toLocaleString()}</span>
                          </div>
                        ))}
                        
                        <div className="border-t border-gray-300 my-2"></div>
                        
                        {/* Bids (Buy Orders) */}
                        {orderbook.bids.slice(0, 3).map((order, index) => (
                          <div key={`bid-${index}`} className="text-xs grid grid-cols-3 gap-2 text-green-600">
                            <span>{order.price.toFixed(2)}</span>
                            <span className="text-right">{order.amount.toLocaleString()}</span>
                            <span className="text-right">${order.total.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trading Stats */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-medium text-gray-900 mb-3">24h Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Volume</p>
                          <p className="font-medium">$2.4M</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Change</p>
                          <p className="font-medium text-green-600">+3.2%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">High</p>
                          <p className="font-medium">${(prices[toToken] * 1.05)?.toFixed(4) || '0.0000'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Low</p>
                          <p className="font-medium">${(prices[toToken] * 0.95)?.toFixed(4) || '0.0000'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!fromAmount || !toAmount || parseFloat(fromAmount) <= 0}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Review Trade
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-medium text-blue-900 mb-3">Trade Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">You're selling:</span>
                      <span className="font-medium text-blue-900">
                        {fromAmount} {fromToken} (${(parseFloat(fromAmount) * prices[fromToken]).toFixed(2)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">You'll receive:</span>
                      <span className="font-medium text-blue-900">
                        {toAmount} {toToken} (${(parseFloat(toAmount) * prices[toToken]).toFixed(2)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Exchange rate:</span>
                      <span className="font-medium text-blue-900">
                        1 {fromToken} = {(prices[toToken] / prices[fromToken]).toFixed(6)} {toToken}
                      </span>
                    </div>
                    {tradeType === 'limit' && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">Limit price:</span>
                        <span className="font-medium text-blue-900">{limitPrice} {toToken}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-blue-700">Slippage tolerance:</span>
                      <span className="font-medium text-blue-900">{slippage}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Fees Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Protocol fee (0.3%):</span>
                      <span className="font-medium">${protocolFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Network fee:</span>
                      <span className="font-medium">${gasFee.toFixed(3)} ETH</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total fees:</span>
                        <span>${(protocolFee + gasFee * prices.ETH).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {tradeType === 'market' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Market Order Warning</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Market orders execute immediately at the best available price. 
                          The final execution price may differ from the estimated price due to market movements.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                    Back
                  </button>
                  <button
                    onClick={handleTrade}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Executing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Execute Trade</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Executing Trade</h3>
                  <p className="text-gray-600">
                    Please wait while we process your {tradeType} order...
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trading pair:</span>
                      <span className="font-medium">{fromToken}/{toToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{fromAmount} {fromToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected:</span>
                      <span className="font-medium">{toAmount} {toToken}</span>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Trade Successful!</h3>
                  <p className="text-gray-600">
                    Your {tradeType} order has been executed successfully
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-medium text-green-900 mb-3">Transaction Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Sold:</span>
                      <span className="font-medium text-green-900">{fromAmount} {fromToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Received:</span>
                      <span className="font-medium text-green-900">{toAmount} {toToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Execution price:</span>
                      <span className="font-medium text-green-900">${executionPrice.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Transaction ID:</span>
                      <span className="font-medium text-green-900 font-mono text-xs">
                        {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    View on Explorer
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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

export default TradeModal
