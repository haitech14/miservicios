import { useEffect, useRef, useState } from 'react'

/**
 * Hook para lazy loading de componentes
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return { ref, isVisible }
}

/**
 * Hook para debounce de valores
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para memoizar resultados de API
 */
export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const cacheKey = `cache_${key}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        const { data: cachedData, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < ttl) {
          setData(cachedData)
          setLoading(false)
          return
        }
      } catch (e) {
        // Cache inválido, continuar con fetch
      }
    }

    setLoading(true)
    fetcher()
      .then((result) => {
        setData(result)
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ data: result, timestamp: Date.now() })
        )
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [key, ttl])

  return { data, loading, error }
}
