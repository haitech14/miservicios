import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { SEDES_COMEDOR } from '../constants/sedes'
import { TURNOS_COMEDOR } from '../constants/turnos'

export function Comedor() {
  const [sedeId, setSedeId] = useState('cu')
  const navigate = useNavigate()
  const handleSelectTurno = (tipo: string) => {
    navigate(`/comedor/turnos?Sede=${sedeId}&tipo=${tipo}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-8 md:pb-0">
      <Header
        title="Servicio de Comedor"
        sectionTitle="SERVICIOS"
        showBack
        showLogo
      />
      <main className="max-w-xl mx-auto md:max-w-6xl px-4 py-6 md:py-8 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-red-500 via-red-600 to-orange-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                🍽️
              </div>
              <div>
                <h1 className="font-bold text-2xl md:text-3xl mb-1">Servicio de Comedor</h1>
                <p className="text-white/90 text-sm md:text-base">Reserva tu ticket para desayuno, almuerzo o cena</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                🏛️ 4 Sedes disponibles
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                ⏰ 3 Turnos diarios
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                ✅ Reserva rápida
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Sedes Section */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">Seleccionar Sede</h2>
                <p className="text-sm text-gray-500">Elige la ubicación más cercana</p>
              </div>
            </div>
            <div className="space-y-3">
              {SEDES_COMEDOR.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSedeId(s.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    sedeId === s.id
                      ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                      sedeId === s.id ? 'bg-red-500 text-white' : 'bg-gray-200'
                    } transition-colors`}>
                      🏛️
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className={`font-semibold ${sedeId === s.id ? 'text-red-700' : 'text-gray-900'}`}>
                        {s.nombre}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{s.direccion}</p>
                    </div>
                  </div>
                  <div className={`ml-4 w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                    sedeId === s.id ? 'bg-red-500' : 'bg-gray-300'
                  }`}>
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        sedeId === s.id ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Turnos Section */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">Elegir Turno</h2>
                <p className="text-sm text-gray-500">Selecciona el horario de tu preferencia</p>
              </div>
            </div>
            <div className="space-y-3">
              {TURNOS_COMEDOR.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTurno(t.tipo)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] ${
                    t.requiereTicket
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-base uppercase">{t.tipo}</p>
                        {t.requiereTicket && (
                          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                            Requiere ticket
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${t.requiereTicket ? 'text-white/90' : 'text-gray-500'}`}>
                        {t.horarioInicio} - {t.horarioFin}
                      </p>
                    </div>
                    <div className={`ml-4 ${t.requiereTicket ? 'text-white' : 'text-gray-400'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-white">ℹ️</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Información importante</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Los tickets deben reservarse con anticipación</li>
                <li>• Presenta tu ticket QR al ingresar al comedor</li>
                <li>• Puedes cancelar hasta 2 horas antes del turno</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
