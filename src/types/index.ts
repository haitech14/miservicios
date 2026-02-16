export interface User {
  id: string
  organizationId: string
  codigoBeneficiario: string
  email: string
  dni: string
  apellidos: string
  nombres: string
  facultad: string
  carrera: string
  celular: string
  fijo: string
  fotoUrl?: string
  presentacion?: string
  alias?: string
  rol: 'beneficiario' | 'admin'
}

export interface Ticket {
  id: string
  userId: string
  servicioId: string
  sedeId: string
  sedeNombre: string
  turnoId: string
  tipoTurno: string
  piso: number
  fecha: string
  horario: string
  qrData: string
  barcodeData: string
  estado: 'activo' | 'usado' | 'cancelado'
  createdAt: string
}

export interface TurnoPiso {
  id: string
  piso: number
  turnoId: string
  horario: string
  disponibles: number
  capacidad: number
}

export interface MenuDia {
  entrada: string
  segundo: string
  postre: string
}
