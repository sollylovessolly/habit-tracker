const CACHE_NAME = 'habit-tracker-v1'

const APP_SHELL = [
  '/login',
  '/signup',
  '/dashboard',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Never intercept navigation to / — let Next.js handle the redirect
  if (event.request.mode === 'navigate' && 
      new URL(event.request.url).pathname === '/') {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => {
        return caches.match('/login')
      })
    })
  )
})