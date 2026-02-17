import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
export function Debates() {
  const { user } = useAuth()
  const [debates, setDebates] = useState<any[]>([])
  const [debateSeleccionado, setDebateSeleccionado] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [crearDebate, setCrearDebate] = useState(false)
  const [nuevoDebate, setNuevoDebate] = useState({
    titulo: '',
    descripcion: '',
    tema: '',
    fechaInicio: '',
    fechaFin: '',
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadDebates()
    }
  }, [user])

  useEffect(() => {
    if (debateSeleccionado) {
      loadDetalleDebate()
    }
  }, [debateSeleccionado])

  const loadDebates = async () => {
    try {
      setLoading(true)
      // TODO: Implementar endpoint de debates
      // const data = await api.comunidad.debates.list(user?.organizationId || '')
      // setDebates(data as any[])
      setDebates([])
    } catch (error) {
      console.error('Error cargando debates:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDetalleDebate = async () => {
    // Cargar detalles del debate seleccionado
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      // TODO: Implementar endpoint
      alert('Funcionalidad de debates próximamente disponible')
      setCrearDebate(false)
    } catch (error: any) {
      alert(error.message || 'Error al crear debate')
    }
  }

  const handleVotarArgumento = async (_debateId: string, _argumentoId: string, _aFavor: boolean) => {
    if (!user) return
    try {
      // TODO: Implementar endpoint
      alert('Funcionalidad de votación próximamente disponible')
    } catch (error: any) {
      alert(error.message || 'Error al votar')
    }
  }

  if (debateSeleccionado) {
    const debate = debates.find((d: any) => d.id === debateSeleccionado)
    if (!debate) return null

    return (
      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        <Header title={debate.titulo} showBack showLogo={false} />
        <main className="max-w-4xl mx-auto px-4 py-4">
          <div className="mb-4">
            <button
              onClick={() => setDebateSeleccionado(null)}
              className="text-primary hover:underline"
            >
              ← Volver a debates
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{debate.titulo}</h2>
            {debate.descripcion && (
              <p className="text-gray-700 mb-6">{debate.descripcion}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <h3 className="font-semibold text-green-900 mb-3">A Favor</h3>
                <div className="space-y-3">
                  {debate.argumentosAFavor?.map((arg: any) => (
                    <div key={arg.id} className="bg-white rounded p-3">
                      <p className="text-sm text-gray-700 mb-2">{arg.texto}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Por {arg.autor}</span>
                        <div className="flex items-center gap-2">
                          <span>👍 {arg.votosAFavor || 0}</span>
                          <button
                            onClick={() => handleVotarArgumento(debate.id, arg.id, true)}
                            className="text-green-600 hover:underline"
                          >
                            Votar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                <h3 className="font-semibold text-red-900 mb-3">En Contra</h3>
                <div className="space-y-3">
                  {debate.argumentosEnContra?.map((arg: any) => (
                    <div key={arg.id} className="bg-white rounded p-3">
                      <p className="text-sm text-gray-700 mb-2">{arg.texto}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Por {arg.autor}</span>
                        <div className="flex items-center gap-2">
                          <span>👎 {arg.votosEnContra || 0}</span>
                          <button
                            onClick={() => handleVotarArgumento(debate.id, arg.id, false)}
                            className="text-red-600 hover:underline"
                          >
                            Votar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Debates" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setCrearDebate(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Crear Debate
          </button>
        </div>

        {crearDebate && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Debate</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={nuevoDebate.titulo}
                  onChange={(e) => setNuevoDebate({ ...nuevoDebate, titulo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={nuevoDebate.descripcion}
                  onChange={(e) => setNuevoDebate({ ...nuevoDebate, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <input
                  type="text"
                  value={nuevoDebate.tema}
                  onChange={(e) => setNuevoDebate({ ...nuevoDebate, tema: e.target.value })}
                  placeholder="Ej: Educación, Medio Ambiente, Salud"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                  <input
                    type="datetime-local"
                    value={nuevoDebate.fechaInicio}
                    onChange={(e) => setNuevoDebate({ ...nuevoDebate, fechaInicio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                  <input
                    type="datetime-local"
                    value={nuevoDebate.fechaFin}
                    onChange={(e) => setNuevoDebate({ ...nuevoDebate, fechaFin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearDebate(false)
                    setNuevoDebate({ titulo: '', descripcion: '', tema: '', fechaInicio: '', fechaFin: '' })
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
          <div className="text-center py-12 text-gray-500">Cargando debates...</div>
        ) : debates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-500">No hay debates disponibles</p>
            <p className="text-sm text-gray-400 mt-2">Crea un nuevo debate para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {debates.map((debate: any) => (
              <div
                key={debate.id}
                onClick={() => setDebateSeleccionado(debate.id)}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{debate.titulo}</h3>
                    {debate.descripcion && (
                      <p className="text-gray-700 mb-3">{debate.descripcion}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(debate.fechaInicio).toLocaleDateString()} - {new Date(debate.fechaFin).toLocaleDateString()}</span>
                      <span>💬 {debate.totalArgumentos || 0} argumentos</span>
                      {debate.tema && <span>🏷️ {debate.tema}</span>}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    debate.estado === 'activo'
                      ? 'bg-green-100 text-green-700'
                      : debate.estado === 'finalizado'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {debate.estado}
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
