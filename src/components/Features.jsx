import { motion } from 'framer-motion'
import { Shield, TrendingUp, Globe, Zap, Users, BarChart } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Sicurezza Bancaria',
      description: 'Multi-signature, cold storage 95%, audit continui',
      color: '#3B82F6'
    },
    {
      icon: Zap,
      title: 'Trading 24/7',
      description: 'Settlement T+0, spread <0.5%, liquidità garantita',
      color: '#3B82F6'
    },
    {
      icon: Globe,
      title: 'Accesso Globale',
      description: 'KYC semplice, nessuna barriera geografica',
      color: '#3B82F6'
    },
    {
      icon: BarChart,
      title: 'Trasparenza Totale',
      description: 'Dashboard real-time, metriche di rischio, reporting automatico',
      color: '#3B82F6'
    }
  ]

  return (
    <section className="py-20" style={{backgroundColor: '#1E293B'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{color: '#E2E8F0'}}>
            Piattaforma Sicura e Veloce
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{color: '#94A3B8'}}>
            Tecnologia enterprise per la tokenizzazione assicurativa con standard istituzionali.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-lg p-6 transition-all duration-200"
                style={{backgroundColor: '#0A192F', border: '1px solid #334155'}}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" 
                  style={{backgroundColor: feature.color}}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{color: '#E2E8F0'}}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed" style={{color: '#94A3B8'}}>
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 bg-white rounded-2xl p-8 shadow-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                $16T
              </div>
              <div className="text-gray-600">Global Market</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
                $124B
              </div>
              <div className="text-gray-600">Untapped Market</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
                1,247
              </div>
              <div className="text-gray-600">Active Portfolios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">
                14.2%
              </div>
              <div className="text-gray-600">Average Yield</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features

