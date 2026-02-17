import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Crea una notificación para un usuario
 */
export async function crearNotificacion(
  userId: string,
  tipo: string,
  titulo: string,
  mensaje: string,
  enlace?: string
) {
  return await prisma.notificacion.create({
    data: {
      userId,
      tipo,
      titulo,
      mensaje,
      enlace: enlace || null,
      leida: false,
    },
  })
}

/**
 * Envía push notification (requiere implementación con servicio externo)
 */
export async function enviarPush(userId: string, titulo: string, mensaje: string) {
  const pushConfig = await prisma.notificacionPush.findUnique({
    where: { userId },
  })

  if (!pushConfig || !pushConfig.activo) {
    return false
  }

  // TODO: Implementar envío real con FCM, OneSignal, etc.
  // Por ahora solo crear notificación
  await crearNotificacion(userId, 'push', titulo, mensaje)

  return true
}

/**
 * Envía email (requiere implementación con servicio de email)
 */
export async function enviarEmail(userId: string, asunto: string, contenido: string) {
  // TODO: Implementar envío real con servicio de email (SendGrid, Resend, etc.)
  
  // Guardar en historial
  await prisma.notificacionEmail.create({
    data: {
      userId,
      asunto,
      contenido,
      enviado: false, // Cambiar a true cuando se implemente
    },
  })

  return true
}

/**
 * Notifica un evento a múltiples usuarios
 */
export async function notificarEvento(
  evento: string,
  usuarios: string[],
  datos: { titulo: string; mensaje: string; enlace?: string }
) {
  const notificaciones = usuarios.map((userId) =>
    crearNotificacion(userId, evento, datos.titulo, datos.mensaje, datos.enlace)
  )

  await Promise.all(notificaciones)

  // Enviar push a usuarios que tengan activo
  for (const userId of usuarios) {
    const pushConfig = await prisma.notificacionPush.findUnique({
      where: { userId },
    })

    if (pushConfig && pushConfig.activo) {
      await enviarPush(userId, datos.titulo, datos.mensaje)
    }
  }
}
