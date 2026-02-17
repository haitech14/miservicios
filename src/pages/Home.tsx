import { useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { HomeSidebar } from '../components/HomeSidebar'
import { getServiciosPorOrg } from '../constants/serviciosResolucion'
import { useOrg } from '../context/OrgContext'
import { getStoredTickets } from '../store/ticketStore'

const ServicioCard = memo(({ servicio }: { servicio: ReturnType<typeof getServiciosPorOrg>[0] }) => {
  const getRoute = () => {
    const routes: Record<string, string> = {
      comedor: '/comedor',
      transporte: '/transporte',
      gimnasio: '/gimnasio',
      tutorias: '/tutorias',
      actividades: '/actividades',
      biblioteca: '/biblioteca',
      clinica: '/clinica',
      sum: '/sum',
      idiomas: '/idiomas',
      drive: '/documentos',
      calendario: '/calendario',
    }
    return routes[servicio.clave] || '#'
  }

  return (
    <Link
      to={getRoute()}
      className="group flex-shrink-0 w-24 flex flex-col items-center gap-2 touch-target"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl gpu-accelerated transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
        style={{ 
          backgroundColor: `${servicio.color}15`,
          boxShadow: `0 4px 12px ${servicio.color}20`
        }}
      >
        {servicio.icono}
      </div>
      <span className="text-xs font-medium text-center text-gray-700 group-hover:text-primary transition-colors">
        {servicio.nombre}
      </span>
    </Link>
  )
})

ServicioCard.displayName = 'ServicioCard'

export const Home = memo(function Home() {
  const { modulosActivos } = useOrg()
  const servicios = useMemo(() => getServiciosPorOrg(modulosActivos), [modulosActivos])
  const tickets = useMemo(() => getStoredTickets().filter((t) => t.estado === 'activo'), [])
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const ticketsHoy = useMemo(() => tickets.filter((t) => t.fecha === today), [tickets, today])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-6 md:max-w-7xl md:px-6 lg:px-8 space-y-6">
        {/* Web: grid de 2 columnas; Móvil: apilado */}
        <div className="md:grid md:grid-cols-3 md:gap-6 md:space-y-0 space-y-6">
          {/* Columna principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Mis tickets hoy - Card mejorado */}
            {ticketsHoy.length > 0 && (
              <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">🎫</span>
                    </div>
                    <h2 className="font-bold text-lg text-gray-900">Mis tickets hoy</h2>
                  </div>
                  <Link 
                    to="/servicios" 
                    className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    Ver todos
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="space-y-3">
                  {ticketsHoy.slice(0, 2).map((t) => (
                    <Link
                      key={t.id}
                      to={`/ticket?v=${t.id}`}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl hover:from-primary/5 hover:to-primary/10 border border-gray-100 hover:border-primary/20 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-xl">🍽️</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{t.sedeNombre}</p>
                          <p className="text-sm text-gray-500">{t.tipoTurno}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">{t.horario}</p>
                        <p className="text-xs text-gray-400">Hoy</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Servicios - Card mejorado */}
            <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
                    <span className="text-xl text-white">📋</span>
                  </div>
                  <h2 className="font-bold text-lg text-gray-900">Servicios</h2>
                </div>
                <Link 
                  to="/servicios" 
                  className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                >
                  Ver más
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {/* Móvil: carrusel horizontal optimizado */}
              <div className="scroll-x pb-2 -mx-4 px-4 flex gap-3 md:hidden">
                {servicios.map((s) => (
                  <ServicioCard key={s.clave} servicio={s} />
                ))}
              </div>
              
              {/* Web: grid de iconos mejorado */}
              <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {servicios.map((s) => {
                    const getRoute = () => {
                      const routes: Record<string, string> = {
                        comedor: '/comedor',
                        transporte: '/transporte',
                        gimnasio: '/gimnasio',
                        tutorias: '/tutorias',
                        actividades: '/actividades',
                        biblioteca: '/biblioteca',
                        clinica: '/clinica',
                        sum: '/sum',
                        idiomas: '/idiomas',
                        drive: '/documentos',
                        calendario: '/calendario',
                      }
                      return routes[s.clave] || '#'
                    }

                  return (
                    <Link
                      key={s.clave}
                      to={getRoute()}
                      className="group flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ 
                          backgroundColor: `${s.color}15`,
                          boxShadow: `0 4px 16px ${s.color}25`
                        }}
                      >
                        {s.icono}
                      </div>
                      <span className="text-sm font-semibold text-center text-gray-700 group-hover:text-primary transition-colors">
                        {s.nombre}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* Noticias - Card mejorado */}
            <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <span className="text-xl text-white">📰</span>
                  </div>
                  <h2 className="font-bold text-lg text-gray-900">Noticias</h2>
                </div>
                <Link 
                  to="/noticias" 
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Ver todas
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-video md:aspect-[21/9] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200')] bg-cover bg-center opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <p className="text-xs text-white/80 mb-2">Viernes, 24 de mayo de 2024</p>
                    <p className="font-bold text-white text-lg md:text-xl">La historia de San Marcos contada</p>
                    <p className="text-sm text-white/90 mt-1">Descubre los hitos más importantes de nuestra universidad</p>
                  </div>
                </div>
                <div className="flex justify-center gap-1.5 py-3 bg-gray-50">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                </div>
              </div>
            </section>
          </div>
          
          {/* Web: columna lateral */}
          <div className="hidden md:block space-y-6">
            <HomeSidebar />
          </div>
        </div>
        
        {/* Móvil: Calendario, Eventos, Noticias, Recomendaciones */}
        <section className="md:hidden space-y-4">
          <HomeSidebar />
        </section>
      </main>
    </div>
  )
})
