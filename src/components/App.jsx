import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Landing Page Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Alliances from './components/Alliances'
import Solution from './components/Solution'
import Features from './components/Features'
import CEO from './components/CEO'
import Roadmap from './components/Roadmap'
import Footer from './components/Footer'

// Platform Components
import Dashboard from './components/Dashboard'
import InsurancePortal from './components/InsurancePortal'
import InvestorDashboard from './components/InvestorDashboard'
import Analytics from './components/Analytics'
import TokenizeRisk from './components/TokenizeRisk'
import Marketplace from './components/Marketplace'
import Portfolio from './components/Portfolio'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [userRole, setUserRole] = useState(null) // 'insurance' or 'investor'
  const [chainId, setChainId] = useState(null)

  // Wallet connection logic
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnecting(true)
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        })
        
        setAccount(accounts[0])
        setChainId(chainId)
        setIsConnected(true)
        
        // Store connection in localStorage
        localStorage.setItem('walletConnected', 'true')
        localStorage.setItem('walletAccount', accounts[0])
        
      } catch (error) {
        console.error('Error connecting wallet:', error)
      } finally {
        setIsConnecting(false)
      }
    } else {
      alert('Please install MetaMask to connect your wallet')
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false)
    setAccount('')
    setUserRole(null)
    setChainId(null)
    localStorage.removeItem('walletConnected')
    localStorage.removeItem('walletAccount')
    localStorage.removeItem('userRole')
  }

  // Set user role
  const selectRole = (role) => {
    setUserRole(role)
    localStorage.setItem('userRole', role)
  }

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          })
          
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({
              method: 'eth_chainId',
            })
            
            setAccount(accounts[0])
            setChainId(chainId)
            setIsConnected(true)
            
            // Restore user role from localStorage
            const savedRole = localStorage.getItem('userRole')
            if (savedRole) {
              setUserRole(savedRole)
            }
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error)
        }
      }
    }
    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
          localStorage.setItem('walletAccount', accounts[0])
        }
      }

      const handleChainChanged = (chainId) => {
        setChainId(chainId)
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  // Landing Page Component
  const LandingPage = () => (
    <>
      <Navbar 
        isConnected={isConnected}
        account={account}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        isConnecting={isConnecting}
      />
      <Hero 
        onConnect={connectWallet} 
        isConnecting={isConnecting}
        isConnected={isConnected}
        onSelectRole={selectRole}
      />
      <Alliances />
      <Solution />
      <Features />
      <CEO />
      <Roadmap />
      <Footer />
    </>
  )

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route 
            path="/" 
            element={<LandingPage />}
          />
          
          {/* Protected Routes - Require wallet connection */}
          <Route 
            path="/dashboard" 
            element={
              isConnected ? (
                <Dashboard 
                  account={account}
                  userRole={userRole}
                  onDisconnect={disconnectWallet}
                  onSelectRole={selectRole}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/insurance" 
            element={
              isConnected && userRole === 'insurance' ? (
                <InsurancePortal 
                  account={account}
                  onDisconnect={disconnectWallet}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          <Route 
            path="/investor" 
            element={
              isConnected && userRole === 'investor' ? (
                <InvestorDashboard 
                  account={account}
                  onDisconnect={disconnectWallet}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          <Route 
            path="/analytics" 
            element={<Analytics />} 
          />
          
          <Route 
            path="/tokenize" 
            element={
              isConnected && userRole === 'insurance' ? (
                <TokenizeRisk 
                  account={account}
                  onDisconnect={disconnectWallet}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          <Route 
            path="/marketplace" 
            element={
              isConnected ? (
                <Marketplace 
                  account={account}
                  userRole={userRole}
                  onDisconnect={disconnectWallet}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/portfolio" 
            element={
              isConnected ? (
                <Portfolio 
                  account={account}
                  userRole={userRole}
                  onDisconnect={disconnectWallet}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

