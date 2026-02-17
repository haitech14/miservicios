import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { useOrg } from '../context/OrgContext'
import { api } from '../services/api'

export function Comunidad() {
  const { user } = useAuth()
  const { nombre: orgNombre } = useOrg()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    socios: 0,
    cuotasPendientes: 0,
    eventosProximos: 0,
    voluntarios: 0,
    donaciones: 0,
    proyectos: 0,
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    try {
      setLoading(true)
      const orgId = user?.organizationId

      // Cargar estadísticas en paralelo
      const [socios, cuotas, eventos, voluntarios, donaciones, proyectos] = await Promise.all([
        api.comunidad.socios.list(orgId || '').catch(() => []),
        api.comunidad.cuotas.list(orgId || '', undefined, 'pendiente').catch(() => []),
        api.comunidad.eventos.list(orgId || '', 'programado').catch(() => []),
        api.comunidad.voluntarios.list(orgId || '').catch(() => []),
        api.comunidad.donaciones.list(orgId || '').catch(() => []),
        api.comunidad.proyectos.list(orgId || '').catch(() => []),
      ])

      // Filtrar eventos próximos (próximos 30 días)
      const ahora = new Date()
      const en30Dias = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000)
      const eventosProximos = (eventos as any[]).filter((e: any) => {
        const fechaInicio = new Date(e.fechaInicio)
        return fechaInicio >= ahora && fechaInicio <= en30Dias
      })

      setStats({
        socios: (socios as any[]).length,
        cuotasPendientes: (cuotas as any[]).length,
        eventosProximos: eventosProximos.length,
        voluntarios: (voluntarios as any[]).length,
        donaciones: (donaciones as any[]).length,
        proyectos: (proyectos as any[]).length,
      })
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const modulos = [
    {
      clave: 'socios',
      nombre: 'Socios',
      icono: '👥',
      ruta: '/comunidad/socios',
      color: 'bg-blue-500',
      estadistica: stats.socios,
    },
    {
      clave: 'cuotas',
      nombre: 'Cuotas',
      icono: '💰',
      ruta: '/comunidad/cuotas',
      color: 'bg-green-500',
      estadistica: stats.cuotasPendientes,
    },
    {
      clave: 'eventos',
      nombre: 'Eventos',
      icono: '📅',
      ruta: '/comunidad/eventos',
      color: 'bg-purple-500',
      estadistica: stats.eventosProximos,
    },
    {
      clave: 'comunicaciones',
      nombre: 'Comunicaciones',
      icono: '📢',
      ruta: '/comunidad/comunicaciones',
      color: 'bg-orange-500',
    },
    {
      clave: 'voluntarios',
      nombre: 'Voluntarios',
      icono: '🤝',
      ruta: '/comunidad/voluntarios',
      color: 'bg-pink-500',
      estadistica: stats.voluntarios,
    },
    {
      clave: 'donaciones',
      nombre: 'Donaciones',
      icono: '💝',
      ruta: '/comunidad/donaciones',
      color: 'bg-red-500',
      estadistica: stats.donaciones,
    },
    {
      clave: 'proyectos',
      nombre: 'Proyectos',
      icono: '🏗️',
      ruta: '/comunidad/proyectos',
      color: 'bg-indigo-500',
      estadistica: stats.proyectos,
    },
    {
      clave: 'votaciones',
      nombre: 'Votaciones',
      icono: '🗳️',
      ruta: '/comunidad/votaciones',
      color: 'bg-yellow-500',
    },
    {
      clave: 'encuestas',
      nombre: 'Encuestas',
      icono: '📊',
      ruta: '/comunidad/encuestas',
      color: 'bg-teal-500',
    },
    {
      clave: 'grupos',
      nombre: 'Grupos',
      icono: '👥',
      ruta: '/comunidad/grupos',
      color: 'bg-cyan-500',
    },
    {
      clave: 'debates',
      nombre: 'Debates',
      icono: '💬',
      ruta: '/comunidad/debates',
      color: 'bg-violet-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Comunidad" showBack showLogo={false} />
      <main className="max-w-xl mx-auto px-4 py-4">
        {/* Resumen */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Resumen de {orgNombre}</h2>
          {loading ? (
            <div className="text-center py-8 text-slate-500">Cargando...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.socios}</div>
                <div className="text-sm text-slate-600">Socios activos</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{stats.cuotasPendientes}</div>
                <div className="text-sm text-slate-600">Cuotas pendientes</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.eventosProximos}</div>
                <div className="text-sm text-slate-600">Eventos próximos</div>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-600">{stats.voluntarios}</div>
                <div className="text-sm text-slate-600">Voluntarios</div>
              </div>
            </div>
          )}
        </div>

        {/* Módulos */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Módulos</h2>
          <div className="grid grid-cols-2 gap-3">
            {modulos.map((modulo) => (
              <Link
                key={modulo.clave}
                to={modulo.ruta}
                className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg ${modulo.color} flex items-center justify-center text-2xl`}>
                  {modulo.icono}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{modulo.nombre}</div>
                  {modulo.estadistica !== undefined && (
                    <div className="text-sm text-slate-500">{modulo.estadistica} registros</div>
                  )}
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
