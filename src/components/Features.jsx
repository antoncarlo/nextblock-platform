import { motion } from 'framer-motion'
import { Shield, TrendingUp, Globe, Zap, Users, BarChart } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with multi-layer protection and regulatory compliance',
      color: 'bg-blue-500'
    },
    {
      icon: TrendingUp,
      title: 'High Returns',
      description: '14.2% average annual returns with diversified insurance risk exposure',
      color: 'bg-green-500'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access to worldwide insurance markets and cross-border opportunities',
      color: 'bg-purple-500'
    },
    {
      icon: Zap,
      title: 'Ultra-Fast Trading',
      description: 'Microsecond execution powered by HyperLiquid infrastructure',
      color: 'bg-yellow-500'
    },
    {
      icon: Users,
      title: 'Institutional Grade',
      description: 'Built for institutional investors with professional-grade tools',
      color: 'bg-red-500'
    },
    {
      icon: BarChart,
      title: 'Real-time Analytics',
      description: 'Comprehensive market data and risk assessment tools',
      color: 'bg-indigo-500'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Platform Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bringing the $16T insurance industry on-chain with decentralized, 
            24/7 stablecoin-based accounting, tracking, and tokenization solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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

