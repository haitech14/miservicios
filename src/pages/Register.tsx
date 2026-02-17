import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { validateEmail, validatePassword, validateSlug, debounce } from '../lib/optimizaciones'

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

type Step = 'datos' | 'comunidad' | 'crear' | 'unirse'

export function Register() {
  const [step, setStep] = useState<Step>('datos')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [dni, setDni] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [slugError, setSlugError] = useState('')

  // Datos de comunidad
  const [comunidadNombre, setComunidadNombre] = useState('')
  const [comunidadSlug, setComunidadSlug] = useState('')
  const [verticalSlug, setVerticalSlug] = useState('HaiCommunity')
  const [modulosAdicionales, setModulosAdicionales] = useState<string[]>([])
  const [comunidades, setComunidades] = useState<any[]>([])
  const [busquedaComunidad, setBusquedaComunidad] = useState('')
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState<string | null>(null)

  const { register } = useAuth()
  const navigate = useNavigate()

  // Validación en tiempo real de email
  const validateEmailDebounced = debounce((emailValue: string) => {
    if (emailValue && !validateEmail(emailValue)) {
      setEmailError('Email inválido')
    } else {
      setEmailError('')
    }
  }, 500)

  // Validación en tiempo real de contraseña
  const validatePasswordDebounced = debounce((passwordValue: string) => {
    if (passwordValue) {
      const validation = validatePassword(passwordValue)
      if (!validation.valid) {
        setPasswordError(validation.message || '')
      } else {
        setPasswordError('')
      }
    } else {
      setPasswordError('')
    }
  }, 500)

  // Validación en tiempo real de slug
  const validateSlugDebounced = debounce((slugValue: string) => {
    if (slugValue) {
      const validation = validateSlug(slugValue)
      if (!validation.valid) {
        setSlugError(validation.message || '')
      } else {
        setSlugError('')
      }
    } else {
      setSlugError('')
    }
  }, 500)

  // Cargar verticales y comunidades públicas
  useEffect(() => {
    if (step === 'unirse') {
      api.organizaciones.publicas().then(setComunidades).catch(console.error)
    }
  }, [step])

  useEffect(() => {
    if (email) {
      validateEmailDebounced(email)
    }
  }, [email])

  useEffect(() => {
    if (password) {
      validatePasswordDebounced(password)
    }
  }, [password])

  useEffect(() => {
    if (comunidadSlug) {
      validateSlugDebounced(comunidadSlug)
    }
  }, [comunidadSlug])

  // Cargar módulos adicionales disponibles
  useEffect(() => {
    if (step === 'crear' && verticalSlug) {
      api.verticales.modulos(verticalSlug).then((data) => {
        // Los módulos adicionales se pueden seleccionar después
      }).catch(console.error)
    }
  }, [step, verticalSlug])

  const handleDatosSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones')
      return
    }
    setStep('comunidad')
  }

  const handleComunidadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let organizationId: string | undefined
      let createOrganization: any | undefined

      if (step === 'crear') {
        if (!comunidadNombre || !comunidadSlug) {
          setError('Completa todos los campos de la comunidad')
          setLoading(false)
          return
        }
        createOrganization = {
          nombre: comunidadNombre,
          slug: comunidadSlug,
          verticalSlug,
          modulosAdicionales,
        }
      } else if (step === 'unirse') {
        if (!comunidadSeleccionada) {
          setError('Selecciona una comunidad')
          setLoading(false)
          return
        }
        organizationId = comunidadSeleccionada
      }

      const ok = await register(
        email,
        password,
        nombres,
        apellidos,
        dni,
        organizationId,
        createOrganization
      )

      if (ok) {
        navigate('/inicio')
      } else {
        setError('Error al registrar. Intenta nuevamente.')
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  const comunidadesFiltradas = comunidades.filter((c: any) =>
    c.nombre.toLowerCase().includes(busquedaComunidad.toLowerCase()) ||
    c.slug.toLowerCase().includes(busquedaComunidad.toLowerCase())
  )

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo: visual + CTA login */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(26,54,93,0.95) 0%, rgba(44,82,130,0.92) 50%, rgba(79,70,229,0.95) 100%)',
          }}
        />
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-8">
          <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/20">
              HC
            </div>
            <span className="font-bold text-lg">HaiCommunity</span>
          </Link>
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            ¿Ya tienes una cuenta?
          </h2>
          <p className="text-white/90 text-center mb-8 max-w-sm">
            Inicia sesión para acceder a todos los servicios de tu organización.
          </p>
          <Link
            to="/login"
            className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/80 transition-all backdrop-blur-sm shadow-lg"
          >
            INICIA SESIÓN
          </Link>
        </div>
      </div>

      {/* Panel derecho: formulario de registro */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-white">
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-primary text-sm font-medium mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Regresar
          </Link>

          <div className="max-w-md">
            {/* Indicador de pasos */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`flex-1 h-1 rounded ${step === 'datos' ? 'bg-primary' : 'bg-primary'}`} />
              <div className={`flex-1 h-1 rounded ${step === 'comunidad' || step === 'crear' || step === 'unirse' ? 'bg-primary' : 'bg-slate-200'}`} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-8">
              {step === 'datos' && 'Registro'}
              {step === 'comunidad' && 'Elige tu opción'}
              {step === 'crear' && 'Crear Comunidad'}
              {step === 'unirse' && 'Unirse a Comunidad'}
            </h1>

            {/* Paso 1: Datos personales */}
            {step === 'datos' && (
              <form onSubmit={handleDatosSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    emailError ? 'border-red-300' : 'border-slate-200 focus:border-primary'
                  }`}
                  required
                />
                {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                </div>
                <div>
                  <label htmlFor="nombres" className="block text-sm font-medium text-slate-700 mb-2">
                    Nombres
                  </label>
                  <input
                    id="nombres"
                    type="text"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="apellidos" className="block text-sm font-medium text-slate-700 mb-2">
                    Apellidos
                  </label>
                  <input
                    id="apellidos"
                    type="text"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="dni" className="block text-sm font-medium text-slate-700 mb-2">
                    DNI (opcional)
                  </label>
                  <input
                    id="dni"
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="mínimo 6 caracteres"
                      value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      passwordError ? 'border-red-300' : 'border-slate-200 focus:border-primary'
                    }`}
                    required
                  />
                  {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    >
                      <EyeIcon show={!showPassword} />
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Repetir contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    >
                      <EyeIcon show={!showConfirmPassword} />
                    </button>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-600">Aceptar términos y condiciones</span>
                </label>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                  CONTINUAR
                </button>
              </form>
            )}

            {/* Paso 2: Opciones de comunidad */}
            {step === 'comunidad' && (
              <div className="space-y-4">
                <p className="text-slate-600 mb-6">
                  ¿Quieres crear una nueva comunidad u unirte a una existente?
                </p>
                <button
                  onClick={() => setStep('crear')}
                  className="w-full p-6 border-2 border-primary rounded-xl hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="font-semibold text-slate-900 mb-2">Crear nueva comunidad</div>
                  <div className="text-sm text-slate-600">Crea una nueva organización o comunidad</div>
                </button>
                <button
                  onClick={() => setStep('unirse')}
                  className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="font-semibold text-slate-900 mb-2">Unirse a comunidad existente</div>
                  <div className="text-sm text-slate-600">Únete a una comunidad ya registrada</div>
                </button>
                <button
                  onClick={() => setStep('datos')}
                  className="text-sm text-slate-600 hover:text-primary"
                >
                  ← Volver
                </button>
              </div>
            )}

            {/* Paso 3a: Crear comunidad */}
            {step === 'crear' && (
              <form onSubmit={handleComunidadSubmit} className="space-y-5">
                <div>
                  <label htmlFor="comunidadNombre" className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre de la Comunidad
                  </label>
                  <input
                    id="comunidadNombre"
                    type="text"
                    value={comunidadNombre}
                    onChange={(e) => setComunidadNombre(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="comunidadSlug" className="block text-sm font-medium text-slate-700 mb-2">
                    Slug (URL amigable)
                  </label>
                  <input
                    id="comunidadSlug"
                    type="text"
                    value={comunidadSlug}
                    onChange={(e) => setComunidadSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="mi-comunidad"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      slugError ? 'border-red-300' : 'border-slate-200 focus:border-primary'
                    }`}
                    required
                  />
                  {slugError ? (
                    <p className="text-xs text-red-500 mt-1">{slugError}</p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">Solo letras, números y guiones</p>
                  )}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('comunidad')}
                    className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
                  >
                    VOLVER
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                  </button>
                </div>
              </form>
            )}

            {/* Paso 3b: Unirse a comunidad */}
            {step === 'unirse' && (
              <form onSubmit={handleComunidadSubmit} className="space-y-5">
                <div>
                  <label htmlFor="busqueda" className="block text-sm font-medium text-slate-700 mb-2">
                    Buscar Comunidad
                  </label>
                  <input
                    id="busqueda"
                    type="text"
                    value={busquedaComunidad}
                    onChange={(e) => setBusquedaComunidad(e.target.value)}
                    placeholder="Buscar por nombre..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {comunidadesFiltradas.map((comunidad: any) => (
                    <button
                      key={comunidad.id}
                      type="button"
                      onClick={() => setComunidadSeleccionada(comunidad.id)}
                      className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                        comunidadSeleccionada === comunidad.id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{comunidad.nombre}</div>
                      <div className="text-sm text-slate-600">{comunidad.slug}</div>
                    </button>
                  ))}
                  {comunidadesFiltradas.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">No se encontraron comunidades</p>
                  )}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('comunidad')}
                    className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
                  >
                    VOLVER
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !comunidadSeleccionada}
                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
