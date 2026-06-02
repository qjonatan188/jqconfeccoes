// components/ProdutoConteudo.tsx
'use client'

import { useState, useMemo } from 'react'
import { useCarrinhoStore } from '@/lib/carrinhoStore'

const numeroWhatsApp = '5511998654952'

export default function ProdutoConteudo({ produto }: { produto: any }) {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(produto.tamanhos?.[0] || '')
  const [corSelecionada, setCorSelecionada] = useState(produto.cores?.[0] || '')
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)

  const adicionarItem = useCarrinhoStore((state) => state.adicionarItem)
  const precoFinal = produto.preco_promocional || produto.preco
  const imagens = produto.produto_imagens || []

  // 🔥 CALCULAR IMAGEM PELA COR
  const imagemAtual = useMemo(() => {
    console.log('Cor selecionada:', corSelecionada)
    console.log('Imagens disponíveis:', imagens)
    
    if (!corSelecionada || imagens.length === 0) {
      return imagens[0]?.url || '/placeholder.jpg'
    }

    // Procurar imagem com a cor exata (case insensitive)
    const encontrada = imagens.find((img: any) => {
      const corImagem = (img.cor || '').toLowerCase().trim()
      const corSelecionadaLower = corSelecionada.toLowerCase().trim()
      console.log('Comparando:', corImagem, '===', corSelecionadaLower)
      return corImagem === corSelecionadaLower
    })

    if (encontrada) {
      console.log('Imagem encontrada:', encontrada.url)
      return encontrada.url
    }

    console.log('Nenhuma imagem encontrada, usando primeira')
    return imagens[0]?.url || '/placeholder.jpg'
  }, [corSelecionada, imagens])

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
    `🛍️ *Pedido - JQ Confecções*\n\n` +
    `*Produto:* ${produto.nome}\n` +
    `*Tamanho:* ${tamanhoSelecionado}\n` +
    `*Cor:* ${corSelecionada}\n` +
    `*Qtd:* ${quantidade}\n` +
    `*Total:* R$ ${(precoFinal * quantidade).toFixed(2)}\n\n` +
    `Gostaria de finalizar! ✨`
  )

  const temPromocao = produto.preco_promocional && produto.preco_promocional < produto.preco

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* IMAGEM PRINCIPAL - TROCA COM A COR */}
      <div className="space-y-4">
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
          <img 
            src={imagemAtual} 
            alt={`${produto.nome} - ${corSelecionada}`} 
            className="w-full h-full object-cover transition-all duration-300" 
          />
        </div>

        {/* Miniaturas para trocar de cor */}
        {imagens.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {imagens.map((img: any, index: number) => (
              <button
                key={index}
                onClick={() => {
                  console.log('Clicou na miniatura, cor:', img.cor)
                  setCorSelecionada(img.cor || '')
                }}
                className={`aspect-square rounded overflow-hidden bg-gray-100 border-2 transition-all ${
                  (img.cor || '').toLowerCase() === corSelecionada.toLowerCase()
                    ? 'border-gray-900'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={img.url} alt={img.alt_text || ''} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* INFO */}
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

        {/* CORES - CLICA AQUI MUDA A IMAGEM */}
        {produto.cores?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase mb-3">Cor: <span className="font-normal text-gray-500">{corSelecionada}</span></h3>
            <div className="flex flex-wrap gap-2">
              {produto.cores.map((cor: string) => (
                <button
                  key={cor}
                  onClick={() => {
                    console.log('Clicou na cor:', cor)
                    setCorSelecionada(cor)
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    corSelecionada === cor ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {cor}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAMANHOS */}
        {produto.tamanhos?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase mb-3">Tamanho: <span className="font-normal text-gray-500">{tamanhoSelecionado}</span></h3>
            <div className="flex flex-wrap gap-2">
              {produto.tamanhos.map((t: string) => (
                <button
                  key={t}
                  onClick={() => setTamanhoSelecionado(t)}
                  className={`w-12 h-12 border-2 rounded-full text-sm font-medium transition-all ${
                    tamanhoSelecionado === t ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {t}
                </button>
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
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-xl font-bold text-gray-900">R$ {(precoFinal * quantidade).toFixed(2)}</span>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="space-y-3">
          <button onClick={handleAdicionar}
            className={`w-full py-4 font-semibold text-sm uppercase tracking-wider transition-all ${
              adicionado ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}>
            {adicionado ? '✓ Adicionado!' : 'Adicionar à Sacola'}
          </button>

          <a href={`https://wa.me/${numeroWhatsApp}?text=${mensagem}`} target="_blank" rel="noopener noreferrer"
            className="block w-full bg-green-600 text-white text-center py-4 font-semibold text-sm uppercase tracking-wider hover:bg-green-700 transition-all">
            Comprar Agora
          </a>
        </div>
      </div>
    </div>
  )
}