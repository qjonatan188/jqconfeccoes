// lib/carrinhoStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItemCarrinho {
  id: number
  nome: string
  slug: string
  preco: number
  preco_promocional: number | null
  imagem: string
  tamanho: string
  cor: string
  quantidade: number
}

interface CarrinhoState {
  itens: ItemCarrinho[]
  adicionarItem: (item: ItemCarrinho) => void
  removerItem: (id: number, tamanho: string, cor: string) => void
  atualizarQuantidade: (id: number, tamanho: string, cor: string, quantidade: number) => void
  limparCarrinho: () => void
  totalItens: () => number
  totalPreco: () => number
}

export const useCarrinhoStore = create<CarrinhoState>()(
  persist(
    (set, get) => ({
      itens: [],

      adicionarItem: (item) => {
        const itens = get().itens
        const existente = itens.find(
          (i) => i.id === item.id && i.tamanho === item.tamanho && i.cor === item.cor
        )

        if (existente) {
          set({
            itens: itens.map((i) =>
              i.id === item.id && i.tamanho === item.tamanho && i.cor === item.cor
                ? { ...i, quantidade: i.quantidade + item.quantidade }
                : i
            ),
          })
        } else {
          set({ itens: [...itens, item] })
        }
      },

      removerItem: (id, tamanho, cor) => {
        set({
          itens: get().itens.filter(
            (i) => !(i.id === id && i.tamanho === tamanho && i.cor === cor)
          ),
        })
      },

      atualizarQuantidade: (id, tamanho, cor, quantidade) => {
        if (quantidade <= 0) {
          get().removerItem(id, tamanho, cor)
          return
        }
        set({
          itens: get().itens.map((i) =>
            i.id === id && i.tamanho === tamanho && i.cor === cor
              ? { ...i, quantidade }
              : i
          ),
        })
      },

      limparCarrinho: () => set({ itens: [] }),

      totalItens: () => {
        return get().itens.reduce((total, item) => total + item.quantidade, 0)
      },

      totalPreco: () => {
        return get().itens.reduce((total, item) => {
          const preco = item.preco_promocional || item.preco
          return total + preco * item.quantidade
        }, 0)
      },
    }),
    {
      name: 'modemoda-carrinho',
    }
  )
)