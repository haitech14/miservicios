import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

interface DailyRewardWheelProps {
  organizationId: string
}

export function DailyRewardWheel({ organizationId }: DailyRewardWheelProps) {
  const { user } = useAuth()
  const [config, setConfig] = useState<any>(null)
  const [estado, setEstado] = useState<any>(null)
  const [spinning, setSpinning] = useState(false)
  const [premioGanado, setPremioGanado] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [organizationId])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const configData = await api.configuracion.gamificacion.get(organizationId).catch(() => null)
      setConfig(configData)

      if (configData && (configData as any).dailyRewardId) {
        const estadoData = await api.gamificacion.estadoPremioDiario((configData as any).dailyRewardId).catch(() => null)
        setEstado(estadoData)
      }
    } catch (error) {
      console.error('Error cargando configuración:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSpin = async () => {
    if (!config || !user || spinning) return

    try {
      setSpinning(true)
      const resultado = await api.gamificacion.premioDiario(config.dailyRewardId || '')
      setPremioGanado((resultado as any).premio)
      await loadConfig() // Recargar estado
    } catch (error: any) {
      alert(error.message || 'Error al reclamar premio')
    } finally {
      setSpinning(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando...</div>
  }

  if (!config || !config.premiosDiariosActivos) {
    return (
      <div className="text-center py-8 text-gray-500">
        Los premios diarios no están activos para esta organización
      </div>
    )
  }

  const puedeReclamar = estado?.puedeReclamar !== false
  const premios = config.premios || []

  if (config.tipo === 'ruleta') {
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 mb-6">
          <div
            className={`w-full h-full rounded-full border-8 border-primary relative overflow-hidden ${
              spinning ? 'animate-spin' : ''
            }`}
            style={{
              transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {premios.map((premio: any, index: number) => {
              const angle = (360 / premios.length) * index
              return (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: 'center',
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-center"
                    style={{ width: '50%', paddingTop: '10px' }}
                  >
                    <div className="text-2xl">{premio.icono || '🎁'}</div>
                    <div className="text-xs font-semibold">{premio.nombre}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary" />
          </div>
        </div>

        {premioGanado && (
          <div className="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded-xl text-center">
            <div className="text-3xl mb-2">{premioGanado.icono || '🎉'}</div>
            <div className="font-bold text-green-700">¡Ganaste {premioGanado.nombre}!</div>
            {premioGanado.puntos && (
              <div className="text-sm text-green-600 mt-1">+{premioGanado.puntos} puntos</div>
            )}
          </div>
        )}

        <button
          onClick={handleSpin}
          disabled={!puedeReclamar || spinning}
          className={`px-8 py-4 rounded-xl font-semibold text-white transition-colors ${
            puedeReclamar && !spinning
              ? 'bg-primary hover:bg-primary-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {spinning ? 'Girando...' : puedeReclamar ? 'Girar Ruleta' : 'Ya reclamaste hoy'}
        </button>
      </div>
    )
  }

  // Sorteo simple
  return (
    <div className="flex flex-col items-center">
      {premioGanado ? (
        <div className="mb-6 p-6 bg-green-50 border-2 border-green-500 rounded-xl text-center">
          <div className="text-5xl mb-3">{premioGanado.icono || '🎉'}</div>
          <div className="text-2xl font-bold text-green-700 mb-2">{premioGanado.nombre}</div>
          {premioGanado.puntos && (
            <div className="text-lg text-green-600">+{premioGanado.puntos} puntos</div>
          )}
        </div>
      ) : (
        <div className="mb-6 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl text-center">
          <div className="text-5xl mb-3">🎁</div>
          <div className="text-gray-600">Haz clic para reclamar tu premio diario</div>
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={!puedeReclamar || spinning}
        className={`px-8 py-4 rounded-xl font-semibold text-white transition-colors ${
          puedeReclamar && !spinning
            ? 'bg-primary hover:bg-primary-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {spinning ? 'Reclamando...' : puedeReclamar ? 'Reclamar Premio' : 'Ya reclamaste hoy'}
      </button>
    </div>
  )
}
