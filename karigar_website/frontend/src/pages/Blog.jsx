import { Link } from 'react-router-dom'
import { ArrowRight, Clock, BookOpen, Calendar, User } from 'lucide-react'
import { BLOG_POSTS } from '../data/blogData'

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header Section */}
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

        {/* Blog Posts 4-Card Grid — Every card links directly to its own article page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="bg-white border border-[#E4EAF2] rounded-3xl overflow-hidden hover:border-[#FF7A00]/50 transition-all shadow-[0_8px_30px_rgba(10,31,68,0.06)] hover:shadow-xl flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Header Icon Graphic */}
                <div className="h-36 bg-gradient-to-br from-[#0A1F44] to-[#102747] flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                  {post.icon}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-[#5A6B84] mb-2 font-medium">
                    <span className="text-[#FF7A00] font-bold">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-poppins font-bold text-base text-[#0A1F44] mb-2 leading-snug group-hover:text-[#FF7A00] transition-colors line-clamp-2">
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
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
