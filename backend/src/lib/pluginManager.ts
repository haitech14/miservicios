/**
 * Sistema de plugins/módulos extensibles
 * Permite agregar nuevos servicios sin modificar el código base
 */

export interface Plugin {
  id: string
  nombre: string
  version: string
  verticales: string[]
  rutas: PluginRoute[]
  hooks: PluginHook[]
  configuracion?: PluginConfigSchema
}

export interface PluginRoute {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  handler: (req: any, res: any) => Promise<any>
}

export interface PluginHook {
  evento: string
  handler: (data: any) => Promise<void>
}

export interface PluginConfigSchema {
  campos: Array<{
    clave: string
    tipo: 'string' | 'number' | 'boolean' | 'json'
    requerido: boolean
    default?: any
  }>
}

class PluginManager {
  private plugins: Map<string, Plugin> = new Map()

  /**
   * Registra un plugin
   */
  registrar(plugin: Plugin) {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin ${plugin.id} ya está registrado`)
    }
    this.plugins.set(plugin.id, plugin)
  }

  /**
   * Obtiene un plugin por ID
   */
  obtener(id: string): Plugin | undefined {
    return this.plugins.get(id)
  }

  /**
   * Lista todos los plugins
   */
  listar(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Lista plugins compatibles con una vertical
   */
  listarPorVertical(verticalSlug: string): Plugin[] {
    return Array.from(this.plugins.values()).filter((p) => p.verticales.includes(verticalSlug))
  }

  /**
   * Ejecuta un hook
   */
  async ejecutarHook(evento: string, data: any) {
    const hooks = Array.from(this.plugins.values())
      .flatMap((p) => p.hooks)
      .filter((h) => h.evento === evento)

    await Promise.all(hooks.map((h) => h.handler(data)))
  }

  /**
   * Obtiene rutas de todos los plugins
   */
  obtenerRutas(): PluginRoute[] {
    return Array.from(this.plugins.values()).flatMap((p) => p.rutas)
  }
}

export const pluginManager = new PluginManager()
