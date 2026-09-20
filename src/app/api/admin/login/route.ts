import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, createSessionToken, passwordMatches } from '@/lib/adminAuth'

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'El panel no está configurado: falta la variable ADMIN_PASSWORD en Vercel.' },
      { status: 503 }
    )
  }

  let password = ''
  try {
    const body = await request.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    // body inválido: se trata como contraseña vacía
  }

  if (!(await passwordMatches(password))) {
    // Pequeña demora para frenar intentos automáticos de adivinar la contraseña.
    await new Promise((r) => setTimeout(r, 800))
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_SECONDS,
  })
  return response
}
