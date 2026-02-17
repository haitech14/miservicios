import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { SERVICIOS_POR_CATEGORIA } from '../constants/servicios'
import { useConfiguracion } from '../context/ConfiguracionContext'
import type { ServicioClave } from '../constants/servicios'

const CATEGORIAS_ORDER: { clave: keyof typeof SERVICIOS_POR_CATEGORIA; label: string; icono: string }[] = [
  { clave: 'bienestar', label: 'Bienestar', icono: '💪' },
  { clave: 'desarrollo', label: 'Desarrollo', icono: '📚' },
  { clave: 'comunidad', label: 'Comunidad', icono: '👥' },
  { clave: 'servicios', label: 'Servicios', icono: '📋' },
]

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

export function TopNav() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const { seccionesSistema, isModuloHabilitado } = useConfiguracion()

  const mostrarInicio = seccionesSistema.inicio
  const mostrarNoticias = seccionesSistema.noticias

  const categoriasConItems = useMemo(() => {
    return CATEGORIAS_ORDER.map(({ clave, label, icono }) => {
      const items = SERVICIOS_POR_CATEGORIA[clave].filter((s) => isModuloHabilitado(s.clave))
      return { clave, label, icono, items }
    }).filter((g) => g.items.length > 0)
  }, [isModuloHabilitado])

  const renderItemServicio = (s: { clave: ServicioClave; nombre: string; icono: string; color: string; activo: boolean }, onClose: () => void) => {
    const to = servicioToRoute[s.clave]
    const isLink = to && to !== '#'
    const content = (
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
          isLink ? 'hover:bg-slate-700/50' : 'opacity-50'
        }`}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style={{ backgroundColor: `${s.color}30` }}
        >
          {s.icono}
        </div>
        <span className="text-sm font-medium text-slate-200 truncate">{s.nombre}</span>
        {!s.activo && <span className="text-[10px] text-amber-400">Próximamente</span>}
      </div>
    )
    return isLink ? (
      <NavLink
        key={s.clave}
        to={to}
        onClick={onClose}
        className={({ isActive }) =>
          isActive ? '[&>div]:bg-gradient-to-r [&>div]:from-primary/20 [&>div]:to-indigo-500/20 [&>div]:border-l-primary [&>div]:text-white' : ''
        }
      >
        {content}
      </NavLink>
    ) : (
      <div key={s.clave} className="cursor-not-allowed">{content}</div>
    )
  }

  return (
    <nav className="flex-1 py-3 px-2 space-y-1">
      {mostrarInicio && (
      <NavLink
        to="/inicio"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-base ${
            isActive ? 'bg-gradient-to-r from-primary/20 to-indigo-500/20 text-white font-medium border-l-2 border-primary' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
          }`
        }
      >
        <span className="text-lg">🏠</span>
        <span className="truncate">Inicio</span>
      </NavLink>
      )}

      {/* Secciones principales: Bienestar, Desarrollo, Comunidad, Servicios */}
      {categoriasConItems.map((grupo) => {
        const isOpen = openSection === grupo.clave
        return (
          <div key={grupo.clave}>
            <button
              onClick={() => setOpenSection(isOpen ? null : grupo.clave)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg transition-all text-base text-left ${
                isOpen ? 'bg-slate-700/50 text-white font-medium border-l-2 border-primary' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">{grupo.icono}</span>
                <span className="truncate">{grupo.label}</span>
              </span>
              <svg
                className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-600 space-y-0.5">
                {grupo.clave === 'comunidad' && (
                  <NavLink
                    to="/comunidad"
                    onClick={() => setOpenSection(null)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-primary/20 to-indigo-500/20' : 'hover:bg-slate-700/50'}`
                    }
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 bg-primary/30">
                      🏠
                    </div>
                    <span className="text-sm font-medium text-slate-200 truncate">Portal Comunidad</span>
                  </NavLink>
                )}
                {grupo.items.map((s) => renderItemServicio(s, () => setOpenSection(null)))}
              </div>
            )}
          </div>
        )
      })}

      {mostrarNoticias && (
        <NavLink
          to="/noticias"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-base ${
              isActive ? 'bg-gradient-to-r from-primary/20 to-indigo-500/20 text-white font-medium border-l-2 border-primary' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`
          }
        >
          <span className="text-lg">📰</span>
          <span className="truncate">Noticias</span>
        </NavLink>
      )}
      <NavLink
        to="/configuracion"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-base ${
            isActive ? 'bg-gradient-to-r from-primary/20 to-indigo-500/20 text-white font-medium border-l-2 border-primary' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
          }`
        }
      >
        <span className="text-lg">⚙️</span>
        <span className="truncate">Configuración</span>
      </NavLink>
    </nav>
  )
}
