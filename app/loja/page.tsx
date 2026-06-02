// app/loja/[slug]/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ImagemProduto from '@/components/ImagemProduto'
import BotaoWhatsApp from '@/components/BotaoWhatsApp'

async function getProduto(slug: string) {
  const { data, error } = await supabase
    .from('produtos')
    .select(`*, produto_imagens(url, alt_text, cor), categorias(nome, slug)`)
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const produto = await getProduto(slug)
  if (!produto) return { title: 'Produto não encontrado | JQ Confecções' }
  return { title: `${produto.nome} | JQ Confecções`, description: produto.descricao || '' }
}

export default async function PaginaProduto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const produto = await getProduto(slug)

  if (!produto) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
        <Link href="/loja" className="text-gray-600 hover:underline">← Voltar</Link>
      </main>
    )
  }

  const temPromocao = produto.preco_promocional && produto.preco_promocional < produto.preco

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900">Início</Link>
        <span className="mx-2">/</span>
        <Link href="/loja" className="hover:text-gray-900">Loja</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{produto.nome}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagem */}
        <ImagemProduto produto={produto} />

        {/* Info */}
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
          <BotaoWhatsApp produto={produto} />
          {produto.descricao && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold uppercase mb-3">Descrição</h3>
              <p className="text-gray-600">{produto.descricao}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}