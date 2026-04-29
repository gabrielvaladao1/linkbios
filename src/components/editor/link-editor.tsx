'use client'

import { useState, useTransition } from 'react'
import { createLink, updateLink, deleteLink, toggleLink, reorderLinks } from '@/actions/links'

interface Link {
  id: string
  title: string
  url: string
  icon: string | null
  position: number
  isActive: boolean
}

export function LinkEditor({ links: initialLinks, clickCounts = {} }: { links: Link[]; clickCounts?: Record<string, number> }) {
  const [links, setLinks] = useState(initialLinks)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createLink(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setShowForm(false)
        setError('')
        window.location.reload()
      }
    })
  }

  async function handleUpdate(linkId: string, formData: FormData) {
    startTransition(async () => {
      const result = await updateLink(linkId, formData)
      if (result?.error) setError(result.error)
      else {
        setEditingId(null)
        window.location.reload()
      }
    })
  }

  async function handleDelete(linkId: string) {
    if (!confirm('Tem certeza que quer excluir este link?')) return
    startTransition(async () => {
      await deleteLink(linkId)
      setLinks(links.filter(l => l.id !== linkId))
    })
  }

  async function handleToggle(linkId: string) {
    startTransition(async () => {
      await toggleLink(linkId)
      setLinks(links.map(l => l.id === linkId ? { ...l, isActive: !l.isActive } : l))
    })
  }

  async function moveLink(index: number, direction: 'up' | 'down') {
    const newLinks = [...links]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newLinks.length) return
    ;[newLinks[index], newLinks[swapIndex]] = [newLinks[swapIndex], newLinks[index]]
    setLinks(newLinks)
    startTransition(async () => {
      await reorderLinks(newLinks.map(l => l.id))
    })
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      <button
        onClick={() => { setShowForm(!showForm); setEditingId(null) }}
        className="w-full py-3 rounded-xl border-2 border-dashed border-surface-border hover:border-brand-600/50 text-zinc-400 hover:text-brand-400 text-sm font-medium transition-all"
      >
        {showForm ? '✕ Cancelar' : '+ Adicionar link'}
      </button>

      {/* Create form */}
      {showForm && (
        <div className="p-5 rounded-2xl border border-brand-600/30 bg-surface-card animate-fade-in">
          <form action={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Título</label>
              <input name="title" required placeholder="Ex: Meu canal no YouTube" className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 focus:border-brand-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">URL</label>
              <input name="url" type="url" required placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 focus:border-brand-500 text-sm" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={isPending} className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all disabled:opacity-50">
              {isPending ? 'Salvando...' : 'Salvar link'}
            </button>
          </form>
        </div>
      )}

      {/* Links list */}
      <div className="space-y-2">
        {links.map((link, index) => (
          <div
            key={link.id}
            className={`p-4 rounded-2xl border bg-surface-card transition-all ${
              link.isActive ? 'border-surface-border' : 'border-surface-border/50 opacity-50'
            }`}
          >
            {editingId === link.id ? (
              /* Edit mode */
              <form action={(fd) => handleUpdate(link.id, fd)} className="space-y-3">
                <input name="title" defaultValue={link.title} required className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-white text-sm" />
                <input name="url" type="url" defaultValue={link.url} required className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-white text-sm" />
                <div className="flex gap-2">
                  <button type="submit" disabled={isPending} className="px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-medium">Salvar</button>
                  <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg bg-surface-hover text-zinc-400 text-xs">Cancelar</button>
                </div>
              </form>
            ) : (
              /* View mode */
              <div className="flex items-center gap-3">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => moveLink(index, 'up')} disabled={index === 0} className="text-zinc-500 hover:text-white disabled:opacity-20 text-xs transition-colors">▲</button>
                  <button onClick={() => moveLink(index, 'down')} disabled={index === links.length - 1} className="text-zinc-500 hover:text-white disabled:opacity-20 text-xs transition-colors">▼</button>
                </div>

                {/* Link info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{link.title}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                      (clickCounts[link.id] || 0) > 0
                        ? 'bg-brand-600/15 text-brand-400'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                        <path d="M2 8L5 2L8 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {clickCounts[link.id] || 0}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleToggle(link.id)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${link.isActive ? 'bg-brand-600' : 'bg-zinc-700'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${link.isActive ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                  <button onClick={() => setEditingId(link.id)} className="p-2 text-zinc-500 hover:text-white transition-colors text-sm">✏️</button>
                  <button onClick={() => handleDelete(link.id)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors text-sm">🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {links.length === 0 && !showForm && (
        <div className="text-center py-12 text-zinc-500">
          <p className="text-4xl mb-3">🔗</p>
          <p className="font-medium">Nenhum link ainda</p>
          <p className="text-sm mt-1">Clique em &quot;Adicionar link&quot; para começar</p>
        </div>
      )}
    </div>
  )
}
