import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Proyectos() {
  const { user } = useAuth()
  const [proyectos, setProyectos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [crearProyecto, setCrearProyecto] = useState(false)
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: '',
    descripcion: '',
    objetivo: '',
    presupuesto: '',
    fechaInicio: '',
    fechaFin: '',
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadProyectos()
    }
  }, [user])

  const loadProyectos = async () => {
    try {
      setLoading(true)
      const data = await api.comunidad.proyectos.list(user?.organizationId || '')
      setProyectos(data as any[])
    } catch (error) {
      console.error('Error cargando proyectos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      await api.comunidad.proyectos.create({
        organizationId: user.organizationId,
        ...nuevoProyecto,
        presupuesto: nuevoProyecto.presupuesto ? parseFloat(nuevoProyecto.presupuesto) : undefined,
        responsableId: user.id,
      })
      setNuevoProyecto({ nombre: '', descripcion: '', objetivo: '', presupuesto: '', fechaInicio: '', fechaFin: '' })
      setCrearProyecto(false)
      loadProyectos()
    } catch (error: any) {
      alert(error.message || 'Error al crear proyecto')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Proyectos" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setCrearProyecto(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Crear Proyecto
          </button>
        </div>

        {crearProyecto && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Proyecto</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Proyecto</label>
                <input
                  type="text"
                  value={nuevoProyecto.nombre}
                  onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={nuevoProyecto.descripcion}
                  onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo</label>
                <textarea
                  value={nuevoProyecto.objetivo}
                  onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, objetivo: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto</label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevoProyecto.presupuesto}
                    onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, presupuesto: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                  <input
                    type="date"
                    value={nuevoProyecto.fechaInicio}
                    onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, fechaInicio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                  <input
                    type="date"
                    value={nuevoProyecto.fechaFin}
                    onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, fechaFin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearProyecto(false)
                    setNuevoProyecto({ nombre: '', descripcion: '', objetivo: '', presupuesto: '', fechaInicio: '', fechaFin: '' })
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
          <div className="text-center py-12 text-gray-500">Cargando proyectos...</div>
        ) : proyectos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay proyectos registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proyectos.map((proyecto: any) => (
              <div key={proyecto.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{proyecto.nombre}</h3>
                    {proyecto.descripcion && (
                      <p className="text-gray-700 mb-2">{proyecto.descripcion}</p>
                    )}
                    {proyecto.objetivo && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">Objetivo: </span>
                        <span className="text-sm text-gray-600">{proyecto.objetivo}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {proyecto.presupuesto && (
                        <span>💰 Presupuesto: S/ {proyecto.presupuesto.toFixed(2)}</span>
                      )}
                      {proyecto.fechaInicio && (
                        <span>📅 Inicio: {new Date(proyecto.fechaInicio).toLocaleDateString()}</span>
                      )}
                      {proyecto.fechaFin && (
                        <span>📅 Fin: {new Date(proyecto.fechaFin).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    proyecto.estado === 'en_ejecucion'
                      ? 'bg-blue-100 text-blue-700'
                      : proyecto.estado === 'completado'
                      ? 'bg-green-100 text-green-700'
                      : proyecto.estado === 'cancelado'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {proyecto.estado}
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
