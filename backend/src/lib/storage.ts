import { supabaseAdmin } from './supabase.js'

/**
 * Sube un archivo a Supabase Storage
 */
export async function subirArchivo(
  bucket: string,
  ruta: string,
  archivo: Buffer | File,
  contentType?: string
): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error('Supabase no configurado')
  }

  const { data, error } = await supabaseAdmin.storage.from(bucket).upload(ruta, archivo, {
    contentType,
    upsert: true,
  })

  if (error) {
    throw new Error(`Error al subir archivo: ${error.message}`)
  }

  // Obtener URL pública
  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(ruta)

  return urlData.publicUrl
}

/**
 * Sube una imagen de perfil
 */
export async function subirFotoPerfil(userId: string, archivo: Buffer | File): Promise<string> {
  const extension = archivo instanceof File ? archivo.name.split('.').pop() : 'jpg'
  const ruta = `perfiles/${userId}/foto.${extension}`
  return await subirArchivo('avatars', ruta, archivo, 'image/jpeg')
}

/**
 * Sube una imagen de portada
 */
export async function subirFotoPortada(userId: string, archivo: Buffer | File): Promise<string> {
  const extension = archivo instanceof File ? archivo.name.split('.').pop() : 'jpg'
  const ruta = `portadas/${userId}/portada.${extension}`
  return await subirArchivo('covers', ruta, archivo, 'image/jpeg')
}

/**
 * Sube logo de organización
 */
export async function subirLogoOrganizacion(orgId: string, archivo: Buffer | File): Promise<string> {
  const extension = archivo instanceof File ? archivo.name.split('.').pop() : 'png'
  const ruta = `organizaciones/${orgId}/logo.${extension}`
  return await subirArchivo('logos', ruta, archivo, 'image/png')
}

/**
 * Sube portada de organización
 */
export async function subirPortadaOrganizacion(orgId: string, archivo: Buffer | File): Promise<string> {
  const extension = archivo instanceof File ? archivo.name.split('.').pop() : 'jpg'
  const ruta = `organizaciones/${orgId}/portada.${extension}`
  return await subirArchivo('covers', ruta, archivo, 'image/jpeg')
}

/**
 * Valida que un archivo sea una imagen válida
 */
export function validarImagen(archivo: File): { valido: boolean; error?: string } {
  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const tamanoMaximo = 5 * 1024 * 1024 // 5MB

  if (!tiposPermitidos.includes(archivo.type)) {
    return {
      valido: false,
      error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP)',
    }
  }

  if (archivo.size > tamanoMaximo) {
    return {
      valido: false,
      error: 'El archivo es demasiado grande. Máximo 5MB',
    }
  }

  return { valido: true }
}
