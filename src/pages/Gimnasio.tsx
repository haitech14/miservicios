import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'

const TURNOS_GIMNASIO = [
  { id: 't1', horario: '6:00 - 8:00', disponibles: 15, total: 30, popular: false },
  { id: 't2', horario: '8:00 - 10:00', disponibles: 20, total: 30, popular: true },
  { id: 't3', horario: '10:00 - 12:00', disponibles: 5, total: 30, popular: false },
  { id: 't4', horario: '14:00 - 16:00', disponibles: 18, total: 30, popular: true },
  { id: 't5', horario: '16:00 - 18:00', disponibles: 12, total: 30, popular: false },
  { id: 't6', horario: '18:00 - 20:00', disponibles: 8, total: 30, popular: false },
]

export function Gimnasio() {
  const navigate = useNavigate()
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<string | null>(null)

  const handleReservar = (t: typeof TURNOS_GIMNASIO[0]) => {
    if (t.disponibles <= 0) return
    navigate(`/ticket?servicio=gimnasio&turno=${t.id}&horario=${encodeURIComponent(t.horario)}&Sede=cu&tipo=Gimnasio&piso=1`)
  }

  const getDisponibilidadColor = (disponibles: number, total: number) => {
    const porcentaje = (disponibles / total) * 100
    if (porcentaje > 50) return 'text-green-600 bg-green-50'
    if (porcentaje > 20) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Header title="Gimnasio Universitario" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="max-w-xl mx-auto md:max-w-4xl px-4 py-6 md:py-8 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-orange-500 via-red-600 to-amber-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                🏋️
              </div>
              <div>
                <h1 className="font-bold text-2xl md:text-3xl mb-1">Gimnasio Universitario</h1>
                <p className="text-white/90 text-sm md:text-base">Reserva tu turno para entrenar - Ciudad Universitaria</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                💪 Equipamiento completo
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                ⏰ 6 Turnos diarios
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                ✅ Reserva rápida
              </div>
            </div>
          </div>
        </div>

        {/* Turnos Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {TURNOS_GIMNASIO.map((turno) => {
            const porcentaje = (turno.disponibles / turno.total) * 100
            const disponible = turno.disponibles > 0

            return (
              <div
                key={turno.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 ${
                  turnoSeleccionado === turno.id
                    ? 'border-orange-500 shadow-lg'
                    : disponible
                      ? 'border-gray-100 hover:border-orange-200 hover:shadow-lg hover:-translate-y-1'
                      : 'border-gray-100 opacity-60'
                }`}
                onClick={() => disponible && setTurnoSeleccionado(turnoSeleccionado === turno.id ? null : turno.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{turno.horario}</h3>
                      {turno.popular && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            porcentaje > 50
                              ? 'bg-green-500'
                              : porcentaje > 20
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getDisponibilidadColor(turno.disponibles, turno.total)}`}>
                        {turno.disponibles}/{turno.total}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {disponible ? `${turno.disponibles} cupos disponibles` : 'Sin cupos disponibles'}
                    </p>
                  </div>
                </div>

                {turnoSeleccionado === turno.id && disponible && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReservar(turno)
                    }}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    Reservar ticket
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-white">ℹ️</span>
            </div>
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">Información del gimnasio</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Horario: Lunes a Viernes 6:00 - 20:00, Sábados 8:00 - 14:00</li>
                <li>• Presenta tu ticket QR al ingresar</li>
                <li>• Trae tu toalla y ropa deportiva</li>
                <li>• Los turnos tienen duración de 2 horas</li>
                <li>• Puedes cancelar hasta 1 hora antes del turno</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
