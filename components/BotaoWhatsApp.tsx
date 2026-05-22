// components/BotaoWhatsApp.tsx
'use client'

import { useState } from 'react'
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

interface BotaoWhatsAppProps {
  produto: {
    id: number
    nome: string
    slug: string
    preco: number
    preco_promocional: number | null
    tamanhos: string[]
    cores: string[]
    produto_imagens: { url: string; alt_text: string }[]
  }
}

export default function BotaoWhatsApp({ produto }: BotaoWhatsAppProps) {
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
  const numeroWhatsApp = '5511998654952' // 🔴 TROQUE PELO SEU NÚMERO

  const handleAdicionarAoCarrinho = () => {
    if (!tamanhoSelecionado || !corSelecionada) {
      alert('Por favor, selecione um tamanho e uma cor.')
      return
    }

    const imagem = produto.produto_imagens?.[0]?.url || ''

    adicionarItem({
      id: produto.id,
      nome: produto.nome,
      slug: produto.slug,
      preco: produto.preco,
      preco_promocional: produto.preco_promocional,
      imagem,
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
          <a href="#" className="text-xs text-pink-600 underline mt-2 inline-block">
            Guia de Tamanhos
          </a>
        </div>
      )}

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

              return (
                <button
                  key={cor}
                  onClick={() => setCorSelecionada(cor)}
                  className="relative group"
                  title={cor}
                >
                  <div
                    className={`w-9 h-9 rounded-full transition-all duration-200 ${
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
                </button>
              )
            })}
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
      <div className="bg-gray-50 rounded-2xl p-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Subtotal</span>
          <span className="text-2xl font-bold text-gray-900">
            R$ {(precoFinal * quantidade).toFixed(2)}
          </span>
        </div>
        {quantidade > 1 && (
          <p className="text-xs text-gray-400 mt-1">
            {quantidade} × R$ {precoFinal.toFixed(2)}
          </p>
        )}
      </div>

      {/* Botões */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleAdicionarAoCarrinho}
          className={`w-full py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
            adicionado
              ? 'bg-green-500 text-white scale-[1.02]'
              : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
          }`}
        >
          {adicionado ? '✓ Adicionado à Sacola!' : 'Adicionar à Sacola'}
        </button>

        <a
          href={`https://wa.me/${numeroWhatsApp}?text=${montarMensagemIndividual()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-600 text-white text-center py-4 rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-green-700 transition-all hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Comprar Agora
        </a>
      </div>
    </div>
  )
}