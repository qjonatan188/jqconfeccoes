// app/loja/[slug]/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import BotaoWhatsApp from '@/components/BotaoWhatsApp'

interface Produto {
  id: number
  nome: string
  slug: string
  descricao: string
  preco: number
  preco_promocional: number | null
  tamanhos: string[]
  cores: string[]
  composicao: string | null
  instrucoes_lavagem: string | null
  em_estoque: boolean
  produto_imagens: {
    url: string
    alt_text: string
  }[]
  categorias: {
    nome: string
    slug: string
  } | null
}

async function getProduto(slug: string): Promise<Produto | null> {
  const { data, error } = await supabase
    .from('produtos')
    .select(`
      *,
      produto_imagens(url, alt_text),
      categorias(nome, slug)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as Produto
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const produto = await getProduto(slug)
  
  if (!produto) {
    return { title: 'Produto não encontrado | Modemoda' }
  }
  
  return {
    title: `${produto.nome} | Modemoda`,
    description: produto.descricao,
  }
}

export default async function PaginaProduto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const produto = await getProduto(slug)

  if (!produto) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Produto não encontrado</h1>
        <p className="text-gray-500 mb-8">Este produto pode ter sido removido ou o link está incorreto.</p>
        <Link href="/loja" className="text-pink-600 hover:underline">
          ← Voltar para a loja
        </Link>
      </main>
    )
  }

  const temPromocao = produto.preco_promocional && produto.preco_promocional < produto.preco
  const imagens = produto.produto_imagens || []

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-pink-600">Início</Link>
        <span className="mx-2">/</span>
        <Link href="/loja" className="hover:text-pink-600">Loja</Link>
        {produto.categorias && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/loja?categoria=${produto.categorias.slug}`} className="hover:text-pink-600">
              {produto.categorias.nome}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-900">{produto.nome}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Galeria de Imagens */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={imagens[0]?.url || '/placeholder.jpg'}
              alt={imagens[0]?.alt_text || produto.nome}
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          {imagens.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {imagens.map((img, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer border-2 border-transparent hover:border-pink-400 transition-colors">
                  <img
                    src={img.url}
                    alt={img.alt_text || `${produto.nome} - Imagem ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              {produto.nome}
            </h1>
            
            {/* Preço */}
            <div className="flex items-baseline gap-3">
              {temPromocao ? (
                <>
                  <span className="text-3xl font-bold text-red-500">
                    R$ {produto.preco_promocional!.toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {Math.round((1 - produto.preco_promocional! / produto.preco) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  R$ {produto.preco.toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mt-1">
              ou em até 6x de R$ {((produto.preco_promocional || produto.preco) / 6).toFixed(2)} sem juros
            </p>
          </div>

          {/* Botão WhatsApp (já inclui tamanho, cor e quantidade) */}
          <BotaoWhatsApp produto={produto} />

          {/* Descrição */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-3">
              Descrição
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {produto.descricao}
            </p>
          </div>

          {/* Composição e Cuidados */}
          {(produto.composicao || produto.instrucoes_lavagem) && (
            <div className="border-t pt-6 space-y-4">
              {produto.composicao && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-2">
                    Composição
                  </h3>
                  <p className="text-gray-600">{produto.composicao}</p>
                </div>
              )}
              {produto.instrucoes_lavagem && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-2">
                    Instruções de Lavagem
                  </h3>
                  <p className="text-gray-600">{produto.instrucoes_lavagem}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}