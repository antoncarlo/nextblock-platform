import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Alliances from './components/Alliances'
import Solution from './components/Solution'
import Features from './components/Features'
import CEO from './components/CEO'
import Roadmap from './components/Roadmap'
import Footer from './components/Footer'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  // Wallet connection logic
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnecting(true)
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        setAccount(accounts[0])
        setIsConnected(true)
      } catch (error) {
        console.error('Error connecting wallet:', error)
      } finally {
        setIsConnecting(false)
      }
    } else {
      alert('Please install MetaMask to connect your wallet')
    }
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
            setAccount(accounts[0])
            setIsConnected(true)
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error)
        }
      }
    }
    checkConnection()
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Navbar 
                  isConnected={isConnected}
                  account={account}
                  onConnect={connectWallet}
                  isConnecting={isConnecting}
                />
                <Hero onConnect={connectWallet} isConnecting={isConnecting} />
                <Alliances />
                <Solution />
                <Features />
                <CEO />
                <Roadmap />
                <Footer />
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

