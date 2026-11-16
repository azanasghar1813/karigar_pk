import { useParams, Link } from 'react-router-dom'
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Share2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import { BLOG_POSTS } from '../data/blogData'

export default function BlogArticle() {
  const { slug } = useParams()
  const article = BLOG_POSTS.find((p) => p.slug === slug)

  if (!article) {
    return (
      <div className="min-h-[70vh] bg-[#F5F7FB] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl border border-[#E4EAF2] p-8 max-w-md w-full text-center shadow-lg">
          <AlertCircle size={44} className="text-red-500 mx-auto mb-3" />
          <h1 className="font-poppins text-2xl font-bold text-[#0A1F44] mb-2">Guide Nahi Mila</h1>
          <p className="text-xs sm:text-sm text-[#5A6B84] mb-6">
            Ye article dastiyab nahi hai ya link badal diya gaya hai.
          </p>
          <Link
            to="/blog"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md"
          >
            <ArrowLeft size={16} /> Wapis Guides Par Jayein
          </Link>
        </div>
      </div>
    )
  }

  const otherArticles = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6B84] mb-6">
          <Link to="/" className="hover:text-[#0A1F44] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#0A1F44] transition-colors">Knowledge Hub</Link>
          <span>/</span>
          <span className="text-[#FF7A00] truncate max-w-xs sm:max-w-md">{article.title}</span>
        </div>

        {/* Article Header Card */}
        <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(10,31,68,0.06)] mb-8">
          
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-orange-50 text-[#FF7A00] font-bold text-xs px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-[#5A6B84] flex items-center gap-1">
              <Clock size={12} /> {article.readTime}
            </span>
          </div>

          <h1 className="font-poppins text-2xl sm:text-4xl font-extrabold text-[#0A1F44] leading-tight mb-4 tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-[#5A6B84] border-t border-[#E4EAF2] pt-4 mb-6">
            <span className="flex items-center gap-1.5 font-semibold text-[#0A1F44]">
              <User size={13} className="text-[#FF7A00]" /> {article.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> {article.date}
            </span>
          </div>

          {/* Featured Article Image */}
          {article.image && (
            <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-8 shadow-inner bg-slate-100">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Lead Paragraph */}
          <p className="text-sm sm:text-base text-[#0E1E3A] font-medium leading-relaxed mb-8 bg-[#F8FAFC] p-4 sm:p-5 rounded-2xl border-l-4 border-[#FF7A00]">
            {article.leadParagraph}
          </p>

          {/* Article Body Sections */}
          <div className="space-y-8">
            {article.sections.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="font-poppins text-lg sm:text-xl font-bold text-[#0A1F44]">
                  {sec.heading}
                </h2>
                <p className="text-xs sm:text-sm text-[#0E1E3A] leading-relaxed">
                  {sec.content}
                </p>

                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-2 mt-3 pl-1">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#0E1E3A] leading-relaxed">
                        <CheckCircle2 size={16} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Bottom Callout / Hire Verified Pro Banner */}
          <div className="mt-10 p-6 rounded-2xl bg-[#0A1F44] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={18} className="text-[#FF7A00]" />
                <h3 className="font-poppins font-bold text-sm sm:text-base text-white">Need a verified professional?</h3>
              </div>
              <p className="text-xs text-gray-300">
                Book background-checked electricians, plumbers, and technicians across Pakistan.
              </p>
            </div>
            <Link
              to="/find-karigar"
              className="inline-flex items-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-md flex-shrink-0"
            >
              <span>Explore Karigars</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

        {/* Other Recommended Guides */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-poppins font-bold text-lg sm:text-xl text-[#0A1F44]">
              More Home Guides & Tips
            </h3>
            <Link to="/blog" className="text-xs font-bold text-[#FF7A00] hover:text-[#F06400]">
              View all guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherArticles.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="bg-white border border-[#E4EAF2] rounded-2xl p-4 shadow-xs hover:border-[#FF7A00]/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#FF7A00] block mb-1">{p.category}</span>
                  <h4 className="font-poppins font-bold text-xs sm:text-sm text-[#0A1F44] group-hover:text-[#FF7A00] transition-colors leading-snug line-clamp-2 mb-2">
                    {p.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#5A6B84] pt-2 border-t border-gray-100">
                  <span>{p.readTime}</span>
                  <span className="font-bold text-[#0A1F44] group-hover:text-[#FF7A00] inline-flex items-center gap-1">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
