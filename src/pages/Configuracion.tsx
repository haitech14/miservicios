import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { useOrg } from '../context/OrgContext'
import { useConfiguracion } from '../context/ConfiguracionContext'
import { api } from '../services/api'
import { SERVICIOS } from '../constants/servicios'

type TabId = 'organizacion' | 'perfil' | 'modulos' | 'gamificacion' | 'notificaciones' | 'privacidad'

export function Configuracion() {
  const { user, updateUser } = useAuth()
  const { nombre: orgNombre } = useOrg()
  const {
    nombreOrganizacion,
    setNombreOrganizacion,
    toggleModulo,
    isModuloHabilitado,
  } = useConfiguracion()
  const [activeTab, setActiveTab] = useState<TabId>('organizacion')
  const [saving, setSaving] = useState(false)

  // Perfil
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [celular, setCelular] = useState('')
  const [fijo, setFijo] = useState('')

  // Gamificación
  const [premiosDiariosActivos, setPremiosDiariosActivos] = useState(false)
  const [tipoPremio, setTipoPremio] = useState<'ruleta' | 'sorteo'>('ruleta')
  const [premios, setPremios] = useState<any[]>([])

  // Notificaciones
  const [emailActivo, setEmailActivo] = useState(true)
  const [pushActivo, setPushActivo] = useState(true)
  const [tiposNotificacion, setTiposNotificacion] = useState({
    evento: true,
    mensaje: true,
    logro: true,
    sistema: true,
  })

  useEffect(() => {
    if (user) {
      setNombres(user.nombres || '')
      setApellidos(user.apellidos || '')
      loadGamificacion()
      loadNotificaciones()
    }
  }, [user])

  const GAMIFICACION_STORAGE = 'mi-servicios-gamificacion'
  const NOTIFICACIONES_STORAGE = 'mi-servicios-notificaciones'
  const isNetworkError = (e: any) => {
    const msg = String(e?.message || '')
    return !msg || /fetch|network|failed|conexión/i.test(msg)
  }

  const loadGamificacion = async () => {
    if (!user?.organizationId) return
    try {
      const config = await api.configuracion.gamificacion.get(user.organizationId)
      if (config) {
        setPremiosDiariosActivos((config as any).premiosDiariosActivos || false)
        setTipoPremio((config as any).tipoPremio || 'ruleta')
        setPremios((config as any).premios || [])
      }
    } catch (error) {
      try {
        const stored = localStorage.getItem(GAMIFICACION_STORAGE)
        if (stored) {
          const data = JSON.parse(stored)
          setPremiosDiariosActivos(data.premiosDiariosActivos ?? false)
          setTipoPremio(data.tipoPremio || 'ruleta')
          setPremios(Array.isArray(data.premios) ? data.premios : [])
        }
      } catch (_) {}
    }
  }

  const loadNotificaciones = async () => {
    try {
      const prefs = await api.notificaciones.preferencias.get()
      if (prefs) {
        setEmailActivo((prefs as any).emailActivo !== false)
        setPushActivo((prefs as any).pushActivo !== false)
        setTiposNotificacion((prefs as any).tiposNotificacion || tiposNotificacion)
      }
    } catch (error) {
      try {
        const stored = localStorage.getItem(NOTIFICACIONES_STORAGE)
        if (stored) {
          const data = JSON.parse(stored)
          setEmailActivo(data.emailActivo !== false)
          setPushActivo(data.pushActivo !== false)
          if (data.tiposNotificacion && typeof data.tiposNotificacion === 'object') {
            setTiposNotificacion((prev) => ({ ...prev, ...data.tiposNotificacion }))
          }
        }
      } catch (_) {}
    }
  }

  const handleSavePerfil = async () => {
    try {
      setSaving(true)
      try {
        await api.configuracion.actualizarPerfil({
          nombres,
          apellidos,
          celular,
          fijo,
        })
        alert('Perfil actualizado correctamente')
      } catch (apiError: any) {
        if (isNetworkError(apiError) && user) {
          updateUser({ nombres, apellidos, celular, fijo })
          alert('Guardado localmente. El servidor no está disponible; los cambios se sincronizarán cuando se conecte.')
        } else {
          throw apiError
        }
      }
    } catch (error: any) {
      alert(error?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveGamificacion = async () => {
    if (!user?.organizationId) return
    try {
      setSaving(true)
      try {
        await api.configuracion.gamificacion.update({
          organizationId: user.organizationId,
          premiosDiariosActivos,
          tipoPremio,
          premios,
        })
        alert('Configuración de gamificación actualizada')
      } catch (apiError: any) {
        if (isNetworkError(apiError)) {
          localStorage.setItem(GAMIFICACION_STORAGE, JSON.stringify({
            premiosDiariosActivos,
            tipoPremio,
            premios,
          }))
          alert('Guardado localmente. El servidor no está disponible; los cambios se sincronizarán cuando se conecte.')
        } else {
          throw apiError
        }
      }
    } catch (error: any) {
      alert(error?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotificaciones = async () => {
    try {
      setSaving(true)
      try {
        await api.notificaciones.preferencias.update({
          emailActivo,
          pushActivo,
          tiposNotificacion,
        })
        alert('Preferencias de notificaciones actualizadas')
      } catch (apiError: any) {
        if (isNetworkError(apiError)) {
          localStorage.setItem(NOTIFICACIONES_STORAGE, JSON.stringify({
            emailActivo,
            pushActivo,
            tiposNotificacion,
          }))
          alert('Guardado localmente. El servidor no está disponible; los cambios se sincronizarán cuando se conecte.')
        } else {
          throw apiError
        }
      }
    } catch (error: any) {
      alert(error?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Configuración" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-4">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-minimal">
            {(
              [
                { id: 'organizacion' as const, label: 'Organización', icon: '🏢' },
                { id: 'perfil' as const, label: 'Mi perfil', icon: '👤' },
                { id: 'modulos' as const, label: 'Módulos', icon: '📦' },
                { id: 'gamificacion' as const, label: 'Gamificación', icon: '🎮' },
                { id: 'notificaciones' as const, label: 'Notificaciones', icon: '🔔' },
                { id: 'privacidad' as const, label: 'Privacidad', icon: '🔒' },
              ] as const
            ).map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-4 font-semibold text-center whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de tabs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'organizacion' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Organización o Comunidad</h2>
              <p className="text-sm text-gray-600 mb-4">
                Personaliza el nombre que ves en la cabecera del menú lateral. Deja vacío para usar el nombre por defecto.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la organización</label>
                <input
                  type="text"
                  value={nombreOrganizacion ?? ''}
                  onChange={(e) => setNombreOrganizacion(e.target.value)}
                  placeholder={orgNombre || 'Ej: Mi Universidad'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <p className="text-xs text-gray-500">Los cambios se guardan automáticamente.</p>
            </div>
          )}

          {activeTab === 'modulos' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos y Servicios</h2>
              <p className="text-sm text-gray-600 mb-4">
                Activa o desactiva los módulos que aparecen en el menú de Servicios. Los módulos desactivados no se mostrarán en la lista.
              </p>
              <div className="space-y-2">
                {SERVICIOS.map((s) => {
                  const habilitado = isModuloHabilitado(s.clave)
                  return (
                    <label
                      key={s.clave}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        habilitado ? 'border-gray-200 hover:bg-gray-50' : 'border-gray-100 bg-gray-50 opacity-75'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                          style={{ backgroundColor: `${s.color}25` }}
                        >
                          {s.icono}
                        </span>
                        <span className="font-medium text-gray-900">{s.nombre}</span>
                        {!s.activo && <span className="text-xs text-amber-600">Próximamente</span>}
                      </span>
                      <input
                        type="checkbox"
                        checked={habilitado}
                        onChange={() => toggleModulo(s.clave)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="space-y-4">
              <Link
                to="/perfil"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 mb-4"
              >
                Ver mi perfil
              </Link>
              <hr className="my-6" />
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información Personal</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                <input
                  type="text"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                <input
                  type="text"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Celular</label>
                <input
                  type="tel"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Fijo</label>
                <input
                  type="tel"
                  value={fijo}
                  onChange={(e) => setFijo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={handleSavePerfil}
                disabled={saving}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}

          {activeTab === 'gamificacion' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Configuración de Gamificación</h2>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={premiosDiariosActivos}
                    onChange={(e) => setPremiosDiariosActivos(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="font-medium text-gray-900">Activar premios diarios</span>
                </label>
              </div>
              {premiosDiariosActivos && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de premio</label>
                    <select
                      value={tipoPremio}
                      onChange={(e) => setTipoPremio(e.target.value as 'ruleta' | 'sorteo')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="ruleta">Ruleta</option>
                      <option value="sorteo">Sorteo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Premios disponibles</label>
                    <p className="text-sm text-gray-500 mb-2">
                      Configura los premios desde el panel de administración de {orgNombre}
                    </p>
                  </div>
                </>
              )}
              <button
                onClick={handleSaveGamificacion}
                disabled={saving}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Preferencias de Notificaciones</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium text-gray-900">Notificaciones por Email</span>
                  <input
                    type="checkbox"
                    checked={emailActivo}
                    onChange={(e) => setEmailActivo(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium text-gray-900">Notificaciones Push</span>
                  <input
                    type="checkbox"
                    checked={pushActivo}
                    onChange={(e) => setPushActivo(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tipos de notificaciones</h3>
                <div className="space-y-2">
                  {Object.entries(tiposNotificacion).map(([tipo, activo]) => (
                    <label key={tipo} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-700 capitalize">{tipo}</span>
                      <input
                        type="checkbox"
                        checked={activo}
                        onChange={(e) =>
                          setTiposNotificacion({ ...tiposNotificacion, [tipo]: e.target.checked })
                        }
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSaveNotificaciones}
                disabled={saving}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}

          {activeTab === 'privacidad' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Privacidad</h2>
              <p className="text-gray-600">
                Las opciones de privacidad estarán disponibles próximamente.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
