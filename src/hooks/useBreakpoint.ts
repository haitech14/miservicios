import { useState, useEffect } from 'react'

/**
 * Hook optimizado para breakpoints usando matchMedia
 * Mejor rendimiento en móvil al evitar listeners de resize
 */
export function useBreakpoint() {
  const [breakpoints, setBreakpoints] = useState(() => {
    if (typeof window === 'undefined') {
      return { isSm: false, isMd: false, isLg: false, isMobile: true }
    }
    
    const sm = window.matchMedia('(min-width: 640px)').matches
    const md = window.matchMedia('(min-width: 768px)').matches
    const lg = window.matchMedia('(min-width: 1024px)').matches
    
    return {
      isSm: sm,
      isMd: md,
      isLg: lg,
      isMobile: !md,
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQueries = {
      sm: window.matchMedia('(min-width: 640px)'),
      md: window.matchMedia('(min-width: 768px)'),
      lg: window.matchMedia('(min-width: 1024px)'),
    }

    const updateBreakpoints = () => {
      setBreakpoints({
        isSm: mediaQueries.sm.matches,
        isMd: mediaQueries.md.matches,
        isLg: mediaQueries.lg.matches,
        isMobile: !mediaQueries.md.matches,
      })
    }

    // Usar change event de matchMedia (más eficiente que resize)
    mediaQueries.sm.addEventListener('change', updateBreakpoints)
    mediaQueries.md.addEventListener('change', updateBreakpoints)
    mediaQueries.lg.addEventListener('change', updateBreakpoints)

    return () => {
      mediaQueries.sm.removeEventListener('change', updateBreakpoints)
      mediaQueries.md.removeEventListener('change', updateBreakpoints)
      mediaQueries.lg.removeEventListener('change', updateBreakpoints)
    }
  }, [])

  return breakpoints
}
