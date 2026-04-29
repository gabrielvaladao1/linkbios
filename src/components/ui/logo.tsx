import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  href?: string
  className?: string
}

const SIZES = {
  sm: { text: 'text-lg', icon: 'w-6 h-6' },
  md: { text: 'text-xl', icon: 'w-8 h-8' },
  lg: { text: 'text-3xl', icon: 'w-10 h-10' },
}

export function Logo({ size = 'md', showIcon = true, href = '/', className = '' }: LogoProps) {
  const s = SIZES[size]

  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {showIcon && (
        <span className={`${s.icon} rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shrink-0`}>
          <svg viewBox="0 0 24 24" fill="none" className="w-[60%] h-[60%]" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </span>
      )}
      <span className={`font-display ${s.text} font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent`}>
        PáginaBio
      </span>
    </span>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
