import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Clock } from 'lucide-react'

const BlogPage: React.FC = () => {
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

  const blogPosts = [
    {
      id: '1',
      title: 'The Art of Making Perfect Momos',
      slug: 'art-of-making-perfect-momos',
      excerpt: 'Learn the traditional techniques behind Nepal\'s most beloved dumplings, from dough preparation to the perfect folding technique.',
      image: 'https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Ramesh Gurung',
      date: '2025-01-15',
      readTime: '8 min read'
    },
    {
      id: '2',
      title: 'Spices of the Himalayas: A Flavor Journey',
      slug: 'spices-of-himalayas-flavor-journey',
      excerpt: 'Discover the unique spices that give Nepalese cuisine its distinctive character and learn how to use them in your own cooking.',
      image: 'https://images.pexels.com/photos/4198733/pexels-photo-4198733.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Maya Thapa',
      date: '2025-01-12',
      readTime: '6 min read'
    },
    {
      id: '3',
      title: 'Dal Bhat: The Heart of Nepalese Cuisine',
      slug: 'dal-bhat-heart-of-nepalese-cuisine',
      excerpt: 'Understanding the cultural significance and nutritional benefits of Nepal\'s national dish and how to prepare it authentically.',
      image: 'https://images.pexels.com/photos/5474640/pexels-photo-5474640.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Ramesh Gurung',
      date: '2025-01-10',
      readTime: '10 min read'
    },
    {
      id: '4',
      title: 'Festive Flavors: Celebrating Nepalese Holidays',
      slug: 'festive-flavors-nepalese-holidays',
      excerpt: 'Explore the special dishes prepared during major Nepalese festivals and their cultural significance in bringing communities together.',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Sabina Rai',
      date: '2025-01-08',
      readTime: '7 min read'
    },
    {
      id: '5',
      title: 'Tea Culture in Nepal: More Than Just a Drink',
      slug: 'tea-culture-nepal-more-than-drink',
      excerpt: 'Delve into Nepal\'s rich tea tradition and discover how masala chai and other traditional teas complement our cuisine.',
      image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Krish Shrestha',
      date: '2025-01-05',
      readTime: '5 min read'
    },
    {
      id: '6',
      title: 'Vegetarian Delights from the Mountains',
      slug: 'vegetarian-delights-mountains',
      excerpt: 'Discover the abundance of vegetarian options in Nepalese cuisine and how mountain communities have perfected plant-based nutrition.',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Maya Thapa',
      date: '2025-01-03',
      readTime: '9 min read'
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
              Himalayan Stories
            </motion.h1>
            <motion.p 
              className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Discover the stories behind our dishes, learn traditional cooking techniques, and explore the rich culinary heritage of Nepal.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-w-16 aspect-h-9 lg:aspect-none">
                <img 
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-64 lg:h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{blogPosts[0].author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(blogPosts[0].date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <Link 
                  to={`/blog/${blogPosts[0].slug}`}
                  className="btn-primary self-start"
                >
                  Read More
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {blogPosts.slice(1).map((post) => (
              <motion.div 
                key={post.id} 
                className="card overflow-hidden group"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default BlogPage