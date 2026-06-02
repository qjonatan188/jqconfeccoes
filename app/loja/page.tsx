// app/loja/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import BotoesCard from '@/components/BotoesCard'

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
    .select(`*, produto_imagens(url, alt_text, cor), categorias!inner(nome, slug)`)
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          {categoria 
            ? categoriasList.find((c: any) => c.slug === categoria)?.nome || 'Loja'
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
            !categoria ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos
        </Link>
        {categoriasList.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/loja?categoria=${cat.slug}`}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              categoria === cat.slug ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.nome}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {produtosList.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {produtosList.map((produto: any) => (
            <div key={produto.id} className="group">
              <Link href={`/loja/${produto.slug}`}>
                <div className="aspect-[3/4] overflow-hidden rounded bg-gray-100 relative">
                  <img
                    src={produto.produto_imagens?.[0]?.url || '/placeholder.jpg'}
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {produto.preco_promocional && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                      OFF
                    </span>
                  )}
                </div>
                <div className="mt-2 px-1">
                  <p className="text-xs text-gray-400 uppercase">{produto.categorias?.nome}</p>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{produto.nome}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    {produto.preco_promocional && produto.preco_promocional < produto.preco ? (
                      <>
                        <span className="text-sm font-bold text-red-600">R$ {produto.preco_promocional.toFixed(2)}</span>
                        <span className="text-xs text-gray-400 line-through">R$ {produto.preco.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-900">R$ {produto.preco.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
              <BotoesCard produto={produto} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}