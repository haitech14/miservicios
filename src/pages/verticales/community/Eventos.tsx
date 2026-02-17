import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Eventos() {
  const { user } = useAuth()
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [crearEvento, setCrearEvento] = useState(false)
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    ubicacion: '',
    tipo: 'social',
    notificarPorCorreo: true,
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadEventos()
    }
  }, [user])

  const loadEventos = async () => {
    try {
      setLoading(true)
      const data = await api.comunidad.eventos.list(user?.organizationId || '')
      setEventos(data as any[])
    } catch (error) {
      console.error('Error cargando eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      await api.comunidad.eventos.create({
        organizationId: user.organizationId,
        ...nuevoEvento,
        userId: user.id,
        notificarPorCorreo: nuevoEvento.notificarPorCorreo,
      })
      setNuevoEvento({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', ubicacion: '', tipo: 'social', notificarPorCorreo: true })
      setCrearEvento(false)
      loadEventos()
    } catch (error: any) {
      alert(error.message || 'Error al crear evento')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Eventos" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setCrearEvento(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Crear Evento
          </button>
        </div>

        {crearEvento && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Evento</h3>
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
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nuevoEvento.notificarPorCorreo}
                    onChange={(e) => setNuevoEvento({ ...nuevoEvento, notificarPorCorreo: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="font-medium text-gray-900">Notificar por correo a los participantes</span>
                </label>
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
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearEvento(false)
                    setNuevoEvento({ titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', ubicacion: '', tipo: 'social', notificarPorCorreo: false })
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
          <div className="text-center py-12 text-gray-500">Cargando eventos...</div>
        ) : eventos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay eventos programados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {eventos.map((evento: any) => (
              <div key={evento.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{evento.titulo}</h3>
                    {evento.descripcion && (
                      <p className="text-gray-600 mb-3">{evento.descripcion}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(evento.fechaInicio).toLocaleString()}</span>
                      {evento.ubicacion && <span>📍 {evento.ubicacion}</span>}
                      <span className="capitalize">{evento.tipo}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    evento.estado === 'programado'
                      ? 'bg-blue-100 text-blue-700'
                      : evento.estado === 'en_curso'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {evento.estado}
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
