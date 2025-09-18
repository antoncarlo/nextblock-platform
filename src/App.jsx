import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/brand-identity.css'
import './styles/nextblock-palette.css'

// Landing Page Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ConnectivityTestPanel from './components/ConnectivityTestPanel'

import Alliances from './components/Alliances'
import Solution from './components/Solution'
import Features from './components/Features'
import CEO from './components/CEO'
import Roadmap from './components/Roadmap'
import QuoteVideoSection from './components/QuoteVideoSection'
import Footer from './components/Footer'

// Platform Components
import Dashboard from './components/Dashboard'
import InsurancePortal from './components/InsurancePortal'
import InvestorDashboard from './components/InvestorDashboard'
import Analytics from './components/Analytics'
import TokenizeRisk from './components/TokenizeRisk'
import Marketplace from './components/Marketplace'
import Portfolio from './components/Portfolio'

// Custom hook for wallet management
import { useWallet } from './useWallet'

function App() {
  const {
    account,
    chainId,
    isConnecting,
    error,
    isConnected,
    networkName,
    connectWallet,
    disconnectWallet,
    switchToHyperLiquid,
    switchToEthereum,
    clearError
  } = useWallet()

  const [userRole, setUserRole] = useState(null) // 'insurance' or 'investor'
  const [showConnectivityTest, setShowConnectivityTest] = useState(false)

  // Set user role
  const selectRole = (role) => {
    setUserRole(role)
    localStorage.setItem('userRole', role)
  }

  // Restore user role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole')
    if (savedRole) {
      setUserRole(savedRole)
    }
  }, [])

  // Landing Page Component
  const LandingPage = () => (
    <>
      <Navbar 
        isConnected={isConnected}
        account={account}
        chainId={chainId}
        networkName={networkName}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        onSwitchToEthereum={switchToEthereum}
        onSwitchToHyperLiquid={switchToHyperLiquid}
        isConnecting={isConnecting}
        error={error}
        onClearError={clearError}
        onShowConnectivityTest={() => setShowConnectivityTest(true)}
      />
      <Hero 
        onConnect={connectWallet} 
        isConnecting={isConnecting}
        isConnected={isConnected}
        onSelectRole={selectRole}
        chainId={chainId}
        networkName={networkName}
        onShowConnectivityTest={() => setShowConnectivityTest(true)}
      />
      <Alliances />
      <Solution />
      <Features />
      <CEO />
      <Roadmap />
      <QuoteVideoSection />
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
                  chainId={chainId}
                  networkName={networkName}
                  userRole={userRole}
                  onDisconnect={disconnectWallet}
                  onSelectRole={selectRole}
                  onSwitchToEthereum={switchToEthereum}
                  onSwitchToHyperLiquid={switchToHyperLiquid}
                  isConnected={isConnected}
                  onSwitchNetwork={(newChainId) => {
                    if (newChainId === 1 || newChainId === 11155111) {
                      switchToEthereum()
                    } else if (newChainId === 998 || newChainId === 999) {
                      switchToHyperLiquid()
                    }
                  }}
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
                  chainId={chainId}
                  networkName={networkName}
                  onDisconnect={disconnectWallet}
                  onSwitchToEthereum={switchToEthereum}
                  onSwitchToHyperLiquid={switchToHyperLiquid}
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
                  chainId={chainId}
                  networkName={networkName}
                  onDisconnect={disconnectWallet}
                  onSwitchToEthereum={switchToEthereum}
                  onSwitchToHyperLiquid={switchToHyperLiquid}
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
                  chainId={chainId}
                  networkName={networkName}
                  onDisconnect={disconnectWallet}
                  onSwitchToEthereum={switchToEthereum}
                  onSwitchToHyperLiquid={switchToHyperLiquid}
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
                  chainId={chainId}
                  networkName={networkName}
                  userRole={userRole}
                  onDisconnect={disconnectWallet}
                  onSwitchToEthereum={switchToEthereum}
                  onSwitchToHyperLiquid={switchToHyperLiquid}
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
                  chainId={chainId}
                  networkName={networkName}
                  userRole={userRole}
                  onDisconnect={disconnectWallet}
                  onSwitchToEthereum={switchToEthereum}
                  onSwitchToHyperLiquid={switchToHyperLiquid}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Connectivity Test Panel */}
        <ConnectivityTestPanel 
          isOpen={showConnectivityTest}
          onClose={() => setShowConnectivityTest(false)}
        />
      </div>
    </Router>
  )
}

export default App
