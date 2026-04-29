'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface ShareModalProps {
  slug: string
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ slug, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const publicUrl = `https://paginabio.com.br/${slug}`

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(publicUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      }).then(setQrDataUrl)
    }
  }, [isOpen, publicUrl])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = publicUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleDownloadQR() {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.download = `PáginaBio-${slug}-qrcode.png`
    link.href = qrDataUrl
    link.click()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-card border border-surface-border rounded-2xl p-6 w-full max-w-sm animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Compartilhar</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-hover flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* URL + Copy */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 px-4 py-3 rounded-xl bg-surface border border-surface-border text-sm text-zinc-300 truncate font-mono">
            paginabio.com.br/{slug}
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            {copied ? 'âœ“ Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white rounded-2xl p-4">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-48 h-48"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-zinc-300 border-t-brand-600 rounded-full animate-spin" />
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-500 text-center">
            Escaneie para visitar sua pÃ¡gina
          </p>

          <button
            onClick={handleDownloadQR}
            className="w-full py-3 rounded-xl border border-surface-border hover:border-zinc-600 text-sm font-medium transition-all hover:bg-surface-hover flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 14H12M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Baixar QR Code (PNG)
          </button>
        </div>

        {/* Social share buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Confira minha pÃ¡gina: ${publicUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 rounded-xl bg-green-600/10 text-green-400 text-xs font-medium text-center hover:bg-green-600/20 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent('Confira meus links!')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 rounded-xl bg-sky-600/10 text-sky-400 text-xs font-medium text-center hover:bg-sky-600/20 transition-colors"
          >
            X / Twitter
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent('Confira meus links!')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 rounded-xl bg-blue-600/10 text-blue-400 text-xs font-medium text-center hover:bg-blue-600/20 transition-colors"
          >
            Telegram
          </a>
        </div>
      </div>
    </div>
  )
}
