import { Link } from 'react-router-dom'

export default function BrandLogo({ variant = 'dark', size = 'md', to = '/', className = '' }) {
  // Uses /logo.png as requested by the user
  const logoSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  const textColor = variant === 'dark' ? 'text-white' : 'text-[#0A1F44]'

  const content = (
    <div className={`inline-flex items-center gap-2.5 font-poppins font-extrabold select-none ${className}`}>
      {/* Official KarigarPK Logo WebP with fallback */}
      <img
        src="/logo.webp"
        onError={(e) => { e.currentTarget.src = '/logo.png' }}
        alt="KarigarPK Logo"
        className={`${logoSizes[size] || logoSizes.md} object-contain rounded-xl flex-shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105`}
      />

      {/* Brand Name Text: Karigar (White or Navy) + PK (Orange) */}
      <span className={`${textSizes[size] || textSizes.md} tracking-tight font-black leading-none`}>
        <span className={textColor}>Karigar</span>
        <span className="text-[#FF7A00]">PK</span>
      </span>
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center group">
        {content}
      </Link>
    )
  }

  return content
}
