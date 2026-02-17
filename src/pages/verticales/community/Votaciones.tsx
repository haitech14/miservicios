import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Votaciones() {
  const { user } = useAuth()
  const [votaciones, setVotaciones] = useState<any[]>([])
  const [votacionSeleccionada, setVotacionSeleccionada] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [crearVotacion, setCrearVotacion] = useState(false)
  const [nuevaVotacion, setNuevaVotacion] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    opciones: [''],
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadVotaciones()
    }
  }, [user])

  useEffect(() => {
    if (votacionSeleccionada) {
      loadDetalleVotacion()
    }
  }, [votacionSeleccionada])

  const loadVotaciones = async () => {
    try {
      setLoading(true)
      const data = await api.comunidad.votaciones.list(user?.organizationId || '')
      setVotaciones(data as any[])
    } catch (error) {
      console.error('Error cargando votaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDetalleVotacion = async () => {
    // Cargar detalles de la votación seleccionada
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      const opciones = nuevaVotacion.opciones.filter((o) => o.trim() !== '')
      await api.comunidad.votaciones.create({
        organizationId: user.organizationId,
        titulo: nuevaVotacion.titulo,
        descripcion: nuevaVotacion.descripcion,
        fechaInicio: nuevaVotacion.fechaInicio,
        fechaFin: nuevaVotacion.fechaFin,
        opciones,
      })
      setNuevaVotacion({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', opciones: [''] })
      setCrearVotacion(false)
      loadVotaciones()
    } catch (error: any) {
      alert(error.message || 'Error al crear votación')
    }
  }

  const handleVotar = async (votacionId: string, opcionId: string) => {
    if (!user) return
    if (!confirm('¿Confirmas tu voto?')) return

    try {
      await api.comunidad.votaciones.votar(votacionId, opcionId, user.id)
      loadVotaciones()
      setVotacionSeleccionada(null)
    } catch (error: any) {
      alert(error.message || 'Error al votar')
    }
  }

  const agregarOpcion = () => {
    setNuevaVotacion({ ...nuevaVotacion, opciones: [...nuevaVotacion.opciones, ''] })
  }

  const actualizarOpcion = (index: number, valor: string) => {
    const nuevasOpciones = [...nuevaVotacion.opciones]
    nuevasOpciones[index] = valor
    setNuevaVotacion({ ...nuevaVotacion, opciones: nuevasOpciones })
  }

  if (votacionSeleccionada) {
    const votacion = votaciones.find((v: any) => v.id === votacionSeleccionada)
    if (!votacion) return null

    return (
      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        <Header title={votacion.titulo} showBack showLogo={false} />
        <main className="max-w-4xl mx-auto px-4 py-4">
          <div className="mb-4">
            <button
              onClick={() => setVotacionSeleccionada(null)}
              className="text-primary hover:underline"
            >
              ← Volver a votaciones
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{votacion.titulo}</h2>
            {votacion.descripcion && (
              <p className="text-gray-700 mb-4">{votacion.descripcion}</p>
            )}
            <div className="text-sm text-gray-500 mb-6">
              <span>📅 {new Date(votacion.fechaInicio).toLocaleDateString()} - {new Date(votacion.fechaFin).toLocaleDateString()}</span>
            </div>

            <div className="space-y-3">
              {votacion.opciones?.map((opcion: any) => {
                const porcentaje = votacion.totalVotos > 0
                  ? ((opcion.votos || 0) / votacion.totalVotos) * 100
                  : 0
                return (
                  <div key={opcion.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{opcion.texto}</span>
                      <span className="text-sm text-gray-500">{opcion.votos || 0} votos ({porcentaje.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    {!votacion.yaVoto && new Date() >= new Date(votacion.fechaInicio) && new Date() <= new Date(votacion.fechaFin) && (
                      <button
                        onClick={() => handleVotar(votacion.id, opcion.id)}
                        className="mt-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-700"
                      >
                        Votar
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Votaciones" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setCrearVotacion(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Crear Votación
          </button>
        </div>

        {crearVotacion && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Votación</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={nuevaVotacion.titulo}
                  onChange={(e) => setNuevaVotacion({ ...nuevaVotacion, titulo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={nuevaVotacion.descripcion}
                  onChange={(e) => setNuevaVotacion({ ...nuevaVotacion, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                  <input
                    type="datetime-local"
                    value={nuevaVotacion.fechaInicio}
                    onChange={(e) => setNuevaVotacion({ ...nuevaVotacion, fechaInicio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                  <input
                    type="datetime-local"
                    value={nuevaVotacion.fechaFin}
                    onChange={(e) => setNuevaVotacion({ ...nuevaVotacion, fechaFin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
                {nuevaVotacion.opciones.map((opcion, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={opcion}
                      onChange={(e) => actualizarOpcion(index, e.target.value)}
                      placeholder={`Opción ${index + 1}`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    {index === nuevaVotacion.opciones.length - 1 && (
                      <button
                        type="button"
                        onClick={agregarOpcion}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearVotacion(false)
                    setNuevaVotacion({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', opciones: [''] })
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
          <div className="text-center py-12 text-gray-500">Cargando votaciones...</div>
        ) : votaciones.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay votaciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {votaciones.map((votacion: any) => (
              <div
                key={votacion.id}
                onClick={() => setVotacionSeleccionada(votacion.id)}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{votacion.titulo}</h3>
                    {votacion.descripcion && (
                      <p className="text-gray-700 mb-3">{votacion.descripcion}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(votacion.fechaInicio).toLocaleDateString()} - {new Date(votacion.fechaFin).toLocaleDateString()}</span>
                      <span>🗳️ {votacion.totalVotos || 0} votos</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    votacion.estado === 'activa'
                      ? 'bg-green-100 text-green-700'
                      : votacion.estado === 'finalizada'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {votacion.estado}
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
