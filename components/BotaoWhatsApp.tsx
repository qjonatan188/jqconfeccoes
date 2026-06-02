// components/BotaoWhatsApp.tsx
'use client'

import { useState } from 'react'
import { useCarrinhoStore } from '@/lib/carrinhoStore'

const numeroWhatsApp = '5511998654952'

interface BotaoWhatsAppProps {
  produto: any
}

export default function BotaoWhatsApp({ produto }: BotaoWhatsAppProps) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(produto?.tamanhos?.[0] || '')
  const [corSelecionada, setCorSelecionada] = useState(produto?.cores?.[0] || '')
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)
  const [imagemAtual, setImagemAtual] = useState(produto?.produto_imagens?.[0]?.url || '/placeholder.jpg')

  const adicionarItem = useCarrinhoStore((state) => state.adicionarItem)
  const precoFinal = produto?.preco_promocional || produto?.preco || 0
  const imagens = produto?.produto_imagens || []

  const handleCorChange = (cor: string) => {
    setCorSelecionada(cor)
    
    // 🔥 TROCAR IMAGEM
    const imgEncontrada = imagens.find(
      (img: any) => img.cor?.toLowerCase().trim() === cor.toLowerCase().trim()
    )
    if (imgEncontrada) {
      setImagemAtual(imgEncontrada.url)
    }
  }

  const handleAdicionar = () => {
    adicionarItem({
      id: produto.id,
      nome: produto.nome,
      slug: produto.slug,
      preco: produto.preco,
      preco_promocional: produto.preco_promocional,
      imagem: imagemAtual,
      tamanho: tamanhoSelecionado,
      cor: corSelecionada,
      quantidade,
    })
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 2000)
  }

  const mensagem = encodeURIComponent(
    `🛍️ *Pedido - JQ Confecções*\n\n*Produto:* ${produto.nome}\n*Tamanho:* ${tamanhoSelecionado}\n*Cor:* ${corSelecionada}\n*Qtd:* ${quantidade}\n*Total:* R$ ${(precoFinal * quantidade).toFixed(2)}\n\nGostaria de finalizar! ✨`
  )

  return (
    <div className="space-y-5">
      {/* IMAGEM QUE TROCA */}
      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
        <img src={imagemAtual} alt={`${produto.nome} - ${corSelecionada}`} className="w-full h-full object-cover" />
      </div>

      {/* CORES */}
      {produto.cores?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase mb-3">Cor: {corSelecionada}</h3>
          <div className="flex flex-wrap gap-2">
            {produto.cores.map((cor: string) => (
              <button key={cor} onClick={() => handleCorChange(cor)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${corSelecionada === cor ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600'}`}>{cor}</button>
            ))}
          </div>
        </div>
      )}

      {/* TAMANHOS */}
      {produto.tamanhos?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase mb-3">Tamanho: {tamanhoSelecionado}</h3>
          <div className="flex flex-wrap gap-2">
            {produto.tamanhos.map((t: string) => (
              <button key={t} onClick={() => setTamanhoSelecionado(t)}
                className={`w-12 h-12 border-2 rounded-full text-sm font-medium ${tamanhoSelecionado === t ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600'}`}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {/* QUANTIDADE */}
      <div>
        <h3 className="text-sm font-semibold uppercase mb-3">Quantidade</h3>
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="w-10 h-10 border-2 border-gray-200 rounded-full text-lg">−</button>
          <span className="text-lg font-medium w-8 text-center">{quantidade}</span>
          <button onClick={() => setQuantidade(quantidade + 1)} className="w-10 h-10 border-2 border-gray-200 rounded-full text-lg">+</button>
        </div>
      </div>

      {/* SUBTOTAL */}
      <div className="bg-gray-50 rounded p-4">
        <span className="text-sm text-gray-500">Subtotal</span>
        <span className="text-xl font-bold text-gray-900 ml-4">R$ {(precoFinal * quantidade).toFixed(2)}</span>
      </div>

      {/* BOTÕES */}
      <div className="space-y-3">
        <button onClick={handleAdicionar}
          className={`w-full py-4 font-semibold text-sm uppercase ${adicionado ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
          {adicionado ? '✓ Adicionado!' : 'Adicionar à Sacola'}
        </button>
        <a href={`https://wa.me/${numeroWhatsApp}?text=${mensagem}`} target="_blank" rel="noopener noreferrer"
          className="block w-full bg-green-600 text-white text-center py-4 font-semibold text-sm uppercase hover:bg-green-700">
          Comprar Agora
        </a>
      </div>
    </div>
  )
}