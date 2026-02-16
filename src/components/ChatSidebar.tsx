import { useState, useRef, useEffect } from 'react'

interface Mensaje {
  id: string
  texto: string
  esMio: boolean
  fecha: Date
  leido?: boolean
}

interface Conversacion {
  id: string
  nombre: string
  avatar: string
  ultimoMensaje: string
  ultimaHora: string
  mensajes: Mensaje[]
}

const CONVERSACIONES_INICIAL: Conversacion[] = [
  {
    id: '1',
    nombre: 'Grupo - Estudiantes Literatura',
    avatar: '👥',
    ultimoMensaje: '¿Alguien tiene el resumen del cap. 3?',
    ultimaHora: '10:30',
    mensajes: [
      { id: 'm1', texto: 'Hola, ¿tienen el material de la clase?', esMio: false, fecha: new Date(), leido: true },
      { id: 'm2', texto: 'Sí, lo paso en un momento', esMio: true, fecha: new Date(), leido: true },
      { id: 'm3', texto: '¿Alguien tiene el resumen del cap. 3?', esMio: false, fecha: new Date(), leido: false },
    ],
  },
  {
    id: '2',
    nombre: 'Ana García',
    avatar: '👩',
    ultimoMensaje: 'Gracias por la ayuda',
    ultimaHora: 'Ayer',
    mensajes: [
      { id: 'm4', texto: '¿Vas al comedor hoy?', esMio: false, fecha: new Date(), leido: true },
      { id: 'm5', texto: 'Sí, a las 12', esMio: true, fecha: new Date(), leido: true },
      { id: 'm6', texto: 'Gracias por la ayuda', esMio: false, fecha: new Date(), leido: false },
    ],
  },
  {
    id: '3',
    nombre: 'Carlos López',
    avatar: '👨',
    ultimoMensaje: 'Perfecto, nos vemos',
    ultimaHora: 'Lun',
    mensajes: [
      { id: 'm7', texto: '¿Compartimos taxi a la universidad?', esMio: true, fecha: new Date(), leido: true },
      { id: 'm8', texto: 'Perfecto, nos vemos', esMio: false, fecha: new Date(), leido: true },
    ],
  },
]

function formatearHora(d: Date) {
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
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
                className="p-1 hover:bg-gray-200 rounded-lg md:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                {chatSeleccionado.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{chatSeleccionado.nombre}</p>
                <p className="text-xs text-gray-500">Estudiante / Miembro</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5] bg-opacity-50">
              {chatSeleccionado.mensajes.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.esMio ? 'justify-end' : 'justify-start'}`}
                >
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
          /* Lista de conversaciones */
          <div className="flex-1 overflow-y-auto">
            <p className="px-4 py-2 text-xs text-gray-500 font-medium">
              Chatea con estudiantes y miembros de tu organización
            </p>
            {conversaciones.map((c) => (
              <button
                key={c.id}
                onClick={() => setChatSeleccionado(c)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{c.nombre}</p>
                  <p className="text-sm text-gray-500 truncate">{c.ultimoMensaje}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{c.ultimaHora}</span>
              </button>
            ))}
          </div>
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
