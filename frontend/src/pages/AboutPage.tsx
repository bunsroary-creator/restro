import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, Clock, Award } from 'lucide-react'

const AboutPage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6"
              variants={fadeInUp}
            >
              Our Story
            </motion.h1>
            <motion.p 
              className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              From the peaks of the Himalayas to the heart of Munich, Himalayan Kitchen brings you authentic Nepalese cuisine crafted with love, tradition, and the finest ingredients.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <img 
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Traditional Nepalese cooking"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                A Journey of Flavors
              </h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  Founded in 2018 by Chef Ramesh Gurung, a native of Kathmandu, Himalayan Kitchen was born from a passion for sharing the authentic flavors of Nepal with the people of Munich.
                </p>
                <p>
                  Our recipes have been passed down through generations, each dish carefully crafted using traditional techniques and the finest spices imported directly from the Himalayan region.
                </p>
                <p>
                  We believe that food is more than sustenance—it's a bridge between cultures, a way to bring people together, and a celebration of heritage and tradition.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-neutral-600">
              What drives us every day to serve exceptional food and hospitality
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Authenticity</h3>
              <p className="text-neutral-600">
                Every dish is prepared using traditional methods and authentic ingredients from Nepal.
              </p>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Community</h3>
              <p className="text-neutral-600">
                Building bridges between cultures through food and creating lasting relationships.
              </p>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Tradition</h3>
              <p className="text-neutral-600">
                Honoring centuries-old recipes while adapting to modern dietary needs and preferences.
              </p>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Quality</h3>
              <p className="text-neutral-600">
                Using only the freshest ingredients and maintaining the highest standards in every dish.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                Our Mission
              </h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  At Himalayan Kitchen, our mission is to preserve and share the culinary heritage of Nepal while creating memorable dining experiences for our guests in Munich.
                </p>
                <p>
                  We are committed to supporting local farmers and suppliers, reducing our environmental impact, and giving back to the communities that have shaped our journey.
                </p>
                <p>
                  Every meal we serve is a celebration of Nepalese culture, a testament to the power of authentic flavors, and an invitation to experience the warmth of Himalayan hospitality.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Traditional Nepalese spices"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage