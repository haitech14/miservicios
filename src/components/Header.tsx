import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { NotificacionesBell } from './NotificacionesBell'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showLogo?: boolean
  /** Título de sección en desktop (ej: SERVICIOS) */
  sectionTitle?: string
}

export function Header({ title, showBack = false, showLogo = true, sectionTitle }: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm pb-safe">
      <div className="flex items-center gap-4 px-4 py-3 max-w-7xl mx-auto md:px-6 lg:px-8">
        {/* Botón volver */}
        <div className="flex-shrink-0">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Volver"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Título: mobile centrado, desktop sección + búsqueda */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2 min-w-0">
          <div className="flex flex-col items-center md:items-start">
            {showLogo && (
              <div className="flex items-center gap-1 md:hidden">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">
                  MI
                </div>
                <span className="text-lg font-bold text-primary">SERVICIOS</span>
              </div>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-primary md:text-gray-900">
              {title || sectionTitle || 'SERVICIOS'}
            </h1>
            {title && sectionTitle && (
              <span className="hidden md:block text-sm text-gray-500">{sectionTitle}</span>
            )}
          </div>

          {/* Búsqueda y acciones - solo desktop */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="w-64 lg:w-80">
              <input
                type="search"
                placeholder="Buscar servicios..."
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400"
              />
            </div>
            <NotificacionesBell />
            <div ref={menuRef} className="relative pl-2 border-l border-gray-200">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 min-w-0 hover:opacity-90 transition-opacity"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-100">
                  {user?.fotoUrl ? (
                    <img src={user.fotoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                      {(user?.nombres?.[0] || user?.email?.[0] || '?').toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 truncate max-w-[120px] hidden sm:block">
                  {user ? `${user.nombres || ''} ${user.apellidos || ''}`.trim() || user.email?.split('@')[0] : 'Mi perfil'}
                </span>
                <svg className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">👤</span>
                    <span className="text-sm font-medium">Ver Perfil</span>
                  </Link>
                  <Link
                    to="/carnet"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">🪪</span>
                    <span className="text-sm font-medium">Carné Virtual</span>
                  </Link>
                  <Link
                    to="/ranking"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">🏆</span>
                    <span className="text-sm font-medium">Ranking</span>
                  </Link>
                  <Link
                    to="/configuracion"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">⚙️</span>
                    <span className="text-sm font-medium">Configuración</span>
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <span className="text-lg">🚪</span>
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
