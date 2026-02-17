import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const ok = await login(email, password)
    if (ok) navigate('/inicio')
    else setError('Usuario o contraseña incorrectos')
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo: visual + CTA registro */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen overflow-hidden">
        {/* Fondo corporativo con imagen */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80')",
          }}
        />
        {/* Overlay con gradiente corporativo */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(26,54,93,0.95) 0%, rgba(44,82,130,0.92) 50%, rgba(79,70,229,0.95) 100%)',
          }}
        />
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-8">
          <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/20">
              MI
            </div>
            <span className="font-bold text-lg">Servicios</span>
          </Link>
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            ¿No tienes una cuenta?
          </h2>
          <p className="text-white/90 text-center mb-8 max-w-sm">
            Crea tu cuenta y accede a todos los servicios de tu organización en un solo lugar.
          </p>
          <Link
            to="/registro"
            className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/80 transition-all backdrop-blur-sm shadow-lg"
          >
            CREA UNA CUENTA AHORA
          </Link>
        </div>
      </div>

      {/* Panel derecho: formulario de login */}
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
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Iniciar Sesión</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoComplete="email"
                  required
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200/50 rounded-lg transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <EyeIcon show={!showPassword} />
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                INGRESA
              </button>
              <Link
                to="/olvide-contrasena"
                className="block text-center text-sm text-slate-500 hover:text-primary"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <p className="text-center text-sm text-slate-600">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="font-medium text-primary hover:underline">
                  Regístrate
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="px-6 sm:px-12 lg:px-16 py-4">
          <Link
            to="/olvide-contrasena"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ¿Necesitas ayuda?
          </Link>
        </div>
      </div>
    </div>
  )
}
