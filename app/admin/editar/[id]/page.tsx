// app/admin/editar/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'

interface Categoria {
  id: number
  nome: string
  slug: string
}

const paletaCores = [
  { nome: 'Preto', hex: '#1a1a1a' },
  { nome: 'Branco', hex: '#f5f5f5' },
  { nome: 'Vermelho', hex: '#dc2626' },
  { nome: 'Rosa', hex: '#ec4899' },
  { nome: 'Azul', hex: '#2563eb' },
  { nome: 'Azul Céu', hex: '#7dd3fc' },
  { nome: 'Verde', hex: '#16a34a' },
  { nome: 'Verde Musgo', hex: '#4d7c0f' },
  { nome: 'Amarelo', hex: '#eab308' },
  { nome: 'Laranja', hex: '#ea580c' },
  { nome: 'Roxo', hex: '#7c3aed' },
  { nome: 'Lavanda', hex: '#c4b5fd' },
  { nome: 'Vinho', hex: '#7f1d1d' },
  { nome: 'Marrom', hex: '#78350f' },
  { nome: 'Caramelo', hex: '#c68e58' },
  { nome: 'Bege', hex: '#d6c8a5' },
  { nome: 'Cru', hex: '#f5f0e8' },
  { nome: 'Champanhe', hex: '#f7e7ce' },
  { nome: 'Salmão', hex: '#fca5a5' },
  { nome: 'Marinho', hex: '#1e3a5f' },
  { nome: 'Cinza', hex: '#6b7280' },
  { nome: 'Floral', hex: '#f472b6' },
  { nome: 'Estampada', hex: '#c084fc' },
  { nome: 'Dourado', hex: '#d4a853' },
  { nome: 'Prata', hex: '#c0c0c0' },
]

