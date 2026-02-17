import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'

function DashboardStats({ organizaciones }: { organizaciones: any[] }) {
  const stats = useMemo(() => {
    const total = organizaciones.length
    const porVertical = organizaciones.reduce<Record<string, number>>((acc, org: any) => {
      const v = org.verticalSlug || 'Sin vertical'
      acc[v] = (acc[v] || 0) + 1
      return acc
    }, {})

    const conDominio = organizaciones.filter((o: any) => o.dominioEmail).length

    return {
      total,
      porVertical,
      conDominio,
    }
  }, [organizaciones])

  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Organizaciones totales</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Con dominio configurado</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{stats.conDominio}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Verticales</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Object.entries(stats.porVertical).map(([vertical, count]) => (
            <span
              key={vertical}
              className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
            >
              {vertical}: {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const [organizaciones, setOrganizaciones] = useState<any[]>([])
  const [ranking, setRanking] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadOrganizaciones()
    loadGamificacion()
  }, [])

  const loadOrganizaciones = async () => {
    try {
      setLoading(true)
      const orgs = await api.organizaciones.list()
      setOrganizaciones(orgs as any[])
    } catch (err: any) {
      setError(err.message || 'Error al cargar organizaciones')
    } finally {
      setLoading(false)
    }
  }

  const loadGamificacion = async () => {
    try {
      const top = await api.gamificacion.ranking(undefined, 5).catch(() => [])
      setRanking(top as any[])
    } catch (err) {
      // No bloquear el dashboard si falla la parte analítica
      console.error('Error cargando ranking de gamificación:', err)
    }
  }

  return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Panel de administración</h1>
        <p className="text-gray-600 mb-8">
          Gestión de organizaciones y configuración de HaiCommunity.
        </p>

        {/* Métricas básicas */}
        {!loading && !error && organizaciones.length > 0 && (
          <DashboardStats organizaciones={organizaciones} />
        )}

        {/* Métricas de engagement / gamificación */}
        {ranking.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Top usuarios por puntos</h2>
              <p className="text-sm text-gray-500 mb-4">
                Vista rápida del ranking general de gamificación.
              </p>
              <div className="space-y-2">
                {ranking.map((item: any, index: number) => (
                  <div key={item.userId || index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        #{index + 1}
                      </span>
                      <span className="font-medium text-gray-900">
                        {item.user?.nombres || ''} {item.user?.apellidos || ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{item.puntosTotales} pts</p>
                      {item.nivel && (
                        <p className="text-xs text-gray-500">Nivel {item.nivel}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Resumen de engagement</h2>
              <p className="text-sm text-gray-500 mb-4">
                Basado en los usuarios con puntaje en gamificación.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>Usuarios con puntos registrados</span>
                  <span className="font-semibold text-gray-900">{ranking.length}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Puntos promedio (top {ranking.length})</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(
                      ranking.reduce((acc: number, r: any) => acc + (r.puntosTotales || 0), 0) /
                        ranking.length
                    )}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Nivel máximo alcanzado</span>
                  <span className="font-semibold text-gray-900">
                    {ranking.reduce(
                      (max: number, r: any) => Math.max(max, r.nivel || 0),
                      0
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          <Link
            to="/admin/nueva-organizacion"
            className="block p-6 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-800 font-medium transition-colors"
          >
            + Crear nueva organización
          </Link>

          {loading ? (
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-center text-gray-600">
              Cargando organizaciones...
            </div>
          ) : error ? (
            <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-red-700">
              {error}
            </div>
          ) : organizaciones.length === 0 ? (
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
              <p className="font-medium text-gray-800 mb-2">No hay organizaciones</p>
              <p className="text-sm">Crea una nueva organización para comenzar</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Organizaciones existentes</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {organizaciones.map((org: any) => (
                  <div key={org.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{org.nombre}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Slug: {org.slug}</span>
                          <span>Vertical: {org.verticalSlug}</span>
                          {org.dominioEmail && <span>Dominio: {org.dominioEmail}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/organizacion/${org.slug}/modulos`}
                          className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          Gestionar Módulos
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  )
}
