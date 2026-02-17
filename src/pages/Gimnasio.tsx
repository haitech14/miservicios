import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'

const SEDES = [
  { id: 'todas', nombre: 'Todas las sedes' },
  { id: 'cu', nombre: 'Ciudad Universitaria' },
  { id: 'sf', nombre: 'San Fernando' },
  { id: 'sjl', nombre: 'San Juan de Lurigancho' },
  { id: 'vet', nombre: 'Veterinaria' },
]

const TURNOS_GIMNASIO = [
  { id: 't1', horario: '6:00 - 8:00', disponibles: 15, total: 30, popular: false, sede: 'cu' as const },
  { id: 't2', horario: '8:00 - 10:00', disponibles: 20, total: 30, popular: true, sede: 'cu' as const },
  { id: 't3', horario: '10:00 - 12:00', disponibles: 5, total: 30, popular: false, sede: 'cu' as const },
  { id: 't4', horario: '14:00 - 16:00', disponibles: 18, total: 30, popular: true, sede: 'cu' as const },
  { id: 't5', horario: '16:00 - 18:00', disponibles: 12, total: 30, popular: false, sede: 'sf' as const },
  { id: 't6', horario: '18:00 - 20:00', disponibles: 8, total: 30, popular: false, sede: 'sf' as const },
]

const CLASES_BAILE = [
  { id: 'cb1', horario: '9:00 - 10:30', nombre: 'Salsa', instructor: 'Prof. Jordan', disponibles: 8, total: 15, sede: 'cu' as const },
  { id: 'cb2', horario: '11:00 - 12:00', nombre: 'Bachata', instructor: 'Prof. Jordan', disponibles: 12, total: 20, sede: 'cu' as const },
  { id: 'cb3', horario: '15:00 - 16:30', nombre: 'Zumba', instructor: 'Prof. Jordan', disponibles: 5, total: 25, sede: 'sf' as const },
  { id: 'cb4', horario: '17:00 - 18:00', nombre: 'Hip Hop', instructor: 'Prof. Jordan', disponibles: 10, total: 18, sede: 'cu' as const },
]

type TipoActividad = 'gimnasio' | 'baile'

