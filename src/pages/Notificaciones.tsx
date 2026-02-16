import { useState } from 'react'
import { Header } from '../components/Header'
const NOTIF_OPTIONS = [
  { id: 'general', label: 'General' },
  { id: 'noticias', label: 'Noticias' },
  { id: 'amigos', label: 'Amigos' },
  { id: 'social', label: 'Social' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'servicios', label: 'Servicios' },
]

export function Notificaciones() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_OPTIONS.map((o) => [o.id, true]))
  )

  const toggle = (id: string) => setToggles((t) => ({ ...t, [id]: !t[id] }))

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Notificaciones" showBack showLogo={false} />
      <main className="max-w-xl mx-auto px-4 py-4 space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {NOTIF_OPTIONS.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <span>{o.label}</span>
              <button
                onClick={() => toggle(o.id)}
                className={`w-12 h-7 rounded-full transition-colors ${
                  toggles[o.id] ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    toggles[o.id] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mx-auto mb-2">
            💬
          </div>
          <h3 className="font-semibold">Ayúdanos a mejorar</h3>
          <p className="text-sm text-gray-500 mt-1">
            Cuéntanos qué te ha gustado y cómo podemos ofrecerte la mejor experiencia de estudio
          </p>
          <button className="mt-4 w-full py-3 rounded-xl bg-primary text-white font-medium min-h-[44px]">
            ESCRIBIR COMENTARIO
          </button>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm font-medium mb-3">Conoce más de Mi UNMSM</p>
          <div className="flex gap-4 justify-center">
            <a href="#" className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              f
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white">
              🌐
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white">
              ▶
            </a>
          </div>
        </div>
        <button className="w-full py-3 rounded-xl bg-accent-red text-white font-medium min-h-[44px]">
          Eliminar Cuenta
        </button>
      </main>
    </div>
  )
}
