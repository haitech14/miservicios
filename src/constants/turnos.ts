export type TipoTurno = 'desayuno' | 'almuerzo' | 'cena'

export interface Turno {
  id: string
  tipo: TipoTurno
  horarioInicio: string
  horarioFin: string
  requiereTicket: boolean
}

export const TURNOS_COMEDOR: Turno[] = [
  { id: 'd1', tipo: 'desayuno', horarioInicio: '7:00', horarioFin: '7:40', requiereTicket: false },
  { id: 'a1', tipo: 'almuerzo', horarioInicio: '12:00', horarioFin: '13:40', requiereTicket: true },
  { id: 'c1', tipo: 'cena', horarioInicio: '17:00', horarioFin: '18:30', requiereTicket: true },
]
