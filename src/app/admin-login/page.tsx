'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Leaf } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'No se pudo iniciar sesión')
        return
      }
      // Solo se redirige a rutas internas del panel (evita redirecciones a otros sitios).
      const next = searchParams.get('next')
      router.replace(next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin')
      router.refresh()
    } catch {
      setError('No se pudo conectar. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
        <div className="bg-green-700 p-1.5 rounded-lg">
          <Leaf className="w-4 h-4 text-green-200" />
        </div>
        Panel Admin
      </div>
      <p className="text-sm text-gray-500 mb-5">Ingresá la contraseña para ver los pedidos.</p>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
      <input
        id="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      {error && <p className="text-sm text-red-600 mt-2" role="alert">{error}</p>}
      <button
        type="submit"
        disabled={loading || password.length === 0}
        className="mt-4 w-full rounded-xl bg-green-700 text-white font-semibold py-2.5 text-sm hover:bg-green-800 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
