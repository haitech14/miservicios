import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
const TURNOS_GIMNASIO = [
  { id: 't1', horario: '6:00 - 8:00', disponibles: 15 },
  { id: 't2', horario: '8:00 - 10:00', disponibles: 20 },
  { id: 't3', horario: '10:00 - 12:00', disponibles: 5 },
  { id: 't4', horario: '14:00 - 16:00', disponibles: 18 },
  { id: 't5', horario: '16:00 - 18:00', disponibles: 12 },
]

export function Gimnasio() {
  const navigate = useNavigate()

  const handleReservar = (t: { id: string; horario: string; disponibles: number }) => {
    if (t.disponibles <= 0) return
    navigate(`/ticket?servicio=gimnasio&turno=${t.id}&horario=${encodeURIComponent(t.horario)}&Sede=cu&tipo=Gimnasio&piso=1`)
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Gimnasio Universitario" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="max-w-xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
              🏋️
            </div>
            <div>
              <h2 className="font-bold text-lg">Gimnasio Universitario</h2>
              <p className="text-sm text-gray-500">Separa tu turno por ticket - Ciudad Universitaria</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Turnos disponibles:</p>
            {TURNOS_GIMNASIO.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{t.horario}</p>
                  <p className="text-xs text-gray-500">Quedan {t.disponibles} cupos</p>
                </div>
                <button
                  onClick={() => handleReservar(t)}
                  disabled={t.disponibles <= 0}
                  className={`px-4 py-2 rounded-lg font-medium min-h-[44px] ${
                    t.disponibles > 0
                      ? 'bg-accent-green text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Reservar ticket
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
