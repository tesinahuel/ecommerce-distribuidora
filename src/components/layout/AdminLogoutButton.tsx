'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function AdminLogoutButton() {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin-login')
    router.refresh()
  }

  return (
    <button
      onClick={logout}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-300"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesión
    </button>
  )
}
