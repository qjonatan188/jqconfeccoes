// components/BotaoWhatsApp.tsx
'use client'

import { useState, useMemo } from 'react'
import { useCarrinhoStore } from '@/lib/carrinhoStore'

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

  const imagemAtual = useMemo(() => {
    const imagens = produto.produto_imagens || []
    const imagemDaCor = imagens.find(
      img => img.cor?.toLowerCase().trim() === corSelecionada.toLowerCase().trim()
    )
    if (imagemDaCor) return imagemDaCor.url
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
      {/* Preview mobile */}
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
          <div className="flex flex-wrap gap-2">
            {produto.cores.map((cor) => {
              const selecionada = corSelecionada === cor
              return (
                <button
                  key={cor}
                  onClick={() => handleCorChange(cor)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                    selecionada
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {cor}
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
      </div>

      {/* Botões */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleAdicionarAoCarrinho}
          className={`w-full py-4 font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
            adicionado
              ? 'bg-green-500 text-white'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {adicionado ? '✓ Adicionado à Sacola!' : 'Adicionar à Sacola'}
        </button>

        <a
          href={`https://wa.me/${numeroWhatsApp}?text=${montarMensagemIndividual()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-600 text-white text-center py-4 font-semibold text-sm uppercase tracking-wider hover:bg-green-700 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          Comprar Agora
        </a>
      </div>
    </div>
  )
}