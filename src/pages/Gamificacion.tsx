import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { DailyRewardWheel } from '../components/DailyRewardWheel'

interface Mision {
  id: string
  titulo: string
  descripcion: string
  puntos: number
  tipo: 'diaria' | 'semanal' | 'especial'
  estado: 'disponible' | 'completada' | 'en_curso'
  progreso: number
  objetivo: number
  expiraEn?: string
}

interface Streak {
  dias: number
  maxDias: number
  emoji: string
  bonificacionPuntos: number
}

const misionesEjemplo: Mision[] = [
  {
    id: 'm1',
    titulo: 'Primer café del día',
    descripcion: 'Reserva un ticket de comedor antes de las 10am',
    puntos: 20,
    tipo: 'diaria',
    estado: 'disponible',
    progreso: 0,
    objetivo: 1,
  },
  {
    id: 'm2',
    titulo: 'Héroe del transporte',
    descripcion: 'Usa el transporte universitario 3 veces esta semana',
    puntos: 30,
    tipo: 'semanal',
    estado: 'disponible',
    progreso: 1,
    objetivo: 3,
  },
  {
    id: 'm3',
    titulo: 'Lector empedernido',
    descripcion: 'Reserva un espacio en biblioteca por 2+ horas',
    puntos: 25,
    tipo: 'diaria',
    estado: 'disponible',
    progreso: 0,
    objetivo: 1,
  },
  {
    id: 'm4',
    titulo: 'Estrella académica',
    descripcion: 'Asiste a todas tus clases esta semana',
    puntos: 100,
    tipo: 'especial',
    estado: 'en_curso',
    progreso: 4,
    objetivo: 5,
    expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const canjeoPremios = [
  { id: 'p1', nombre: 'Café gratis en comedor', puntos: 200, icono: '☕' },
  { id: 'p2', nombre: 'Pase libre en gimnasio', puntos: 300, icono: '🏋️' },
  { id: 'p3', nombre: 'Libro de la biblioteca', puntos: 150, icono: '📚' },
  { id: 'p4', nombre: 'Descuento en transporte', puntos: 250, icono: '🚌' },
  { id: 'p5', nombre: 'Entrada a evento exclusivo', puntos: 500, icono: '🎉' },
]

export function Gamificacion() {
  const { user } = useAuth()
  const [perfil, setPerfil] = useState<any>(null)
  const [logros, setLogros] = useState<any[]>([])
  const [logrosDisponibles, setLogrosDisponibles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Nuevos estados
  const [misiones, setMisiones] = useState<Mision[]>(misionesEjemplo)
  const [activeTab, setActiveTab] = useState<'misiones' | 'logros' | 'canjeo'>('misiones')
  const [puntosCanjeo, setPuntosCanjeo] = useState(0)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const [perfilData, misLogros, todosLogros] = await Promise.all([
        api.gamificacion.miPerfil().catch(() => null),
        api.gamificacion.misLogros().catch(() => []),
        api.gamificacion.logros().catch(() => []),
      ])

      setPerfil(perfilData)
      setLogros(misLogros as any[])
      setLogrosDisponibles(todosLogros as any[])
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const puntosParaSiguienteNivel = (nivel: number, puntos: number) => {
    const puntosSiguienteNivel = Math.pow(nivel, 2) * 100
    return puntosSiguienteNivel - puntos
  }

  const progresoNivel = (nivel: number, puntos: number) => {
    const puntosNivelActual = Math.pow(nivel - 1, 2) * 100
    const puntosSiguienteNivel = Math.pow(nivel, 2) * 100
    const rango = puntosSiguienteNivel - puntosNivelActual
    const progreso = puntos - puntosNivelActual
    return Math.min(100, Math.max(0, (progreso / rango) * 100))
  }

  const calcularStreak = (puntos: number): Streak => {
    const dias = Math.floor(puntos / 50)
    const niveles = [
      { max: 7, emoji: '🔥', bonificacion: 50 },
      { max: 14, emoji: '⚡', bonificacion: 100 },
      { max: 30, emoji: '💎', bonificacion: 200 },
      { max: 60, emoji: '🏆', bonificacion: 500 },
      { max: 100, emoji: '👑', bonificacion: 1000 },
    ]
    
    for (const nivel of niveles) {
      if (dias <= nivel.max) {
        return {
          dias,
          maxDias: nivel.max,
          emoji: nivel.emoji,
          bonificacionPuntos: nivel.bonificacion,
        }
      }
    }
    return { dias, maxDias: 100, emoji: '👑', bonificacionPuntos: 1000 }
  }

  const handleCompletarMision = async (mision: Mision) => {
    try {
      // Simular completar misión
      setMisiones(
        misiones.map((m) =>
          m.id === mision.id ? { ...m, estado: 'completada', progreso: m.objetivo } : m
        )
      )

      // Añadir puntos por misión
      if (perfil) {
        setPerfil({ ...perfil, puntosTotales: (perfil.puntosTotales || 0) + mision.puntos })
      }

      alert(`¡Misión completada! +${mision.puntos} puntos`)
    } catch (error) {
      console.error('Error completando misión:', error)
      alert('Error al completar misión')
    }
  }

  const handleCanjearPremio = async (premio: any) => {
    const puntos = perfil?.puntosTotales || 0
    
    if (puntos < premio.puntos) {
      alert(`Necesitas ${premio.puntos} puntos para este premio. Tienes ${puntos} puntos.`)
      return
    }
    
    try {
      if (!confirm(`¿Canjear "${premio.nombre}" por ${premio.puntos} puntos?`)) {
        return
      }
      
      // Simular canje
      setPerfil({ ...perfil, puntosTotales: puntos - premio.puntos })
      setPuntosCanjeo(premio.puntos)
      
      setTimeout(() => setPuntosCanjeo(0), 3000)
      alert(`¡Premio canjeado! Te quedan ${puntos - premio.puntos} puntos.`)
    } catch (error) {
      console.error('Error canjeando premio:', error)
      alert('Error al canjear premio')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        <Header title="Gamificación" showBack showLogo={false} />
        <main className="max-w-4xl mx-auto px-4 py-4">
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        </main>
      </div>
    )
  }

  const puntos = perfil?.puntosTotales || 0
  const nivel = perfil?.nivel || 1
  const ranking = perfil?.rankingGeneral || null
  const streak = calcularStreak(puntos)

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Gamificación" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Premio diario / ruleta */}
        {user?.organizationId && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Premio diario</h2>
            <DailyRewardWheel organizationId={user.organizationId} />
          </div>
        )}

        {/* Dashboard personal mejorado */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>
            {puntosCanjeo > 0 && (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full animate-bounce">
                <span className="font-bold">+{puntosCanjeo} pts</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{puntos}</div>
              <div className="text-sm text-gray-600">Puntos Totales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Nivel {nivel}</div>
              <div className="text-sm text-gray-600">Nivel Actual</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {ranking ? `#${ranking}` : '-'}
              </div>
              <div className="text-sm text-gray-600">Ranking</div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Racha de Actividad</div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{streak.emoji}</span>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{streak.dias} días</div>
                    <div className="text-sm text-gray-600">de {streak.maxDias} para bonificación</div>
                  </div>
                </div>
              </div>
              {streak.bonificacionPuntos > 0 && (
                <div className="text-right">
                  <div className="text-sm text-orange-600 font-medium">+{streak.bonificacionPuntos} pts</div>
                  <div className="text-xs text-gray-500">Bonificación</div>
                </div>
              )}
            </div>
          </div>

          {/* Barra de progreso */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso al Nivel {nivel + 1}</span>
              <span>{puntosParaSiguienteNivel(nivel, puntos)} puntos restantes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${progresoNivel(nivel, puntos)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs de gamificación */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('misiones')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'misiones'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🎯 Misiones
            </button>
            <button
              onClick={() => setActiveTab('logros')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'logros'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🏆 Logros
            </button>
            <button
              onClick={() => setActiveTab('canjeo')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'canjeo'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🎁 Canjeo
            </button>
          </div>

          {/* Contenido por tab */}
          <div className="p-6">
            {activeTab === 'misiones' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Misiones Disponibles</h3>
                <div className="space-y-4">
                  {misiones.filter(m => m.estado === 'disponible').map((mision) => (
                    <div
                      key={mision.id}
                      className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              mision.tipo === 'diaria' ? 'bg-blue-100 text-blue-700' :
                              mision.tipo === 'semanal' ? 'bg-purple-100 text-purple-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {mision.tipo}
                            </span>
                            <h4 className="font-bold text-gray-900">{mision.titulo}</h4>
                          </div>
                          <p className="text-gray-600 text-sm">{mision.descripcion}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">+{mision.puntos}</div>
                          <div className="text-xs text-gray-500">pts</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCompletarMision(mision)}
                        className="w-full py-3 bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all"
                      >
                        Completar Misión
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'logros' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Mis Logros</h3>
                {logros.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aún no has desbloqueado logros. ¡Completa misiones para ganarlos!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {logros.map((logro: any) => (
                      <div
                        key={logro.id}
                        className="p-4 border-2 border-primary rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-center"
                      >
                        <div className="text-4xl mb-2">{logro.achievement?.icono || '🏆'}</div>
                        <div className="font-semibold text-gray-900">{logro.achievement?.nombre}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {new Date(logro.fechaDesbloqueo).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'canjeo' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Tienda de Premios</h3>
                  <div className="text-sm text-gray-600">
                    Tienes <span className="font-bold text-primary">{puntos}</span> puntos
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {canjeoPremios.map((premio) => (
                    <div
                      key={premio.id}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all"
                    >
                      <div className="text-5xl mb-3 text-center">{premio.icono}</div>
                      <div className="font-semibold text-gray-900 text-center mb-2">{premio.nombre}</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{premio.puntos}</div>
                        <div className="text-xs text-gray-500">puntos</div>
                      </div>
                      <button
                        onClick={() => handleCanjearPremio(premio)}
                        disabled={puntos < premio.puntos}
                        className={`w-full mt-3 py-2.5 font-semibold rounded-lg transition-all ${
                          puntos >= premio.puntos
                            ? 'bg-gradient-to-r from-primary to-indigo-600 text-white hover:shadow-lg'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {puntos >= premio.puntos ? 'Canjear' : `${premio.puntos - puntos} pts más`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas de servicios */}
        {perfil?.serviceScores && perfil.serviceScores.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Puntos por Servicio</h2>
            <div className="space-y-3">
              {perfil.serviceScores.map((score: any) => (
                <div key={score.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                  <div>
                    <div className="font-semibold text-gray-900">{score.servicioNombre}</div>
                    {score.rankingEnServicio && (
                      <div className="text-sm text-gray-600">Posición #{score.rankingEnServicio}</div>
                    )}
                  </div>
                  <div className="text-xl font-bold text-primary">{score.puntos} pts</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
