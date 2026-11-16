import { useState } from 'react'

export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'KP'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function sanitizeImageUrl(url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null

  // Prevent document scans / PDF / sensitive files from being used as avatars
  if (/\.(pdf|doc|docx)$/i.test(trimmed)) return null
  if (/cnic/i.test(trimmed)) return null

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed
  }

  // Backend API URL resolution for uploaded paths (like /uploads/photo.jpg)
  const backendBase = 'https://karigar-pk-xuea.onrender.com'
  if (trimmed.startsWith('/')) {
    return `${backendBase}${trimmed}`
  }
  return `${backendBase}/${trimmed}`
}

export default function UserAvatar({
  src,
  name = 'Karigar',
  alt = 'Karigar photo',
  className = 'w-12 h-12 rounded-full',
  textClassName = 'text-sm font-bold text-white',
  bgClassName = 'bg-[#0A1F44]'
}) {
  const [hasError, setHasError] = useState(false)
  const resolvedSrc = !hasError ? sanitizeImageUrl(src) : null

  if (!resolvedSrc) {
    return (
      <div
        className={`${className} ${bgClassName} flex items-center justify-center flex-shrink-0 border-2 border-white/80 shadow-sm select-none`}
        title={name}
      >
        <span className={textClassName}>{getInitials(name)}</span>
      </div>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt || name}
      onError={() => setHasError(true)}
      className={`${className} object-cover flex-shrink-0 border-2 border-white/80 shadow-sm`}
      loading="lazy"
    />
  )
}
