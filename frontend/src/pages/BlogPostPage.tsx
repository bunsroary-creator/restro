import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react'

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  // Mock blog post data - in real app, fetch from API
  const post = {
    title: 'The Art of Making Perfect Momos',
    content: `
      <p>Momos, the beloved dumplings of Nepal, are more than just food—they're a cultural institution that brings families and communities together. These delicate parcels of flavor have been perfected over generations, and today I'll share the secrets behind creating authentic momos that honor this beautiful tradition.</p>

      <h2>The Perfect Dough</h2>
      <p>The foundation of any great momo lies in its dough. Unlike other dumpling varieties, momo dough requires a specific balance of flour, water, and a pinch of salt. The key is achieving the right elasticity—too stiff and your momos will be tough, too soft and they'll fall apart during steaming.</p>

      <p>Start with all-purpose flour and gradually add warm water while kneading. The dough should be smooth, pliable, and slightly sticky to the touch. Let it rest for at least 30 minutes to allow the gluten to develop properly.</p>

      <h2>The Art of Filling</h2>
      <p>Traditional momo filling combines finely chopped meat (usually buffalo or chicken) with onions, garlic, ginger, and a blend of aromatic spices. The secret lies in the spice mixture: a careful balance of cumin, coriander, turmeric, and garam masala that creates depth without overwhelming the meat's natural flavor.</p>

      <p>For vegetarian momos, we use a combination of cabbage, carrots, onions, and sometimes paneer or tofu. The vegetables must be finely chopped and lightly salted to remove excess moisture—this prevents soggy momos.</p>

      <h2>The Folding Technique</h2>
      <p>Perhaps the most challenging aspect of momo making is the folding technique. There are several traditional methods, but the most common creates a beautiful pleated pattern that not only looks elegant but also ensures the filling stays secure during cooking.</p>

      <p>Place a spoonful of filling in the center of your rolled dough circle, then bring the edges together, creating small pleats as you work around the circumference. The goal is to create a small pouch that's completely sealed—any openings will cause the filling to leak during steaming.</p>

      <h2>Steaming to Perfection</h2>
      <p>Momos are traditionally steamed in a multi-tiered bamboo steamer, but a regular steamer works just fine. The key is to ensure the momos don't stick to the steamer—lightly oil the surface or line it with cabbage leaves.</p>

      <p>Steam for 12-15 minutes, depending on the size of your momos. They're ready when the dough becomes translucent and slightly firm to the touch.</p>

      <h2>The Perfect Accompaniment</h2>
      <p>No momo is complete without its traditional accompaniment—a spicy tomato-based sauce called "achaar." This tangy, spicy condiment provides the perfect contrast to the rich, savory dumplings.</p>

      <p>At Himalayan Kitchen, we've perfected our achaar recipe over the years, balancing heat, acidity, and umami to create a sauce that enhances rather than masks the delicate flavor of the momos.</p>

      <p>Making momos is truly an art form—one that requires patience, practice, and respect for tradition. Each fold tells a story, each spice carries history, and each bite connects us to the rich culinary heritage of Nepal.</p>
    `,
    author: 'Ramesh Gurung',
    date: '2025-01-15',
    readTime: '8 min read',
    image: 'https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop'
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/blog"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
          
          <div className="card p-8">
            <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-6">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-neutral-900 mb-6">
              {post.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop"
                  alt={post.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-neutral-900">{post.author}</div>
                  <div className="text-sm text-neutral-500">Head Chef & Owner</div>
                </div>
              </div>
              
              <button className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img 
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-xl shadow-lg"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          className="card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div 
            className="prose prose-lg max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-p:leading-relaxed prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="border-t border-neutral-200 mt-12 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop"
                  alt={post.author}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-neutral-900 text-lg">{post.author}</div>
                  <div className="text-neutral-500">Head Chef & Owner</div>
                  <div className="text-sm text-neutral-600 mt-1">
                    Passionate about preserving authentic Nepalese culinary traditions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-neutral-900 mb-8">More Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Spices of the Himalayas: A Flavor Journey',
                excerpt: 'Discover the unique spices that give Nepalese cuisine its distinctive character.',
                image: 'https://images.pexels.com/photos/4198733/pexels-photo-4198733.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
                slug: 'spices-of-himalayas-flavor-journey'
              },
              {
                title: 'Dal Bhat: The Heart of Nepalese Cuisine',
                excerpt: 'Understanding the cultural significance of Nepal\'s national dish.',
                image: 'https://images.pexels.com/photos/5474640/pexels-photo-5474640.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
                slug: 'dal-bhat-heart-of-nepalese-cuisine'
              }
            ].map((relatedPost, index) => (
              <div key={relatedPost.slug} className="card overflow-hidden group">
                <img 
                  src={relatedPost.image}
                  alt={relatedPost.title}
                  className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-neutral-600 mb-3">{relatedPost.excerpt}</p>
                  <Link 
                    to={`/blog/${relatedPost.slug}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </article>
    </div>
  )
}

export default BlogPostPage