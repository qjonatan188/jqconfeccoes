// app/admin/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SENHA_ADMIN = 'modemoda2026' // 🔴 TROQUE POR UMA SENHA FORTE

export default function AdminLogin() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    setTimeout(() => {
      if (senha === SENHA_ADMIN) {
        // Salvar no localStorage
        localStorage.setItem('admin_logado', 'true')
        // Salvar no cookie (para o middleware)
        document.cookie = 'admin_logado=true; path=/; max-age=86400; SameSite=Lax'
        router.push('/admin/dashboard')
      } else {
        setErro('Senha incorreta!')
        setCarregando(false)
      }
    }, 800)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Modemoda
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Painel Administrativo
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-900 outline-none transition-colors text-sm"
                placeholder="Digite a senha"
                autoFocus
              />
            </div>

            {erro && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando || !senha}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Área restrita para administradores
          </p>
        </div>
      </div>
    </main>
  )
}