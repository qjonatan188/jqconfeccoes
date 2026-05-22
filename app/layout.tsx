// app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import Cabecalho from '@/components/Cabecalho'
import Rodape from '@/components/Rodape'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'JQ Confecções | Moda Feminina',
    template: '%s | JQ Confecções',
  },
  description: 'Descubra peças exclusivas que celebram a beleza e individualidade da mulher contemporânea.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${cormorant.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <Cabecalho />
        <div className="min-h-screen">
          {children}
        </div>
        <Rodape />
      </body>
    </html>
  )
}