import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp, Shield, Zap, Globe, DollarSign, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Solution = () => {
  const { t } = useTranslation()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  const problemStats = [
    {
      value: "$16T",
      label: t('solution.stats.insuranceMarket'),
      description: "Le compagnie tradizionali hanno fornito l'81.24% della capacità nel 2024"
    },
    {
      value: "$124B",
      label: t('solution.stats.missedOpportunities'),
      description: "A causa della non capacità finanziaria per nuovi rischi"
    },
    {
      value: "20%",
      label: t('solution.stats.inefficiencyCosts'),
      description: "Processi lenti e costosi che sprecano fatturato potenziale"
    }
  ]

  const solutionFeatures = [
    {
      icon: Shield,
      title: "Tokenizzazione dei Rischi",
      description: "Trasformiamo i portafogli assicurativi in asset digitali negoziabili",
      color: "text-blue-500"
    },
    {
      icon: Globe,
      title: "Mercato Globale",
      description: "Accesso a investitori internazionali per finanziare direttamente i rischi",
      color: "text-green-500"
    },
    {
      icon: Zap,
      title: "Liquidità Immediata",
      description: "Sblocchiamo la capacità finanziaria delle compagnie assicurative",
      color: "text-yellow-500"
    },
    {
      icon: TrendingUp,
      title: "Rendimenti Elevati",
      description: "14.2% rendimento medio annuo con esposizione diversificata",
      color: "text-purple-500"
    },
    {
      icon: DollarSign,
      title: "Efficienza Operativa",
      description: "Riduciamo i costi amministrativi e aumentiamo la redditività",
      color: "text-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Trasparenza Totale",
      description: "Monitoraggio real-time e analytics avanzate su blockchain",
      color: "text-indigo-500"
    }
  ]

    return (
    <section ref={ref} className="py-20 overflow-hidden" style={{backgroundColor: '#1E293B'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Problem Section */}
        <motion.div 
          style={{ y, opacity, scale }}
          className="text-center mb-20"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{color: '#E2E8F0'}}
          >
            {t('solution.problemTitle')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-12 max-w-4xl mx-auto"
            style={{color: '#94A3B8'}}
          >
            {t('solution.problemDescription')}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {problemStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg p-8 transition-all duration-200"
                style={{backgroundColor: '#0A192F', borderColor: '#334155', border: '1px solid'}}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{color: '#3B82F6'}}
                >
                  {stat.value}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3" style={{color: '#E2E8F0'}}>
                  {stat.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{color: '#94A3B8'}}>
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{color: '#E2E8F0'}}
          >
            {t('solution.solutionTitle')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-4 max-w-4xl mx-auto"
            style={{color: '#94A3B8'}}
          >
            {t('solution.solutionDescription')}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg max-w-4xl mx-auto"
            style={{color: '#94A3B8'}}
          >
            {t('solution.benefits')}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutionFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5
                }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform-gpu"
                style={{
                  transformStyle: 'preserve-3d'
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className={`w-16 h-16 ${feature.color} bg-gray-50 rounded-2xl flex items-center justify-center mb-6 mx-auto`}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-xl font-semibold text-gray-900 mb-4 text-center"
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-gray-600 text-center leading-relaxed"
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            )
          })}
        </div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-12 text-white"
        >
          <motion.h3
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            La Nostra Visione
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl leading-relaxed max-w-4xl mx-auto"
          >
            Vogliamo democratizzare il mercato tradizionale esplorando con le tecnologie, 
            la conoscenza e l'innovazione un nuovo approccio. L'approccio di NextBlock andrà 
            a rivoluzionare il modo in cui viene gestita la liquidità giornalmente nel mercato 
            mondiale assicurativo, andando a posizionarsi come leader e punto di riferimento 
            nel mondo Web3 e della Tokenizzazione.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default Solution

