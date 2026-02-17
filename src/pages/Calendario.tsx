import { useState } from 'react'
import { Header } from '../components/Header'

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DIAS_SEM = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

interface Evento {
  id: string
  titulo: string
  fecha: Date
  hora: string
  tipo: 'personal' | 'academico' | 'recordatorio'
  color: string
  descripcion?: string
}

const eventosEjemplo: Evento[] = [
  {
    id: '1',
    titulo: 'Examen de Matemáticas',
    fecha: new Date(2024, 1, 20),
    hora: '14:00',
    tipo: 'academico',
    color: 'from-red-500 to-pink-500',
    descripcion: 'Examen parcial de Cálculo I',
  },
  {
    id: '2',
    titulo: 'Reunión con tutor',
    fecha: new Date(2024, 1, 22),
    hora: '10:00',
    tipo: 'academico',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '3',
    titulo: 'Entrega de proyecto',
    fecha: new Date(2024, 1, 25),
    hora: '23:59',
    tipo: 'academico',
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: '4',
    titulo: 'Recordatorio: Pagar matrícula',
    fecha: new Date(2024, 1, 18),
    hora: '09:00',
    tipo: 'recordatorio',
    color: 'from-yellow-500 to-orange-500',
  },
]

export function Calendario() {
  const [fecha, setFecha] = useState(new Date())
  const [eventos, setEventos] = useState<Evento[]>(eventosEjemplo)
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const year = fecha.getFullYear()
  const month = fecha.getMonth()
  const hoy = new Date()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1
  const dias = Array.from({ length: offset }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  )

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    setFecha(new Date(year, month + (direccion === 'siguiente' ? 1 : -1), 1))
  }

  const eventosDelDia = (dia: number | null) => {
    if (dia === null) return []
    const fechaCompleta = new Date(year, month, dia)
    return eventos.filter((e) => {
      return (
        e.fecha.getDate() === fechaCompleta.getDate() &&
        e.fecha.getMonth() === fechaCompleta.getMonth() &&
        e.fecha.getFullYear() === fechaCompleta.getFullYear()
      )
    })
  }

  const esHoy = (dia: number | null) => {
    if (dia === null) return false
    return (
      dia === hoy.getDate() &&
      month === hoy.getMonth() &&
      year === hoy.getFullYear()
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Header title="Calendario Personal" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="max-w-xl mx-auto md:max-w-7xl px-4 py-6 md:py-8 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-pink-500 via-rose-600 to-fuchsia-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                  📅
                </div>
                <div>
                  <h1 className="font-bold text-2xl md:text-3xl mb-1">Calendario Personal</h1>
                  <p className="text-white/90 text-sm md:text-base">Gestiona tus eventos y recordatorios</p>
                </div>
              </div>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="px-4 py-2 bg-white text-pink-600 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                + Nuevo evento
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendario */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => cambiarMes('anterior')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-bold text-xl text-gray-900">
                {MESES[month]} {year}
              </h2>
              <button
                onClick={() => cambiarMes('siguiente')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {DIAS_SEM.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {dias.map((dia, i) => {
                const eventos = eventosDelDia(dia)
                const esDiaSeleccionado = diaSeleccionado && dia === diaSeleccionado.getDate()
                const esHoyDia = esHoy(dia)

                return (
                  <button
                    key={i}
                    onClick={() => dia && setDiaSeleccionado(new Date(year, month, dia))}
                    className={`aspect-square rounded-lg p-2 text-sm transition-all ${
                      dia === null
                        ? 'text-transparent'
                        : esDiaSeleccionado
                          ? 'bg-pink-500 text-white font-bold shadow-lg scale-105'
                          : esHoyDia
                            ? 'bg-pink-100 text-pink-700 font-bold border-2 border-pink-300'
                            : eventos.length > 0
                              ? 'bg-blue-50 text-gray-900 hover:bg-blue-100'
                              : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{dia || ''}</div>
                    {eventos.length > 0 && (
                      <div className="flex gap-0.5 justify-center mt-1">
                        {eventos.slice(0, 3).map((e, idx) => (
                          <div
                            key={idx}
                            className="w-1.5 h-1.5 rounded-full bg-pink-500"
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Panel de eventos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              {diaSeleccionado
                ? `Eventos del ${diaSeleccionado.getDate()} de ${MESES[month]}`
                : 'Próximos eventos'}
            </h3>
            <div className="space-y-3">
              {(diaSeleccionado ? eventosDelDia(diaSeleccionado.getDate()) : eventos)
                .slice(0, 5)
                .map((evento) => (
                  <div
                    key={evento.id}
                    className={`p-4 rounded-xl bg-gradient-to-r ${evento.color} text-white shadow-md`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm">{evento.titulo}</h4>
                      <span className="text-xs opacity-80">{evento.hora}</span>
                    </div>
                    {evento.descripcion && (
                      <p className="text-xs opacity-90 mt-1">{evento.descripcion}</p>
                    )}
                    <span className="inline-block mt-2 px-2 py-0.5 bg-white/20 rounded text-xs">
                      {evento.tipo === 'academico' ? '📚 Académico' : evento.tipo === 'personal' ? '👤 Personal' : '🔔 Recordatorio'}
                    </span>
                  </div>
                ))}
              {(!diaSeleccionado ? eventos : eventosDelDia(diaSeleccionado.getDate())).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No hay eventos programados
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
