import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Comunicaciones() {
  const { user } = useAuth()
  const [comunicaciones, setComunicaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [crearComunicacion, setCrearComunicacion] = useState(false)
  const [nuevaComunicacion, setNuevaComunicacion] = useState({
    titulo: '',
    mensaje: '',
    tipo: 'general',
    canal: 'todos',
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadComunicaciones()
    }
  }, [user])

  const loadComunicaciones = async () => {
    try {
      setLoading(true)
      const data = await api.comunidad.comunicaciones.list(user?.organizationId || '')
      setComunicaciones(data as any[])
    } catch (error) {
      console.error('Error cargando comunicaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      await api.comunidad.comunicaciones.create({
        organizationId: user.organizationId,
        ...nuevaComunicacion,
        userId: user.id,
      })
      setNuevaComunicacion({ titulo: '', mensaje: '', tipo: 'general', canal: 'todos' })
      setCrearComunicacion(false)
      loadComunicaciones()
    } catch (error: any) {
      alert(error.message || 'Error al crear comunicación')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Comunicaciones" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setCrearComunicacion(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Nueva Comunicación
          </button>
        </div>

        {crearComunicacion && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Comunicación</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={nuevaComunicacion.titulo}
                  onChange={(e) => setNuevaComunicacion({ ...nuevaComunicacion, titulo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea
                  value={nuevaComunicacion.mensaje}
                  onChange={(e) => setNuevaComunicacion({ ...nuevaComunicacion, mensaje: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={nuevaComunicacion.tipo}
                    onChange={(e) => setNuevaComunicacion({ ...nuevaComunicacion, tipo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General</option>
                    <option value="urgente">Urgente</option>
                    <option value="anuncio">Anuncio</option>
                    <option value="recordatorio">Recordatorio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Canal</label>
                  <select
                    value={nuevaComunicacion.canal}
                    onChange={(e) => setNuevaComunicacion({ ...nuevaComunicacion, canal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="todos">Todos</option>
                    <option value="email">Email</option>
                    <option value="push">Push</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearComunicacion(false)
                    setNuevaComunicacion({ titulo: '', mensaje: '', tipo: 'general', canal: 'todos' })
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando comunicaciones...</div>
        ) : comunicaciones.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay comunicaciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comunicaciones.map((com: any) => (
              <div key={com.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{com.titulo}</h3>
                    <p className="text-gray-700 mb-3">{com.mensaje}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="capitalize">{com.tipo}</span>
                      <span>📧 {com.canal}</span>
                      <span>{new Date(com.fechaEnvio).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    com.estado === 'enviada'
                      ? 'bg-green-100 text-green-700'
                      : com.estado === 'programada'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {com.estado}
                  </span>
                </div>
                {com.destinatarios && (
                  <div className="text-sm text-gray-500">
                    Enviada a {com.destinatarios} destinatarios
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
