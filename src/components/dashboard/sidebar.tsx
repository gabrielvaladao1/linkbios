'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from '@/actions/auth'

interface SidebarProps {
  user: {
    name: string | null
    slug: string
    plan: string
    avatarUrl: string | null
  }
  setupProgress?: { completed: number; total: number }
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'VisÃ£o geral', icon: 'ðŸ“Š' },
  { href: '/dashboard/links', label: 'Links', icon: 'ðŸ”—' },
  { href: '/dashboard/aparencia', label: 'AparÃªncia', icon: 'ðŸŽ¨' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'ðŸ“ˆ' },
  { href: '/dashboard/leads', label: 'Leads', icon: 'ðŸ“§' },
  { href: '/dashboard/planos', label: 'Planos', icon: 'ðŸ’Ž' },
  { href: '/dashboard/configuracoes', label: 'ConfiguraÃ§Ãµes', icon: 'âš™ï¸' },
]

function SidebarContent({ user, onNavigate, setupProgress }: SidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-surface-border shrink-0">
        <Link href="/" className="font-display text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
          PáginaBio
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 mx-3 mt-4 rounded-xl bg-surface border border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-sm font-bold shrink-0">
            {user.name?.[0]?.toUpperCase() || user.slug[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name || user.slug}</p>
            <p className="text-xs text-zinc-500 truncate">paginabio.com.br/{user.slug}</p>
          </div>
        </div>
        <div className="mt-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
            user.plan === 'FREE' ? 'bg-zinc-800 text-zinc-400' :
            user.plan === 'PRO' ? 'bg-brand-600/20 text-brand-400' :
            'bg-purple-600/20 text-purple-400'
          }`}>
            {user.plan === 'FREE' ? 'GrÃ¡tis' : user.plan}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const showBadge = item.href === '/dashboard' && setupProgress && setupProgress.completed < setupProgress.total
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-brand-600/10 text-brand-400 font-medium'
                  : 'text-zinc-400 hover:text-white hover:bg-surface-hover'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {showBadge && (
                <span className="ml-auto inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-brand-600/20 text-brand-400 text-[10px] font-bold">
                  {setupProgress.completed}/{setupProgress.total}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Preview Link */}
      <div className="px-3 mb-2 shrink-0">
        <a
          href={`/${user.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-surface-hover transition-all"
        >
          <span>ðŸŒ</span>
          Ver minha pÃ¡gina
          <span className="text-xs">â†—</span>
        </a>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-surface-border shrink-0">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <span>ðŸšª</span>
            Sair
          </button>
        </form>
      </div>
    </>
  )
}

export function DashboardSidebar({ user, setupProgress }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass flex items-center justify-between px-4">
        <Link href="/" className="font-display text-lg font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
          PáginaBio
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-surface-hover transition-colors"
          aria-label="Menu"
        >
          <span className={`w-5 h-0.5 bg-zinc-300 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
          <span className={`w-5 h-0.5 bg-zinc-300 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-zinc-300 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 mobile-nav-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-surface-card border-r border-surface-border z-50 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent user={user} setupProgress={setupProgress} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-surface-card border-r border-surface-border hidden lg:flex flex-col z-40">
        <SidebarContent user={user} setupProgress={setupProgress} />
      </aside>
    </>
  )
}
