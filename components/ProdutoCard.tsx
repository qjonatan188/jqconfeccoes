// components/ProdutoCard.tsx
'use client'

import Link from 'next/link'
import { useCarrinhoStore } from '@/lib/carrinhoStore'

interface ProdutoCardProps {
  produto: {
    id: number
    nome: string
    slug: string
    preco: number
    preco_promocional: number | null
    tamanhos: string[]
    cores: string[]
    produto_imagens: { url: string; alt_text: string }[]
    categorias: { nome: string; slug: string } | null
  }
}

export default function ProdutoCard({ produto }: ProdutoCardProps) {
  const adicionarItem = useCarrinhoStore((state) => state.adicionarItem)
  const imagemPrincipal = produto.produto_imagens?.[0]?.url || '/placeholder.jpg'
  const temPromocao = produto.preco_promocional && produto.preco_promocional < produto.preco

  const handleCompraRapida = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const tamanho = produto.tamanhos?.[0] || 'Único'
    const cor = produto.cores?.[0] || 'Única'

    adicionarItem({
      id: produto.id,
      nome: produto.nome,
      slug: produto.slug,
      preco: produto.preco,
      preco_promocional: produto.preco_promocional,
      imagem: imagemPrincipal,
      tamanho,
      cor,
      quantidade: 1,
    })
  }

  return (
    <div className="group relative">
      <Link href={`/loja/${produto.slug}`}>
        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 relative mb-4">
          <img
            src={imagemPrincipal}
            alt={produto.produto_imagens?.[0]?.alt_text || produto.nome}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {temPromocao && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
              -{Math.round((1 - produto.preco_promocional! / produto.preco) * 100)}%
            </span>
          )}
          
          {/* Botão compra rápida */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleCompraRapida}
              className="w-full bg-white text-gray-900 text-sm font-medium py-3 rounded-full hover:bg-pink-50 transition-colors"
            >
              Comprar Rápido
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {produto.categorias?.nome}
        </p>
        <h3 className="text-base font-medium text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
          {produto.nome}
        </h3>
        <div className="flex items-center gap-3">
          {temPromocao ? (
            <>
              <span className="text-lg font-bold text-red-500">
                R$ {produto.preco_promocional!.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                R$ {produto.preco.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              R$ {produto.preco.toFixed(2)}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}