// app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'

interface Produto {
  id: number
  nome: string
  slug: string
  preco: number
  preco_promocional: number | null
  em_estoque: boolean
  destaque: boolean
  created_at: string
  produto_imagens: { url: string }[]
  categorias: { nome: string } | null
}

export default function Dashboard() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')

  const buscarProdutos = async () => {
    const { data, error } = await supabase
      .from('produtos')
      .select(`*, produto_imagens(url), categorias(nome)`)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProdutos(data as Produto[])
    }
    setCarregando(false)
  }

  useEffect(() => {
    buscarProdutos()
  }, [])

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    await supabase.from('produto_imagens').delete().eq('produto_id', id)
    const { error } = await supabase.from('produtos').delete().eq('id', id)

    if (error) {
      setMensagem('Erro ao excluir: ' + error.message)
    } else {
      setMensagem('Produto excluído com sucesso!')
      buscarProdutos()
      setTimeout(() => setMensagem(''), 3000)
    }
  }

  const handleToggleDestaque = async (id: number, destaque: boolean) => {
    await supabase.from('produtos').update({ destaque: !destaque }).eq('id', id)
    buscarProdutos()
  }

  const handleToggleEstoque = async (id: number, emEstoque: boolean) => {
    await supabase.from('produtos').update({ em_estoque: !emEstoque }).eq('id', id)
    buscarProdutos()
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_logado')
    document.cookie = 'admin_logado=; path=/; max-age=0'
    window.location.href = '/admin'
  }

  return (
    <AdminGuard>
      {carregando ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Carregando produtos...</p>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* Cabeçalho */}
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-xl font-serif font-bold text-gray-900">
                  modemoda
                </Link>
                <span className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full">Admin</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/novo"
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  + Novo Produto
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Mensagem */}
            {mensagem && (
              <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
                mensagem.includes('Erro') 
                  ? 'bg-red-50 text-red-600' 
                  : 'bg-green-50 text-green-600'
              }`}>
                {mensagem}
              </div>
            )}

            {/* Tabela de Produtos */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Produtos ({produtos.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Produto</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Categoria</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Preço</th>
                      <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Estoque</th>
                      <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Destaque</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {produtos.map((produto) => (
                      <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={produto.produto_imagens?.[0]?.url || '/placeholder.jpg'}
                                alt={produto.nome}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{produto.nome}</p>
                              <p className="text-xs text-gray-400">/{produto.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{produto.categorias?.nome || '—'}</span>
                        </td>
                        <td className="px-6 py-4">
                          {produto.preco_promocional ? (
                            <>
                              <span className="text-sm font-semibold text-red-500">R$ {produto.preco_promocional.toFixed(2)}</span>
                              <span className="text-xs text-gray-400 line-through ml-1">R$ {produto.preco.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-gray-900">R$ {produto.preco.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleEstoque(produto.id, produto.em_estoque)}
                            className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                              produto.em_estoque
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {produto.em_estoque ? 'Sim' : 'Não'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleDestaque(produto.id, produto.destaque)}
                            className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                              produto.destaque
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {produto.destaque ? '⭐' : '—'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/editar/${produto.id}`}
                              className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleExcluir(produto.id)}
                              className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}