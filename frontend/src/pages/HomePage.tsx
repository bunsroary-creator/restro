import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Clock, MapPin, Phone } from 'lucide-react'

const HomePage: React.FC = () => {
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-shadow"
            variants={fadeInUp}
          >
            Himalayan Kitchen
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-shadow"
            variants={fadeInUp}
          >
            Authentic Nepalese Cuisine in Munich
          </motion.p>
          <motion.p 
            className="text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Experience the rich flavors of the Himalayas with traditional recipes passed down through generations, prepared with love and the finest ingredients.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Link 
              to="/menu" 
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-transform duration-200 hover:scale-105 shadow-lg"
            >
              View Menu
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-white hover:text-primary-600"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From traditional recipes to modern convenience, we bring you the best of Nepalese cuisine
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Authentic Recipes</h3>
              <p className="text-neutral-600 leading-relaxed">
                Traditional Nepalese recipes passed down through generations, prepared with authentic spices and techniques.
              </p>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Fast Delivery</h3>
              <p className="text-neutral-600 leading-relaxed">
                Quick pickup and delivery options throughout Munich. Fresh, hot meals delivered to your doorstep.
              </p>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Prime Location</h3>
              <p className="text-neutral-600 leading-relaxed">
                Located in the heart of Munich, easily accessible by public transport with a warm, welcoming atmosphere.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Popular Dishes
            </h2>
            <p className="text-xl text-neutral-600">
              Taste the flavors that keep our customers coming back
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Dal Bhat',
                description: 'Traditional Nepalese lentil curry served with steamed rice, vegetables, and pickle.',
                price: '€14.90',
                image: 'https://images.pexels.com/photos/5474640/pexels-photo-5474640.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
              },
              {
                name: 'Momos',
                description: 'Steamed dumplings filled with seasoned vegetables or meat, served with special sauce.',
                price: '€12.50',
                image: 'https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
              },
              {
                name: 'Thukpa',
                description: 'Hearty Himalayan noodle soup with vegetables, herbs, and your choice of protein.',
                price: '€13.90',
                image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
              }
            ].map((dish, index) => (
              <motion.div 
                key={dish.name} 
                className="card overflow-hidden group"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-neutral-900">{dish.name}</h3>
                    <span className="text-lg font-bold text-primary-600">{dish.price}</span>
                  </div>
                  <p className="text-neutral-600 mb-4 leading-relaxed">{dish.description}</p>
                  <button className="btn-primary w-full">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link to="/menu" className="btn-outline text-lg px-8 py-4">
              View Full Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">
                Visit Us Today
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Located in the vibrant heart of Munich, our restaurant offers a warm and authentic atmosphere where you can enjoy traditional Nepalese hospitality.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Address</div>
                    <div className="text-neutral-600">Maximilianstraße 35, 80539 Munich</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Phone</div>
                    <div className="text-neutral-600">+49 89 1234 5678</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Hours</div>
                    <div className="text-neutral-600">Mon-Thu: 11:00-22:00, Fri-Sun: 11:00-23:00</div>
                  </div>
                </div>
              </div>

              <Link to="/menu" className="btn-primary text-lg">
                Order Now
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Himalayan Kitchen Interior"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage