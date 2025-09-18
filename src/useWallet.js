import { useState, useEffect, useCallback } from 'react'

export const useWallet = () => {
  const [account, setAccount] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState(null)
  const [error, setError] = useState(null)

  // Network configurations
  const networks = {
    1: {
      name: 'Ethereum Mainnet',
      rpc: 'https://eth.llamarpc.com',
      explorer: 'https://etherscan.io',
      currency: 'ETH'
    },
    11155111: {
      name: 'Sepolia Testnet',
      rpc: 'https://rpc.sepolia.org',
      explorer: 'https://sepolia.etherscan.io',
      currency: 'ETH'
    },
    998: {
      name: 'HyperLiquid',
      rpc: 'https://rpc.hyperliquid.xyz/evm',
      explorer: 'https://hypurrscan.io',
      currency: 'ETH'
    },
    999: {
      name: 'HyperLiquid Testnet',
      rpc: 'https://rpc.hyperliquid-testnet.xyz/evm',
      explorer: 'https://hypurrscan-testnet.io',
      currency: 'ETH'
    }
  }

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  // Connect to wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        
        // Get chain ID
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        })
        setChainId(parseInt(chainId, 16))

        // Store connection in localStorage
        localStorage.setItem('walletConnected', 'true')
        localStorage.setItem('walletAccount', accounts[0])
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error)
      setError(error.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setChainId(null)
    setError(null)
    localStorage.removeItem('walletConnected')
    localStorage.removeItem('walletAccount')
    localStorage.removeItem('userRole')
  }, [])

  // Switch to HyperLiquid network
  const switchToHyperLiquid = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed')
      return
    }

    try {
      // Try to switch to HyperLiquid network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3e6' }], // 998 in hex
      })
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x3e6', // 998 in hex
                chainName: 'HyperLiquid',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.hyperliquid.xyz/evm'],
                blockExplorerUrls: ['https://hypurrscan.io'],
              },
            ],
          })
        } catch (addError) {
          console.error('Error adding HyperLiquid network:', addError)
          setError('Failed to add HyperLiquid network')
        }
      } else {
        console.error('Error switching to HyperLiquid network:', switchError)
        setError('Failed to switch to HyperLiquid network')
      }
    }
  }, [])

  // Switch to HyperLiquid Testnet
  const switchToHyperLiquidTestnet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed')
      return
    }

    try {
      // Try to switch to HyperLiquid Testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3e7' }], // 999 in hex
      })
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x3e7', // 999 in hex
                chainName: 'HyperLiquid Testnet',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.hyperliquid-testnet.xyz/evm'],
                blockExplorerUrls: ['https://hypurrscan-testnet.io'],
              },
            ],
          })
        } catch (addError) {
          console.error('Error adding HyperLiquid Testnet:', addError)
          setError('Failed to add HyperLiquid Testnet')
        }
      } else {
        console.error('Error switching to HyperLiquid Testnet:', switchError)
        setError('Failed to switch to HyperLiquid Testnet')
      }
    }
  }, [])

  // Switch to Ethereum mainnet
  const switchToEthereum = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed')
      return
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // 1 in hex (Ethereum mainnet)
      })
    } catch (error) {
      console.error('Error switching to Ethereum:', error)
      setError('Failed to switch to Ethereum network')
    }
  }, [])

  // Switch to Sepolia testnet
  const switchToSepolia = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed')
      return
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 11155111 in hex (Sepolia)
      })
    } catch (error) {
      console.error('Error switching to Sepolia:', error)
      setError('Failed to switch to Sepolia network')
    }
  }, [])

  // Get network information
  const getNetworkInfo = useCallback((chainId) => {
    return networks[chainId] || {
      name: `Unknown Network (${chainId})`,
      rpc: '',
      explorer: '',
      currency: 'ETH'
    }
  }, [])

  // Check if network is supported
  const isSupportedNetwork = useCallback((chainId) => {
    return chainId in networks
  }, [])

  // Get network status
  const getNetworkStatus = useCallback((chainId) => {
    if (!chainId) return 'disconnected'
    if (!isSupportedNetwork(chainId)) return 'unsupported'
    if (chainId === 1 || chainId === 998) return 'mainnet'
    return 'testnet'
  }, [isSupportedNetwork])

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        setAccount(accounts[0])
        localStorage.setItem('walletAccount', accounts[0])
      }
    }

    const handleChainChanged = (chainId) => {
      const newChainId = parseInt(chainId, 16)
      setChainId(newChainId)
      
      // Clear error when switching networks
      setError(null)
      
      // Show network switch notification
      const networkInfo = getNetworkInfo(newChainId)
      console.log(`Switched to ${networkInfo.name}`)
    }

    const handleDisconnect = () => {
      disconnectWallet()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('disconnect', handleDisconnect)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
      window.ethereum.removeListener('disconnect', handleDisconnect)
    }
  }, [disconnectWallet, getNetworkInfo])

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })

        if (accounts.length > 0) {
          setAccount(accounts[0])
          
          const chainId = await window.ethereum.request({
            method: 'eth_chainId',
          })
          setChainId(parseInt(chainId, 16))
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }

    checkConnection()
  }, [])

  // Clear error function
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const networkInfo = getNetworkInfo(chainId)

  return {
    // State
    account,
    chainId,
    isConnecting,
    error,
    isConnected: !!account,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    
    // Network info
    networkName: networkInfo.name,
    networkInfo,
    isSupportedNetwork: isSupportedNetwork(chainId),
    networkStatus: getNetworkStatus(chainId),
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchToHyperLiquid,
    switchToHyperLiquidTestnet,
    switchToEthereum,
    switchToSepolia,
    clearError,
    
    // Utilities
    getNetworkInfo,
    networks,
  }
}
