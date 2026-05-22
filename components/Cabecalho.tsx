// components/Cabecalho.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCarrinhoStore } from '@/lib/carrinhoStore'

export default function Cabecalho() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const [isClient, setIsClient] = useState(false) // ✅ Adicione isto
  const totalItens = useCarrinhoStore((state) => state.totalItens)

  useEffect(() => {
    setIsClient(true) // ✅ Só renderiza no cliente
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      {/* Barra superior */}
      <div className="bg-gray-900 text-white text-xs text-center py-2 px-4">
        <p>Frete grátis para todo o Brasil nas compras acima de R$ 299 ✨</p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Menu Mobile */}
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="lg:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={menuAberto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Menu Esquerdo */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link href="/loja" className="text-sm tracking-[0.2em] uppercase text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Loja
            </Link>
            <Link href="/loja?categoria=vestidos" className="text-sm tracking-[0.2em] uppercase text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Vestidos
            </Link>
            <Link href="/loja?categoria=blusas" className="text-sm tracking-[0.2em] uppercase text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Blusas
            </Link>
            <Link href="/loja?categoria=conjuntos" className="text-sm tracking-[0.2em] uppercase text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Conjuntos
            </Link>
          </nav>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
  <h1 className="text-2xl lg:text-3xl font-serif font-bold tracking-wide text-gray-900">
    JQ Confecções
  </h1>
</Link>

          {/* Menu Direito */}
          <div className="flex items-center gap-6">
            <Link 
              href="/carrinho" 
              className="relative text-sm tracking-[0.2em] uppercase text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Sacola
              {isClient && totalItens() > 0 && ( // ✅ Só mostra no cliente
                <span className="absolute -top-2 -right-5 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItens()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuAberto && (
          <div className="lg:hidden border-t border-gray-100 py-6">
            <nav className="flex flex-col gap-4">
              <Link href="/loja" className="text-base text-gray-600 hover:text-gray-900 transition-colors py-2">
                Loja
              </Link>
              <Link href="/loja?categoria=vestidos" className="text-base text-gray-600 hover:text-gray-900 transition-colors py-2">
                Vestidos
              </Link>
              <Link href="/loja?categoria=blusas" className="text-base text-gray-600 hover:text-gray-900 transition-colors py-2">
                Blusas
              </Link>
              <Link href="/loja?categoria=conjuntos" className="text-base text-gray-600 hover:text-gray-900 transition-colors py-2">
                Conjuntos
              </Link>
              <Link href="/carrinho" className="text-base text-gray-600 hover:text-gray-900 transition-colors py-2">
                Sacola {isClient && totalItens() > 0 && `(${totalItens()})`}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}