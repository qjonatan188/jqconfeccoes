// app/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

async function getProdutos() {
  const { data } = await supabase
    .from('produtos')
    .select(`*, produto_imagens(url, alt_text), categorias(nome, slug)`)
    .eq('em_estoque', true)
    .order('created_at', { ascending: false })

  return data || []
}

export const revalidate = 3600

export default async function Home() {
  const produtos = await getProdutos()

  return (
    <main className="bg-white min-h-screen">
      {/* Grade de Produtos */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {produtos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Nenhum produto cadastrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {produtos.map((produto: any) => {
              const imagem = produto.produto_imagens?.[0]?.url || '/placeholder.jpg'
              const temPromocao = produto.preco_promocional && produto.preco_promocional < produto.preco

              return (
                <Link
                  key={produto.id}
                  href={`/loja/${produto.slug}`}
                  className="group block"
                >
                  {/* Imagem */}
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100 rounded">
                    <img
                      src={imagem}
                      alt={produto.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-2 px-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {produto.nome}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
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
      </div>
    </main>
  )
}