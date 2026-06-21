import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight } from 'lucide-react'

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Find a Trusted Electrician in Lahore',
      excerpt: 'Learn the key tips to find a reliable electrician for your electrical problems.',
      author: 'Admin',
      date: '2024-01-15',
      category: 'Guide',
      image: '⚡',
      content: 'Finding a trusted electrician in Lahore can be challenging. Here are some tips...'
    },
    { 
      id: 2,
      title: 'Top 10 Home Repair Tips for Pakistani Homes',
      excerpt: 'Essential home maintenance tips that every Pakistani homeowner should know.',
      author: 'Expert Writer',
      date: '2024-01-12',
      category: 'Tips',
      image: '🔧',
      content: 'Home maintenance is essential for keeping your home safe and comfortable...'
    },
    {
      id: 3,
      title: 'How Much Does a Plumber Cost in Pakistan?',
      excerpt: 'Complete breakdown of plumbing service costs in Pakistan for 2024.',
      author: 'Admin',
      date: '2024-01-10',
      category: 'Pricing',
      image: '💧',
      content: 'Plumbing costs can vary significantly based on several factors...'
    },
    {
      id: 4,
      title: 'Best AC Repair Services in Karachi',
      excerpt: 'Expert advice on maintaining your air conditioner and finding reliable repair services.',
      author: 'Expert Writer',
      date: '2024-01-08',
      category: 'Services',
      image: '❄️',
      content: 'Air conditioning maintenance is crucial in Karachis hot climate...'
    },
    {
      id: 5,
      title: 'How to Book a Karigar Online in Pakistan',
      excerpt: 'Step-by-step guide on how to use Karigar platform to book services.',
      author: 'Admin',
      date: '2024-01-05',
      category: 'Guide',
      image: '📱',
      content: 'Booking a service on Karigar is easy and quick. Follow these steps...'
    },
    {
      id: 6,
      title: 'Ghar Ki Repair Kaise Karein - Complete Guide',
      excerpt: 'گھر کی مرمت کے لیے مکمل رہنما - اردو میں',
      author: 'لکھاری',
      date: '2024-01-01',
      category: 'اردو گائیڈ',
      image: '🏠',
      content: 'گھر کی مرمت کرنا ہر گھر والے کے لیے ضروری ہے...'
    }
  ]

  return (
    <div>

      <div className="bg-gradient-to-br from-primary to-blue-900 text-white py-12 px-4">
        <div className="container">
          <h1 className="font-poppins text-4xl font-bold mb-4">Karigar Blog</h1>
          <p className="text-gray-300 text-lg">Tips, guides, and stories from Pakistan's home services experts</p>
        </div>
      </div>

      <div className="py-16 px-4 bg-field-general min-h-screen">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:shadow-xl transition-all h-full flex flex-col">
                <div className="bg-gradient-to-br from-primary to-secondary h-40 flex items-center justify-center">
                  <span className="text-6xl">{post.image}</span>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge badge-primary text-xs">{post.category}</span>
                  </div>

                  <h2 className="font-poppins font-bold text-white text-lg mb-2 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="border-t border-gray-700 pt-4 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <a href="#" className="mt-4 flex items-center gap-2 text-secondary hover:text-orange-500 font-semibold text-sm">
                    Read More
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-primary to-blue-900 rounded-xl p-8 text-white text-center">
            <h2 className="font-poppins text-2xl font-bold mb-3">Stay Updated with Latest Tips</h2>
            <p className="text-gray-200 mb-6">Subscribe to our newsletter for home service tips and offers</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="btn-secondary px-8">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}