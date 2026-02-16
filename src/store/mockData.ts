import type { User, Ticket, TurnoPiso, MenuDia } from '../types'

export const MOCK_USER: User = {
  id: '1',
  organizationId: 'unmsm',
  codigoBeneficiario: '16200050',
  email: 'estudiante@unmsm.edu.pe',
  dni: '7332910',
  apellidos: 'Altaminaro Paredes',
  nombres: 'Gloria',
  facultad: 'Escuela de Posgrado',
  carrera: 'Medicina Humana',
  celular: '+51 926224234',
  fijo: '+01 265 8420',
  presentacion: 'Estudiante de Medicina en UNMSM',
  alias: 'Gloria',
  rol: 'beneficiario',
}

export const MOCK_TICKETS: Ticket[] = []

export const MOCK_TURNOS_PISO: TurnoPiso[] = [
  { id: 'tp1', piso: 1, turnoId: '801', horario: '12:00 - 12:20', disponibles: 5, capacidad: 20 },
  { id: 'tp2', piso: 2, turnoId: '801', horario: '12:00 - 12:20', disponibles: 0, capacidad: 20 },
  { id: 'tp3', piso: 1, turnoId: '802', horario: '12:20 - 12:40', disponibles: 18, capacidad: 20 },
  { id: 'tp4', piso: 2, turnoId: '802', horario: '12:20 - 12:40', disponibles: 10, capacidad: 20 },
]

export const MOCK_MENU: MenuDia = {
  entrada: 'Ensalada mixta',
  segundo: 'Arroz con pollo',
  postre: 'Mazamorra',
}
