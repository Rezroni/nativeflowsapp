'use client'

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  onError?: (error: Error) => void
}

export function registerServiceWorker(config?: ServiceWorkerConfig) {
  if (typeof window === 'undefined') {
    return
  }

  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return
  }

  window.addEventListener('load', () => {
    const swUrl = '/service-worker.js'

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('Service Worker registered:', registration)

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing

          if (!installingWorker) {
            return
          }

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                console.log('New content is available; please refresh.')
                if (config?.onUpdate) {
                  config.onUpdate(registration)
                }
              } else {
                // Content cached for offline use
                console.log('Content is cached for offline use.')
                if (config?.onSuccess) {
                  config.onSuccess(registration)
                }
              }
            }
          })
        })

        // Check for updates every hour
        setInterval(() => {
          registration.update()
        }, 1000 * 60 * 60)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
        if (config?.onError) {
          config.onError(error)
        }
      })
  })
}

export function unregisterServiceWorker() {
  if (typeof window === 'undefined') {
    return
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error('Service Worker unregistration failed:', error)
      })
  }
}

export function sendMessageToServiceWorker(message: any) {
  if (typeof window === 'undefined') {
    return
  }

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message)
  }
}

export async function checkForUpdates() {
  if (typeof window === 'undefined') {
    return
  }

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready
    return registration.update()
  }
}
