import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { useOrg } from '../context/OrgContext'
import { api } from '../services/api'

export function Feed() {
  const { user } = useAuth()
  useOrg()
  const [actividades, setActividades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<string>('todos')

  useEffect(() => {
    if (user?.organizationId) {
      loadActividades()
    }
  }, [user, filtro])

  const loadActividades = async () => {
    try {
      setLoading(true)
      const data = await api.interaccion.feed.list(user?.organizationId || '', 50)
      setActividades(data as any[])
    } catch (error) {
      console.error('Error cargando feed:', error)
    } finally {
      setLoading(false)
    }
  }

  const actividadesFiltradas = filtro === 'todos'
    ? actividades
    : actividades.filter((a: any) => a.tipo === filtro)

  const getIconoPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'post': return '📝'
      case 'evento': return '📅'
      case 'logro': return '🏆'
      case 'votacion': return '🗳️'
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
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Feed de Actividades" showBack showLogo={false} />
      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex gap-2 overflow-x-auto">
            {['todos', 'post', 'evento', 'logro', 'votacion'].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltro(tipo)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filtro === tipo
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tipo === 'todos' ? 'Todos' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de actividades */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando actividades...</div>
        ) : actividadesFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500">No hay actividades para mostrar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {actividadesFiltradas.map((actividad: any) => {
              const contenido = typeof actividad.contenido === 'string'
                ? JSON.parse(actividad.contenido)
                : actividad.contenido

              return (
                <div key={actividad.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{getIconoPorTipo(actividad.tipo)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {contenido?.usuario || 'Usuario'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatearFecha(actividad.fecha)}
                        </span>
                      </div>
                      <div className="text-gray-700">
                        {contenido?.mensaje || contenido?.titulo || 'Actividad'}
                      </div>
                      {contenido?.enlace && (
                        <a
                          href={contenido.enlace}
                          className="text-primary text-sm mt-2 inline-block hover:underline"
                        >
                          Ver más →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
