import { useState, useEffect } from 'react'
import { Star, Eye, EyeOff, Bookmark, BookmarkCheck } from 'lucide-react'
import api from '../../config/api'

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'} />
      ))}
    </div>
  )
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    api.get('/admin/reviews').then(({ data }) => setReviews(data)).finally(() => setLoading(false))
  }, [])

  const toggleFeature = async (id) => {
    setUpdatingId(id)
    try {
      const { data } = await api.put(`/admin/reviews/${id}/feature`)
      setReviews((prev) => prev.map((r) => r._id === id ? { ...r, featured: data.featured } : r))
    } finally { setUpdatingId(null) }
  }

  const toggleHide = async (id) => {
    setUpdatingId(id)
    try {
      const { data } = await api.put(`/admin/reviews/${id}/hide`)
      setReviews((prev) => prev.map((r) => r._id === id ? { ...r, hidden: data.hidden } : r))
    } finally { setUpdatingId(null) }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-poppins">Reviews</h1>
        <p className="text-slate-400 text-sm mt-1">Feature reviews on the homepage or hide abusive ones — without deleting</p>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-20 animate-pulse" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Star size={40} className="mx-auto mb-3 opacity-30" />
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide">Review</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden md:table-cell">Karigar</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden sm:table-cell">Rating</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide">Featured</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {reviews.map((r) => (
                  <tr key={r._id} className={`hover:bg-slate-800/30 transition-colors ${r.hidden ? 'opacity-40' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium text-sm">{r.customer?.fullName || 'Anonymous'}</p>
                      <p className="text-slate-400 text-xs mt-0.5 max-w-[200px] truncate">{r.comment || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300 hidden md:table-cell">{r.karigar?.fullName || '—'}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <StarRating rating={r.rating} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                      {new Date(r.createdAt).toLocaleDateString('en-PK')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        disabled={updatingId === r._id}
                        onClick={() => toggleFeature(r._id)}
                        title={r.featured ? 'Remove from homepage' : 'Feature on homepage'}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${r.featured ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'}`}
                      >
                        {r.featured ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        disabled={updatingId === r._id}
                        onClick={() => toggleHide(r._id)}
                        title={r.hidden ? 'Show review' : 'Hide review'}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${r.hidden ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20' : 'text-slate-500 hover:text-red-400 hover:bg-slate-800'}`}
                      >
                        {r.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
