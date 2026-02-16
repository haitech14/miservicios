export type ServicioClave =
  | 'comedor'
  | 'transporte'
  | 'biblioteca'
  | 'clinica'
  | 'sum'
  | 'idiomas'
  | 'aula-virtual'
  | 'gimnasio'
  | 'mapa'

export interface Servicio {
  clave: ServicioClave
  nombre: string
  icono: string
  color: string
  descripcion: string
  activo: boolean
}

export const SERVICIOS: Servicio[] = [
  {
    clave: 'comedor',
    nombre: 'Comedor',
    icono: '🍽️',
    color: '#dc2626',
    descripcion: 'Almuerzo y Cena - Ciudad Universitaria, San Fernando, San Juan de Lurigancho, Veterinaria',
    activo: true,
  },
  {
    clave: 'transporte',
    nombre: 'Transporte',
    icono: '🚌',
    color: '#2563eb',
    descripcion: 'Bus interno y externo - Ciudad Universitaria, Ruta Norte, Sur, Este y Oeste',
    activo: true,
  },
  {
    clave: 'clinica',
    nombre: 'Clínica',
    icono: '🏥',
    color: '#16a34a',
    descripcion: 'Chequeo médico, citas y emergencias - Ciudad Universitaria',
    activo: true,
  },
  {
    clave: 'biblioteca',
    nombre: 'Biblioteca',
    icono: '📚',
    color: '#22c55e',
    descripcion: 'Reserva espacios, mesas, libros, tesis',
    activo: true,
  },
  {
    clave: 'sum',
    nombre: 'Sistema Único de Matrícula',
    icono: '📋',
    color: '#64748b',
    descripcion: 'Consulta información en línea, matrícula, trámites',
    activo: true,
  },
  {
    clave: 'idiomas',
    nombre: 'Centro de Idiomas',
    icono: '🌐',
    color: '#0d9488',
    descripcion: 'Inscríbete a los cursos en línea',
    activo: true,
  },
  {
    clave: 'aula-virtual',
    nombre: 'Aula Virtual',
    icono: '💻',
    color: '#6366f1',
    descripcion: 'Tus cursos, tus profesores',
    activo: true,
  },
  {
    clave: 'gimnasio',
    nombre: 'Gimnasio',
    icono: '🏋️',
    color: '#ea580c',
    descripcion: 'Separa tu turno por ticket - Ciudad Universitaria',
    activo: true,
  },
  {
    clave: 'mapa',
    nombre: 'Mapa Universitario',
    icono: '🗺️',
    color: '#0891b2',
    descripcion: 'Guía del ingresante, ubicaciones',
    activo: true,
  },
]
