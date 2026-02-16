export interface Sede {
  id: string
  nombre: string
  direccion: string
}

export const SEDES_COMEDOR: Sede[] = [
  { id: 'cu', nombre: 'Ciudad Universitaria', direccion: 'Av. Venezuela / Av. Universitaria' },
  { id: 'sf', nombre: 'San Fernando', direccion: 'Av. Grau, cuadra 7' },
  { id: 'sjl', nombre: 'San Juan de Lurigancho', direccion: 'Av. San Juan de Lurigancho, cuadra 5' },
  { id: 'vet', nombre: 'Veterinaria', direccion: 'Av. San Juan de Lurigancho, cuadra 5' },
]
