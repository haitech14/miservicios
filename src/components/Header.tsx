import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showLogo?: boolean
  /** Título de sección en desktop (ej: SERVICIOS) */
  sectionTitle?: string
}

export function Header({ title, showBack = false, showLogo = true, sectionTitle }: HeaderProps) {
  const navigate = useNavigate()

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
              {sectionTitle || title || 'SERVICIOS'}
            </h1>
            {title && sectionTitle && (
              <span className="hidden md:block text-sm text-gray-500">{title}</span>
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
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Notificaciones"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Más opciones"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
