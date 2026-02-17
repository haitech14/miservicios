import type { Modulo } from '../types/verticales'
import type { VerticalSlug } from '../types/verticales'

/**
 * Catálogo de módulos por vertical.
 * esBase: true = obligatorio para la vertical; false = opcional (adicional).
 */
export const MODULOS: Modulo[] = [
  // --- HaiEduCore (base) ---
  { id: 'm-edu-1', clave: 'estudiantes', nombre: 'Gestión de estudiantes', verticalSlug: 'HaiEduCore', esBase: true, icono: '👥' },
  { id: 'm-edu-2', clave: 'matriculas', nombre: 'Matrículas e inscripciones', verticalSlug: 'HaiEduCore', esBase: true, icono: '📋' },
  { id: 'm-edu-3', clave: 'calendario', nombre: 'Calendario académico', verticalSlug: 'HaiEduCore', esBase: true, icono: '📅' },
  { id: 'm-edu-4', clave: 'docentes', nombre: 'Gestión de docentes', verticalSlug: 'HaiEduCore', esBase: true, icono: '👨‍🏫' },
  { id: 'm-edu-5', clave: 'asistencia', nombre: 'Control de asistencia', verticalSlug: 'HaiEduCore', esBase: true, icono: '✅' },
  { id: 'm-edu-6', clave: 'evaluaciones', nombre: 'Evaluaciones y calificaciones', verticalSlug: 'HaiEduCore', esBase: true, icono: '📊' },
  { id: 'm-edu-7', clave: 'expedientes', nombre: 'Expedientes digitales', verticalSlug: 'HaiEduCore', esBase: true, icono: '📁' },
  // HaiEduCore adicionales
  { id: 'm-edu-a1', clave: 'aula_virtual', nombre: 'Aula virtual / LMS', verticalSlug: 'HaiEduCore', esBase: false, icono: '💻' },
  { id: 'm-edu-a2', clave: 'pagos', nombre: 'Pagos y facturación', verticalSlug: 'HaiEduCore', esBase: false, icono: '💳' },
  { id: 'm-edu-a3', clave: 'biblioteca', nombre: 'Biblioteca digital', verticalSlug: 'HaiEduCore', esBase: false, icono: '📚' },
  { id: 'm-edu-a4', clave: 'tutorias', nombre: 'Tutorías y seguimiento académico', verticalSlug: 'HaiEduCore', esBase: false, icono: '🎓' },
  { id: 'm-edu-a5', clave: 'practicas', nombre: 'Gestión de prácticas', verticalSlug: 'HaiEduCore', esBase: false, icono: '🔬' },
  { id: 'm-edu-a6', clave: 'certificados', nombre: 'Certificados automáticos', verticalSlug: 'HaiEduCore', esBase: false, icono: '📜' },
  { id: 'm-edu-a7', clave: 'app_padres', nombre: 'App para padres', verticalSlug: 'HaiEduCore', esBase: false, icono: '👨‍👩‍👧' },
  { id: 'm-edu-a8', clave: 'reportes_ministeriales', nombre: 'Reportes ministeriales', verticalSlug: 'HaiEduCore', esBase: false, icono: '📑' },
  { id: 'm-edu-a9', clave: 'becas', nombre: 'Gestión de becas', verticalSlug: 'HaiEduCore', esBase: false, icono: '🎁' },
  { id: 'm-edu-a10', clave: 'comedor', nombre: 'Comedor', verticalSlug: 'HaiEduCore', esBase: false, icono: '🍽️' },
  { id: 'm-edu-a11', clave: 'transporte', nombre: 'Transporte', verticalSlug: 'HaiEduCore', esBase: false, icono: '🚌' },
  { id: 'm-edu-a12', clave: 'clinica', nombre: 'Clínica', verticalSlug: 'HaiEduCore', esBase: false, icono: '🏥' },
  { id: 'm-edu-a13', clave: 'gimnasio', nombre: 'Gimnasio', verticalSlug: 'HaiEduCore', esBase: false, icono: '🏋️' },
  { id: 'm-edu-a14', clave: 'sum', nombre: 'SUM / Trámites', verticalSlug: 'HaiEduCore', esBase: false, icono: '📋' },
  { id: 'm-edu-a15', clave: 'idiomas', nombre: 'Centro de Idiomas', verticalSlug: 'HaiEduCore', esBase: false, icono: '🌐' },
  { id: 'm-edu-a16', clave: 'mapa', nombre: 'Mapa', verticalSlug: 'HaiEduCore', esBase: false, icono: '🗺️' },

  // --- HaiBizFlow (base) ---
  { id: 'm-biz-1', clave: 'empleados', nombre: 'Gestión de empleados', verticalSlug: 'HaiBizFlow', esBase: true, icono: '👥' },
  { id: 'm-biz-2', clave: 'portal_empleado', nombre: 'Portal del empleado', verticalSlug: 'HaiBizFlow', esBase: true, icono: '🏠' },
  { id: 'm-biz-3', clave: 'beneficios', nombre: 'Beneficios corporativos', verticalSlug: 'HaiBizFlow', esBase: true, icono: '🎁' },
  { id: 'm-biz-4', clave: 'solicitudes', nombre: 'Solicitudes internas (vacaciones, permisos)', verticalSlug: 'HaiBizFlow', esBase: true, icono: '📝' },
  { id: 'm-biz-5', clave: 'nomina', nombre: 'Nómina integrada', verticalSlug: 'HaiBizFlow', esBase: true, icono: '💰' },
  { id: 'm-biz-6', clave: 'documentacion', nombre: 'Documentación laboral', verticalSlug: 'HaiBizFlow', esBase: true, icono: '📄' },
  // HaiBizFlow adicionales
  { id: 'm-biz-a1', clave: 'desempeno', nombre: 'Evaluación de desempeño', verticalSlug: 'HaiBizFlow', esBase: false, icono: '📊' },
  { id: 'm-biz-a2', clave: 'okrs', nombre: 'OKRs / metas SMART', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🎯' },
  { id: 'm-biz-a3', clave: 'onboarding', nombre: 'Onboarding digital', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🚀' },
  { id: 'm-biz-a4', clave: 'clima', nombre: 'Encuestas de clima', verticalSlug: 'HaiBizFlow', esBase: false, icono: '📋' },
  { id: 'm-biz-a5', clave: 'capacitaciones', nombre: 'Gestión de capacitaciones', verticalSlug: 'HaiBizFlow', esBase: false, icono: '📚' },
  { id: 'm-biz-a6', clave: 'activos', nombre: 'Control de activos', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🖥️' },
  { id: 'm-biz-a7', clave: 'entretenimiento', nombre: 'Entretenimiento (eventos, descanso)', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🎉' },
  { id: 'm-biz-a8', clave: 'firma_electronica', nombre: 'Firma electrónica', verticalSlug: 'HaiBizFlow', esBase: false, icono: '✍️' },
  { id: 'm-biz-a9', clave: 'proveedores', nombre: 'Gestión de proveedores', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🏢' },
  { id: 'm-biz-a10', clave: 'comedor', nombre: 'Comedor / Cafetería', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🍽️' },
  { id: 'm-biz-a11', clave: 'transporte', nombre: 'Transporte corporativo', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🚌' },
  { id: 'm-biz-a12', clave: 'gimnasio', nombre: 'Gimnasio corporativo', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🏋️' },
  { id: 'm-biz-a13', clave: 'clinica', nombre: 'Medicina ocupacional / EPS', verticalSlug: 'HaiBizFlow', esBase: false, icono: '🏥' },

  // --- HaiActive (base) ---
  { id: 'm-active-1', clave: 'miembros', nombre: 'Gestión de miembros', verticalSlug: 'HaiActive', esBase: true, icono: '👥' },
  { id: 'm-active-2', clave: 'acceso', nombre: 'Control de acceso (QR / biometría)', verticalSlug: 'HaiActive', esBase: true, icono: '🔐' },
  { id: 'm-active-3', clave: 'planes', nombre: 'Planes y membresías', verticalSlug: 'HaiActive', esBase: true, icono: '📋' },
  { id: 'm-active-4', clave: 'facturacion_recurrente', nombre: 'Facturación recurrente', verticalSlug: 'HaiActive', esBase: true, icono: '💳' },
  { id: 'm-active-5', clave: 'reservas_clases', nombre: 'Reservas de clases', verticalSlug: 'HaiActive', esBase: true, icono: '📅' },
  { id: 'm-active-6', clave: 'asistencia', nombre: 'Control de asistencia', verticalSlug: 'HaiActive', esBase: true, icono: '✅' },
  // HaiActive adicionales
  { id: 'm-active-a1', clave: 'entrenadores', nombre: 'Entrenadores y planificación de rutinas', verticalSlug: 'HaiActive', esBase: false, icono: '🏋️' },
  { id: 'm-active-a2', clave: 'app_socios', nombre: 'App para socios', verticalSlug: 'HaiActive', esBase: false, icono: '📱' },
  { id: 'm-active-a3', clave: 'tienda', nombre: 'Tienda deportiva', verticalSlug: 'HaiActive', esBase: false, icono: '🛒' },
  { id: 'm-active-a4', clave: 'torneos', nombre: 'Torneos y eventos', verticalSlug: 'HaiActive', esBase: false, icono: '🏆' },
  { id: 'm-active-a5', clave: 'evaluacion_fisica', nombre: 'Evaluación física', verticalSlug: 'HaiActive', esBase: false, icono: '📊' },
  { id: 'm-active-a6', clave: 'wearables', nombre: 'Integración con wearables', verticalSlug: 'HaiActive', esBase: false, icono: '⌚' },
  { id: 'm-active-a7', clave: 'fidelizacion', nombre: 'Sistema de puntos y fidelización', verticalSlug: 'HaiActive', esBase: false, icono: '⭐' },

  // --- HaiCare (base) ---
  { id: 'm-care-1', clave: 'pacientes', nombre: 'Gestión de pacientes', verticalSlug: 'HaiCare', esBase: true, icono: '👥' },
  { id: 'm-care-2', clave: 'agenda', nombre: 'Agenda médica', verticalSlug: 'HaiCare', esBase: true, icono: '📅' },
  { id: 'm-care-3', clave: 'historia_clinica', nombre: 'Historia clínica digital', verticalSlug: 'HaiCare', esBase: true, icono: '📁' },
  { id: 'm-care-4', clave: 'facturacion', nombre: 'Facturación', verticalSlug: 'HaiCare', esBase: true, icono: '💳' },
  { id: 'm-care-5', clave: 'especialidades', nombre: 'Gestión de especialidades', verticalSlug: 'HaiCare', esBase: true, icono: '🏥' },
  // HaiCare adicionales
  { id: 'm-care-a1', clave: 'telemedicina', nombre: 'Telemedicina', verticalSlug: 'HaiCare', esBase: false, icono: '📹' },
  { id: 'm-care-a2', clave: 'recetas', nombre: 'Recetas digitales', verticalSlug: 'HaiCare', esBase: false, icono: '💊' },
  { id: 'm-care-a3', clave: 'laboratorio', nombre: 'Laboratorio integrado', verticalSlug: 'HaiCare', esBase: false, icono: '🔬' },
  { id: 'm-care-a4', clave: 'recordatorios', nombre: 'Recordatorios automáticos', verticalSlug: 'HaiCare', esBase: false, icono: '🔔' },
  { id: 'm-care-a5', clave: 'inventario_medico', nombre: 'Control de inventario médico', verticalSlug: 'HaiCare', esBase: false, icono: '📦' },
  { id: 'm-care-a6', clave: 'reportes_regulatorios', nombre: 'Reportes regulatorios', verticalSlug: 'HaiCare', esBase: false, icono: '📑' },

  // --- HaiCommunity (base) ---
  { id: 'm-comm-1', clave: 'socios', nombre: 'Gestión de socios', verticalSlug: 'HaiCommunity', esBase: true, icono: '👥' },
  { id: 'm-comm-2', clave: 'cuotas', nombre: 'Cuotas y aportes', verticalSlug: 'HaiCommunity', esBase: true, icono: '💰' },
  { id: 'm-comm-3', clave: 'eventos', nombre: 'Eventos', verticalSlug: 'HaiCommunity', esBase: true, icono: '📅' },
  { id: 'm-comm-4', clave: 'comunicaciones', nombre: 'Comunicaciones masivas', verticalSlug: 'HaiCommunity', esBase: true, icono: '📢' },
  { id: 'm-comm-5', clave: 'reportes_financieros', nombre: 'Reportes financieros básicos', verticalSlug: 'HaiCommunity', esBase: true, icono: '📊' },
  // HaiCommunity adicionales
  { id: 'm-comm-a1', clave: 'voluntarios', nombre: 'Gestión de voluntarios', verticalSlug: 'HaiCommunity', esBase: false, icono: '🤝' },
  { id: 'm-comm-a2', clave: 'donaciones', nombre: 'Donaciones online', verticalSlug: 'HaiCommunity', esBase: false, icono: '💝' },
  { id: 'm-comm-a3', clave: 'proyectos', nombre: 'Proyectos sociales', verticalSlug: 'HaiCommunity', esBase: false, icono: '📋' },
  { id: 'm-comm-a4', clave: 'transparencia', nombre: 'Transparencia financiera', verticalSlug: 'HaiCommunity', esBase: false, icono: '🔍' },
  { id: 'm-comm-a5', clave: 'portal_comunitario', nombre: 'Portal comunitario', verticalSlug: 'HaiCommunity', esBase: false, icono: '🌐' },
  { id: 'm-comm-a6', clave: 'votaciones', nombre: 'Votaciones digitales', verticalSlug: 'HaiCommunity', esBase: false, icono: '🗳️' },

  // --- HaiFacility (base) ---
  { id: 'm-fac-1', clave: 'espacios', nombre: 'Gestión de espacios', verticalSlug: 'HaiFacility', esBase: true, icono: '🏢' },
  { id: 'm-fac-2', clave: 'reservas', nombre: 'Reservas', verticalSlug: 'HaiFacility', esBase: true, icono: '📅' },
  { id: 'm-fac-3', clave: 'incidencias', nombre: 'Incidencias y mantenimiento', verticalSlug: 'HaiFacility', esBase: true, icono: '🔧' },
  { id: 'm-fac-4', clave: 'facturacion_servicios', nombre: 'Facturación de servicios', verticalSlug: 'HaiFacility', esBase: true, icono: '💳' },
  // HaiFacility adicionales
  { id: 'm-fac-a1', clave: 'control_acceso', nombre: 'Control de acceso', verticalSlug: 'HaiFacility', esBase: false, icono: '🔐' },
  { id: 'm-fac-a2', clave: 'estacionamiento', nombre: 'Gestión de estacionamiento', verticalSlug: 'HaiFacility', esBase: false, icono: '🅿️' },
  { id: 'm-fac-a3', clave: 'marketplace', nombre: 'Marketplace interno', verticalSlug: 'HaiFacility', esBase: false, icono: '🛒' },
  { id: 'm-fac-a4', clave: 'energia', nombre: 'Gestión energética', verticalSlug: 'HaiFacility', esBase: false, icono: '⚡' },
  { id: 'm-fac-a5', clave: 'satisfaccion', nombre: 'Encuestas de satisfacción', verticalSlug: 'HaiFacility', esBase: false, icono: '📋' },
]

export function getModulosByVertical(slug: VerticalSlug): Modulo[] {
  return MODULOS.filter((m) => m.verticalSlug === slug)
}

export function getModulosBaseByVertical(slug: VerticalSlug): Modulo[] {
  return MODULOS.filter((m) => m.verticalSlug === slug && m.esBase)
}

export function getModulosAdicionalesByVertical(slug: VerticalSlug): Modulo[] {
  return MODULOS.filter((m) => m.verticalSlug === slug && !m.esBase)
}

export function getModuloByClave(clave: string): Modulo | undefined {
  return MODULOS.find((m) => m.clave === clave)
}
