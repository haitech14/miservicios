import { useState, useRef, useEffect } from 'react'
import { SERVICIOS } from '../constants/servicios'

type TipoConversacion = 'general' | 'servicio' | 'grupo' | 'individual'
type RangoUsuario = 'estudiante' | 'docente' | 'admin' | 'coordinador' | 'director'

interface Miembro {
  id: string
  nombre: string
  apellidos: string
  avatar: string
  rango: RangoUsuario
  online?: boolean
}

interface Mensaje {
  id: string
  texto: string
  esMio: boolean
  fecha: Date
  leido?: boolean
  autorId?: string
  autorNombre?: string
}

interface Conversacion {
  id: string
  nombre: string
  avatar: string
  tipo: TipoConversacion
  ultimoMensaje: string
  ultimaHora: string
  mensajes: Mensaje[]
  miembros?: Miembro[]
  servicioClave?: string
  noLeidos?: number
  pinned?: boolean
}

// Función para obtener el color del rango
function getRangoColor(rango: RangoUsuario): string {
  const colores: Record<RangoUsuario, string> = {
    estudiante: 'text-blue-600 bg-blue-50',
    docente: 'text-purple-600 bg-purple-50',
    admin: 'text-red-600 bg-red-50',
    coordinador: 'text-orange-600 bg-orange-50',
    director: 'text-green-600 bg-green-50',
  }
  return colores[rango] || 'text-gray-600 bg-gray-50'
}

// Función para obtener el label del rango
function getRangoLabel(rango: RangoUsuario): string {
  const labels: Record<RangoUsuario, string> = {
    estudiante: 'Estudiante',
    docente: 'Docente',
    admin: 'Admin',
    coordinador: 'Coordinador',
    director: 'Director',
  }
  return labels[rango] || rango
}

const CONVERSACIONES_INICIAL: Conversacion[] = [
  {
    id: 'general',
    nombre: 'Chat General',
    avatar: '💬',
    tipo: 'general',
    ultimoMensaje: 'Bienvenidos al chat general de la organización',
    ultimaHora: '10:30',
    pinned: true,
    mensajes: [
      { id: 'm1', texto: 'Bienvenidos al chat general', esMio: false, fecha: new Date(), leido: true, autorNombre: 'Sistema' },
    ],
    miembros: [
      { id: 'u1', nombre: 'Juan', apellidos: 'Pérez', avatar: '👤', rango: 'estudiante', online: true },
      { id: 'u2', nombre: 'María', apellidos: 'García', avatar: '👩', rango: 'docente', online: true },
    ],
  },
  {
    id: 'comedor',
    nombre: 'Comedor',
    avatar: '🍽️',
    tipo: 'servicio',
    servicioClave: 'comedor',
    ultimoMensaje: '¿Alguien va al comedor hoy?',
    ultimaHora: '09:15',
    pinned: true,
    noLeidos: 2,
    mensajes: [
      { id: 'm2', texto: '¿Alguien va al comedor hoy?', esMio: false, fecha: new Date(), leido: false, autorNombre: 'Ana García' },
    ],
  },
  {
    id: 'transporte',
    nombre: 'Transporte',
    avatar: '🚌',
    tipo: 'servicio',
    servicioClave: 'transporte',
    ultimoMensaje: 'El bus de la ruta norte saldrá a las 8:00',
    ultimaHora: 'Ayer',
    mensajes: [
      { id: 'm3', texto: 'El bus de la ruta norte saldrá a las 8:00', esMio: false, fecha: new Date(), leido: true, autorNombre: 'Sistema' },
    ],
  },
  {
    id: 'grupo-literatura',
    nombre: 'Grupo - Estudiantes Literatura',
    avatar: '👥',
    tipo: 'grupo',
    ultimoMensaje: '¿Alguien tiene el resumen del cap. 3?',
    ultimaHora: '10:30',
    noLeidos: 1,
    mensajes: [
      { id: 'm4', texto: '¿Alguien tiene el resumen del cap. 3?', esMio: false, fecha: new Date(), leido: false, autorNombre: 'Carlos López' },
    ],
    miembros: [
      { id: 'u3', nombre: 'Carlos', apellidos: 'López', avatar: '👨', rango: 'estudiante', online: false },
      { id: 'u4', nombre: 'Laura', apellidos: 'Martínez', avatar: '👩', rango: 'estudiante', online: true },
    ],
  },
  {
    id: 'ana-garcia',
    nombre: 'Ana García',
    avatar: '👩',
    tipo: 'individual',
    ultimoMensaje: 'Gracias por la ayuda',
    ultimaHora: 'Ayer',
    mensajes: [
      { id: 'm5', texto: 'Gracias por la ayuda', esMio: false, fecha: new Date(), leido: true, autorNombre: 'Ana García' },
    ],
    miembros: [
      { id: 'u2', nombre: 'Ana', apellidos: 'García', avatar: '👩', rango: 'docente', online: true },
    ],
  },
  {
    id: 'carlos-lopez',
    nombre: 'Carlos López',
    avatar: '👨',
    tipo: 'individual',
    ultimoMensaje: 'Perfecto, nos vemos',
    ultimaHora: 'Lun',
    mensajes: [
      { id: 'm6', texto: 'Perfecto, nos vemos', esMio: false, fecha: new Date(), leido: true, autorNombre: 'Carlos López' },
    ],
    miembros: [
      { id: 'u3', nombre: 'Carlos', apellidos: 'López', avatar: '👨', rango: 'estudiante', online: false },
    ],
  },
]

