import type { Vertical } from '../types/verticales'

/**
 * Catálogo de verticales (líneas de producto) HaiCommunity.
 * Cada vertical corresponde a un tipo de organización y sus destinatarios internos.
 */
export const VERTICALES: Vertical[] = [
  {
    id: 'v-edu',
    slug: 'HaiEduCore',
    nombre: 'Educación',
    descripcion: 'Centros educativos, institutos, universidades, academias',
    perfil: 'universidad',
    destinatarios: 'Estudiantes, docentes',
  },
  {
    id: 'v-biz',
    slug: 'HaiBizFlow',
    nombre: 'Empresas',
    descripcion: 'Empresas, pymes, corporativos, startups, consultoras',
    perfil: 'empresa',
    destinatarios: 'Empleados',
  },
  {
    id: 'v-active',
    slug: 'HaiActive',
    nombre: 'Gimnasio y Deporte',
    descripcion: 'Centros deportivos, gimnasios, clubes, academias deportivas',
    perfil: 'gimnasio',
    destinatarios: 'Socios / miembros',
  },
  {
    id: 'v-care',
    slug: 'HaiCare',
    nombre: 'Salud',
    descripcion: 'Clínicas, centros médicos, centros de bienestar, consultorios',
    perfil: 'clinica',
    destinatarios: 'Pacientes',
  },
  {
    id: 'v-community',
    slug: 'HaiCommunity',
    nombre: 'Comunidades y ONG',
    descripcion: 'ONG, asociaciones, cooperativas, fundaciones, comunidades',
    perfil: 'comunidad',
    destinatarios: 'Socios, voluntarios',
  },
  {
    id: 'v-facility',
    slug: 'HaiFacility',
    nombre: 'Vecindarios',
    descripcion: 'Coworkings, centros comerciales, parques empresariales',
    perfil: 'facility',
    destinatarios: 'Residentes, arrendatarios',
  },
]

export const VERTICALES_BY_SLUG = Object.fromEntries(
  VERTICALES.map((v) => [v.slug, v])
)

export const VERTICAL_BY_PERFIL: Record<string, (typeof VERTICALES)[0]> =
  Object.fromEntries(VERTICALES.map((v) => [v.perfil, v]))
