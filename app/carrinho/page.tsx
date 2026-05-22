// app/carrinho/page.tsx
'use client'

import Link from 'next/link'
import { useCarrinhoStore } from '@/lib/carrinhoStore'

const numeroWhatsApp = '5511998654952' // 🔴 TROQUE PELO SEU NÚMERO

export default function PaginaCarrinho() {
  const itens = useCarrinhoStore((state) => state.itens)
  const removerItem = useCarrinhoStore((state) => state.removerItem)
  const atualizarQuantidade = useCarrinhoStore((state) => state.atualizarQuantidade)
  const limparCarrinho = useCarrinhoStore((state) => state.limparCarrinho)
  const totalPreco = useCarrinhoStore((state) => state.totalPreco)

  const montarMensagem = () => {
    let mensagem = `🛍️ *Meu Pedido - JQ Confecções*\n\n`

    itens.forEach((item, index) => {
      const preco = item.preco_promocional || item.preco
      const subtotal = preco * item.quantidade
      mensagem += `*${index + 1}. ${item.nome}*\n`
      mensagem += `   ▸ Tamanho: ${item.tamanho} | Cor: ${item.cor}\n`
      mensagem += `   ▸ Qtd: ${item.quantidade} × R$ ${preco.toFixed(2)} = R$ ${subtotal.toFixed(2)}\n\n`
    })

    mensagem += `━━━━━━━━━━━━━━━\n`
    mensagem += `*Total: R$ ${totalPreco().toFixed(2)}*\n\n`
    mensagem += `Gostaria de finalizar o pedido! ✨`

    return encodeURIComponent(mensagem)
  }

  if (itens.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="max-w-md mx-auto">
          <span className="text-6xl mb-6 block">🛒</span>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Sua sacola está vazia
          </h1>
          <p className="text-gray-500 mb-8">
            Que tal explorar nossa coleção e encontrar peças incríveis para você?
          </p>
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Ver Coleção
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
        Minha Sacola
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Lista de Itens */}
        <div className="lg:col-span-2 space-y-6">
          {itens.map((item) => {
            const preco = item.preco_promocional || item.preco
            const subtotal = preco * item.quantidade

            return (
              <div
                key={`${item.id}-${item.tamanho}-${item.cor}`}
                className="flex gap-6 bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
              >
                {/* Imagem */}
                <div className="w-24 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Detalhes */}
                <div className="flex-1">
                  <Link
                    href={`/loja/${item.slug}`}
                    className="text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors"
                  >
                    {item.nome}
                  </Link>
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      Tamanho: <span className="font-medium text-gray-700">{item.tamanho}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Cor: <span className="font-medium text-gray-700">{item.cor}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Quantidade */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          atualizarQuantidade(item.id, item.tamanho, item.cor, item.quantidade - 1)
                        }
                        className="w-8 h-8 border-2 border-gray-300 rounded-full text-sm hover:border-gray-900 transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() =>
                          atualizarQuantidade(item.id, item.tamanho, item.cor, item.quantidade + 1)
                        }
                        className="w-8 h-8 border-2 border-gray-300 rounded-full text-sm hover:border-gray-900 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Preço */}
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        R$ {subtotal.toFixed(2)}
                      </span>
                      {item.quantidade > 1 && (
                        <p className="text-xs text-gray-400">
                          {item.quantidade} × R$ {preco.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remover */}
                <button
                  onClick={() => removerItem(item.id, item.tamanho, item.cor)}
                  className="text-gray-400 hover:text-red-500 transition-colors self-start"
                  title="Remover item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}

          {/* Limpar Carrinho */}
          <button
            onClick={limparCarrinho}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors underline"
          >
            Limpar sacola
          </button>
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-8 sticky top-28">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 mb-6">
              {itens.map((item) => {
                const preco = item.preco_promocional || item.preco
                const subtotal = preco * item.quantidade
                return (
                  <div key={`resumo-${item.id}-${item.tamanho}-${item.cor}`} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate max-w-[180px]">
                      {item.nome} ({item.quantidade}x)
                    </span>
                    <span className="font-medium text-gray-700">
                      R$ {subtotal.toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  R$ {totalPreco().toFixed(2)}
                </span>
              </div>

              <a
                href={`https://wa.me/${numeroWhatsApp}?text=${montarMensagem()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white text-center py-4 rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Finalizar pelo WhatsApp
              </a>

              <Link
                href="/loja"
                className="block w-full text-center mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}