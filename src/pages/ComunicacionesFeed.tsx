import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

interface Comunicacion {
  id: string
  titulo: string
  mensaje: string
  canal: 'general' | 'anuncios' | 'eventos'
  programadaPara?: string
  enviadaEn?: string
  estado: 'borrador' | 'programada' | 'enviada'
}

type FiltroCanal = 'todas' | 'general' | 'anuncios' | 'eventos'
type FiltroEstado = 'todas' | 'borrador' | 'programada' | 'enviada'

export function ComunicacionesFeed() {
  const { user } = useAuth()
  const [comunicaciones, setComunicaciones] = useState<Comunicacion[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroCanal, setFiltroCanal] = useState<FiltroCanal>('todas')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todas')

  useEffect(() => {
    if (user?.organizationId) {
      loadComunicaciones()
    }
  }, [user])

  const loadComunicaciones = async () => {
    try {
      setLoading(true)
      const data = await api.comunidad.comunicaciones.list(user?.organizationId || '')
      setComunicaciones(data as Comunicacion[])
    } catch (error) {
      console.error('Error cargando comunicaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const comunicacionesFiltradas = comunicaciones.filter((c) => {
    const matchCanal = filtroCanal === 'todas' || c.canal === filtroCanal
    const matchEstado = filtroEstado === 'todas' || c.estado === filtroEstado
    return matchCanal && matchEstado
  })

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return '-'
    return new Date(fecha).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Comunicaciones" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {(['todas', 'general', 'anuncios', 'eventos'] as FiltroCanal[]).map((canal) => (
              <button
                key={canal}
                onClick={() => setFiltroCanal(canal)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filtroCanal === canal
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {canal === 'todas'
                  ? 'Todos los canales'
                  : canal.charAt(0).toUpperCase() + canal.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['todas', 'borrador', 'programada', 'enviada'] as FiltroEstado[]).map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filtroEstado === estado
                    ? 'bg-primary/10 text-primary border border-primary/40'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {estado === 'todas'
                  ? 'Todos los estados'
                  : estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de comunicaciones */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando comunicaciones...</div>
        ) : comunicacionesFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500">No hay comunicaciones registradas</p>
            <p className="text-sm text-gray-400 mt-2">
              Aquí verás el historial de anuncios y mensajes enviados a tu comunidad.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comunicacionesFiltradas.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{c.titulo}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          c.canal === 'anuncios'
                            ? 'bg-amber-100 text-amber-800'
                            : c.canal === 'eventos'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {c.canal === 'general'
                          ? 'General'
                          : c.canal === 'anuncios'
                          ? 'Anuncios'
                          : 'Eventos'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">{c.mensaje}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      {c.programadaPara && (
                        <span>⏱ Programada: {formatearFecha(c.programadaPara)}</span>
                      )}
                      {c.enviadaEn && (
                        <span>✅ Enviada: {formatearFecha(c.enviadaEn)}</span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      c.estado === 'enviada'
                        ? 'bg-green-100 text-green-700'
                        : c.estado === 'programada'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {c.estado === 'enviada'
                      ? 'Enviada'
                      : c.estado === 'programada'
                      ? 'Programada'
                      : 'Borrador'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

