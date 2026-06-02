// components/ModalCompra.tsx
'use client'

import { useState, useMemo } from 'react'
import { useCarrinhoStore } from '@/lib/carrinhoStore'

const numeroWhatsApp = '5511998654952'

interface ModalCompraProps {
  aberto: boolean
  fechar: () => void
  produto: {
    id: number
    nome: string
    slug: string
    preco: number
    preco_promocional: number | null
    tamanhos: string[]
    cores: string[]
    produto_imagens: { url: string; alt_text: string; cor?: string | null }[]
  }
}

export default function ModalCompra({ aberto, fechar, produto }: ModalCompraProps) {
  const [tamanho, setTamanho] = useState(produto.tamanhos?.[0] || '')
  const [cor, setCor] = useState(produto.cores?.[0] || '')
  const [quantidade, setQuantidade] = useState(1)
  
  const adicionarItem = useCarrinhoStore((state) => state.adicionarItem)
  const preco = produto.preco_promocional || produto.preco

  // 🔥 Imagem muda conforme a cor selecionada
  const imagemAtual = useMemo(() => {
    const imagens = produto.produto_imagens || []
    
    // Procura imagem com a cor exata
    const imagemDaCor = imagens.find(
      img => img.cor?.toLowerCase().trim() === cor.toLowerCase().trim()
    )
    if (imagemDaCor) return imagemDaCor.url

    // Procura no alt_text
    const imagemPorAlt = imagens.find(
      img => img.alt_text?.toLowerCase().includes(cor.toLowerCase())
    )
    if (imagemPorAlt) return imagemPorAlt.url

    // Primeira imagem
    return imagens[0]?.url || '/placeholder.jpg'
  }, [cor, produto.produto_imagens])

  const total = preco * quantidade

  const handleAdicionar = () => {
    adicionarItem({
      id: produto.id,
      nome: produto.nome,
      slug: produto.slug,
      preco: produto.preco,
      preco_promocional: produto.preco_promocional,
      imagem: imagemAtual,
      tamanho,
      cor,
      quantidade,
    })
    fechar()
  }

  const mensagem = encodeURIComponent(
    `🛍️ *Pedido - JQ Confecções*\n\n` +
    `*Produto:* ${produto.nome}\n` +
    `*Tamanho:* ${tamanho}\n` +
    `*Cor:* ${cor}\n` +
    `*Qtd:* ${quantidade}\n` +
    `*Total:* R$ ${total.toFixed(2)}\n\n` +
    `Gostaria de finalizar! ✨`
  )

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fundo escuro */}
      <div className="absolute inset-0 bg-black/50" onClick={fechar} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Fechar */}
        <button onClick={fechar} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none z-10">
          ×
        </button>

        {/* Imagem - MUDA COM A COR */}
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
          <img 
            src={imagemAtual} 
            alt={`${produto.nome} - ${cor}`} 
            className="w-full h-full object-cover transition-all duration-300" 
          />
        </div>

        {/* Nome e Preço */}
        <h3 className="font-semibold text-gray-900">{produto.nome}</h3>
        <p className="text-lg font-bold text-gray-900 mt-1">R$ {preco.toFixed(2)}</p>

        {/* Tamanho */}
        {produto.tamanhos.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">TAMANHO</p>
            <div className="flex gap-2">
              {produto.tamanhos.map((t) => (
                <button
                  key={t}
                  onClick={() => setTamanho(t)}
                  className={`w-10 h-10 rounded-full text-sm font-medium border-2 transition-all ${
                    tamanho === t ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cor - MUDA A IMAGEM */}
        {produto.cores.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-2">COR: {cor}</p>
            <div className="flex flex-wrap gap-2">
              {produto.cores.map((c) => (
                <button
                  key={c}
                  onClick={() => setCor(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    cor === c ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantidade */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500">QUANTIDADE</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="w-8 h-8 border-2 border-gray-200 rounded-full text-sm">−</button>
            <span className="text-sm font-medium w-6 text-center">{quantidade}</span>
            <button onClick={() => setQuantidade(quantidade + 1)} className="w-8 h-8 border-2 border-gray-200 rounded-full text-sm">+</button>
          </div>
        </div>

        {/* Total */}
        {quantidade > 1 && (
          <p className="text-xs text-gray-400 mt-2">{quantidade} × R$ {preco.toFixed(2)} = R$ {total.toFixed(2)}</p>
        )}

        {/* Botões */}
        <div className="mt-5 space-y-2">
          <button onClick={handleAdicionar} className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            Adicionar à Sacola
          </button>
          <a
            href={`https://wa.me/${numeroWhatsApp}?text=${mensagem}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Comprar Agora
          </a>
        </div>
      </div>
    </div>
  )
}