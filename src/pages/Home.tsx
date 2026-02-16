import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { HomeSidebar } from '../components/HomeSidebar'
import { SERVICIOS } from '../constants/servicios'
import { getStoredTickets } from '../store/ticketStore'

export function Home() {
  const tickets = getStoredTickets().filter((t) => t.estado === 'activo')
  const today = new Date().toISOString().split('T')[0]
  const ticketsHoy = tickets.filter((t) => t.fecha === today)

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-4 md:max-w-7xl md:px-6 lg:px-8 space-y-6">
        {/* Web: grid de 2 columnas; Móvil: apilado */}
        <div className="md:grid md:grid-cols-3 md:gap-6 md:space-y-0 space-y-6">
          {/* Columna principal */}
          <div className="md:col-span-2 space-y-6">
            {ticketsHoy.length > 0 && (
              <section className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-2">Mis tickets hoy</h2>
                <div className="space-y-2">
                  {ticketsHoy.slice(0, 2).map((t) => (
                    <Link
                      key={t.id}
                      to={`/ticket?v=${t.id}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <span className="font-medium">{t.sedeNombre} - {t.tipoTurno}</span>
                      <span className="text-sm text-gray-500">{t.horario}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">Servicios</h2>
                <Link to="/servicios" className="text-sm text-primary font-medium hover:underline">
                  Ver más
                </Link>
              </div>
              {/* Móvil: carrusel horizontal */}
              <div className="overflow-x-auto pb-2 -mx-4 px-4 flex gap-3 md:hidden">
                {SERVICIOS.filter((s) => s.activo).map((s) => (
                  <Link
                    key={s.clave}
                    to={s.clave === 'comedor' ? '/comedor' : s.clave === 'transporte' ? '/transporte' : s.clave === 'gimnasio' ? '/gimnasio' : '#'}
                    className="flex-shrink-0 w-24 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${s.color}25` }}
                    >
                      {s.icono}
                    </div>
                    <span className="text-xs font-medium text-center">{s.nombre}</span>
                  </Link>
                ))}
              </div>
              {/* Web: grid de iconos */}
              <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-4">
                {SERVICIOS.filter((s) => s.activo).map((s) => (
                  <Link
                    key={s.clave}
                    to={s.clave === 'comedor' ? '/comedor' : s.clave === 'transporte' ? '/transporte' : s.clave === 'gimnasio' ? '/gimnasio' : '#'}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${s.color}25` }}
                    >
                      {s.icono}
                    </div>
                    <span className="text-sm font-medium text-center">{s.nombre}</span>
                  </Link>
                ))}
              </div>
            </section>
            <section>
              <h2 className="font-semibold text-gray-900 mb-3">Noticias</h2>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-video md:aspect-[21/9] bg-gray-200 relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-3 md:p-4">
                    <p className="text-xs text-gray-500">Viernes, 24 de mayo de 2019</p>
                    <p className="font-medium md:text-lg">La historia de San Marcos contada</p>
                  </div>
                </div>
                <div className="flex justify-center gap-1 py-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
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
}