export function Gimnasio() {
  const navigate = useNavigate()
  const [tipoActivo, setTipoActivo] = useState<TipoActividad>('gimnasio')
  const [sedeFiltro, setSedeFiltro] = useState('todas')
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<string | null>(null)

  const filtrarPorSede = <T extends { sede: string }>(items: T[]) => {
    if (sedeFiltro === 'todas') return items
    return items.filter((i) => i.sede === sedeFiltro)
  }

  const turnosFiltrados = filtrarPorSede(TURNOS_GIMNASIO)
  const clasesFiltradas = filtrarPorSede(CLASES_BAILE)

  const handleReservarGimnasio = (t: typeof TURNOS_GIMNASIO[0]) => {
    if (t.disponibles <= 0) return
    navigate(`/ticket?servicio=gimnasio&turno=${t.id}&horario=${encodeURIComponent(t.horario)}&Sede=${t.sede}&tipo=Gimnasio&piso=1`)
  }

  const handleReservarClase = (c: typeof CLASES_BAILE[0]) => {
    if (c.disponibles <= 0) return
    navigate(`/ticket?servicio=baile&turno=${c.id}&horario=${encodeURIComponent(c.horario)}&Sede=${c.sede}&tipo=Clase ${c.nombre}&instructor=${encodeURIComponent(c.instructor)}`)
  }

  const getDisponibilidadColor = (disponibles: number, total: number) => {
    const porcentaje = (disponibles / total) * 100
    if (porcentaje > 50) return 'text-green-600 bg-green-50'
    if (porcentaje > 20) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Header title="Gimnasio y Clases" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="w-full max-w-[1600px] mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Tipo de actividad */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTipoActivo('gimnasio')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
              tipoActivo === 'gimnasio'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            🏋️ Gimnasio
          </button>
          <button
            onClick={() => setTipoActivo('baile')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
              tipoActivo === 'baile'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            💃 Clases de Baile
          </button>
        </div>

        {/* Hero Section - Gimnasio */}
        {tipoActivo === 'gimnasio' && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-orange-500 via-red-600 to-amber-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                  🏋️
                </div>
                <div>
                  <h1 className="font-bold text-2xl md:text-3xl mb-1">Gimnasio Universitario</h1>
                  <p className="text-white/90 text-sm md:text-base">Reserva tu turno para entrenar</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">💪 Equipamiento completo</div>
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">⏰ 6 Turnos diarios</div>
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">✅ Reserva rápida</div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section - Clases de Baile */}
        {tipoActivo === 'baile' && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-purple-500 via-pink-600 to-violet-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                  💃
                </div>
                <div>
                  <h1 className="font-bold text-2xl md:text-3xl mb-1">Clases de Baile</h1>
                  <p className="text-white/90 text-sm md:text-base">Salsa, Bachata, Zumba, Hip Hop y más</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">🎵 Prof. Jordan</div>
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">📍 Varias sedes</div>
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">✅ Inscripción en línea</div>
              </div>
            </div>
          </div>
        )}

        {/* Filtro por sede */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm font-medium text-gray-600">Filtrar por sede:</span>
          <div className="flex flex-wrap gap-2">
            {SEDES.map((sede) => (
              <button
                key={sede.id}
                onClick={() => setSedeFiltro(sede.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sedeFiltro === sede.id
                    ? tipoActivo === 'gimnasio'
                      ? 'bg-orange-500 text-white'
                      : 'bg-purple-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {sede.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Turnos Gimnasio */}
        {tipoActivo === 'gimnasio' && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {turnosFiltrados.map((turno) => {
              const porcentaje = (turno.disponibles / turno.total) * 100
              const disponible = turno.disponibles > 0
              const sedeNombre = SEDES.find((s) => s.id === turno.sede)?.nombre

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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{sedeNombre}</span>
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{turno.horario}</h3>
                        {turno.popular && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Popular</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              porcentaje > 50 ? 'bg-green-500' : porcentaje > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${getDisponibilidadColor(turno.disponibles, turno.total)}`}>
                          {turno.disponibles}/{turno.total}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{disponible ? `${turno.disponibles} cupos disponibles` : 'Sin cupos'}</p>
                    </div>
                  </div>
                  {turnoSeleccionado === turno.id && disponible && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReservarGimnasio(turno) }}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    >
                      Reservar ticket
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Clases de Baile */}
        {tipoActivo === 'baile' && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clasesFiltradas.map((clase) => {
              const disponible = clase.disponibles > 0
              const porcentaje = (clase.disponibles / clase.total) * 100
              const sedeNombre = SEDES.find((s) => s.id === clase.sede)?.nombre

              return (
                <div
                  key={clase.id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 ${
                    turnoSeleccionado === clase.id
                      ? 'border-purple-500 shadow-lg'
                      : disponible
                        ? 'border-gray-100 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1'
                        : 'border-gray-100 opacity-60'
                  }`}
                  onClick={() => disponible && setTurnoSeleccionado(turnoSeleccionado === clase.id ? null : clase.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{sedeNombre}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{clase.nombre}</h3>
                  <p className="text-sm text-purple-600 font-medium mb-3 flex items-center gap-1">
                    <span>👨‍🏫</span> {clase.instructor}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">{clase.horario}</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          porcentaje > 50 ? 'bg-green-500' : porcentaje > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getDisponibilidadColor(clase.disponibles, clase.total)}`}>
                      {clase.disponibles}/{clase.total}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{disponible ? `${clase.disponibles} cupos disponibles` : 'Sin cupos'}</p>
                  {turnoSeleccionado === clase.id && disponible && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReservarClase(clase) }}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    >
                      Inscribirse
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {((tipoActivo === 'gimnasio' && turnosFiltrados.length === 0) || (tipoActivo === 'baile' && clasesFiltradas.length === 0)) && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">📍</p>
            <p>No hay turnos en la sede seleccionada</p>
            <button
              onClick={() => setSedeFiltro('todas')}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Ver todas las sedes
            </button>
          </div>
        )}

        {/* Info adicional */}
        <div className={`mt-8 rounded-2xl p-6 ${tipoActivo === 'gimnasio' ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'}`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tipoActivo === 'gimnasio' ? 'bg-orange-500' : 'bg-purple-500'}`}>
              <span className="text-xl text-white">ℹ️</span>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${tipoActivo === 'gimnasio' ? 'text-orange-900' : 'text-purple-900'}`}>
                Información {tipoActivo === 'gimnasio' ? 'del gimnasio' : 'de clases'}
              </h3>
              <ul className={`text-sm space-y-1 ${tipoActivo === 'gimnasio' ? 'text-orange-800' : 'text-purple-800'}`}>
                {tipoActivo === 'gimnasio' ? (
                  <>
                    <li>• Horario: Lunes a Viernes 6:00 - 20:00, Sábados 8:00 - 14:00</li>
                    <li>• Presenta tu ticket QR al ingresar</li>
                    <li>• Trae tu toalla y ropa deportiva</li>
                    <li>• Los turnos tienen duración de 2 horas</li>
                  </>
                ) : (
                  <>
                    <li>• Instructor: Prof. Jordan - Especialista en danzas latinas</li>
                    <li>• Niveles: Principiante, Intermedio, Avanzado</li>
                    <li>• Trae ropa cómoda y zapatos de baile</li>
                    <li>• Inscríbete con anticipación para asegurar tu cupo</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
