import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { SERVICIOS } from '../constants/servicios'
import type { ServicioClave } from '../constants/servicios'

const servicioToRoute: Partial<Record<ServicioClave, string>> = {
  comedor: '/comedor',
  transporte: '/transporte',
  gimnasio: '/gimnasio',
  biblioteca: '/biblioteca',
  clinica: '/clinica',
  sum: '/sum',
  idiomas: '/idiomas',
  'aula-virtual': '#',
  mapa: '#',
  tutorias: '/tutorias',
  actividades: '/actividades',
  voluntarios: '/participacion',
  proyectos: '/participacion',
  drive: '/documentos',
  calendario: '/calendario',
  marketplace: '/marketplace',
}

export function SidebarServices() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-slate-700 pt-3 px-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-700/50 transition-colors"
      >
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Servicios
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <nav className="space-y-1 mt-2 pl-2 border-l border-slate-600/50 ml-4">
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
                className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: `${s.color}30` }}
                >
                  {s.icono}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-200 truncate block">
                    {s.nombre}
                  </span>
                  {!s.activo && (
                    <span className="text-[10px] text-amber-400">Próximamente</span>
                  )}
                </div>
              </div>
            )
            return isLink ? (
              <NavLink
                key={s.clave}
                to={to}
                onClick={() => setOpen(false)}
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
      )}
    </div>
  )
}
