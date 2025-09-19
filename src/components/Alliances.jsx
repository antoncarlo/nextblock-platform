import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Alliances = () => {
  const { t } = useTranslation()
  const partners = [
    {
      name: 'HyperLiquid',
      logo: 'https://hyperliquid.xyz/logo.svg',
      description: t('alliances.partnerships.hyperliquid')
    },
    {
      name: 'Chainlink',
      logo: 'https://chain.link/assets/images/chainlink-logo.svg',
      description: t('alliances.partnerships.chainlink')
    },
    {
      name: 'Circle',
      logo: 'https://www.circle.com/hubfs/sundaySky/images/logos/circle-logo.svg',
      description: t('alliances.partnerships.circle')
    },
    {
      name: 'Polygon',
      logo: 'https://polygon.technology/wp-content/uploads/2021/07/polygon-logo.svg',
      description: t('alliances.partnerships.polygon')
    }
  ]

  return (
    <section className="py-20" style={{backgroundColor: '#0A192F'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold" style={{color: '#E2E8F0'}}>
              {t('alliances.title')}
            </h2>
            <ArrowUpRight className="w-8 h-8 ml-4" style={{color: '#3B82F6'}} strokeWidth={1.5} />
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
              className="rounded-lg p-8 transition-all duration-200" 
              style={{backgroundColor: '#1E293B', borderColor: '#334155', border: '1px solid'}}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter brightness-0 invert"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center font-semibold text-sm hidden"
                    style={{backgroundColor: '#334155', color: '#E2E8F0'}}
                  >
                    {partner.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{color: '#E2E8F0'}}>
                  {partner.name}
                </h3>
                <p className="text-sm" style={{color: '#94A3B8'}}>
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

