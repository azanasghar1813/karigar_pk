import { Star } from 'lucide-react'

export function formatRatingValue(rating) {
  if (rating === undefined || rating === null || isNaN(rating) || Number(rating) === 0) {
    return null
  }
  return Number(rating).toFixed(1)
}

export function formatReviewCount(count) {
  if (!count || isNaN(count) || Number(count) <= 0) {
    return '0'
  }
  const n = Number(count)
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return n.toString()
}

export default function RatingBadge({ rating, reviewsCount, size = 'sm', showCount = true, className = '' }) {
  const count = Number(reviewsCount) || 0
  const ratingVal = formatRatingValue(rating)

  // Honest state: If zero reviews or no valid rating, display "New" badge
  if (!count || !ratingVal) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-2 py-0.5 text-xs ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        New
      </span>
    )
  }

  const iconSize = size === 'lg' ? 18 : size === 'md' ? 15 : 13
  const textSize = size === 'lg' ? 'text-base font-bold' : size === 'md' ? 'text-sm font-bold' : 'text-xs font-bold'

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-1 text-[#0E1E3A]">
        <Star size={iconSize} className="fill-[#FFB800] text-[#FFB800]" />
        <span className={textSize}>{ratingVal}</span>
      </div>
      {showCount && (
        <span className="text-[#5A6B84] text-xs font-medium">
          ({formatReviewCount(count)} reviews)
        </span>
      )}
    </div>
  )
}
