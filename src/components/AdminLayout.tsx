import { Outlet, Link } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/admin" className="font-semibold text-gray-900">
            HaiCommunity Admin
          </Link>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            Volver al inicio
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto py-8">
        <Outlet />
      </main>
    </div>
  )
}
