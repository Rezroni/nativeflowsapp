'use client'

import { useEffect, useState } from 'react'
import { registerServiceWorker } from '@/lib/pwa/service-worker-registration'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [showReload, setShowReload] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      registerServiceWorker({
        onSuccess: (registration) => {
          console.log('✅ PWA ready for offline use')
        },
        onUpdate: (registration) => {
          const waiting = registration.waiting
          if (waiting) {
            setWaitingWorker(waiting)
            setShowReload(true)

            toast.info('New version available', {
              description: 'A new version of Nativeflows is available. Please update.',
              duration: Infinity,
              action: {
                label: 'Update',
                onClick: () => reloadPage()
              }
            })
          }
        },
        onError: (error) => {
          console.error('❌ Service Worker error:', error)
        }
      })
    }
  }, [])

  const reloadPage = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      waitingWorker.addEventListener('statechange', (e) => {
        const target = e.target as ServiceWorker
        if (target.state === 'activated') {
          window.location.reload()
        }
      })
    }
  }

  return (
    <>
      {children}
      {showReload && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="rounded-lg bg-purple-600 p-4 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5" />
              <div>
                <p className="font-semibold">Update Available</p>
                <p className="text-sm text-purple-100">
                  Click to reload and update
                </p>
              </div>
              <button
                onClick={reloadPage}
                className="ml-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-purple-600 hover:bg-gray-100 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
