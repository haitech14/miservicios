import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export function NotificacionesBell() {
  const { user } = useAuth()
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [noLeidas, setNoLeidas] = useState(0)
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadNotificaciones()
      // Configurar polling o WebSocket para actualizaciones en tiempo real
      const interval = setInterval(loadNotificaciones, 30000) // Cada 30 segundos
      return () => clearInterval(interval)
    }
  }, [user])

  const loadNotificaciones = async () => {
    try {
      const [lista, contador] = await Promise.all([
        api.notificaciones.list().catch(() => []),
        api.notificaciones.noLeidas().catch(() => ({ count: 0 })),
      ])
      setNotificaciones((lista as any[]).slice(0, 5)) // Últimas 5
      setNoLeidas((contador as any).count || 0)
    } catch (error) {
      console.error('Error cargando notificaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarcarLeida = async (id: string) => {
    try {
      await api.notificaciones.marcarLeida(id)
      loadNotificaciones()
    } catch (error) {
      console.error('Error marcando notificación:', error)
    }
  }

  const getIconoPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'evento': return '📅'
      case 'mensaje': return '💬'
      case 'logro': return '🏆'
      case 'sistema': return '🔔'
      default: return '📌'
    }
  }

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha)
    const ahora = new Date()
    const diff = ahora.getTime() - date.getTime()
    const minutos = Math.floor(diff / 60000)
    const horas = Math.floor(minutos / 60)
    const dias = Math.floor(horas / 24)

    if (minutos < 1) return 'Ahora'
    if (minutos < 60) return `Hace ${minutos} min`
    if (horas < 24) return `Hace ${horas} h`
    if (dias < 7) return `Hace ${dias} días`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarDropdown(!mostrarDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Notificaciones"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {noLeidas > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white">
            <span className="sr-only">{noLeidas} notificaciones no leídas</span>
          </span>
        )}
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {mostrarDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMostrarDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notificaciones</h3>
              {noLeidas > 0 && (
                <span className="text-sm text-gray-500">{noLeidas} no leídas</span>
              )}
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Cargando...</div>
            ) : notificaciones.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notificaciones.map((notif: any) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.leida) handleMarcarLeida(notif.id)
                      if (notif.enlace) window.location.href = notif.enlace
                      setMostrarDropdown(false)
                    }}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notif.leida ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getIconoPorTipo(notif.tipo)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-medium ${!notif.leida ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notif.titulo}
                          </h4>
                          {!notif.leida && (
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notif.mensaje}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatearFecha(notif.fecha)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-3 border-t border-gray-200">
              <Link
                to="/notificaciones"
                onClick={() => setMostrarDropdown(false)}
                className="block text-center text-sm text-primary hover:underline font-medium"
              >
                Ver todas las notificaciones
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
