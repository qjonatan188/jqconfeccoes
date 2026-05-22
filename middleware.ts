// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger todas as rotas /admin exceto a página de login
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const authCookie = request.cookies.get('admin_logado')

    if (!authCookie || authCookie.value !== 'true') {
      const loginUrl = new URL('/admin', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}