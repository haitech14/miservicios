import { useState, useCallback } from 'react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleTouchStart = useCallback(() => {
    if (window.scrollY === 0) setPulling(true)
  }, [])

  const handleTouchEnd = useCallback(async () => {
    if (!pulling || refreshing) return
    setPulling(false)
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }, [pulling, refreshing, onRefresh])

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {refreshing && (
        <div className="flex justify-center py-2 text-sm text-gray-500">
          Actualizando...
        </div>
      )}
      {children}
    </div>
  )
}
