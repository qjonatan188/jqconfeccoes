// app/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

async function getProdutosDestaque() {
  const { data } = await supabase
    .from('produtos')
    .select(`*, produto_imagens(url, alt_text), categorias(nome, slug)`)
    .eq('em_estoque', true)
    .order('created_at', { ascending: false })
    .limit(12)

  return data || []
}

async function getCategorias() {
  const { data } = await supabase
    .from('categorias')
    .select('*')
    .order('nome')
  
  return data || []
}

export const revalidate = 3600

export default async function Home() {
  const produtos = await getProdutosDestaque()
  const categorias = await getCategorias()

  return (
    <main className="bg-white">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-xs text-center py-2 px-4">
        <p>ATACADO E VAREJO • FRETE GRÁTIS ACIMA DE R$299 • PARCELE EM ATÉ 6X</p>
      </div>

      {/* Hero Minimalista */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="text-xs tracking-[0.3em] uppercase text-gray-500 font-medium">
              JQ Confecções
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-4 mb-4 leading-tight">
              Moda feminina<br />em atacado e varejo
            </h1>
            <p className="text-gray-500 text-lg max-w-xl">
              Peças de qualidade para revenda ou uso próprio. Estilo, conforto e os melhores preços.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                href="/loja"
                className="bg-gray-900 text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Ver Catálogo
              </Link>
              <a
                href="https://wa.me/5511998654952"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 text-sm font-medium uppercase tracking-wider hover:border-gray-900 transition-colors"
              >
                Fazer Pedido
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gray-200"></div>
          <h2 className="text-xs tracking-[0.3em] uppercase text-gray-500 font-medium whitespace-nowrap">
            Categorias
          </h2>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Link
            href="/loja"
            className="bg-gray-100 text-gray-700 text-sm font-medium py-4 px-6 rounded text-center hover:bg-gray-200 transition-colors uppercase tracking-wider"
          >
            Todos
          </Link>
          {categorias.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/loja?categoria=${cat.slug}`}
              className="bg-gray-100 text-gray-700 text-sm font-medium py-4 px-6 rounded text-center hover:bg-gray-200 transition-colors uppercase tracking-wider"
            >
              {cat.nome}
            </Link>
          ))}
        </div>
      </section>

      {/* Grade de Produtos */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gray-200"></div>
          <h2 className="text-xs tracking-[0.3em] uppercase text-gray-500 font-medium whitespace-nowrap">
            Produtos
          </h2>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Nenhum produto cadastrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {produtos.map((produto: any) => {
              const imagem = produto.produto_imagens?.[0]?.url || '/placeholder.jpg'
              const temPromocao = produto.preco_promocional && produto.preco_promocional < produto.preco

              return (
                <Link
                  key={produto.id}
                  href={`/loja/${produto.slug}`}
                  className="group block bg-white border border-gray-100 hover:border-gray-300 transition-all rounded"
                >
                  {/* Imagem */}
                  <div className="aspect-[3/4] overflow-hidden bg-gray-50">
                    <img
                      src={imagem}
                      alt={produto.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 md:p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      {produto.categorias?.nome || 'JQ Confecções'}
                    </p>
                    <h3 className="text-sm font-medium text-gray-900 mt-1 group-hover:text-gray-600 transition-colors line-clamp-2">
                      {produto.nome}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      {temPromocao ? (
                        <>
                          <span className="text-sm font-bold text-red-600">
                            R$ {produto.preco_promocional.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            R$ {produto.preco.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-gray-900">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Botão Ver Todos */}
        <div className="text-center mt-12">
          <Link
            href="/loja"
            className="inline-block bg-gray-900 text-white px-10 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Ver Catálogo Completo
          </Link>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-2xl font-bold">📦</p>
              <p className="text-xs uppercase tracking-wider mt-2 text-gray-400">Frete Grátis</p>
              <p className="text-sm mt-1">Acima de R$299</p>
            </div>
            <div>
              <p className="text-2xl font-bold">💳</p>
              <p className="text-xs uppercase tracking-wider mt-2 text-gray-400">Parcele</p>
              <p className="text-sm mt-1">Em até 6x</p>
            </div>
            <div>
              <p className="text-2xl font-bold">📱</p>
              <p className="text-xs uppercase tracking-wider mt-2 text-gray-400">WhatsApp</p>
              <p className="text-sm mt-1">(11) 99865-4952</p>
            </div>
            <div>
              <p className="text-2xl font-bold">🏭</p>
              <p className="text-xs uppercase tracking-wider mt-2 text-gray-400">Atacado</p>
              <p className="text-sm mt-1">Consulte valores</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}