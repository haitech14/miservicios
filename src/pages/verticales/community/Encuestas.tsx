import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'

export function Encuestas() {
  const { user } = useAuth()
  const [encuestas, setEncuestas] = useState<any[]>([])
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [crearEncuesta, setCrearEncuesta] = useState(false)
  const [nuevaEncuesta, setNuevaEncuesta] = useState({
    titulo: '',
    descripcion: '',
    anonima: false,
    fechaInicio: '',
    fechaFin: '',
    preguntas: [{ texto: '', tipo: 'opcion_multiple', opciones: [''] }],
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadEncuestas()
    }
  }, [user])

  useEffect(() => {
    if (encuestaSeleccionada) {
      loadDetalleEncuesta()
    }
  }, [encuestaSeleccionada])

  const loadEncuestas = async () => {
    try {
      setLoading(true)
      // TODO: Implementar endpoint de encuestas
      // const data = await api.comunidad.encuestas.list(user?.organizationId || '')
      // setEncuestas(data as any[])
      setEncuestas([])
    } catch (error) {
      console.error('Error cargando encuestas:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDetalleEncuesta = async () => {
    // Cargar detalles de la encuesta seleccionada
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return

    try {
      // TODO: Implementar endpoint
      // await api.comunidad.encuestas.create({...})
      alert('Funcionalidad de encuestas próximamente disponible')
      setCrearEncuesta(false)
    } catch (error: any) {
      alert(error.message || 'Error al crear encuesta')
    }
  }

  const agregarPregunta = () => {
    setNuevaEncuesta({
      ...nuevaEncuesta,
      preguntas: [...nuevaEncuesta.preguntas, { texto: '', tipo: 'opcion_multiple', opciones: [''] }],
    })
  }

  const actualizarPregunta = (index: number, campo: string, valor: any) => {
    const nuevasPreguntas = [...nuevaEncuesta.preguntas]
    nuevasPreguntas[index] = { ...nuevasPreguntas[index], [campo]: valor }
    setNuevaEncuesta({ ...nuevaEncuesta, preguntas: nuevasPreguntas })
  }

  const agregarOpcion = (preguntaIndex: number) => {
    const nuevasPreguntas = [...nuevaEncuesta.preguntas]
    nuevasPreguntas[preguntaIndex].opciones = [...nuevasPreguntas[preguntaIndex].opciones, '']
    setNuevaEncuesta({ ...nuevaEncuesta, preguntas: nuevasPreguntas })
  }

  if (encuestaSeleccionada) {
    const encuesta = encuestas.find((e: any) => e.id === encuestaSeleccionada)
    if (!encuesta) return null

    return (
      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        <Header title={encuesta.titulo} showBack showLogo={false} />
        <main className="max-w-4xl mx-auto px-4 py-4">
          <div className="mb-4">
            <button
              onClick={() => setEncuestaSeleccionada(null)}
              className="text-primary hover:underline"
            >
              ← Volver a encuestas
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{encuesta.titulo}</h2>
            {encuesta.descripcion && (
              <p className="text-gray-700 mb-6">{encuesta.descripcion}</p>
            )}

            <div className="space-y-6">
              {encuesta.preguntas?.map((pregunta: any, index: number) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {index + 1}. {pregunta.texto}
                  </h3>
                  {pregunta.tipo === 'opcion_multiple' && (
                    <div className="space-y-2">
                      {pregunta.opciones?.map((opcion: any, opIndex: number) => (
                        <label key={opIndex} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name={`pregunta-${index}`} className="text-primary" />
                          <span>{opcion.texto || opcion}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700">
              Enviar Respuestas
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Encuestas" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setCrearEncuesta(true)}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            + Crear Encuesta
          </button>
        </div>

        {crearEncuesta && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Encuesta</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={nuevaEncuesta.titulo}
                  onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, titulo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={nuevaEncuesta.descripcion}
                  onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                  <input
                    type="datetime-local"
                    value={nuevaEncuesta.fechaInicio}
                    onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, fechaInicio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                  <input
                    type="datetime-local"
                    value={nuevaEncuesta.fechaFin}
                    onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, fechaFin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nuevaEncuesta.anonima}
                  onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, anonima: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Encuesta anónima</span>
              </label>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Preguntas</label>
                  <button
                    type="button"
                    onClick={agregarPregunta}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    + Agregar Pregunta
                  </button>
                </div>
                {nuevaEncuesta.preguntas.map((pregunta, index) => (
                  <div key={index} className="mb-4 p-4 border-2 border-gray-200 rounded-lg">
                    <input
                      type="text"
                      value={pregunta.texto}
                      onChange={(e) => actualizarPregunta(index, 'texto', e.target.value)}
                      placeholder={`Pregunta ${index + 1}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                      required
                    />
                    <select
                      value={pregunta.tipo}
                      onChange={(e) => actualizarPregunta(index, 'tipo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                    >
                      <option value="opcion_multiple">Opción Múltiple</option>
                      <option value="texto">Texto Libre</option>
                      <option value="escala">Escala</option>
                    </select>
                    {pregunta.tipo === 'opcion_multiple' && (
                      <div className="space-y-2">
                        {pregunta.opciones.map((opcion: string, opIndex: number) => (
                          <div key={opIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={opcion}
                              onChange={(e) => {
                                const nuevasOpciones = [...pregunta.opciones]
                                nuevasOpciones[opIndex] = e.target.value
                                actualizarPregunta(index, 'opciones', nuevasOpciones)
                              }}
                              placeholder={`Opción ${opIndex + 1}`}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => agregarOpcion(index)}
                          className="text-sm text-primary hover:underline"
                        >
                          + Agregar opción
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearEncuesta(false)
                    setNuevaEncuesta({
                      titulo: '',
                      descripcion: '',
                      anonima: false,
                      fechaInicio: '',
                      fechaFin: '',
                      preguntas: [{ texto: '', tipo: 'opcion_multiple', opciones: [''] }],
                    })
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando encuestas...</div>
        ) : encuestas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-500">No hay encuestas disponibles</p>
            <p className="text-sm text-gray-400 mt-2">Crea una nueva encuesta para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {encuestas.map((encuesta: any) => (
              <div
                key={encuesta.id}
                onClick={() => setEncuestaSeleccionada(encuesta.id)}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{encuesta.titulo}</h3>
                    {encuesta.descripcion && (
                      <p className="text-gray-700 mb-3">{encuesta.descripcion}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(encuesta.fechaInicio).toLocaleDateString()} - {new Date(encuesta.fechaFin).toLocaleDateString()}</span>
                      <span>📝 {encuesta.totalRespuestas || 0} respuestas</span>
                      {encuesta.anonima && <span>🔒 Anónima</span>}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    encuesta.estado === 'activa'
                      ? 'bg-green-100 text-green-700'
                      : encuesta.estado === 'finalizada'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {encuesta.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
