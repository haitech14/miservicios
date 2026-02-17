/**
 * Helper para agregar puntos desde servicios
 * Facilita la integración de puntos en diferentes módulos
 */

import { agregarPuntos } from './gamificacion.js'

/**
 * Puntos predefinidos por acción
 */
export const PUNTOS_POR_ACCION: Record<string, number> = {
  // Comedor
  reservar_ticket_comedor: 10,
  usar_comedor: 5,

  // Transporte
  usar_transporte: 5,

  // Gimnasio
  reservar_gimnasio: 10,
  asistir_gimnasio: 15,

  // Eventos
  crear_evento: 15,
  asistir_evento: 20,

  // Comunidad
  pagar_cuota: 20,
  donar: 50,
  participar_votacion: 10,
  crear_post: 5,
  comentar: 3,
  reaccionar: 1,

  // Perfil
  completar_perfil: 20,
  subir_foto_perfil: 5,
  subir_foto_portada: 5,

  // Otros
  primera_vez: 10,
}

/**
 * Agrega puntos por una acción específica
 */
export async function agregarPuntosPorAccion(
  userId: string,
  accion: string,
  servicioId?: string,
  servicioNombre?: string
) {
  const puntos = PUNTOS_POR_ACCION[accion] || 0
  if (puntos > 0) {
    return await agregarPuntos(userId, puntos, accion, servicioId, servicioNombre)
  }
  return null
}
