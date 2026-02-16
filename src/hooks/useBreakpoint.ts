import { useState, useEffect } from 'react'

export function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isSm: width >= 640,
    isMd: width >= 768,
    isLg: width >= 1024,
    isMobile: width < 768,
  }
}
