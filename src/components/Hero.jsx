import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Shield, TrendingUp, Zap, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Hero = ({ 
  onConnect, 
  isConnecting, 
  isConnected, 
  onSelectRole, 
  chainId, 
  networkName 
}) => {
  const { t } = useTranslation()
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Video Background */}
      <div className="absolute inset-0">
        {/* World Rotating Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source src="/world-background.mp4" type="video/mp4" />
        </video>
        
        {/* Very light overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
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
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-slate-100 mb-4">
            <motion.span
              key={currentText}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="block text-slate-100"
            >
              {heroTexts[currentText]}
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          <span className="text-slate-100 font-semibold">{t('hero.title')}</span>
          <br />
          {t('hero.subtitle')} {' '}
          <span className="text-blue-400 font-semibold">{t('hero.description')}</span>
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Shield,
              title: t('hero.features.enterpriseSecurity.title'),
              description: t('hero.features.enterpriseSecurity.description'),
              color: "bg-blue-500"
            },
            {
              icon: TrendingUp,
              title: t('hero.features.highReturns.title'),
              description: t('hero.features.highReturns.description'),
              color: "bg-green-600"
            },
            {
              icon: Zap,
              title: t('hero.features.ultraFastExecution.title'),
              description: t('hero.features.ultraFastExecution.description'),
              color: "bg-blue-600"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6 group cursor-pointer transition-all duration-200 backdrop-blur-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3, ease: "easeOut" }}
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 transition-transform duration-200`}>
                <feature.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
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
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 rounded-full px-4 py-2">
              <div className={`w-3 h-3 rounded-full ${
                chainId === 1 || chainId === 998 ? 'bg-green-600' : 'bg-blue-500'
              } animate-pulse`} />
              <span className="text-slate-100 text-sm font-medium">{networkName}</span>
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <button
            onClick={handleGetStarted}
            disabled={isConnecting}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
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
          </button>

          <button
            className="border border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Analisi Tecnica
          </button>
        </motion.div>

        {/* Role Selection */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.5 }}
            className="mt-12"
          >
            <p className="text-blue-400 font-medium mb-6 text-lg">
              Wallet Connesso! Seleziona il tuo profilo:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <motion.button
                whileHover={{ 
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('insurance')}
                className="bg-slate-800 border border-slate-700 p-6 rounded-lg text-slate-100 text-left group hover:bg-slate-700 transition-all duration-200"
              >
                <Shield className="w-8 h-8 mb-4 transition-transform duration-200" strokeWidth={1.5} />
                <h4 className="text-xl font-semibold mb-2">Compagnia Assicurativa</h4>
                <p className="text-slate-400">Tokenizza i tuoi portafogli di rischio e accedi al capitale globale</p>
              </motion.button>

              <motion.button
                whileHover={{ 
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('investor')}
                className="bg-slate-800 border border-slate-700 p-6 rounded-lg text-slate-100 text-left group hover:bg-slate-700 transition-all duration-200"
              >
                <TrendingUp className="w-8 h-8 mb-4 transition-transform duration-200" strokeWidth={1.5} />
                <h4 className="text-xl font-semibold mb-2">Investitore Qualificato</h4>
                <p className="text-slate-400">Accesso a portafogli di rischio assicurativo diversificati</p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-slate-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
