'use client'

import { useState } from 'react'
import ShareModal from './share-modal'

export default function ShareButton({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-brand-600/25"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 7L10 5M6 9L10 11M14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4ZM6 8C6 9.10457 5.10457 10 4 10C2.89543 10 2 9.10457 2 8C2 6.89543 2.89543 6 4 6C5.10457 6 6 6.89543 6 8ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Compartilhar
      </button>
      <ShareModal slug={slug} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
