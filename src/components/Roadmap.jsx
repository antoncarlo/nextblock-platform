import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, Target, Users, Rocket, Building, TrendingUp, Smartphone, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Roadmap = () => {
  const { t } = useTranslation()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  const roadmapItems = [
    {
      quarter: "Q1 2025",
      title: t('roadmap.phases.q1_2025.title'),
      description: Array.isArray(t('roadmap.phases.q1_2025.items')) ? t('roadmap.phases.q1_2025.items').join(', ') : t('roadmap.phases.q1_2025.items'),
      icon: Building,
      color: "bg-blue-500",
      status: "completed"
    },
    {
      quarter: "Q2 2025",
      title: t('roadmap.phases.q2_2025.title'),
      description: Array.isArray(t('roadmap.phases.q2_2025.items')) ? t('roadmap.phases.q2_2025.items').join(', ') : t('roadmap.phases.q2_2025.items'),
      icon: Rocket,
      color: "bg-green-500",
      status: "in-progress"
    },
    {
      quarter: "Q3 2025",
      title: t('roadmap.phases.q3_2025.title'),
      description: Array.isArray(t('roadmap.phases.q3_2025.items')) ? t('roadmap.phases.q3_2025.items').join(', ') : t('roadmap.phases.q3_2025.items'),
      icon: Users,
      color: "bg-purple-500",
      status: "upcoming"
    },
    {
      quarter: "Q4 2025",
      title: t('roadmap.phases.q4_2025.title'),
      description: Array.isArray(t('roadmap.phases.q4_2025.items')) ? t('roadmap.phases.q4_2025.items').join(', ') : t('roadmap.phases.q4_2025.items'),
      icon: TrendingUp,
      color: "bg-orange-500",
      status: "upcoming"
    }
  ]

  const milestones = [
    {
      title: "Novembre 2025",
      description: "Espansione strategica con apertura della nuova company a San Francisco",
      highlight: true
    },
    {
      title: "Novembre 2025",
      description: "Pre-Seed Round 500K per accelerare lo sviluppo",
      highlight: true
    },
    {
      title: "Gennaio/Febbraio 2026",
      description: "Lancio piattaforma con funzionalità essenziali",
      highlight: false
    },
    {
      title: "Maggio 2026",
      description: "Rilascio piattaforma completa per espansione internazionale",
      highlight: false
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          style={{ y }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            {t('roadmap.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            I nostri milestone strategici per rivoluzionare l'industria assicurativa 
            attraverso la tokenizzazione blockchain e l'integrazione DeFi.
          </motion.p>
        </motion.div>

        {/* Milestones Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Milestone Chiave
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl ${
                  milestone.highlight 
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white' 
                    : 'bg-gray-50 text-gray-900'
                } shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <h4 className={`text-lg font-bold mb-3 ${
                  milestone.highlight ? 'text-white' : 'text-green-600'
                }`}>
                  {milestone.title}
                </h4>
                <p className={`${
                  milestone.highlight ? 'text-green-100' : 'text-gray-600'
                }`}>
                  {milestone.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Roadmap */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-green-500 to-blue-600 h-full rounded-full"></div>
          
          {/* Roadmap Items */}
          <div className="space-y-16">
            {roadmapItems.map((item, index) => {
              const Icon = item.icon
              const isLeft = index % 2 === 0
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`w-5/12 ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-green-500"
                    >
                      <div className={`flex items-center ${isLeft ? 'justify-end' : 'justify-start'} mb-4`}>
                        <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          {item.quarter}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className={`mt-4 flex items-center ${isLeft ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          item.status === 'upcoming' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status === 'completed' ? 'Completato' :
                           item.status === 'in-progress' ? 'In Corso' :
                           item.status === 'upcoming' ? 'Prossimo' : 'Futuro'}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="w-2/12 flex justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.2 }}
                      className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center shadow-lg z-10 relative`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Spacer */}
                  <div className="w-5/12"></div>
                </motion.div>
              )
            })}
          </div>
        </div>


      </div>
    </section>
  )
}

export default Roadmap

