import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const Alliances = () => {
  const partners = [
    {
      name: 'HyperLiquid',
      logo: 'https://hyperliquid.xyz/logo.svg',
      description: 'Ultra-fast DEX integration'
    },
    {
      name: 'Chainlink',
      logo: 'https://chain.link/assets/images/chainlink-logo.svg',
      description: 'Reliable price oracles'
    },
    {
      name: 'Circle',
      logo: 'https://www.circle.com/hubfs/sundaySky/images/logos/circle-logo.svg',
      description: 'USDC stablecoin infrastructure'
    },
    {
      name: 'Polygon',
      logo: 'https://polygon.technology/wp-content/uploads/2021/07/polygon-logo.svg',
      description: 'Layer 2 scaling solution'
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
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Alliances
            </h2>
            <ArrowUpRight className="w-8 h-8 text-green-500 ml-4" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold text-sm hidden"
                  >
                    {partner.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {partner.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {partner.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Alliances

