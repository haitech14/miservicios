import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Cuotas() {
  const { user } = useAuth()
  const [cuotas, setCuotas] = useState<any[]>([])
  const [socios, setSocios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<string>('todas')
  const [crearCuota, setCrearCuota] = useState(false)
  const [nuevaCuota, setNuevaCuota] = useState({
    socioId: '',
    monto: '',
    concepto: '',
    fechaVencimiento: '',
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadData()
    }
  }, [user, filtro])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cuotasData, sociosData] = await Promise.all([
        api.comunidad.cuotas.list(user?.organizationId || '', undefined, filtro === 'todas' ? undefined : filtro),
        api.comunidad.socios.list(user?.organizationId || ''),
      ])
      setCuotas(cuotasData as any[])
      setSocios(sociosData as any[])
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      await api.comunidad.cuotas.create({
        organizationId: user.organizationId,
        ...nuevaCuota,
        monto: parseFloat(nuevaCuota.monto),
      })
      setNuevaCuota({ socioId: '', monto: '', concepto: '', fechaVencimiento: '' })
      setCrearCuota(false)
      loadData()
    } catch (error: any) {
      alert(error.message || 'Error al crear cuota')
    }
  }

  const handlePagar = async (id: string) => {
    if (!confirm('¿Marcar esta cuota como pagada?')) return

    try {
      await api.comunidad.cuotas.pagar(id, 'transferencia')
      loadData()
    } catch (error: any) {
      alert(error.message || 'Error al pagar cuota')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Cuotas" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {['todas', 'pendiente', 'pagada', 'vencida'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltro(estado)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filtro === estado
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCrearCuota(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Crear Cuota
          </button>
        </div>

        {crearCuota && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Cuota</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Socio</label>
                <select
                  value={nuevaCuota.socioId}
                  onChange={(e) => setNuevaCuota({ ...nuevaCuota, socioId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Selecciona un socio</option>
                  {socios.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.nombres} {s.apellidos}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevaCuota.monto}
                    onChange={(e) => setNuevaCuota({ ...nuevaCuota, monto: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Vencimiento</label>
                  <input
                    type="date"
                    value={nuevaCuota.fechaVencimiento}
                    onChange={(e) => setNuevaCuota({ ...nuevaCuota, fechaVencimiento: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Concepto</label>
                <input
                  type="text"
                  value={nuevaCuota.concepto}
                  onChange={(e) => setNuevaCuota({ ...nuevaCuota, concepto: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearCuota(false)
                    setNuevaCuota({ socioId: '', monto: '', concepto: '', fechaVencimiento: '' })
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
          <div className="text-center py-12 text-gray-500">Cargando cuotas...</div>
        ) : cuotas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay cuotas</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Socio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cuotas.map((cuota: any) => (
                    <tr key={cuota.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cuota.socio?.nombres} {cuota.socio?.apellidos}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{cuota.concepto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        S/ {cuota.monto.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(cuota.fechaVencimiento).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          cuota.estado === 'pagada'
                            ? 'bg-green-100 text-green-700'
                            : cuota.estado === 'vencida'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {cuota.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {cuota.estado === 'pendiente' && (
                          <button
                            onClick={() => handlePagar(cuota.id)}
                            className="text-primary hover:underline text-sm"
                          >
                            Marcar pagada
                          </button>
                        )}
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
