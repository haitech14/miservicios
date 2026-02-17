import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Socios() {
  const { user } = useAuth()
  const [socios, setSocios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [crearSocio, setCrearSocio] = useState(false)
  const [nuevoSocio, setNuevoSocio] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    codigoSocio: '',
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadSocios()
    }
  }, [user])

  const loadSocios = async () => {
    try {
      setLoading(true)
      const data = await api.comunidad.socios.list(user?.organizationId || '')
      setSocios(data as any[])
    } catch (error) {
      console.error('Error cargando socios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      await api.comunidad.socios.create({
        organizationId: user.organizationId,
        ...nuevoSocio,
        userId: user.id,
      })
      setNuevoSocio({ nombres: '', apellidos: '', email: '', telefono: '', codigoSocio: '' })
      setCrearSocio(false)
      loadSocios()
    } catch (error: any) {
      alert(error.message || 'Error al crear socio')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Socios" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setCrearSocio(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Registrar Socio
          </button>
        </div>

        {crearSocio && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Socio</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                  <input
                    type="text"
                    value={nuevoSocio.nombres}
                    onChange={(e) => setNuevoSocio({ ...nuevoSocio, nombres: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                  <input
                    type="text"
                    value={nuevoSocio.apellidos}
                    onChange={(e) => setNuevoSocio({ ...nuevoSocio, apellidos: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={nuevoSocio.email}
                  onChange={(e) => setNuevoSocio({ ...nuevoSocio, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={nuevoSocio.telefono}
                    onChange={(e) => setNuevoSocio({ ...nuevoSocio, telefono: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código Socio</label>
                  <input
                    type="text"
                    value={nuevoSocio.codigoSocio}
                    onChange={(e) => setNuevoSocio({ ...nuevoSocio, codigoSocio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearSocio(false)
                    setNuevoSocio({ nombres: '', apellidos: '', email: '', telefono: '', codigoSocio: '' })
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
          <div className="text-center py-12 text-gray-500">Cargando socios...</div>
        ) : socios.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay socios registrados</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingreso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {socios.map((socio: any) => (
                    <tr key={socio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {socio.codigoSocio || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {socio.nombres} {socio.apellidos}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {socio.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          socio.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {socio.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(socio.fechaIngreso).toLocaleDateString()}
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
