// components/ProdutoPageClient.tsx
'use client'

import { useState } from 'react'
import ImagemProduto from '@/components/ImagemProduto'
import BotaoWhatsApp from '@/components/BotaoWhatsApp'

interface ProdutoPageClientProps {
  produto: any
}

export default function ProdutoPageClient({ produto }: ProdutoPageClientProps) {
  const [corSelecionada, setCorSelecionada] = useState(produto.cores?.[0] || '')
  const temPromocao = produto.preco_promocional && produto.preco_promocional < produto.preco

  return (
    <>
      <ImagemProduto produto={produto} corSelecionada={corSelecionada} />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{produto.nome}</h1>
        <div className="flex items-baseline gap-3">
          {temPromocao ? (
            <>
              <span className="text-3xl font-bold text-red-600">R$ {produto.preco_promocional.toFixed(2)}</span>
              <span className="text-xl text-gray-400 line-through">R$ {produto.preco.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-900">R$ {produto.preco.toFixed(2)}</span>
          )}
        </div>
        <BotaoWhatsApp produto={produto} onCorChange={setCorSelecionada} />
        {produto.descricao && (
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold uppercase mb-3">Descrição</h3>
            <p className="text-gray-600">{produto.descricao}</p>
          </div>
        )}
      </div>
    </>
  )
}