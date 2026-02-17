import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useOrg } from '../context/OrgContext'
import { useConfiguracion } from '../context/ConfiguracionContext'
import { api } from '../services/api'

export function SidebarHeader() {
  const { nombre, slug, setOrganization, primaryColor } = useOrg()
  const { getNombreOrgDisplay } = useConfiguracion()
  const nombreDisplay = getNombreOrgDisplay(nombre || 'Mi Servicios')
  const [open, setOpen] = useState(false)
  const [comunidades, setComunidades] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setLoading(true)
      api.organizaciones.publicas()
        .then((data) => setComunidades((data as any[]) || []))
        .catch(() => {
          // Fallback: incluir org actual cuando el backend no responde
          if (nombre && slug) {
            setComunidades([{ id: slug, nombre, slug, primaryColor }])
          } else {
            setComunidades([])
          }
        })
        .finally(() => setLoading(false))
    }
  }, [open, nombre, slug, primaryColor])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  const filtradas = busqueda.trim()
    ? comunidades.filter(
        (c: any) =>
          (c.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
          (c.slug || '').toLowerCase().includes(busqueda.toLowerCase())
      )
    : comunidades

  const seleccionarComunidad = (org: any) => {
    setOrganization({
      id: org.id,
      nombre: org.nombre,
      slug: org.slug,
      logoUrl: org.logoUrl,
      portadaUrl: org.portadaUrl,
      primaryColor: org.primaryColor,
      secondaryColor: org.secondaryColor,
      verticalSlug: org.verticalSlug,
    })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-3 py-4 border-b border-slate-700 w-full text-left hover:bg-slate-800/50 transition-colors"
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0"
          style={{ background: primaryColor ? `linear-gradient(135deg, ${primaryColor}, #6366f1)` : undefined }}
        >
          {nombre?.slice(0, 2).toUpperCase() || 'MI'}
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-bold text-white text-base block truncate">{nombreDisplay}</span>
          <p className="text-xs text-slate-400 truncate">Mi Servicios</p>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-0 left-full ml-2 mt-0 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden w-72">
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar comunidad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
          </div>
          <div className="py-1">
            <Link
              to="/registro"
              className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-amber-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <span className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-500 text-xs">+</span>
              <span className="font-medium text-sm">Crear comunidad</span>
            </Link>
            <Link
              to="/registro"
              state={{ step: 'comunidad' }}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-amber-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V8m0 4h-5" />
              </svg>
              <span className="font-medium text-sm">Descubrir comunidades</span>
            </Link>
          </div>
          <div className="border-t border-slate-100 max-h-64 overflow-y-auto scrollbar-minimal">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">Cargando...</div>
            ) : filtradas.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">No hay comunidades</div>
            ) : (
              filtradas.map((org: any) => (
                <button
                  key={org.id}
                  onClick={() => seleccionarComunidad(org)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    org.slug === slug ? 'bg-amber-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: org.primaryColor || '#4f46e5' }}
                  >
                    {(org.nombre || 'MI').slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium text-sm text-slate-800 truncate">{org.nombre || org.slug || 'Comunidad'}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
