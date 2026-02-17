import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { ServicioContenido } from '../components/ServicioContenido'
import { getServiciosPorOrg } from '../constants/serviciosResolucion'
import { useOrg } from '../context/OrgContext'
import type { ServicioClave } from '../constants/servicios'

export function Servicios() {
  const { modulosActivos } = useOrg()
  const servicios = useMemo(() => getServiciosPorOrg(modulosActivos), [modulosActivos])
  const { state } = useLocation()
  const inicial = (state as { servicio?: ServicioClave })?.servicio
  const [seleccionado, setSeleccionado] = useState<ServicioClave>(
    inicial && servicios.some((s) => s.clave === inicial) ? inicial : servicios[0]?.clave
  )

  useEffect(() => {
    if (inicial && servicios.some((s) => s.clave === inicial)) {
      setSeleccionado(inicial)
    }
  }, [inicial, servicios])
  const servicioActual = servicios.find((s) => s.clave === seleccionado)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-20 md:pb-0">
      <Header title="Catálogo de Servicios" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="flex-1 flex flex-col min-h-0 w-full max-w-[1600px] mx-auto px-4 py-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          {/* Sidebar secundario */}
          <aside className="lg:w-72 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
              {servicios.map((s) => (
                <button
                  key={s.clave}
                  onClick={() => setSeleccionado(s.clave)}
                  className={`flex-shrink-0 lg:w-full min-w-[200px] lg:min-w-0 flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    seleccionado === s.clave
                      ? 'bg-primary/10 border-l-4 border-primary'
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: `${s.color}25` }}
                  >
                    {s.icono}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{s.nombre}</p>
                    <p className="text-xs text-gray-500 truncate">{s.descripcion}</p>
                  </div>
                </button>
              ))}
            </nav>
            <div className="hidden lg:block mt-4 space-y-2">
              <button className="w-full py-3 rounded-xl bg-blue-100 text-primary font-medium text-sm hover:bg-blue-200 transition-colors">
                SUGERENCIAS
              </button>
              <button className="w-full py-3 rounded-xl bg-red-100 text-red-600 font-medium text-sm hover:bg-red-200 transition-colors">
                REPORTAR UN PROBLEMA
              </button>
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col">
            {servicioActual ? (
              <ServicioContenido servicio={servicioActual} />
            ) : (
              <div className="bg-white rounded-xl p-6 text-gray-500">
                No hay servicios configurados para esta organización. Active módulos en el panel de administración.
              </div>
            )}
          </div>
        </div>

        {/* Móvil: botones inferiores */}
        <div className="lg:hidden grid grid-cols-2 gap-2 pt-4">
          <button className="py-3 rounded-xl bg-blue-100 text-primary font-medium min-h-[44px]">
            SUGERENCIAS
          </button>
          <button className="py-3 rounded-xl bg-red-100 text-red-600 font-medium min-h-[44px]">
            REPORTAR UN PROBLEMA
          </button>
        </div>
      </main>
    </div>
  )
}
