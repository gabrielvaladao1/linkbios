'use client'

import { useState, useRef, useTransition } from 'react'
import { uploadAvatar, removeAvatar } from '@/actions/avatar'

interface AvatarUploadProps {
  currentUrl: string | null
  userName: string | null
  slug: string
}

export default function AvatarUpload({ currentUrl, userName, slug }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    if (file.size > 2 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 2MB.')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG, WebP ou GIF.')
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload
    setError('')
    const formData = new FormData()
    formData.append('avatar', file)

    startTransition(async () => {
      const result = await uploadAvatar(formData)
      if (result.error) {
        setError(result.error)
        setPreview(currentUrl) // Revert preview
      } else {
        setSuccess('Foto salva!')
        if (result.url) setPreview(result.url)
        setTimeout(() => setSuccess(''), 2000)
      }
    })
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeAvatar()
      if (result.error) {
        setError(result.error)
      } else {
        setPreview(null)
        setSuccess('Foto removida!')
        setTimeout(() => setSuccess(''), 2000)
      }
    })
  }

  const initials = (userName || slug)[0].toUpperCase()

  return (
    <div className="flex items-center gap-5">
      {/* Avatar circle */}
      <div className="relative group">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-surface-border bg-surface-card shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-400 bg-surface">
              {initials}
            </div>
          )}
        </div>

        {/* Overlay on hover */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-wait"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 16L16 16M10 4L10 12M10 4L7 7M10 4L13 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Loading spinner */}
        {isPending && (
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isPending}
            className="px-4 py-2 rounded-xl bg-surface-hover hover:bg-zinc-700 text-sm font-medium transition-all disabled:opacity-50"
          >
            {preview ? 'Trocar foto' : 'Adicionar foto'}
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-sm text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              Remover
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-500">JPG, PNG, WebP ou GIF. Máximo 2MB.</p>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {success && <p className="text-xs text-green-400">{success}</p>}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
