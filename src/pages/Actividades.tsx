import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

type TabType = 'eventos' | 'entretenimiento'

export function Actividades() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('eventos')
  const [eventos, setEventos] = useState<any[]>([])
  const [actividades, setActividades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [crearEvento, setCrearEvento] = useState(false)
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    ubicacion: '',
    tipo: 'social',
    categoria: 'eventos', // eventos o entretenimiento
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const [eventosData] = await Promise.all([
        api.comunidad.eventos.list(user?.organizationId || ''),
      ])
      setEventos(eventosData as any[])
      // Actividades de entretenimiento (simuladas por ahora)
      setActividades([
        {
          id: '1',
          titulo: 'Torneo de Ping Pong',
          descripcion: 'Competencia amistosa entre departamentos',
          fechaInicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          tipo: 'deportivo',
          categoria: 'entretenimiento',
          estado: 'programado',
          inscritos: 12,
          capacidadMaxima: 24,
        },
        {
          id: '2',
          titulo: 'Cine en el jardín',
          descripcion: 'Proyección de película al aire libre con snacks',
          fechaInicio: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          tipo: 'cultural',
          categoria: 'entretenimiento',
          estado: 'programado',
          inscritos: 45,
          capacidadMaxima: 60,
        },
      ])
    } catch (error) {
      console.error('Error cargando actividades:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      if (nuevoEvento.categoria === 'eventos') {
        await api.comunidad.eventos.create({
          organizationId: user.organizationId,
          ...nuevoEvento,
          userId: user.id,
        })
      } else {
        // Simular creación de actividad de entretenimiento
        const nuevaActividad = {
          id: Date.now().toString(),
          ...nuevoEvento,
          categoria: 'entretenimiento',
          estado: 'programado',
          inscritos: 0,
          createdAt: new Date().toISOString(),
        }
        setActividades([nuevaActividad, ...actividades])
      }
      setNuevoEvento({ 
        titulo: '', 
        descripcion: '', 
        fechaInicio: '', 
        fechaFin: '', 
        ubicacion: '', 
        tipo: 'social',
        categoria: activeTab 
      })
      setCrearEvento(false)
      loadData()
    } catch (error: any) {
      alert(error.message || 'Error al crear actividad')
    }
  }

  const handleInscribir = async (item: any) => {
    // Simular inscripción
    alert(`Te has inscrito en: ${item.titulo}`)
    loadData()
  }

  const actividadesFiltradas = activeTab === 'eventos' ? eventos : actividades

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Actividades" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Tabs */}
        <div className="flex mb-4 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('eventos')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'eventos'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📅 Eventos
          </button>
          <button
            onClick={() => setActiveTab('entretenimiento')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              activeTab === 'entretenimiento'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎉 Entretenimiento
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setCrearEvento(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            + Crear {activeTab === 'eventos' ? 'Evento' : 'Actividad'}
          </button>
        </div>

        {crearEvento && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nuevo {activeTab === 'eventos' ? 'Evento' : 'Actividad'}
            </h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={nuevoEvento.titulo}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={nuevoEvento.descripcion}
                  onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                  <input
                    type="datetime-local"
                    value={nuevoEvento.fechaInicio}
                    onChange={(e) => setNuevoEvento({ ...nuevoEvento, fechaInicio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                  <input
                    type="datetime-local"
                    value={nuevoEvento.fechaFin}
                    onChange={(e) => setNuevoEvento({ ...nuevoEvento, fechaFin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                  <input
                    type="text"
                    value={nuevoEvento.ubicacion}
                    onChange={(e) => setNuevoEvento({ ...nuevoEvento, ubicacion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={nuevoEvento.tipo}
                    onChange={(e) => setNuevoEvento({ ...nuevoEvento, tipo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="social">Social</option>
                    <option value="reunion">Reunión</option>
                    <option value="deportivo">Deportivo</option>
                    <option value="cultural">Cultural</option>
                    <option value="relax">Relax/Descanso</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearEvento(false)
                    setNuevoEvento({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', ubicacion: '', tipo: 'social', categoria: activeTab })
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando {activeTab}...</div>
        ) : actividadesFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay {activeTab} programados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {actividadesFiltradas.map((item: any) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.titulo}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        item.categoria === 'eventos' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.categoria === 'eventos' ? 'Evento' : 'Entretenimiento'}
                      </span>
                    </div>
                    {item.descripcion && (
                      <p className="text-gray-600 mb-3">{item.descripcion}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(item.fechaInicio).toLocaleDateString()}</span>
                      {item.ubicacion && <span>📍 {item.ubicacion}</span>}
                      <span className="capitalize">🏷️ {item.tipo}</span>
                      {item.capacidadMaxima && (
                        <span>👥 {item.inscritos || 0}/{item.capacidadMaxima}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      item.estado === 'programado'
                        ? 'bg-blue-100 text-blue-700'
                        : item.estado === 'en_curso'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.estado === 'programado' ? 'Programado' : item.estado === 'en_curso' ? 'En curso' : 'Finalizado'}
                    </span>
                    <button
                      onClick={() => handleInscribir(item)}
                      className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Inscribirse
                    </button>
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
