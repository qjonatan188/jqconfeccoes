// app/admin/novo/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'

interface Categoria {
  id: number
  nome: string
  slug: string
}

interface CorImagem {
  cor: string
  hex: string
  url: string
}

export default function NovoProduto() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [coresImagens, setCoresImagens] = useState<CorImagem[]>([])
  const [tamanhos, setTamanhos] = useState('')

  const [form, setForm] = useState({
    nome: '',
    slug: '',
    descricao: '',
    preco: '',
    preco_promocional: '',
    categoria_id: '',
    composicao: '',
    instrucoes_lavagem: '',
    em_estoque: true,
    destaque: false,
  })

  useEffect(() => {
    buscarCategorias()
  }, [])

  const buscarCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*').order('nome')
    if (data) setCategorias(data)
  }

  const gerarSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value
    setForm({ ...form, nome, slug: gerarSlug(nome) })
  }

  const adicionarCor = () => {
    setCoresImagens([...coresImagens, { cor: '', hex: '#1a1a1a', url: '' }])
  }

  const removerCor = (index: number) => {
    setCoresImagens(coresImagens.filter((_, i) => i !== index))
  }

  const atualizarCor = (index: number, campo: 'cor' | 'hex' | 'url', valor: string) => {
    const novas = [...coresImagens]
    novas[index][campo] = valor
    setCoresImagens(novas)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setMensagem('')

    // 🔥 Pegar nomes das cores
    const coresNomes = coresImagens
      .filter(c => c.cor.trim() !== '')
      .map(c => c.cor.trim())

    // Inserir produto
    const { data: produto, error } = await supabase
      .from('produtos')
      .insert({
        nome: form.nome,
        slug: form.slug,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        preco_promocional: form.preco_promocional ? parseFloat(form.preco_promocional) : null,
        categoria_id: parseInt(form.categoria_id) || null,
        tamanhos: tamanhos ? tamanhos.split(',').map(s => s.trim()) : [],
        cores: coresNomes,
        composicao: form.composicao || null,
        instrucoes_lavagem: form.instrucoes_lavagem || null,
        em_estoque: form.em_estoque,
        destaque: form.destaque,
      })
      .select()
      .single()

    if (error) {
      setMensagem('Erro: ' + error.message)
      setSalvando(false)
      return
    }

    // 🔥 Inserir imagens COM O CAMPO COR PREENCHIDO
    if (produto) {
      const imagensParaInserir = coresImagens
        .filter(c => c.url.trim() !== '' && c.cor.trim() !== '')
        .map((c, index) => ({
          produto_id: produto.id,
          url: c.url.trim(),
          alt_text: `${form.nome} ${c.cor.trim()}`,
          cor: c.cor.trim(), // 🔥 AQUI: preenche o campo cor
          ordem: index + 1,
        }))

      console.log('Inserindo imagens:', imagensParaInserir) // Debug

      if (imagensParaInserir.length > 0) {
        const { error: imgError } = await supabase.from('produto_imagens').insert(imagensParaInserir)
        if (imgError) {
          console.error('Erro ao inserir imagens:', imgError)
        }
      }
    }

    setMensagem('Produto criado com sucesso!')
    setSalvando(false)
    setCoresImagens([])
    setTamanhos('')
    setForm({
      nome: '',
      slug: '',
      descricao: '',
      preco: '',
      preco_promocional: '',
      categoria_id: '',
      composicao: '',
      instrucoes_lavagem: '',
      em_estoque: true,
      destaque: false,
    })

    setTimeout(() => setMensagem(''), 3000)
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900">← Voltar</Link>
            <h1 className="text-lg font-semibold text-gray-900">Novo Produto</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {mensagem && (
            <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${mensagem.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {mensagem}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            {/* Nome e Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <input type="text" value={form.nome} onChange={handleNomeChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" placeholder="Calça Pantalona" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm bg-gray-50" />
              </div>
            </div>

            {/* Preço e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço *</label>
                <input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" placeholder="89.90" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço Promocional</label>
                <input type="number" step="0.01" value={form.preco_promocional} onChange={(e) => setForm({ ...form, preco_promocional: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" placeholder="69.90" />
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
            </div>

            {/* Tamanhos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tamanhos (separados por vírgula)</label>
              <input type="text" value={tamanhos} onChange={(e) => setTamanhos(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" placeholder="P, M, G, GG" />
            </div>

            {/* 🎨 CORES + IMAGENS */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">🎨 Cores do Produto</label>
                <button type="button" onClick={adicionarCor} className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1 rounded-lg">
                  + Adicionar Cor
                </button>
              </div>

              {coresImagens.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Nenhuma cor adicionada. Clique em "+ Adicionar Cor".</p>
              )}

              <div className="space-y-4">
                {coresImagens.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl">
                    {/* Color Picker */}
                    <div className="flex-shrink-0">
                      <input
                        type="color"
                        value={item.hex}
                        onChange={(e) => atualizarCor(index, 'hex', e.target.value)}
                        className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer"
                        title="Escolher cor"
                      />
                    </div>

                    {/* Nome da Cor */}
                    <div className="w-36">
                      <input
                        type="text"
                        value={item.cor}
                        onChange={(e) => atualizarCor(index, 'cor', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-900 outline-none text-sm"
                        placeholder="Ex: Preto"
                      />
                    </div>

                    {/* URL da Imagem */}
                    <div className="flex-1">
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => atualizarCor(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-gray-900 outline-none text-sm"
                        placeholder="URL da imagem"
                      />
                    </div>

                    {/* Remover */}
                    <button type="button" onClick={() => removerCor(index)} className="text-gray-400 hover:text-red-500 text-xl">×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm resize-none" placeholder="Descreva o produto..." />
            </div>

            {/* Switches */}
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

            {/* Salvar */}
            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={salvando} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
                {salvando ? 'Salvando...' : 'Salvar Produto'}
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