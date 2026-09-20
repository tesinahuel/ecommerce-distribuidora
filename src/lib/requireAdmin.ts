import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, verifySessionToken } from './adminAuth'

/** Para páginas del panel (server components): si no hay sesión válida, manda al login. */
export async function requireAdmin() {
  const store = await cookies()
  if (!(await verifySessionToken(store.get(ADMIN_COOKIE)?.value))) {
    redirect('/admin-login')
  }
}