function formatearHora(d: Date) {
  const ahora = new Date()
  const ayer = new Date(ahora)
  ayer.setDate(ayer.getDate() - 1)
  
  if (d.toDateString() === ahora.toDateString()) {
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  } else if (d.toDateString() === ayer.toDateString()) {
    return 'Ayer'
  } else {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    return dias[d.getDay()]
  }
}

export function ChatSidebar() {
  const [expandido, setExpandido] = useState(false)
  const [conversaciones, setConversaciones] = useState<Conversacion[]>(CONVERSACIONES_INICIAL)
  const [chatSeleccionado, setChatSeleccionado] = useState<Conversacion | null>(null)
  const [mensajeNuevo, setMensajeNuevo] = useState('')
  const mensajesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    scrollToBottom()
  }, [chatSeleccionado, conversaciones])

  const enviarMensaje = () => {
    if (!mensajeNuevo.trim() || !chatSeleccionado) return
    const msg: Mensaje = {
      id: `m${Date.now()}`,
      texto: mensajeNuevo.trim(),
      esMio: true,
      fecha: new Date(),
      leido: false,
    }
    setConversaciones((prev) =>
      prev.map((c) =>
        c.id === chatSeleccionado.id
          ? {
              ...c,
              mensajes: [...c.mensajes, msg],
              ultimoMensaje: msg.texto,
              ultimaHora: formatearHora(msg.fecha),
              noLeidos: 0,
            }
          : c
      )
    )
    setChatSeleccionado((prev) =>
      prev
        ? {
            ...prev,
            mensajes: [...prev.mensajes, msg],
            ultimoMensaje: msg.texto,
            ultimaHora: formatearHora(msg.fecha),
            noLeidos: 0,
          }
        : null
    )
    setMensajeNuevo('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensaje()
    }
  }

  // Organizar conversaciones por tipo
  const conversacionesPinned = conversaciones.filter((c) => c.pinned)
  const conversacionesServicios = conversaciones.filter((c) => c.tipo === 'servicio' && !c.pinned)
  const conversacionesGrupos = conversaciones.filter((c) => c.tipo === 'grupo' && !c.pinned)
  const conversacionesIndividuales = conversaciones.filter((c) => c.tipo === 'individual' && !c.pinned)

  const renderListaConversaciones = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Chats fijados */}
      {conversacionesPinned.length > 0 && (
        <>
          <p className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider sticky top-0 bg-white z-10">
            Fijados
          </p>
          {conversacionesPinned.map((c) => renderItemConversacion(c))}
        </>
      )}

      {/* Chats de servicios */}
      {conversacionesServicios.length > 0 && (
        <>
          <p className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider sticky top-0 bg-white z-10">
            Comunidades por Servicio
          </p>
          {conversacionesServicios.map((c) => renderItemConversacion(c))}
        </>
      )}

      {/* Grupos */}
      {conversacionesGrupos.length > 0 && (
        <>
          <p className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider sticky top-0 bg-white z-10">
            Grupos
          </p>
          {conversacionesGrupos.map((c) => renderItemConversacion(c))}
        </>
      )}

      {/* Chats individuales */}
      {conversacionesIndividuales.length > 0 && (
        <>
          <p className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider sticky top-0 bg-white z-10">
            Chats
          </p>
          {conversacionesIndividuales.map((c) => renderItemConversacion(c))}
        </>
      )}
    </div>
  )

  const renderItemConversacion = (c: Conversacion) => {
    const servicio = c.servicioClave ? SERVICIOS.find((s) => s.clave === c.servicioClave) : null
    const esGrupo = c.tipo === 'grupo' || c.tipo === 'servicio' || c.tipo === 'general'
    
    return (
      <button
        key={c.id}
        onClick={() => setChatSeleccionado(c)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-100 text-left transition-colors"
      >
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
              c.tipo === 'servicio' && servicio
                ? ''
                : c.tipo === 'general'
                  ? 'bg-green-100'
                  : 'bg-gray-100'
            }`}
            style={
              c.tipo === 'servicio' && servicio
                ? { backgroundColor: `${servicio.color}25` }
                : undefined
            }
          >
            {c.avatar}
          </div>
          {c.tipo === 'individual' && c.miembros?.[0]?.online && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          )}
          {esGrupo && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-medium text-gray-900 truncate text-sm">{c.nombre}</p>
            {c.tipo === 'servicio' && (
              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">
                Servicio
              </span>
            )}
            {c.tipo === 'general' && (
              <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                General
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{c.ultimoMensaje}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs text-gray-400">{c.ultimaHora}</span>
          {c.noLeidos && c.noLeidos > 0 && (
            <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center justify-center">
              {c.noLeidos > 9 ? '9+' : c.noLeidos}
            </span>
          )}
        </div>
      </button>
    )
  }

  return (
    <>
      {/* Botón flotante cuando está minimizado */}
      <button
        onClick={() => setExpandido(true)}
        className={`fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all flex items-center justify-center ${
          expandido ? 'hidden' : ''
        }`}
        aria-label="Abrir chat"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        </svg>
        {conversaciones.reduce((acc, c) => acc + (c.noLeidos || 0), 0) > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
            {conversaciones.reduce((acc, c) => acc + (c.noLeidos || 0), 0) > 9
              ? '9+'
              : conversaciones.reduce((acc, c) => acc + (c.noLeidos || 0), 0)}
          </span>
        )}
      </button>

      {/* Panel del chat */}
      <aside
        className={`fixed top-0 right-0 h-full z-50 flex flex-col bg-white border-l border-gray-200 shadow-xl transition-transform duration-300 ease-in-out ${
          expandido ? 'translate-x-0 w-full sm:w-96' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-green-600 text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <h2 className="font-semibold">Chat</h2>
          </div>
          <button
            onClick={() => setExpandido(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Minimizar chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {chatSeleccionado ? (
          /* Vista de conversación */
          <>
            <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 bg-gray-50">
              <button
                onClick={() => setChatSeleccionado(null)}
                className="p-2 -ml-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                aria-label="Volver a los chats"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                {chatSeleccionado.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">{chatSeleccionado.nombre}</p>
                {chatSeleccionado.tipo === 'individual' && chatSeleccionado.miembros?.[0] && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getRangoColor(
                        chatSeleccionado.miembros[0].rango
                      )}`}
                    >
                      {getRangoLabel(chatSeleccionado.miembros[0].rango)}
                    </span>
                    {chatSeleccionado.miembros[0].online && (
                      <span className="text-[10px] text-green-600">● En línea</span>
                    )}
                  </div>
                )}
                {chatSeleccionado.tipo === 'grupo' && chatSeleccionado.miembros && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {chatSeleccionado.miembros.length} {chatSeleccionado.miembros.length === 1 ? 'miembro' : 'miembros'}
                  </p>
                )}
                {chatSeleccionado.tipo === 'servicio' && (
                  <p className="text-xs text-gray-500 mt-0.5">Comunidad del servicio</p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5] bg-opacity-50">
              {chatSeleccionado.mensajes.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.esMio ? 'justify-end' : 'justify-start'} ${chatSeleccionado.tipo !== 'individual' && !m.esMio ? 'flex-col' : ''}`}
                >
                  {chatSeleccionado.tipo !== 'individual' && !m.esMio && m.autorNombre && (
                    <span className="text-xs text-gray-600 mb-0.5 px-1">{m.autorNombre}</span>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm ${
                      m.esMio
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{m.texto}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        m.esMio ? 'text-green-100' : 'text-gray-400'
                      }`}
                    >
                      {formatearHora(m.fecha)}
                      {m.esMio && (
                        <span className="ml-1">
                          {m.leido ? '✓✓' : '✓'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={mensajesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mensajeNuevo}
                  onChange={(e) => setMensajeNuevo(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm"
                />
                <button
                  onClick={enviarMensaje}
                  disabled={!mensajeNuevo.trim()}
                  className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          renderListaConversaciones()
        )}
      </aside>

      {/* Overlay en móvil cuando está expandido */}
      {expandido && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setExpandido(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
