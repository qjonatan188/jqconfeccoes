// components/BotaoWhatsApp.tsx
'use client'

import { useState, useMemo } from 'react'
import { useCarrinhoStore } from '@/lib/carrinhoStore'

// Mapeamento de cores para hexadecimal
const mapaCores: Record<string, string> = {
  'preto': '#1a1a1a',
  'branco': '#f5f5f5',
  'vermelho': '#dc2626',
  'azul': '#2563eb',
  'azul céu': '#7dd3fc',
  'rosa': '#ec4899',
  'verde': '#16a34a',
  'verde musgo': '#4d7c0f',
  'amarelo': '#eab308',
  'laranja': '#ea580c',
  'roxo': '#7c3aed',
  'vinho': '#7f1d1d',
  'marrom': '#78350f',
  'cinza': '#6b7280',
  'bege': '#d6c8a5',
  'cru': '#f5f0e8',
  'champanhe': '#f7e7ce',
  'caramelo': '#c68e58',
  'lavanda': '#c4b5fd',
  'salmão': '#fca5a5',
  'marinho': '#1e3a5f',
  'floral': '#f472b6',
  'estampada': '#c084fc',
}

function getCorHex(cor: string): string {
  const corLower = cor.toLowerCase().trim()
  return mapaCores[corLower] || '#d1d5db'
}

function isCorClara(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminosidade = (r * 299 + g * 587 + b * 114) / 1000
  return luminosidade > 150
}

interface ProdutoImagem {
  url: string
  alt_text: string
  cor?: string | null
}

interface BotaoWhatsAppProps {
  produto: {
    id: number
    nome: string
    slug: string
    preco: number
    preco_promocional: number | null
    tamanhos: string[]
    cores: string[]
    produto_imagens: ProdutoImagem[]
  }
  onCorChange?: (cor: string) => void
}

export default function BotaoWhatsApp({ produto, onCorChange }: BotaoWhatsAppProps) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(
    produto.tamanhos?.[0] || ''
  )
  const [corSelecionada, setCorSelecionada] = useState(
    produto.cores?.[0] || ''
  )
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)

  const adicionarItem = useCarrinhoStore((state) => state.adicionarItem)

  const precoFinal = produto.preco_promocional || produto.preco
  const numeroWhatsApp = '5511998654952'

  const handleCorChange = (cor: string) => {
    setCorSelecionada(cor)
    if (onCorChange) onCorChange(cor)
  }

  // Encontrar imagem da cor selecionada
  const imagemAtual = useMemo(() => {
    const imagens = produto.produto_imagens || []
    
    const imagemDaCor = imagens.find(
      img => img.cor?.toLowerCase().trim() === corSelecionada.toLowerCase().trim()
    )
    if (imagemDaCor) return imagemDaCor.url

    const imagemPorAlt = imagens.find(
      img => img.alt_text?.toLowerCase().includes(corSelecionada.toLowerCase())
    )
    if (imagemPorAlt) return imagemPorAlt.url

    return imagens[0]?.url || '/placeholder.jpg'
  }, [corSelecionada, produto.produto_imagens])

  const handleAdicionarAoCarrinho = () => {
    if (!tamanhoSelecionado || !corSelecionada) {
      alert('Por favor, selecione um tamanho e uma cor.')
      return
    }

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

  const montarMensagemIndividual = () => {
    let mensagem = `🛍️ *Novo Pedido - JQ Confecções*\n\n`
    mensagem += `*Produto:* ${produto.nome}\n`
    mensagem += `*Preço unitário:* R$ ${precoFinal.toFixed(2)}\n`
    mensagem += `*Quantidade:* ${quantidade}\n`
    if (tamanhoSelecionado) mensagem += `*Tamanho:* ${tamanhoSelecionado}\n`
    if (corSelecionada) mensagem += `*Cor:* ${corSelecionada}\n`
    const total = precoFinal * quantidade
    mensagem += `\n*Total:* R$ ${total.toFixed(2)}\n\n`
    mensagem += `Gostaria de finalizar o pedido! ✨`
    return encodeURIComponent(mensagem)
  }

  return (
    <div className="space-y-5">
      {/* Preview da cor selecionada (mobile) */}
      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 md:hidden">
        <img
          src={imagemAtual}
          alt={`${produto.nome} - ${corSelecionada}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Cores */}
      {produto.cores && produto.cores.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-3">
            Cor: <span className="font-normal text-gray-500">{corSelecionada}</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {produto.cores.map((cor) => {
              const hex = getCorHex(cor)
              const clara = isCorClara(hex)
              const selecionada = corSelecionada === cor

              const temImagem = produto.produto_imagens?.some(
                img => img.cor?.toLowerCase().trim() === cor.toLowerCase().trim() ||
                       img.alt_text?.toLowerCase().includes(cor.toLowerCase())
              )

              return (
                <button
                  key={cor}
                  onClick={() => handleCorChange(cor)}
                  className="relative group"
                  title={`${cor}${temImagem ? ' - tem foto' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full transition-all duration-200 ${
                      selecionada
                        ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                        : 'ring-1 ring-gray-200 hover:scale-110'
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {selecionada && (
                      <svg
                        className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                          clara ? 'text-gray-800' : 'text-white'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {temImagem && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tamanhos */}
      {produto.tamanhos && produto.tamanhos.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-3">
            Tamanho: <span className="font-normal text-gray-500">{tamanhoSelecionado}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {produto.tamanhos.map((tamanho) => (
              <button
                key={tamanho}
                onClick={() => setTamanhoSelecionado(tamanho)}
                className={`w-12 h-12 border-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  tamanhoSelecionado === tamanho
                    ? 'border-gray-900 bg-gray-900 text-white shadow-md scale-105'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:scale-105'
                }`}
              >
                {tamanho}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantidade */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-3">
          Quantidade
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
            className="w-10 h-10 border-2 border-gray-200 rounded-full text-lg font-medium hover:border-gray-900 transition-all flex items-center justify-center hover:scale-105"
          >
            −
          </button>
          <span className="text-lg font-medium min-w-[2rem] text-center">{quantidade}</span>
          <button
            onClick={() => setQuantidade(quantidade + 1)}
            className="w-10 h-10 border-2 border-gray-200 rounded-full text-lg font-medium hover:border-gray-900 transition-all flex items-center justify-center hover:scale-105"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="bg-gray-50 rounded p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Subtotal</span>
          <span className="text-xl font-bold text-gray-900">
            R$ {(precoFinal * quantidade).toFixed(2)}
          </span>
        </div>
        {quantidade > 1 && (
          <p className="text-xs text-gray-400 mt-1">
            {quantidade} × R$ {precoFinal.toFixed(2)}
          </p>
        )}
     