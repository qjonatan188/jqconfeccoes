// components/BotoesCard.tsx
'use client'

import { useState } from 'react'
import { useCarrinhoStore } from '@/lib/carrinhoStore'
import ModalCompra from '@/components/ModalCompra'

interface BotoesCardProps {
  produto: any
}

export default function BotoesCard({ produto }: BotoesCardProps) {
  const [modalAberto, setModalAberto] = useState(false)
  const adicionarItem = useCarrinhoStore((state) => state.adicionarItem)
  const imagem = produto.produto_imagens?.[0]?.url || ''
  const tamanho = produto.tamanhos?.[0] || 'Único'
  const cor = produto.cores?.[0] || 'Única'

  const handleAdicionar = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    adicionarItem({
      id: produto.id,
      nome: produto.nome,
      slug: produto.slug,
      preco: produto.preco,
      preco_promocional: produto.preco_promocional,
      imagem,
      tamanho,
      cor,
      quantidade: 1,
    })
  }

  return (
    <>
      <div className="mt-2 px-1 flex gap-1">
        <button onClick={handleAdicionar} className="flex-1 bg-gray-900 text-white text-xs py-2 rounded font-medium hover:bg-gray-800 transition-colors">
          Adicionar
        </button>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setModalAberto(true) }} className="flex-1 bg-green-600 text-white text-xs py-2 rounded font-medium hover:bg-green-700 transition-colors">
          Comprar
        </button>
      </div>
      <ModalCompra aberto={modalAberto} fechar={() => setModalAberto(false)} produto={produto} />
    </>
  )
}