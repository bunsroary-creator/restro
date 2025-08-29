import React from 'react'
import { motion } from 'framer-motion'

const TeamPage: React.FC = () => {
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

  const teamMembers = [
    {
      name: 'Ramesh Gurung',
      role: 'Head Chef & Owner',
      bio: 'Born in Kathmandu, Ramesh brings 20+ years of culinary expertise and a passion for authentic Nepalese cuisine.',
      image: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    },
    {
      name: 'Maya Thapa',
      role: 'Sous Chef',
      bio: 'Maya specializes in traditional momos and spice blending, ensuring every dish maintains its authentic flavor profile.',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    },
    {
      name: 'Krish Shrestha',
      role: 'Restaurant Manager',
      bio: 'With a background in hospitality management, Krish ensures every guest experiences genuine Nepalese hospitality.',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    },
    {
      name: 'Sabina Rai',
      role: 'Pastry Chef',
      bio: 'Sabina creates beautiful traditional sweets and desserts that perfectly complement our savory offerings.',
      image: 'https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      {/* Header */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6"
              variants={fadeInUp}
            >
              Meet Our Team
            </motion.h1>
            <motion.p 
              className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              The passionate individuals behind Himalayan Kitchen who bring authentic Nepalese flavors to Munich with dedication and expertise.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {teamMembers.map((member) => (
              <motion.div 
                key={member.name} 
                className="card overflow-hidden group"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-neutral-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Culture Section */}
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
                Our Culture
              </h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  At Himalayan Kitchen, we foster a culture of excellence, respect, and continuous learning. Our team is united by a shared passion for culinary arts and a commitment to preserving Nepalese traditions.
                </p>
                <p>
                  We believe in supporting each other's growth, celebrating our diverse backgrounds, and creating an environment where creativity and tradition can flourish together.
                </p>
                <p>
                  Every member of our team contributes to the warm, welcoming atmosphere that makes Himalayan Kitchen feel like home for our guests.
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
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Team working together"
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TeamPage