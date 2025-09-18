import { motion } from 'framer-motion'
import { Twitter, Linkedin, Github, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: 'mailto:next.block@insurer.com', label: 'Email' }
  ]

  const footerLinks = [
    { text: 'Terms of use', href: '#' },
    { text: 'Privacy Policy', href: '#' },
    { text: 'Media Kit', href: '#' }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/nextblock-logo-icon.png" 
                alt="NextBlock" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">
                NEXTBLOCK
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              The first decentralized tokenization & payment layer for the 
              $16T global insurance industry.
            </p>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              We're Here to Help
            </h3>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                Email: next.block@insurer.com
              </p>
              <p className="text-gray-600 text-sm">
                Documentation: docs.nextblock.io
              </p>
              <p className="text-gray-600 text-sm">
                Support: support@nextblock.io
              </p>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gray-100 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-white" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-600 text-sm">
              ©{currentYear} All rights reserved
            </div>

            {/* Footer Links */}
            <div className="flex space-x-6">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-600 hover:text-green-500 text-sm transition-colors"
                >
                  {link.text}
                </a>
              ))}
            </div>

            {/* Contract Address */}
            <div className="text-gray-500 text-xs font-mono">
              CA: 0xB4C6fedD984bC983b1a758d0875f1Ea34F81A6af
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer

