import { useState, useCallback, useRef } from 'react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
}

export function PullToRefresh({ onRefresh, children, threshold = 80 }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const container = containerRef.current
    if (!container) return
    
    // Solo activar si estamos en el top del scroll
    if (container.scrollTop === 0 && e.touches.length === 1) {
      startY.current = e.touches[0].clientY
      setPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling || refreshing || e.touches.length !== 1) return
    
    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY.current
    
    // Solo permitir pull hacia abajo
    if (deltaY > 0) {
      setPullDistance(Math.min(deltaY, threshold * 1.5))
      // Prevenir scroll nativo si estamos haciendo pull
      if (deltaY > 10) {
        e.preventDefault()
      }
    }
  }, [pulling, refreshing, threshold])

  const handleTouchEnd = useCallback(async () => {
    if (!pulling || refreshing) return
    
    const shouldRefresh = pullDistance >= threshold
    
    setPulling(false)
    setPullDistance(0)
    
    if (shouldRefresh) {
      setRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setRefreshing(false)
      }
    }
  }, [pulling, refreshing, pullDistance, threshold, onRefresh])

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
      style={{ touchAction: 'pan-y' }}
    >
      {pulling && (
        <div
          className="flex justify-center items-center py-2 text-sm text-gray-500 transition-opacity"
          style={{
            height: `${Math.min(pullDistance, threshold)}px`,
            opacity: Math.min(pullDistance / threshold, 1),
          }}
        >
          {pullDistance >= threshold ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Suelta para actualizar
            </span>
          ) : (
            <span>Desliza para actualizar</span>
          )}
        </div>
      )}
      {refreshing && (
        <div className="flex justify-center items-center py-3 text-sm text-gray-500">
          <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Actualizando...
        </div>
      )}
      {children}
    </div>
  )
}
