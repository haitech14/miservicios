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
  | 'tutorias'
  | 'actividades'
  | 'voluntarios'
  | 'proyectos'
  | 'drive'
  | 'calendario'
  | 'marketplace'

export interface Servicio {
  clave: ServicioClave
  nombre: string
  icono: string
  color: string
  descripcion: string
  activo: boolean
  categoria: 'bienestar' | 'desarrollo' | 'comunidad' | 'servicios'
}

export const SERVICIOS: Servicio[] = [
  // Categoría: Bienestar
  {
    clave: 'comedor',
    nombre: 'Comedor',
    icono: '🍽️',
    color: '#dc2626',
    descripcion: 'Almuerzo y Cena - Ciudad Universitaria, San Fernando, San Juan de Lurigancho, Veterinaria',
    activo: true,
    categoria: 'bienestar',
  },
  {
    clave: 'clinica',
    nombre: 'Clínica',
    icono: '🏥',
    color: '#16a34a',
    descripcion: 'Chequeo médico, citas y emergencias - Ciudad Universitaria',
    activo: true,
    categoria: 'bienestar',
  },
  {
    clave: 'gimnasio',
    nombre: 'Gimnasio',
    icono: '🏋️',
    color: '#ea580c',
    descripcion: 'Separa tu turno por ticket - Ciudad Universitaria',
    activo: true,
    categoria: 'bienestar',
  },

  // Categoría: Desarrollo
  {
    clave: 'biblioteca',
    nombre: 'Biblioteca',
    icono: '📚',
    color: '#22c55e',
    descripcion: 'Reserva espacios, mesas, libros, tesis',
    activo: true,
    categoria: 'desarrollo',
  },
  {
    clave: 'aula-virtual',
    nombre: 'Aula Virtual',
    icono: '💻',
    color: '#6366f1',
    descripcion: 'Tus cursos, tus profesores',
    activo: true,
    categoria: 'desarrollo',
  },
  {
    clave: 'tutorias',
    nombre: 'Tutorías',
    icono: '🎓',
    color: '#7c3aed',
    descripcion: 'Tutorías y seguimiento académico con docentes',
    activo: true,
    categoria: 'desarrollo',
  },
  {
    clave: 'idiomas',
    nombre: 'Centro de Idiomas',
    icono: '🌐',
    color: '#0d9488',
    descripcion: 'Inscríbete a los cursos en línea',
    activo: true,
    categoria: 'desarrollo',
  },

  // Categoría: Comunidad
  {
    clave: 'actividades',
    nombre: 'Actividades',
    icono: '🎉',
    color: '#f59e0b',
    descripcion: 'Eventos, entretenimiento y actividades recreativas',
    activo: true,
    categoria: 'comunidad',
  },
  {
    clave: 'voluntarios',
    nombre: 'Voluntariado',
    icono: '🤝',
    color: '#ec4899',
    descripcion: 'Participa en proyectos sociales de tu comunidad',
    activo: true,
    categoria: 'comunidad',
  },
  {
    clave: 'proyectos',
    nombre: 'Proyectos',
    icono: '🏗️',
    color: '#8b5cf6',
    descripcion: 'Colabora en proyectos comunitarios',
    activo: true,
    categoria: 'comunidad',
  },

  // Categoría: Servicios
  {
    clave: 'transporte',
    nombre: 'Transporte',
    icono: '🚌',
    color: '#2563eb',
    descripcion: 'Bus interno y externo - Ciudad Universitaria, Ruta Norte, Sur, Este y Oeste',
    activo: true,
    categoria: 'servicios',
  },
  {
    clave: 'sum',
    nombre: 'Sistema Único de Matrícula',
    icono: '📋',
    color: '#64748b',
    descripcion: 'Consulta información en línea, matrícula, trámites',
    activo: true,
    categoria: 'servicios',
  },
  {
    clave: 'drive',
    nombre: 'Documentos',
    icono: '☁️',
    color: '#3b82f6',
    descripcion: 'Almacenamiento en la nube y cuaderno virtual',
    activo: true,
    categoria: 'servicios',
  },
  {
    clave: 'calendario',
    nombre: 'Calendario Personal',
    icono: '📅',
    color: '#ec4899',
    descripcion: 'Gestiona tus eventos y recordatorios',
    activo: true,
    categoria: 'servicios',
  },
  {
    clave: 'marketplace',
    nombre: 'Marketplace',
    icono: '🛒',
    color: '#059669',
    descripcion: 'Compra, vende e intercambia con la comunidad',
    activo: true,
    categoria: 'comunidad',
  },
]

export const SERVICIOS_POR_CATEGORIA = {
  bienestar: SERVICIOS.filter(s => s.categoria === 'bienestar'),
  desarrollo: SERVICIOS.filter(s => s.categoria === 'desarrollo'),
  comunidad: SERVICIOS.filter(s => s.categoria === 'comunidad'),
  servicios: SERVICIOS.filter(s => s.categoria === 'servicios'),
}
