import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Se estiver acessando qualquer página admin (exceto a de login)
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
  matcher: ['/admin/:path*'],
}