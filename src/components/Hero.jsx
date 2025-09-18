import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Shield, TrendingUp, Zap, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Hero = ({ 
  onConnect, 
  isConnecting, 
  isConnected, 
  onSelectRole, 
  chainId, 
  networkName 
}) => {
  const [currentText, setCurrentText] = useState(0)
  const { scrollY } = useScroll()
  const navigate = useNavigate()
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const heroTexts = [
    "Tokenize Risk.",
    "Unlock Capital.",
    "Democratize Insurance."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    if (!isConnected) {
      onConnect()
    } else {
      navigate('/dashboard')
    }
  }

  const handleRoleSelection = (role) => {
    onSelectRole(role)
    if (role === 'insurance') {
      navigate('/insurance')
    } else {
      navigate('/investor')
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Video Background Simulation with CSS */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-orange-900/20" />
        
        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        style={{ y: y1, opacity }}
      >
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-4">
            <motion.span
              key={currentText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="block bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
            >
              {heroTexts[currentText]}
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Democratizziamo il mercato assicurativo tradizionale aprendo una nuova frontiera. 
          La nostra piattaforma trasforma{' '}
          <span className="text-green-400 font-semibold">i rischi assicurativi in asset digitali</span>, 
          permettendo a un mercato globale di investitori di finanziarli direttamente.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Shield,
              title: "Sicurezza Enterprise",
              description: "Protezione multi-livello e conformità normativa",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: TrendingUp,
              title: "Rendimenti Elevati",
              description: "14.2% rendimento medio annuo con diversificazione",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: Zap,
              title: "Trading Ultra-Veloce",
              description: "Esecuzione in microsecondi su HyperLiquid",
              color: "from-purple-500 to-violet-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Network Status */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex items-center justify-center space-x-4"
          >
            <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
              <div className={`w-3 h-3 rounded-full ${
                chainId === 1 || chainId === 998 ? 'bg-green-500' : 'bg-yellow-500'
              } animate-pulse`} />
              <span className="text-white text-sm font-medium">{networkName}</span>
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Button
            onClick={handleGetStarted}
            disabled={isConnecting}
            className="group bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Connecting...
              </>
            ) : isConnected ? (
              <>
                Enter NEXTBLOCK
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                <Globe className="mr-2 w-5 h-5" />
                Connect Wallet
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-md"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </motion.div>

        {/* Role Selection */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <p className="text-green-400 font-medium mb-6 text-lg">
              Wallet Connected! Choose your role:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRoleSelection('insurance')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white text-left group"
              >
                <Shield className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-semibold mb-2">Insurance Company</h4>
                <p className="text-blue-100">Tokenize your risk portfolios and access global capital</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRoleSelection('investor')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-2xl text-white text-left group"
              >
                <TrendingUp className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-semibold mb-2">Investor</h4>
                <p className="text-green-100">Invest in diversified insurance risk portfolios</p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
