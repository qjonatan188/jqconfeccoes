import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ProdutoInfo from '@/components/produto-info'

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

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900">Início</Link>
        <span className="mx-2">/</span>
        <Link href="/loja" className="hover:text-gray-900">Loja</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{produto.nome}</span>
      </nav>

      <ProdutoInfo produto={produto} />
    </main>
  )
}