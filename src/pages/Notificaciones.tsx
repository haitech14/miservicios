import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export function Notificaciones() {
  const { user } = useAuth()
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todas' | 'no-leidas'>('todas')

  useEffect(() => {
    if (user) {
      loadNotificaciones()
    }
  }, [user, filtro])

  const loadNotificaciones = async () => {
    try {
      setLoading(true)
      const data = await api.notificaciones.list()
      let notifs = data as any[]
      if (filtro === 'no-leidas') {
        notifs = notifs.filter((n: any) => !n.leida)
      }
      setNotificaciones(notifs)
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

  const handleMarcarTodasLeidas = async () => {
    try {
      const noLeidas = notificaciones.filter((n: any) => !n.leida)
      await Promise.all(noLeidas.map((n: any) => api.notificaciones.marcarLeida(n.id)))
      loadNotificaciones()
    } catch (error) {
      console.error('Error marcando notificaciones:', error)
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
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const noLeidas = notificaciones.filter((n: any) => !n.leida).length

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Notificaciones" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Filtros y acciones */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFiltro('todas')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filtro === 'todas'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltro('no-leidas')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filtro === 'no-leidas'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                No leídas {noLeidas > 0 && `(${noLeidas})`}
              </button>
            </div>
            {noLeidas > 0 && (
              <button
                onClick={handleMarcarTodasLeidas}
                className="px-4 py-2 text-sm text-primary hover:underline"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
        </div>

        {/* Lista de notificaciones */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando notificaciones...</div>
        ) : notificaciones.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">🔔</div>
            <p className="text-gray-500">No hay notificaciones</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificaciones.map((notif: any) => (
              <div
                key={notif.id}
                className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${
                  !notif.leida
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getIconoPorTipo(notif.tipo)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${!notif.leida ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notif.titulo}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{notif.mensaje}</p>
                        <p className="text-xs text-gray-400">{formatearFecha(notif.fecha)}</p>
                      </div>
                      {!notif.leida && (
                        <button
                          onClick={() => handleMarcarLeida(notif.id)}
                          className="ml-4 px-3 py-1 text-xs text-primary hover:underline"
                        >
                          Marcar leída
                        </button>
                      )}
                    </div>
                    {notif.enlace && (
                      <a
                        href={notif.enlace}
                        className="inline-block mt-2 text-sm text-primary hover:underline"
                      >
                        Ver más →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
