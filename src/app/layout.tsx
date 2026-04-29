import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
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
    default: 'PáginaBio â€” Sua pÃ¡gina de links profissional com PIX',
    template: '%s â€” PáginaBio',
  },
  description:
    'Crie sua pÃ¡gina de links profissional em 2 minutos. Venda por PIX, veja analytics e conecte seu WhatsApp. 100% brasileira, em portuguÃªs e com preÃ§o em real.',
  keywords: ['link na bio', 'linktree alternativa', 'pÃ¡gina de links', 'pix', 'link in bio brasil', 'PáginaBio', 'bio link'],
  authors: [{ name: 'PáginaBio' }],
  creator: 'PáginaBio',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://paginabio.com.br'),
  openGraph: {
    title: 'PáginaBio â€” Sua pÃ¡gina de links profissional com PIX',
    description: 'Crie sua pÃ¡gina de links em 2 minutos. PIX nativo, analytics e WhatsApp.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'PáginaBio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PáginaBio â€” Sua pÃ¡gina de links profissional com PIX',
    description: 'Crie sua pÃ¡gina de links em 2 minutos. PIX nativo, analytics e WhatsApp.',
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
        {children}
      </body>
    </html>
  )
}
