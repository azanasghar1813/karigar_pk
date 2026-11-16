import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Find a Trusted Electrician in Pakistan',
      excerpt: 'Key safety checkpoints, breaker board testing, and finding reliable certified electricians in Karachi, Lahore, and Islamabad.',
      author: 'KarigarPK Editorial',
      date: 'Nov 12, 2025',
      category: 'Safety & Guides',
      icon: '⚡',
      readTime: '4 min read'
    },
    { 
      id: 2,
      title: 'Top 10 Essential Home Repair Tips for Pakistani Residences',
      excerpt: 'Preventative maintenance checklist for seasonal rains, plumbing valves, water tank hygiene, and UPS backup battery health.',
      author: 'Technical Team',
      date: 'Oct 28, 2025',
      category: 'Home Care',
      icon: '🔧',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'Fair Pricing Guide: What Does a Plumber Cost in Pakistan?',
      excerpt: 'Comprehensive transparent breakdown of plumbing charges for pipe leakages, sanitary installation, and pump repair.',
      author: 'Pricing Desk',
      date: 'Oct 15, 2025',
      category: 'Cost Estimates',
      icon: '💧',
      readTime: '5 min read'
    },
    {
      id: 4,
      title: 'AC Servicing & Gas Refill: Complete Pre-Summer Guide',
      excerpt: 'How split AC deep chemical cleaning saves electricity and prevents compressor failure during extreme Pakistani summers.',
      author: 'HVAC Specialist',
      date: 'Sep 30, 2025',
      category: 'Cooling',
      icon: '❄️',
      readTime: '4 min read'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest block mb-2">
            Guides, Tips & Advice
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl font-extrabold text-[#0A1F44] mb-3 tracking-tight">
            KarigarPK Knowledge Hub
          </h1>
          <p className="text-[#5A6B84] text-sm sm:text-base leading-relaxed">
            Practical advice, transparent pricing guides, and safety tips from Pakistan's leading verified craftsman network.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-[#E4EAF2] rounded-3xl overflow-hidden hover:border-[#FF7A00]/50 transition-all shadow-[0_8px_30px_rgba(10,31,68,0.06)] hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="h-36 bg-gradient-to-br from-[#0A1F44] to-[#102747] flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                  {post.icon}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-[#5A6B84] mb-2 font-medium">
                    <span className="text-[#FF7A00] font-bold">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="font-poppins font-bold text-base text-[#0A1F44] mb-2 leading-snug group-hover:text-[#FF7A00] transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-xs text-[#5A6B84] leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#E4EAF2]/60 mt-auto flex items-center justify-between text-xs text-[#5A6B84]">
                <span>{post.date}</span>
                <span className="font-bold text-[#0A1F44] group-hover:text-[#FF7A00] inline-flex items-center gap-1 transition-colors">
                  Read Guide <ArrowRight size={12} />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  )
}
