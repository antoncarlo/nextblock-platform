import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const QuoteVideoSection = () => {
  const { t } = useTranslation()
  return (
    <section className="py-20" style={{backgroundColor: '#0A192F'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Text - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left space-y-6"
          >
            {/* Titolo */}
            <h2 className="text-3xl lg:text-4xl font-bold" style={{color: '#E2E8F0'}}>
              {t('quote.title')}
            </h2>
            
            {/* Descrizione */}
            <p className="text-lg lg:text-xl leading-relaxed" style={{color: '#94A3B8'}}>
              {t('quote.description')}
            </p>
            
            {/* Quote */}
            <blockquote className="text-2xl lg:text-3xl font-bold italic border-l-4 pl-6" 
              style={{color: '#3B82F6', borderColor: '#3B82F6'}}>
              {t('quote.quote')}
            </blockquote>
          </motion.div>

          {/* Video - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-lg overflow-hidden" style={{backgroundColor: '#1E293B', border: '1px solid #334155'}}>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto aspect-video object-cover"
              >
                <source src="/nextblock-video.mp4" type="video/mp4" />
                Il tuo browser non supporta il tag video.
              </video>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default QuoteVideoSection
