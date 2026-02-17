import { NavLink } from 'react-router-dom'
import { SERVICIOS } from '../constants/servicios'
import type { ServicioClave } from '../constants/servicios'

const servicioToRoute: Record<ServicioClave, string> = {
  comedor: '/comedor',
  transporte: '/transporte',
  gimnasio: '/gimnasio',
  biblioteca: '/biblioteca',
  clinica: '/clinica',
  sum: '/sum',
  idiomas: '/idiomas',
  'aula-virtual': '#',
  mapa: '#',
  actividades: '/actividades',
  voluntarios: '/participacion',
  proyectos: '/participacion',
  drive: '/documentos',
  calendario: '/calendario',
}

export function SidebarServices() {
  return (
    <div className="border-t border-slate-700 pt-4 px-2">
      <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Servicios
      </p>
      <nav className="space-y-0.5">
        {SERVICIOS.map((s) => {
          const to = servicioToRoute[s.clave]
          const isLink = to && to !== '#'
          const content = (
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border-l-2 border-transparent ${
                isLink ? 'hover:bg-slate-700/50' : 'opacity-50'
              }`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-md"
                style={{ backgroundColor: `${s.color}30` }}
              >
                {s.icono}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-200 truncate block">
                  {s.nombre}
                </span>
                {!s.activo && (
                  <span className="text-xs text-amber-400">Próximamente</span>
                )}
              </div>
            </div>
          )
          return isLink ? (
            <NavLink
              key={s.clave}
              to={to}
              className={({ isActive }) =>
                isActive ? '[&>div]:bg-gradient-to-r [&>div]:from-primary/20 [&>div]:to-indigo-500/20 [&>div]:border-l-primary [&>div]:text-white [&>div]:shadow-lg' : ''
              }
            >
              {content}
            </NavLink>
          ) : (
            <div key={s.clave} className="cursor-not-allowed">
              {content}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
