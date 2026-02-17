import { useSearchParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { SEDES_COMEDOR } from '../constants/sedes'
import { MOCK_TURNOS_PISO, MOCK_MENU } from '../store/mockData'

export function ComedorTurnos() {
  const [searchParams] = useSearchParams()
  const sedeId = searchParams.get('Sede') || 'cu'
  const tipo = searchParams.get('tipo') || 'almuerzo'
  const navigate = useNavigate()
  const sede = SEDES_COMEDOR.find((s) => s.id === sedeId)
  const totalDisponibles = MOCK_TURNOS_PISO.reduce((acc, t) => acc + t.disponibles, 0)

  const handleReservar = (tp: { id: string; piso: number; turnoId: string; horario: string; disponibles: number }) => {
    if (tp.disponibles <= 0) return
    navigate(`/ticket?Sede=${sedeId}&tipo=${tipo}&piso=${tp.piso}&turno=${tp.turnoId}&horario=${encodeURIComponent(tp.horario)}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <Header title={`${sede?.nombre} - ${tipo}`} showBack showLogo={false} />
      <main className="max-w-xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h2 className="font-bold">
            {sede?.nombre}
          </h2>
          <p className="text-sm text-gray-500">{tipo}, seleccione un turno</p>
          <div className="flex gap-4">
            <div className="flex-1 text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-primary">{totalDisponibles}</p>
              <p className="text-sm text-gray-500">Quedan ticket(s)</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Menú de hoy</p>
              <p className="text-xs text-gray-500">{MOCK_MENU.entrada}</p>
              <p className="text-xs text-gray-500">{MOCK_MENU.segundo}</p>
              <p className="text-xs text-gray-500">{MOCK_MENU.postre}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {MOCK_TURNOS_PISO.map((tp) => (
              <div
                key={tp.id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <p className="text-xs font-medium text-gray-500">
                  {tp.piso}er piso Turno {tp.turnoId}
                </p>
                <p className="text-2xl font-bold text-primary">{tp.disponibles}</p>
                <p className="text-xs text-gray-500">TICKET(S)</p>
                <p className="text-xs mt-1">SEDE {sede?.nombre}</p>
                <p className="text-xs">HORARIO {tp.horario}</p>
                <button
                  onClick={() => handleReservar(tp)}
                  disabled={tp.disponibles <= 0}
                  className={`w-full mt-2 py-2 rounded-lg font-medium text-sm min-h-[44px] ${
                    tp.disponibles > 0
                      ? 'bg-accent-green text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Reservar ticket
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-2">
            <button className="w-full py-3 rounded-xl bg-primary text-white font-medium min-h-[44px]">
              NO ALCANCÉ TICKET
            </button>
            <button className="w-full py-3 rounded-xl bg-accent-red text-white font-medium min-h-[44px]">
              REPORTAR UN PROBLEMA
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
