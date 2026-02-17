import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Voluntarios() {
  const { user } = useAuth()
  const [voluntarios, setVoluntarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [crearVoluntario, setCrearVoluntario] = useState(false)
  const [nuevoVoluntario, setNuevoVoluntario] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    areaVoluntariado: '',
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadVoluntarios()
    }
  }, [user])

  const loadVoluntarios = async () => {
    try {
      setLoading(true)
      const data = await api.comunidad.voluntarios.list(user?.organizationId || '')
      setVoluntarios(data as any[])
    } catch (error) {
      console.error('Error cargando voluntarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      await api.comunidad.voluntarios.create({
        organizationId: user.organizationId,
        ...nuevoVoluntario,
        userId: user.id,
      })
      setNuevoVoluntario({ nombres: '', apellidos: '', email: '', telefono: '', areaVoluntariado: '' })
      setCrearVoluntario(false)
      loadVoluntarios()
    } catch (error: any) {
      alert(error.message || 'Error al registrar voluntario')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Voluntarios" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setCrearVoluntario(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Registrar Voluntario
          </button>
        </div>

        {crearVoluntario && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Voluntario</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                  <input
                    type="text"
                    value={nuevoVoluntario.nombres}
                    onChange={(e) => setNuevoVoluntario({ ...nuevoVoluntario, nombres: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                  <input
                    type="text"
                    value={nuevoVoluntario.apellidos}
                    onChange={(e) => setNuevoVoluntario({ ...nuevoVoluntario, apellidos: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={nuevoVoluntario.email}
                    onChange={(e) => setNuevoVoluntario({ ...nuevoVoluntario, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={nuevoVoluntario.telefono}
                    onChange={(e) => setNuevoVoluntario({ ...nuevoVoluntario, telefono: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Área de Voluntariado</label>
                <input
                  type="text"
                  value={nuevoVoluntario.areaVoluntariado}
                  onChange={(e) => setNuevoVoluntario({ ...nuevoVoluntario, areaVoluntariado: e.target.value })}
                  placeholder="Ej: Educación, Salud, Medio Ambiente"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearVoluntario(false)
                    setNuevoVoluntario({ nombres: '', apellidos: '', email: '', telefono: '', areaVoluntariado: '' })
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando voluntarios...</div>
        ) : voluntarios.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay voluntarios registrados</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {voluntarios.map((vol: any) => (
                    <tr key={vol.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vol.nombres} {vol.apellidos}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vol.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vol.areaVoluntariado || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vol.horasAcumuladas || 0} horas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          vol.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {vol.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
