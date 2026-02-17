import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Donaciones() {
  const { user } = useAuth()
  const [donaciones, setDonaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [crearDonacion, setCrearDonacion] = useState(false)
  const [nuevaDonacion, setNuevaDonacion] = useState({
    donanteId: '',
    monto: '',
    concepto: '',
    metodoPago: 'transferencia',
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadDonaciones()
    }
  }, [user])

  const loadDonaciones = async () => {
    try {
      setLoading(true)
      const data = await api.comunidad.donaciones.list(user?.organizationId || '')
      setDonaciones(data as any[])
    } catch (error) {
      console.error('Error cargando donaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      await api.comunidad.donaciones.create({
        organizationId: user.organizationId,
        ...nuevaDonacion,
        monto: parseFloat(nuevaDonacion.monto),
        donanteId: nuevaDonacion.donanteId || user.id,
        estado: 'completada',
      })
      setNuevaDonacion({ donanteId: '', monto: '', concepto: '', metodoPago: 'transferencia' })
      setCrearDonacion(false)
      loadDonaciones()
    } catch (error: any) {
      alert(error.message || 'Error al registrar donación')
    }
  }

  const totalDonaciones = donaciones
    .filter((d: any) => d.estado === 'completada')
    .reduce((sum: number, d: any) => sum + (d.monto || 0), 0)

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Donaciones" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-xl shadow-sm p-6 mb-4 text-white">
          <div className="text-sm opacity-90 mb-1">Total Recaudado</div>
          <div className="text-3xl font-bold">S/ {totalDonaciones.toFixed(2)}</div>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setCrearDonacion(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Registrar Donación
          </button>
        </div>

        {crearDonacion && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Donación</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevaDonacion.monto}
                    onChange={(e) => setNuevaDonacion({ ...nuevaDonacion, monto: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                  <select
                    value={nuevaDonacion.metodoPago}
                    onChange={(e) => setNuevaDonacion({ ...nuevaDonacion, metodoPago: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="transferencia">Transferencia</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Concepto</label>
                <input
                  type="text"
                  value={nuevaDonacion.concepto}
                  onChange={(e) => setNuevaDonacion({ ...nuevaDonacion, concepto: e.target.value })}
                  placeholder="Ej: Donación para proyecto X"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearDonacion(false)
                    setNuevaDonacion({ donanteId: '', monto: '', concepto: '', metodoPago: 'transferencia' })
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
          <div className="text-center py-12 text-gray-500">Cargando donaciones...</div>
        ) : donaciones.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay donaciones registradas</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donante</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donaciones.map((don: any) => (
                    <tr key={don.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {don.donante?.nombres || 'Anónimo'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{don.concepto || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        S/ {don.monto.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {don.metodoPago}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(don.fechaDonacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          don.estado === 'completada'
                            ? 'bg-green-100 text-green-700'
                            : don.estado === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {don.estado}
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
