import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
export function GestionModulos() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [organizacion, setOrganizacion] = useState<any>(null)
  const [modulosBase, setModulosBase] = useState<string[]>([])
  const [modulosAdicionales, setModulosAdicionales] = useState<string[]>([])
  const [modulosDisponibles, setModulosDisponibles] = useState<any[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (slug) {
      loadData()
    }
  }, [slug])

  const loadData = async () => {
    try {
      setLoading(true)
      const org = await api.organizaciones.get(slug!)
      const modulosData = await api.verticales.modulos((org as any)?.verticalSlug || 'HaiCommunity')

      setOrganizacion(org)
      setModulosAdicionales((org as any).modulosActivos?.filter((m: string) => !modulosBase.includes(m)) || [])

      if (modulosData) {
        setModulosBase(modulosData.base.map((m: any) => m.clave))
        setModulosDisponibles(modulosData.adicionales)
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const toggleModulo = (clave: string) => {
    if (modulosAdicionales.includes(clave)) {
      setModulosAdicionales(modulosAdicionales.filter((m) => m !== clave))
    } else {
      setModulosAdicionales([...modulosAdicionales, clave])
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      await api.organizaciones.updateModulos(slug!, modulosAdicionales)

      setSuccess('Módulos actualizados correctamente')
      setTimeout(() => {
        navigate('/admin')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
        <div className="text-center py-12">Cargando...</div>
    )
  }

  return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestión de Módulos - {organizacion?.nombre}
          </h1>
          <p className="text-gray-600">
            Activa o desactiva módulos adicionales para esta organización
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Módulos base (no editables) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Módulos Base</h2>
          <p className="text-sm text-gray-500 mb-4">
            Estos módulos son obligatorios y no se pueden desactivar
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {modulosBase.map((clave) => {
              const modulo = modulosDisponibles.find((m) => m.clave === clave) || { clave, nombre: clave }
              return (
                <div
                  key={clave}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2"
                >
                  <span className="text-xl">{modulo.icono || '📦'}</span>
                  <span className="text-sm font-medium text-gray-700">{modulo.nombre}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Módulos adicionales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Módulos Adicionales</h2>
          <p className="text-sm text-gray-500 mb-4">
            Selecciona los módulos adicionales que deseas activar
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {modulosDisponibles.map((modulo) => {
              const activo = modulosAdicionales.includes(modulo.clave)
              return (
                <button
                  key={modulo.clave}
                  onClick={() => toggleModulo(modulo.clave)}
                  className={`p-3 border-2 rounded-lg flex items-center gap-2 transition-colors text-left ${
                    activo
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-xl">{modulo.icono || '📦'}</span>
                  <span className="text-sm font-medium text-gray-700 flex-1">{modulo.nombre}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
  )
}
