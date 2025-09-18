import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const RoboraEnhancedHero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: false });
  const controls = useAnimation();

  const dynamicTexts = [
    { 
      main: "Tokenize Risk", 
      sub: "Transform insurance portfolios into digital assets",
      color: "from-emerald-400 to-cyan-400"
    },
    { 
      main: "Unlock Capital", 
      sub: "Enable fractional ownership of insurance risks",
      color: "from-blue-400 to-purple-400"
    },
    { 
      main: "Democratize Insurance", 
      sub: "Make institutional-grade investments accessible to all",
      color: "from-purple-400 to-pink-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % dynamicTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    if (heroRef.current) {
      heroRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (heroRef.current) {
        heroRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Floating orbs animation
  const FloatingOrb = ({ size, delay, duration, x, y }) => (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl`}
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={{
        x: [0, 30, -30, 0],
        y: [0, -30, 30, 0],
        scale: [1, 1.2, 0.8, 1],
        opacity: [0.3, 0.6, 0.3, 0.3],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  // Particle system
  const ParticleField = () => {
    const particles = Array.from({ length: 50 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -100, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    ));
    return <div className="absolute inset-0 overflow-hidden">{particles}</div>;
  };

  // Interactive grid
  const InteractiveGrid = () => (
    <div className="absolute inset-0 opacity-10">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Interactive grid points */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400/50 rounded-full"
          style={{
            left: `${(i % 5) * 20 + 10}%`,
            top: `${Math.floor(i / 5) * 25 + 10}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
          }}
          whileHover={{
            scale: 2,
            opacity: 1,
          }}
        />
      ))}
    </div>
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 50%, black 100%)`,
      }}
    >
      {/* Background Effects */}
      <ParticleField />
      <InteractiveGrid />
      
      {/* Floating Orbs */}
      <FloatingOrb size={200} delay={0} duration={8} x={10} y={20} />
      <FloatingOrb size={150} delay={2} duration={6} x={80} y={70} />
      <FloatingOrb size={100} delay={4} duration={10} x={60} y={10} />
      <FloatingOrb size={120} delay={1} duration={7} x={20} y={80} />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Dynamic Main Title */}
        <motion.div
          key={currentText}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 1.1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className={`text-6xl md:text-8xl font-bold bg-gradient-to-r ${dynamicTexts[currentText].color} bg-clip-text text-transparent mb-4`}>
            {dynamicTexts[currentText].main}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            {dynamicTexts[currentText].sub}
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Democratizziamo il mercato assicurativo tradizionale aprendo una nuova frontiera. 
          La nostra piattaforma trasforma{" "}
          <span className="text-emerald-400 font-semibold">
            i rischi assicurativi in asset digitali
          </span>
          , permettendo a un mercato globale di investitori di finanziarli direttamente.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          {[
            {
              icon: "🛡️",
              title: "Sicurezza Enterprise",
              description: "Protezione multi-livello e conformità normativa",
              gradient: "from-blue-500/20 to-cyan-500/20",
              border: "border-blue-500/30",
            },
            {
              icon: "📈",
              title: "Rendimenti Elevati",
              description: "14.2% rendimento medio annuo con diversificazione",
              gradient: "from-emerald-500/20 to-green-500/20",
              border: "border-emerald-500/30",
            },
            {
              icon: "⚡",
              title: "Trading Ultra-Veloce",
              description: "Esecuzione in microsecondi su HyperLiquid",
              gradient: "from-purple-500/20 to-pink-500/20",
              border: "border-purple-500/30",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                },
              }}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
              className={`relative p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border ${feature.border} group cursor-pointer`}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            Connect Wallet
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-gray-600 text-white font-bold rounded-full text-lg hover:border-white hover:bg-white/5 transition-all duration-300"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: "$2.3B", label: "Assets Tokenized" },
            { value: "40-60%", label: "Faster Settlement" },
            { value: "15-25%", label: "Increased Liquidity" },
            { value: "24/7", label: "Global Trading" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              className="group"
            >
              <div className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RoboraEnhancedHero;
