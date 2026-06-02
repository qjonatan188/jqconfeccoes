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

interface ImagemCor {
  url: string
  cor: string
}

export default function NovoProduto() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [coresSelecionadas, setCoresSelecionadas] = useState<string[]>([])
  const [novaCor, setNovaCor] = useState('')
  const [imagens, setImagens] = useState<ImagemCor[]>([{ url: '', cor: '' }])

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

  // Cores
  const adicionarCor = () => {
    const cor = novaCor.trim()
    if (cor && !coresSelecionadas.includes(cor)) {
      setCoresSelecionadas([...coresSelecionadas, cor])
      setNovaCor('')
    }
  }

  const removerCor = (cor: string) => {
    setCoresSelecionadas(coresSelecionadas.filter(c => c !== cor))
  }

  // Imagens
  const atualizarImagem = (index: number, campo: 'url' | 'cor', valor: string) => {
    const novasImagens = [...imagens]
    novasImagens[index][campo] = valor
    setImagens(novasImagens)
  }

  const adicionarImagem = () => {
    setImagens([...imagens, { url: '', cor: '' }])
  }

  const removerImagem = (index: number) => {
    if (imagens.length > 1) {
      setImagens(imagens.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setMensagem('')

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
        tamanhos: form.tamanhos ? form.tamanhos.split(',').map(s => s.trim()) : [],
        cores: coresSelecionadas,
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

    // Inserir imagens com cor
    if (produto) {
      const imagensParaInserir = imagens
        .filter(img => img.url.trim())
        .map((img, index) => ({
          produto_id: produto.id,
          url: img.url.trim(),
          alt_text: `${form.nome} ${img.cor.trim() || ''}`.trim(),
          cor: img.cor.trim() || null,
          ordem: index + 1,
        }))

      if (imagensParaInserir.length > 0) {
        await supabase.from('produto_imagens').insert(imagensParaInserir)
      }
    }

    setMensagem('Produto criado com sucesso!')
    setSalvando(false)
    setCoresSelecionadas([])
    setImagens([{ url: '', cor: '' }])
    setForm({
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
    })

    setTimeout(() => setMensagem(''), 3000)
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900">
                ← Voltar
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">Novo Produto</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {mensagem && (
            <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
              mensagem.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            }`}>
              {mensagem}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            {/* Dados Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <input type="text" value={form.nome} onChange={handleNomeChange} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" placeholder="Calça Pantalona" />
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
                <input type="number" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" placeholder="89.90" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço Promocional</label>
                <input type="number" step="0.01" value={form.preco_promocional} onChange={(e) => setForm({ ...form, preco_promocional: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" placeholder="69.90" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamanhos (separados por vírgula)</label>
                <input type="text" value={form.tamanhos} onChange={(e) => setForm({ ...form, tamanhos: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm" placeholder="P, M, G, GG" />
              </div>
            </div>

            {/* Cores */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Cores do Produto</label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={novaCor}
                  onChange={(e) => setNovaCor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarCor())}
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm"
                  placeholder="Ex: Preto"
                />
                <button type="button" onClick={adicionarCor} className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800">
                  Adicionar
                </button>
              </div>

              {coresSelecionadas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {coresSelecionadas.map((cor) => (
                    <span key={cor} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                      {cor}
                      <button type="button" onClick={() => removerCor(cor)} className="text-gray-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 📸 IMAGENS POR COR */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  📸 Imagens do Produto (uma para cada cor)
                </label>
                <button
                  type="button"
                  onClick={adicionarImagem}
                  className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1 rounded-lg"
                >
                  + Adicionar Imagem
                </button>
              </div>

              <div className="space-y-3">
                {imagens.map((img, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">URL da Imagem</label>
                      <input
                        type="url"
                        value={img.url}
                        onChange={(e) => atualizarImagem(index, 'url', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm"
                        placeholder="https://i.ibb.co/sua-foto.jpg"
                      />
                    </div>
                    <div className="w-40">
                      <label className="block text-xs text-gray-500 mb-1">Cor</label>
                      <input
                        type="text"
                        value={img.cor}
                        onChange={(e) => atualizarImagem(index, 'cor', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm"
                        placeholder="Ex: Preto"
                        list="cores-sugeridas"
                      />
                      <datalist id="cores-sugeridas">
                        {coresSelecionadas.map(cor => (
                          <option key={cor} value={cor} />
                        ))}
                      </datalist>
                    </div>
                    {imagens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerImagem(index)}
                        className="mt-6 text-gray-400 hover:text-red-500 p-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none text-sm resize-none" placeholder="Descreva o produto..." />
            </div>

            {/* Opções */}
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

            {/* Botões */}
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