import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const VideoSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <section 
      id="video" 
      className="py-20 bg-slate-900 transition-all duration-700 delay-800"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)'
      }}
      onLoad={() => setIsVisible(true)}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Testo */}
          <div className="order-2 lg:order-1">
            <motion.h2 
              className="text-4xl md:text-5xl font-black text-slate-100 mb-6"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              NextBlock Rilascia{' '}
              <span className="text-blue-400">Potenza e Valore</span>{' '}
              Economico
            </motion.h2>
            
            <motion.p 
              className="text-xl text-slate-300 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
            >
              Agendo nelle retrovie dove il caos regna, con NextBlock calmiamo queste{' '}
              <strong className="text-blue-400">acque in piena come una diga</strong>,
              permettendo di <strong className="text-blue-400">far fluire come i fiumi
              la liquidità nei posti giusti</strong>.
            </motion.p>
            
            <motion.p 
              className="text-lg text-slate-300 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            >
              Trasformiamo la turbolenza del mercato in <em className="text-blue-300">canali controllati
              di opportunità</em>. Come un sistema idraulico perfetto, incanaliamo il capitale
              verso dove può generare il massimo valore.
            </motion.p>
            
            <motion.p 
              className="text-lg text-slate-400 mb-8 font-medium"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="text-slate-300">"Dove altri vedono caos, noi creiamo flussi.
              Dove altri temono la tempesta, noi costruiamo dighe che generano energia."</span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 flex items-center justify-center">
                Scopri la Tecnologia
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-slate-600 text-slate-300 hover:bg-slate-800 font-semibold px-8 py-4 rounded-lg border transition-all duration-200">
                Analisi Tecnica
              </button>
            </motion.div>
          </div>

          {/* Video */}
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                style={{ aspectRatio: '16/9' }}
              >
                <source src="/nextblock-video.mp4" type="video/mp4" />
                Il tuo browser non supporta il tag video.
              </video>
              {/* Overlay sottile per migliorare la leggibilità se necessario */}
              <div className="absolute inset-0 bg-slate-900/10"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default VideoSection
