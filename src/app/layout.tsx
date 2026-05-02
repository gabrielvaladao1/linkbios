import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Suspense } from 'react'
import QueryToast from '@/components/ui/query-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'PáginaBio — Sua página de links profissional com PIX',
    template: '%s — PáginaBio',
  },
  description:
    'Crie sua página de links profissional em 2 minutos. Venda por PIX, veja analytics e conecte seu WhatsApp. 100% brasileira, em português e com preço em real.',
  keywords: ['link na bio', 'linktree alternativa', 'página de links', 'pix', 'link in bio brasil', 'PáginaBio', 'bio link'],
  authors: [{ name: 'PáginaBio' }],
  creator: 'PáginaBio',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://paginabio.com.br'),
  openGraph: {
    title: 'PáginaBio — Sua página de links profissional com PIX',
    description: 'Crie sua página de links em 2 minutos. PIX nativo, analytics e WhatsApp.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'PáginaBio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PáginaBio — Sua página de links profissional com PIX',
    description: 'Crie sua página de links em 2 minutos. PIX nativo, analytics e WhatsApp.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased bg-surface text-zinc-100">
        <Suspense fallback={null}>
          <QueryToast />
        </Suspense>
        {children}
      </body>
    </html>
  )
}

