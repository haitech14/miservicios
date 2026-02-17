import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const verticalesData = [
  { slug: 'HaiEduCore', nombre: 'HaiEduCore', descripcion: 'Centros educativos, institutos, universidades', perfil: 'universidad', destinatarios: 'Estudiantes, docentes' },
  { slug: 'HaiBizFlow', nombre: 'HaiBizFlow', descripcion: 'Empresas, pymes, corporativos', perfil: 'empresa', destinatarios: 'Empleados' },
  { slug: 'HaiActive', nombre: 'HaiActive', descripcion: 'Gimnasios, clubes deportivos', perfil: 'gimnasio', destinatarios: 'Socios / miembros' },
  { slug: 'HaiCare', nombre: 'HaiCare', descripcion: 'Clínicas, centros médicos', perfil: 'clinica', destinatarios: 'Pacientes' },
  { slug: 'HaiCommunity', nombre: 'HaiCommunity', descripcion: 'ONG, asociaciones, cooperativas', perfil: 'comunidad', destinatarios: 'Socios, voluntarios' },
  { slug: 'HaiFacility', nombre: 'HaiFacility', descripcion: 'Coworkings, centros comerciales', perfil: 'facility', destinatarios: 'Residentes, arrendatarios' },
]

const modulosData: { clave: string; nombre: string; verticalSlug: string; esBase: boolean; icono?: string }[] = [
  { clave: 'estudiantes', nombre: 'Gestión de estudiantes', verticalSlug: 'HaiEduCore', esBase: true, icono: '👥' },
  { clave: 'matriculas', nombre: 'Matrículas e inscripciones', verticalSlug: 'HaiEduCore', esBase: true, icono: '📋' },
  { clave: 'calendario', nombre: 'Calendario académico', verticalSlug: 'HaiEduCore', esBase: true, icono: '📅' },
  { clave: 'docentes', nombre: 'Gestión de docentes', verticalSlug: 'HaiEduCore', esBase: true, icono: '👨‍🏫' },
  { clave: 'asistencia', nombre: 'Control de asistencia', verticalSlug: 'HaiEduCore', esBase: true, icono: '✅' },
  { clave: 'evaluaciones', nombre: 'Evaluaciones y calificaciones', verticalSlug: 'HaiEduCore', esBase: true, icono: '📊' },
  { clave: 'expedientes', nombre: 'Expedientes digitales', verticalSlug: 'HaiEduCore', esBase: true, icono: '📁' },
  { clave: 'aula_virtual', nombre: 'Aula virtual / LMS', verticalSlug: 'HaiEduCore', esBase: false, icono: '💻' },
  { clave: 'pagos', nombre: 'Pagos y facturación', verticalSlug: 'HaiEduCore', esBase: false, icono: '💳' },
  { clave: 'biblioteca', nombre: 'Biblioteca digital', verticalSlug: 'HaiEduCore', esBase: false, icono: '📚' },
  { clave: 'tutorias', nombre: 'Tutorías y seguimiento académico', verticalSlug: 'HaiEduCore', esBase: false, icono: '🎓' },
  { clave: 'comedor', nombre: 'Comedor', verticalSlug: 'HaiEduCore', esBase: false, icono: '🍽️' },
  { clave: 'transporte', nombre: 'Transporte', verticalSlug: 'HaiEduCore', esBase: false, icono: '🚌' },
  { clave: 'clinica', nombre: 'Clínica', verticalSlug: 'HaiEduCore', esBase: false, icono: '🏥' },
  { clave: 'gimnasio', nombre: 'Gimnasio', verticalSlug: 'HaiEduCore', esBase: false, icono: '🏋️' },
  { clave: 'sum', nombre: 'SUM / Trámites', verticalSlug: 'HaiEduCore', esBase: false, icono: '📋' },
  { clave: 'idiomas', nombre: 'Centro de Idiomas', verticalSlug: 'HaiEduCore', esBase: false, icono: '🌐' },
  { clave: 'mapa', nombre: 'Mapa', verticalSlug: 'HaiEduCore', esBase: false, icono: '🗺️' },
  { clave: 'empleados', nombre: 'Gestión de empleados', verticalSlug: 'HaiBizFlow', esBase: true, icono: '👥' },
  { clave: 'portal_empleado', nombre: 'Portal del empleado', verticalSlug: 'HaiBizFlow', esBase: true, icono: '🏠' },
  { clave: 'beneficios', nombre: 'Beneficios corporativos', verticalSlug: 'HaiBizFlow', esBase: true, icono: '🎁' },
  { clave: 'solicitudes', nombre: 'Solicitudes internas', verticalSlug: 'HaiBizFlow', esBase: true, icono: '📝' },
  { clave: 'nomina', nombre: 'Nómina integrada', verticalSlug: 'HaiBizFlow', esBase: true, icono: '💰' },
  { clave: 'documentacion', nombre: 'Documentación laboral', verticalSlug: 'HaiBizFlow', esBase: true, icono: '📄' },
  { clave: 'entretenimiento', nombre: 'Entretenimiento', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🎉' },
  { clave: 'miembros', nombre: 'Gestión de miembros', verticalSlug: 'HaiActive', esBase: true, icono: '👥' },
  { clave: 'acceso', nombre: 'Control de acceso', verticalSlug: 'HaiActive', esBase: true, icono: '🔐' },
  { clave: 'planes', nombre: 'Planes y membresías', verticalSlug: 'HaiActive', esBase: true, icono: '📋' },
  { clave: 'reservas_clases', nombre: 'Reservas de clases', verticalSlug: 'HaiActive', esBase: true, icono: '📅' },
  { clave: 'pacientes', nombre: 'Gestión de pacientes', verticalSlug: 'HaiCare', esBase: true, icono: '👥' },
  { clave: 'agenda', nombre: 'Agenda médica', verticalSlug: 'HaiCare', esBase: true, icono: '📅' },
  { clave: 'historia_clinica', nombre: 'Historia clínica digital', verticalSlug: 'HaiCare', esBase: true, icono: '📁' },
  { clave: 'socios', nombre: 'Gestión de socios', verticalSlug: 'HaiCommunity', esBase: true, icono: '👥' },
  { clave: 'cuotas', nombre: 'Cuotas y aportes', verticalSlug: 'HaiCommunity', esBase: true, icono: '💰' },
  { clave: 'eventos', nombre: 'Eventos', verticalSlug: 'HaiCommunity', esBase: true, icono: '📅' },
  { clave: 'espacios', nombre: 'Gestión de espacios', verticalSlug: 'HaiFacility', esBase: true, icono: '🏢' },
  { clave: 'reservas', nombre: 'Reservas', verticalSlug: 'HaiFacility', esBase: true, icono: '📅' },
  { clave: 'incidencias', nombre: 'Incidencias y mantenimiento', verticalSlug: 'HaiFacility', esBase: true, icono: '🔧' },
]

async function main() {
  for (const v of verticalesData) {
    await prisma.vertical.upsert({
      where: { slug: v.slug },
      create: v,
      update: v,
    })
  }

  const verticals = await prisma.vertical.findMany()
  const bySlug = Object.fromEntries(verticals.map((x) => [x.slug, x.id]))

  for (const m of modulosData) {
    const verticalId = bySlug[m.verticalSlug]
    if (!verticalId) continue
    await prisma.modulo.upsert({
      where: {
        verticalId_clave: { verticalId, clave: m.clave },
      },
      create: {
        clave: m.clave,
        nombre: m.nombre,
        verticalId,
        esBase: m.esBase,
        icono: m.icono ?? null,
      },
      update: { nombre: m.nombre, esBase: m.esBase, icono: m.icono ?? null },
    })
  }

  console.log('Seed: verticales y módulos creados.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
