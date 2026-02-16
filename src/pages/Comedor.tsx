import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { SEDES_COMEDOR } from '../constants/sedes'
import { TURNOS_COMEDOR } from '../constants/turnos'

export function Comedor() {
  const [sedeId, setSedeId] = useState('cu')
  const navigate = useNavigate()
  const sede = SEDES_COMEDOR.find((s) => s.id === sedeId)!

  const handleSelectTurno = (tipo: string) => {
    navigate(`/comedor/turnos?Sede=${sedeId}&tipo=${tipo}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-8 md:pb-0">
      <Header
        title="Servicio de Comedor"
        sectionTitle="SERVICIOS"
        showBack
        showLogo
      />
      <main className="max-w-xl mx-auto md:max-w-5xl px-4 py-4 md:py-6 lg:px-8">
        <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-sm border border-gray-100">
          {/* Card header */}
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-red-200 bg-red-50 flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
              🍽️
            </div>
            <div>
              <h2 className="font-bold text-lg md:text-xl text-gray-900">Servicio de Comedor</h2>
              <p className="text-sm text-gray-500">Elegir sede y modalidad</p>
            </div>
          </div>

          {/* Layout: sedes | turnos en dos columnas en desktop */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Sedes */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Seleccionar sede</h3>
              <div className="space-y-2">
                {SEDES_COMEDOR.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900">{s.nombre}</p>
                      <p className="text-xs text-gray-500 truncate">{s.direccion}</p>
                    </div>
                    <button
                      onClick={() => setSedeId(s.id)}
                      className={`ml-4 w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                        sedeId === s.id ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          sedeId === s.id ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Turnos */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Elegir turno</h3>
              <div className="space-y-2">
                {TURNOS_COMEDOR.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTurno(t.tipo)}
                    className={`w-full p-4 rounded-xl text-left flex justify-between items-center min-h-[52px] transition-all ${
                      t.requiereTicket
                        ? 'bg-primary text-white hover:bg-primary-700 shadow-sm hover:shadow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>
                      <p className="font-semibold uppercase text-sm">{t.tipo}</p>
                      <p className={`text-sm ${t.requiereTicket ? 'opacity-90' : 'text-gray-500'}`}>
                        {t.horarioInicio} - {t.horarioFin}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {t.requiereTicket ? 'Reservar ticket' : 'No es necesario separar ticket'}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
