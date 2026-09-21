import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminAuth'

// Protege las páginas del panel /admin: sin sesión válida se redirige al login.
// (Las APIs de pedidos y las páginas del panel además verifican la sesión por su cuenta.)
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  if (await verifySessionToken(token)) return NextResponse.next()

  const loginUrl = new URL('/admin-login', request.url)
  loginUrl.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
