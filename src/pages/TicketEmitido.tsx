import { useEffect, useRef, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import JsBarcode from 'jsbarcode'
import { useAuth } from '../context/AuthContext'
import { Header } from '../components/Header'
import { SEDES_COMEDOR } from '../constants/sedes'
import { addTicket, getStoredTickets } from '../store/ticketStore'
import type { Ticket } from '../types'

export function TicketEmitido() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const barcodeRef = useRef<HTMLCanvasElement>(null)

  const viewId = searchParams.get('v')
  const existingTicket = viewId ? getStoredTickets().find((t) => t.id === viewId) : null

  const servicio = searchParams.get('servicio') || existingTicket?.servicioId || 'comedor'
  const sedeId = searchParams.get('Sede') || existingTicket?.sedeId || 'cu'
  const tipo = searchParams.get('tipo') || existingTicket?.tipoTurno || 'almuerzo'
  const piso = searchParams.get('piso') || String(existingTicket?.piso || 1)
  const turnoId = searchParams.get('turno') || existingTicket?.turnoId || '801'
  const horario = searchParams.get('horario') || existingTicket?.horario || '12:00 - 12:20'

  const sede = SEDES_COMEDOR.find((s) => s.id === sedeId)
  const ticketId = useMemo(() => existingTicket?.id || `T${Date.now()}`, [existingTicket?.id])
  const qrData = JSON.stringify({
    id: ticketId,
    userId: user?.id,
    codigo: user?.codigoBeneficiario,
    sede: sedeId,
    tipo,
    piso,
    turno: turnoId,
    fecha: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (!user) return
    const existing = getStoredTickets().find((t) => t.id === ticketId)
    if (!existing) {
      const ticket: Ticket = {
        id: ticketId,
        userId: user.id,
        servicioId: servicio,
        sedeId,
        sedeNombre: servicio === 'gimnasio' ? 'Ciudad Universitaria' : (sede?.nombre || 'Ciudad Universitaria'),
        turnoId,
        tipoTurno: tipo,
        piso: parseInt(piso, 10),
        fecha: new Date().toISOString().split('T')[0],
        horario,
        qrData,
        barcodeData: user.codigoBeneficiario,
        estado: 'activo',
        createdAt: new Date().toISOString(),
      }
      addTicket(ticket)
    }
  }, [user, ticketId, sedeId, sede?.nombre, turnoId, tipo, piso, horario, qrData])

  useEffect(() => {
    if (barcodeRef.current && user) {
      try {
        JsBarcode(barcodeRef.current, user.codigoBeneficiario + ticketId, {
          format: 'CODE128',
          width: 2,
          height: 40,
        })
      } catch {
        //
      }
    }
  }, [user, ticketId])

  const formatFecha = () => {
    const d = new Date()
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    return `${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <Header title="Ticket" showBack showLogo={false} />
      <main className="max-w-md mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
          <div className="flex justify-between text-sm">
            <div>
              <p className="font-medium">{existingTicket?.sedeNombre || sede?.nombre}</p>
              <p className="text-gray-500">{existingTicket?.fecha ? new Date(existingTicket.fecha).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : formatFecha()}</p>
            </div>
            <div className="text-right">
              <p className="font-medium capitalize">{tipo}</p>
              <p className="text-gray-500">{piso}er Piso</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="font-semibold">{user.nombres} {user.apellidos}</p>
              <p className="text-sm text-gray-500">Código: {user.codigoBeneficiario}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Turno {turnoId}</p>
          <div className="flex justify-center py-4 bg-white border rounded-lg">
            <QRCodeSVG value={existingTicket?.qrData || qrData} size={180} level="H" />
          </div>
          <div className="flex justify-center">
            <canvas ref={barcodeRef} />
          </div>
          <p className="text-xs text-center text-gray-400">N° {ticketId}</p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button className="py-3 rounded-xl bg-primary text-white font-medium min-h-[44px]">
              CAMBIAR TURNO
            </button>
            <button
              onClick={() => navigate('/')}
              className="py-3 rounded-xl bg-accent-red text-white font-medium min-h-[44px]"
            >
              NO PODRÉ ASISTIR
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
