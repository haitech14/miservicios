import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export function Ranking() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'general' | 'servicio'>('general')
  const [periodo, setPeriodo] = useState<string>('todos')
  const [servicioId, setServicioId] = useState<string>('')
  const [ranking, setRanking] = useState<any[]>([])
  const [miPosicion, setMiPosicion] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRanking()
  }, [tab, periodo, servicioId])

  const loadRanking = async () => {
    try {
      setLoading(true)
      let data: any[] = []

      if (tab === 'general') {
        data = (await api.gamificacion.ranking(periodo === 'todos' ? undefined : periodo)) as any[]
      } else {
        if (servicioId) {
          data = (await api.gamificacion.rankingServicio(servicioId)) as any[]
        }
      }

      setRanking(data)

      // Buscar mi posición
      if (user) {
        const miPos = data.findIndex((r: any) => r.userId === user.id)
        if (miPos !== -1) {
          setMiPosicion({ ...data[miPos], posicion: miPos + 1 })
        }
      }
    } catch (error) {
      console.error('Error cargando ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  const servicios = [
    { id: 'comedor', nombre: 'Comedor' },
    { id: 'transporte', nombre: 'Transporte' },
    { id: 'gimnasio', nombre: 'Gimnasio' },
    { id: 'eventos', nombre: 'Eventos' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Ranking" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-4">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTab('general')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
                tab === 'general'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ranking General
            </button>
            <button
              onClick={() => setTab('servicio')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
                tab === 'servicio'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Por Servicio
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex flex-wrap gap-4">
            {tab === 'general' && (
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todos">Todos los tiempos</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="anual">Anual</option>
              </select>
            )}
            {tab === 'servicio' && (
              <select
                value={servicioId}
                onChange={(e) => setServicioId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecciona un servicio</option>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Mi posición destacada */}
        {miPosicion && (
          <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-xl shadow-sm p-6 mb-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">Tu posición</div>
                <div className="text-3xl font-bold">#{miPosicion.posicion}</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90 mb-1">Puntos</div>
                <div className="text-2xl font-bold">
                  {tab === 'general' ? miPosicion.puntosTotales : miPosicion.puntos}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de ranking */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando ranking...</div>
          ) : ranking.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {tab === 'servicio' && !servicioId
                ? 'Selecciona un servicio para ver el ranking'
                : 'No hay datos disponibles'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Puntos</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nivel</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Logros</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ranking.map((item: any, index: number) => {
                    const esYo = user && item.userId === user.id
                    return (
                      <tr
                        key={item.id}
                        className={esYo ? 'bg-primary/5 font-semibold' : 'hover:bg-gray-50'}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <span className="text-2xl">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            )}
                            <span className="text-gray-900">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {item.user?.nombres?.[0] || item.user?.email?.[0] || '?'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.user?.nombres && item.user?.apellidos
                                  ? `${item.user.nombres} ${item.user.apellidos}`
                                  : item.user?.email || 'Usuario'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-gray-900 font-semibold">
                            {tab === 'general' ? item.puntosTotales : item.puntos}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            Nivel {item.nivel || 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            {item.achievements?.slice(0, 3).map((a: any, i: number) => (
                              <span key={i} className="text-xl" title={a.achievement?.nombre}>
                                {a.achievement?.icono || '🏆'}
                              </span>
                            ))}
                            {item.achievements?.length > 3 && (
                              <span className="text-xs text-gray-500">+{item.achievements.length - 3}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
