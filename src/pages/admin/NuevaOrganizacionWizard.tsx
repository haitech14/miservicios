import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VERTICALES } from '../../constants/verticales'
import { getModulosBaseByVertical, getModulosAdicionalesByVertical } from '../../constants/modulos'
import type { VerticalSlug } from '../../types/verticales'
import { api } from '../../services/api'

const PASOS = ['Datos básicos', 'Perfil / Vertical', 'Módulos adicionales', 'Revisar y crear'] as const

export function NuevaOrganizacionWizard() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(0)
  const [slug, setSlug] = useState('')
  const [nombre, setNombre] = useState('')
  const [dominioEmail, setDominioEmail] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#1a365d')
  const [verticalSlug, setVerticalSlug] = useState<VerticalSlug | ''>('')
  const [adicionales, setAdicionales] = useState<string[]>([])
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const vertical = verticalSlug ? VERTICALES.find((v) => v.slug === verticalSlug) : null
  const modulosBase = verticalSlug ? getModulosBaseByVertical(verticalSlug) : []
  const modulosAdicionales = verticalSlug ? getModulosAdicionalesByVertical(verticalSlug) : []

  const toggleAdicional = (clave: string) => {
    setAdicionales((prev) =>
      prev.includes(clave) ? prev.filter((c) => c !== clave) : [...prev, clave]
    )
  }

  const puedeSiguiente = () => {
    if (paso === 0) return nombre.trim() && slug.trim()
    if (paso === 1) return !!verticalSlug
    return true
  }

  const handleSiguiente = () => {
    setError('')
    if (paso < PASOS.length - 1) setPaso((p) => p + 1)
  }

  const handleCrear = async () => {
    setError('')
    setEnviando(true)
    try {
      await api.organizaciones.create({
        slug: slug.trim(),
        nombre: nombre.trim(),
        verticalSlug: verticalSlug as VerticalSlug,
        modulosAdicionales: adicionales,
        dominioEmail: dominioEmail.trim() || undefined,
        primaryColor: primaryColor || undefined,
      })
      navigate('/admin')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear la organización')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Nueva organización</h1>
      <p className="text-gray-600 mb-6">
        Configure la organización según su perfil y los módulos que necesite.
      </p>

      <ul className="flex gap-2 mb-8 overflow-x-auto">
        {PASOS.map((label, i) => (
          <li
            key={label}
            className={`shrink-0 px-3 py-1 rounded text-sm ${
              i === paso ? 'bg-blue-600 text-white' : i < paso ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ul>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Paso 1: Datos básicos */}
      {paso === 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ej. UNMSM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ej. unmsm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dominio de correo (opcional)</label>
            <input
              type="text"
              value={dominioEmail}
              onChange={(e) => setDominioEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ej. unmsm.edu.pe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color principal</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-10 w-full border border-gray-300 rounded"
            />
          </div>
        </div>
      )}

      {/* Paso 2: Perfil / Vertical */}
      {paso === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Elija el perfil que mejor describe a la organización. Esto define los módulos base y los opcionales disponibles.
          </p>
          <div className="grid gap-2">
            {VERTICALES.map((v) => (
              <button
                key={v.slug}
                type="button"
                onClick={() => setVerticalSlug(v.slug)}
                className={`text-left p-4 rounded-lg border-2 transition ${
                  verticalSlug === v.slug
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">{v.nombre}</span>
                <span className="block text-sm text-gray-600 mt-1">{v.descripcion}</span>
                <span className="block text-xs text-gray-500 mt-1">Destinatarios: {v.destinatarios}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Paso 3: Módulos adicionales */}
      {paso === 2 && vertical && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Módulos base incluidos (solo lectura): {modulosBase.map((m) => m.nombre).join(', ')}
          </p>
          <p className="text-sm font-medium text-gray-700">Active los módulos adicionales que desee:</p>
          <div className="grid gap-2">
            {modulosAdicionales.map((m) => (
              <label key={m.clave} className="flex items-center gap-3 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={adicionales.includes(m.clave)}
                  onChange={() => toggleAdicional(m.clave)}
                />
                <span>{m.icono}</span>
                <span>{m.nombre}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Paso 4: Revisar */}
      {paso === 3 && (
        <div className="space-y-4 rounded-lg border border-gray-200 p-4 bg-gray-50">
          <p><strong>Nombre:</strong> {nombre}</p>
          <p><strong>Slug:</strong> {slug}</p>
          <p><strong>Vertical:</strong> {vertical?.nombre}</p>
          <p><strong>Dominio correo:</strong> {dominioEmail || '—'}</p>
          <p><strong>Módulos base:</strong> {modulosBase.length}</p>
          <p><strong>Módulos adicionales elegidos:</strong> {adicionales.length} ({adicionales.join(', ') || 'ninguno'})</p>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => setPaso((p) => Math.max(0, p - 1))}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
        >
          Atrás
        </button>
        {paso < PASOS.length - 1 ? (
          <button
            type="button"
            onClick={handleSiguiente}
            disabled={!puedeSiguiente()}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCrear}
            disabled={enviando}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {enviando ? 'Creando…' : 'Crear organización'}
          </button>
        )}
      </div>
    </div>
  )
}
