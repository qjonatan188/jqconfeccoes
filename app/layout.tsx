import type { Metadata } from 'next'
import './globals.css'
import Cabecalho from '@/components/Cabecalho'
import Rodape from '@/components/Rodape'

export const metadata: Metadata = {
  title: {
    default: 'JQ Confecções | Moda Feminina',
    template: '%s | JQ Confecções',
  },
  description: 'Moda feminina de qualidade. Atacado e varejo.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-900 antialiased" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <Cabecalho />
        <div className="min-h-screen">
          {children}
        </div>
        <Rodape />
      </body>
    </html>
  )
}