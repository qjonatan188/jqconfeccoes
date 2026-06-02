// components/ImagemProduto.tsx
'use client'

import { useState, useEffect } from 'react'

interface ImagemProdutoProps {
  produto: {
    nome: string
    cores: string[]
    produto_imagens: { url: string; alt_text: string; cor?: string | null }[]
  }
  corSelecionada?: string
}

export default function ImagemProduto({ produto, corSelecionada }: ImagemProdutoProps) {
  const [corAtiva, setCorAtiva] = useState(corSelecionada || produto.cores?.[0] || '')
  const imagens = produto.produto_imagens || []

  useEffect(() => {
    if (corSelecionada) {
      setCorAtiva(corSelecionada)
    }
  }, [corSelecionada])

  const imagemAtual = 
    imagens.find(img => img.cor?.toLowerCase() === corAtiva?.toLowerCase())?.url ||
    imagens.find(img => img.alt_text?.toLowerCase().includes(corAtiva?.toLowerCase()))?.url ||
    imagens[0]?.url ||
    '/placeholder.jpg'

  return (
    <div className="space-y-4">
      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
        <img
          src={imagemAtual}
          alt={`${produto.nome} - ${corAtiva}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Miniaturas */}
      {imagens.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imagens.map((img, index) => (
            <button
              key={index}
              onClick={() => setCorAtiva(img.cor || '')}
              className={`aspect-square rounded overflow-hidden bg-gray-100 border-2 transition-all ${
                img.cor?.toLowerCase() === corAtiva?.toLowerCase()
                  ? 'border-gray-900'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt_text || `${produto.nome} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}