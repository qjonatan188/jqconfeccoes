// components/Rodape.tsx
import Link from 'next/link'

export default function Rodape() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Coluna 1 - Marca */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-serif font-bold text-white">
  JQ Confecções
</Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Moda feminina que celebra a individualidade e o estilo de cada mulher. 
              Peças atemporais feitas com amor e atenção aos detalhes.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <span className="text-sm">Instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <span className="text-sm">Pinterest</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <span className="text-sm">TikTok</span>
              </a>
            </div>
          </div>

          {/* Coluna 2 - Loja */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white font-semibold mb-6">
              Loja
            </h4>
            <ul className="space-y-3">
              <li><Link href="/loja" className="text-sm text-gray-400 hover:text-white transition-colors">Todos os Produtos</Link></li>
              <li><Link href="/loja?categoria=vestidos" className="text-sm text-gray-400 hover:text-white transition-colors">Vestidos</Link></li>
              <li><Link href="/loja?categoria=blusas" className="text-sm text-gray-400 hover:text-white transition-colors">Blusas</Link></li>
              <li><Link href="/loja?categoria=saias" className="text-sm text-gray-400 hover:text-white transition-colors">Saias</Link></li>
              <li><Link href="/loja?categoria=conjuntos" className="text-sm text-gray-400 hover:text-white transition-colors">Conjuntos</Link></li>
            </ul>
          </div>

          {/* Coluna 3 - Ajuda */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white font-semibold mb-6">
              Ajuda
            </h4>
            <ul className="space-y-3">
              <li><Link href="/guia-de-tamanhos" className="text-sm text-gray-400 hover:text-white transition-colors">Guia de Tamanhos</Link></li>
              <li><Link href="/trocas" className="text-sm text-gray-400 hover:text-white transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/frete" className="text-sm text-gray-400 hover:text-white transition-colors">Política de Frete</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">Perguntas Frequentes</Link></li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white font-semibold mb-6">
              Contato
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span>📧</span> jqconfeccoes@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span> (11) 99865-4952
              </li>
              <li className="flex items-start gap-2">
                <span>🕐</span> Seg a Sex: 9h às 18h<br />
                <span className="ml-7">Sáb: 9h às 13h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
  © 2026 JQ Confecções. Todos os direitos reservados.
</p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}