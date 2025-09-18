import { motion } from 'framer-motion'
import { ExternalLink, BookOpen } from 'lucide-react'

const CEO = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet The Team
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Bringing the $16T insurance industry on-chain. NEXTBLOCK allows insurance 
              companies to harness decentralized, on-chain, 24/7 stablecoin-based accounting, 
              risk tracking, payment & tokenization solutions optimized to the specific needs 
              of different insurance use cases.
            </p>

            <div className="space-y-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore Documentation</span>
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Side - Team Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* CEO Card */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CEO</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Chief Executive Officer
                  </h3>
                  <p className="text-gray-600">
                    Leading innovation in insurance tokenization
                  </p>
                </div>
              </div>
            </div>

            {/* CTO Card */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CTO</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Chief Technology Officer
                  </h3>
                  <p className="text-gray-600">
                    Blockchain architecture and smart contracts
                  </p>
                </div>
              </div>
            </div>

            {/* CFO Card */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CFO</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Chief Financial Officer
                  </h3>
                  <p className="text-gray-600">
                    Financial strategy and risk management
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-gray-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Our Vision
          </h3>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            "To democratize the global insurance market by creating the first comprehensive 
            blockchain infrastructure that enables seamless tokenization, trading, and 
            management of insurance risks, unlocking unprecedented liquidity and efficiency 
            for the $16 trillion industry."
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default CEO

