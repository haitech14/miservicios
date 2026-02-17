import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Grupos() {
  const { user } = useAuth()
  const [grupos, setGrupos] = useState<any[]>([])
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [crearGrupo, setCrearGrupo] = useState(false)
  const [nuevoGrupo, setNuevoGrupo] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'tematico',
    privado: false,
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadGrupos()
    }
  }, [user])

  useEffect(() => {
    if (grupoSeleccionado) {
      loadDetalleGrupo()
    }
  }, [grupoSeleccionado])

  const loadGrupos = async () => {
    try {
      setLoading(true)
      const data = await api.interaccion.grupos.list(user?.organizationId || '')
      setGrupos(data as any[])
    } catch (error) {
      console.error('Error cargando grupos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDetalleGrupo = async () => {
    // Cargar detalles del grupo seleccionado
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      await api.interaccion.grupos.create({
        organizationId: user.organizationId,
        ...nuevoGrupo,
        creadorId: user.id,
      })
      setNuevoGrupo({ nombre: '', descripcion: '', tipo: 'tematico', privado: false })
      setCrearGrupo(false)
      loadGrupos()
    } catch (error: any) {
      alert(error.message || 'Error al crear grupo')
    }
  }

  const handleUnirse = async (_grupoId: string) => {
    if (!user) return
    try {
      // TODO: Implementar endpoint de unirse a grupo
      alert('Funcionalidad de unirse a grupo próximamente disponible')
    } catch (error: any) {
      alert(error.message || 'Error al unirse al grupo')
    }
  }

  if (grupoSeleccionado) {
    const grupo = grupos.find((g: any) => g.id === grupoSeleccionado)
    if (!grupo) return null

    return (
      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        <Header title={grupo.nombre} showBack showLogo={false} />
        <main className="max-w-4xl mx-auto px-4 py-4">
          <div className="mb-4">
            <button
              onClick={() => setGrupoSeleccionado(null)}
              className="text-primary hover:underline"
            >
              ← Volver a grupos
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{grupo.nombre}</h2>
            {grupo.descripcion && (
              <p className="text-gray-700 mb-4">{grupo.descripcion}</p>
            )}
            <div className="flex gap-4 text-sm text-gray-500 mb-6">
              <span>👥 {grupo.miembros?.length || 0} miembros</span>
              <span className="capitalize">{grupo.tipo}</span>
              {grupo.privado && <span>🔒 Privado</span>}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Chat del Grupo</h3>
              <div className="border-2 border-gray-200 rounded-lg p-4 min-h-[200px] bg-gray-50">
                <p className="text-center text-gray-500 py-8">Chat del grupo próximamente disponible</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Grupos" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setCrearGrupo(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Crear Grupo
          </button>
        </div>

        {crearGrupo && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Grupo</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Grupo</label>
                <input
                  type="text"
                  value={nuevoGrupo.nombre}
                  onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={nuevoGrupo.descripcion}
                  onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, descripcion: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={nuevoGrupo.tipo}
                    onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, tipo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="tematico">Temático</option>
                    <option value="proyecto">Proyecto</option>
                    <option value="interes">Interés</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer h-full items-center justify-center">
                    <input
                      type="checkbox"
                      checked={nuevoGrupo.privado}
                      onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, privado: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Grupo privado</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearGrupo(false)
                    setNuevoGrupo({ nombre: '', descripcion: '', tipo: 'tematico', privado: false })
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
          <div className="text-center py-12 text-gray-500">Cargando grupos...</div>
        ) : grupos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-500">No hay grupos disponibles</p>
            <p className="text-sm text-gray-400 mt-2">Crea un nuevo grupo para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grupos.map((grupo: any) => (
              <div
                key={grupo.id}
                onClick={() => setGrupoSeleccionado(grupo.id)}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{grupo.nombre}</h3>
                    {grupo.descripcion && (
                      <p className="text-gray-700 mb-3">{grupo.descripcion}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>👥 {grupo.miembros?.length || 0} miembros</span>
                      <span className="capitalize">{grupo.tipo}</span>
                      {grupo.privado && <span>🔒 Privado</span>}
                    </div>
                  </div>
                  {!grupo.esMiembro && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUnirse(grupo.id)
                      }}
                      className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-700"
                    >
                      Unirse
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
