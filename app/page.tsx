// app/loja/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 3600

export default async function PaginaLoja({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams

  // Buscar categorias
  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .order('nome')

  // Buscar produtos com filtro
  let query = supabase
    .from('produtos')
    .select(`*, produto_imagens(url, alt_text), categorias!inner(nome, slug)`)
    .eq('em_estoque', true)
    .order('created_at', { ascending: false })

  if (categoria) {
    query = query.eq('categorias.slug', categoria)
  }

  const { data: produtos, error } = await query

  if (error) {
    console.error('Erro:', error.message)
  }

  const produtosList = produtos || []
  const categoriasList = categorias || []

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900">
          {categoria 
            ? categoriasList.find(c => c.slug === categoria)?.nome || 'Loja'
            : 'Nossa Coleção'
          }
        </h1>
        <p className="text-gray-500 mt-2">
          {produtosList.length} {produtosList.length === 1 ? 'produto' : 'produtos'}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Link
          href="/loja"
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            !categoria
              ? 'bg-gray-900 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos
        </Link>
        {categoriasList.map((cat) => (
          <Link
            key={cat.id}
            href={`/loja?categoria=${cat.slug}`}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              categoria === cat.slug
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.nome}
          </Link>
        ))}
      </div>

      {/* Grid de Produtos */}
      {produtosList.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">📦</span>
          <p className="text-gray-400 text-lg mb-4">Nenhum produto encontrado nesta categoria.</p>
          <Link href="/loja" className="text-pink-600 hover:underline font-medium">
            ← Ver todos os produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {produtosList.map((produto: any) => {
            const imagemPrincipal = produto.produto_imagens?.[0]?.url || '/placeholder.jpg'
            const temPromocao = produto.preco_promocional && produto.preco_promocional < produto.preco

            return (
              <Link 
                key={produto.id} 
                href={`/loja/${produto.slug}`}
                className="group block"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 relative mb-4">
                  <img
                    src={imagemPrincipal}
                    alt={produto.produto_imagens?.[0]?.alt_text || produto.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {temPromocao && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      -{Math.round((1 - produto.preco_promocional / produto.preco) * 100)}%
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {produto.categorias?.nome}
                </p>
                <h3 className="text-base font-medium text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
                  {produto.nome}
                </h3>
                <div className="flex items-center gap-3">
                  {temPromocao ? (
                    <>
                      <span className="text-lg font-bold text-red-500">
                        R$ {produto.preco_promocional.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}