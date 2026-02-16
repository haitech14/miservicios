import { useState } from 'react'
import { Link } from 'react-router-dom'

export function OlvideContrasena() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.endsWith('@unmsm.edu.pe')) setSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/login" className="p-2 -ml-2 rounded-lg hover:bg-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-xl font-semibold">Olvidé mi contraseña</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {sent ? (
            <p className="text-center text-gray-600">
              Si el correo existe, recibirás instrucciones para restablecer tu contraseña.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="usuario@unmsm.edu.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none focus:border-primary text-base"
                required
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold min-h-[44px]"
              >
                Enviar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