export default function EditarProduto() {
  const params = useParams()
  const id = params.id as string

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const [coresSelecionadas, setCoresSelecionadas] = useState<string[]>([])
  const [corPersonalizada, setCorPersonalizada] = useState('#ec4899')
  const [nomeCorPersonalizada, setNomeCorPersonalizada] = useState('')

  const [form, setForm] = useState({
    nome: '',
    slug: '',
    descricao: '',
    preco: '',
    preco_promocional: '',
    categoria_id: '',
    tamanhos: '',
    composicao: '',
    instrucoes_lavagem: '',
    em_estoque: true,
    destaque: false,
    imagem_url: '',
  })

  useEffect(() => {
    buscarCategorias()
    carregarProduto()
  }, [])

  const buscarCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nome')
    if (data) setCategorias(data)
  }

  const carregarProduto = async () => {
    const { data: produto } = await supabase
      .from('produtos')
      .select('*, produto_imagens(url)')
      .eq('id', id)
      .single()

    if (produto) {
      setForm({
        nome: produto.nome || '',
        slug: produto.slug || '',
        descricao: produto.descricao || '',
        preco: produto.preco?.toString() || '',
        preco_promocional: produto.preco_promocional?.toString() || '',
        categoria_id: produto.categoria_id?.toString() || '',
        tamanhos: produto.tamanhos?.join(', ') || '',
        composicao: produto.composicao || '',
        instrucoes_lavagem: produto.instrucoes_lavagem || '',
        em_estoque: produto.em_estoque ?? true,
        destaque: produto.destaque ?? false,
        imagem_url: produto.produto_imagens?.[0]?.url || '',
      })
      setCoresSelecionadas(produto.cores || [])
    }
    setCarregando(false)
  }

  const toggleCor = (nomeCor: string) => {
    setCoresSelecionadas((prev) =>
      prev.includes(nomeCor)
        ? prev.filter((c) => c !== nomeCor)
        : [...prev, nomeCor]
    )
  }

  const adicionarCorPersonalizada = () => {
    if (nomeCorPersonalizada.trim() && !coresSelecionadas.includes(nomeCorPersonalizada.trim())) {
      setCoresSelecionadas([...coresSelecionadas, nomeCorPersonalizada.trim()])
      setNomeCorPersonalizada('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setMensagem('')

    const { error } = await supabase
      .from('produtos')
      .update({
        nome: form.nome,
        slug: form.slug,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        preco_promocional: form.preco_promocional ? parseFloat(form.preco_promocional) : null,
        categoria_id: parseInt(form.categoria_id) || null,
        tamanhos: form.tamanhos ? form.tamanhos.split(',').map(s => s.trim()) : [],
        cores: coresSelecionadas,
        composicao: form.composicao || null,
        instrucoes_lavagem: form.instrucoes_lavagem || null,
        em_estoque: form.em_estoque,
        destaque: form.destaque,
      })
      .eq('id', id)

    if (error) {
      setMensagem('Erro: ' + error.message)
      setSalvando(false)
      return
    }

    if (form.imagem_url) {
      await supabase.from('produto_imagens').delete().eq('produto_id', id)
      await supabase.from('produto_imagens').insert({
        produto_id: parseInt(id),
        url: form.imagem_url,
        alt_text: form.nome,
        ordem: 1,
      })
    }

    setMensagem('Produto atualizado com sucesso!')
    setSalvando(false)
    setTimeout(() => setMensagem(''), 3000)
  }

  if (carregando) {
    return (
      <AdminGuard>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Carregando produto...</p>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900">← Voltar</Link>
              <h1 className="text-lg font-semibold text-gray-900">Editar Produto</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {mensagem && (
            <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${mensagem.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {mensagem}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm">
                  <option value="">Selecione...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço *</label>
                <input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço Promocional</label>
                <input type="number" step="0.01" value={form.preco_promocional} onChange={(e) => setForm({ ...form, preco_promocional: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamanhos (separados por vírgula)</label>
                <input type="text" value={form.tamanhos} onChange={(e) => setForm({ ...form, tamanhos: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem</label>
                <input type="url" value={form.imagem_url} onChange={(e) => setForm({ ...form, imagem_url: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" />
                {form.imagem_url && (
                  <div className="mt-3 w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
                    <img src={form.imagem_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* 🎨 SELETOR DE CORES */}
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">🎨 Cores do Produto</label>

              {coresSelecionadas.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {coresSelecionadas.map((cor) => {
                    const corEncontrada = paletaCores.find(c => c.nome === cor)
                    const hex = corEncontrada?.hex || '#d1d5db'
                    return (
                      <span key={cor} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                        <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: hex }} />
                        {cor}
                        <button type="button" onClick={() => toggleCor(cor)} className="text-gray-400 hover:text-red-500 ml-1">×</button>
                      </span>
                    )
                  })}
                </div>
              )}

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 mb-6">
                {paletaCores.map((cor) => (
                  <button
                    key={cor.nome}
                    type="button"
                    onClick={() => toggleCor(cor.nome)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      coresSelecionadas.includes(cor.nome) ? 'bg-gray-100 ring-2 ring-gray-900 scale-105' : 'hover:bg-gray-50 hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 transition-all ${coresSelecionadas.includes(cor.nome) ? 'border-gray-900 shadow-md' : 'border-gray-200'}`}
                      style={{ backgroundColor: cor.hex }}
                    >
                      {coresSelecionadas.includes(cor.nome) && (
                        <svg className="w-5 h-5 mx-auto mt-2.5 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 text-center leading-tight">{cor.nome}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-end gap-3 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Cor personalizada</label>
                  <input type="color" value={corPersonalizada} onChange={(e) => setCorPersonalizada(e.target.value)} className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-2">Nome da cor</label>
                  <input type="text" value={nomeCorPersonalizada} onChange={(e) => setNomeCorPersonalizada(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarCorPersonalizada())} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" placeholder="Ex: Turquesa" />
                </div>
                <button type="button" onClick={adicionarCorPersonalizada} disabled={!nomeCorPersonalizada.trim()} className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                  Adicionar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm resize-none" />
            </div>

            <div className="flex gap-8 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.em_estoque} onChange={(e) => setForm({ ...form, em_estoque: e.target.checked })} className="w-5 h-5 rounded" />
                <span className="text-sm text-gray-700">Em estoque</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.destaque} onChange={(e) => setForm({ ...form, destaque: e.target.checked })} className="w-5 h-5 rounded" />
                <span className="text-sm text-gray-700">Destaque na Home</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={salvando} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
                {salvando ? 'Salvando...' : 'Atualizar Produto'}
              </button>
              <Link href="/admin/dashboard" className="px-8 py-3 rounded-xl font-medium text-sm border-2 border-gray-200 text-gray-600 hover:border-gray-400 transition-colors">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AdminGuard>
  )
}