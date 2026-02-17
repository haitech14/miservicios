const CACHE_NAME = 'mi-servicios-v2'
const STATIC_CACHE = 'mi-servicios-static-v2'
const urlsToCache = ['/', '/index.html', '/manifest.json']

// Instalación: cachear recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.log('Error al cachear recursos:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activación: limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )
  return self.clients.claim()
})

// Fetch: estrategia cache-first para estáticos, network-first para API
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Recursos estáticos: cache-first
  if (request.method === 'GET' && (url.origin === location.origin || url.pathname.startsWith('/assets'))) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request).then((response) => {
          // Solo cachear respuestas exitosas
          if (response.status === 200) {
            const responseToCache = response.clone()
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
      })
    )
  } else {
    // API y otros: network-first
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response
        })
        .catch(() => {
          return caches.match(request)
        })
    )
  }
})
