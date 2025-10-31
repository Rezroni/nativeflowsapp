'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isInStandaloneMode = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      )
    }

    setIsStandalone(isInStandaloneMode())

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Don't show if already installed
    if (isInStandaloneMode()) {
      return
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('install-prompt-dismissed')
    const dismissedTime = dismissed ? parseInt(dismissed) : 0
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000

    // Show again after 24 hours
    if (dismissedTime < oneDayAgo) {
      // For Android/Chrome
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e as BeforeInstallPromptEvent)

        // Show prompt after 30 seconds of engagement
        setTimeout(() => {
          setShowPrompt(true)
        }, 30000)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      // For iOS, show manual instructions after engagement
      if (iOS && !isInStandaloneMode()) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 30000)
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('install-prompt-dismissed', Date.now().toString())
  }

  if (!showPrompt || isStandalone) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <div className="rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 p-1 shadow-2xl">
          <div className="rounded-lg bg-white p-4">
            <button
              onClick={handleDismiss}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>

              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">
                  Install Nativeflows
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Install our app for faster access, offline support, and a better experience!
                </p>

                {isIOS ? (
                  <div className="space-y-2 rounded-lg bg-purple-50 p-3 text-sm">
                    <p className="font-medium text-purple-900">
                      To install on iOS:
                    </p>
                    <ol className="list-decimal space-y-1 pl-5 text-purple-800">
                      <li>Tap the Share button</li>
                      <li>Scroll down and tap "Add to Home Screen"</li>
                      <li>Tap "Add"</li>
                    </ol>
                  </div>
                ) : (
                  <Button
                    onClick={handleInstallClick}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Install App
                  </Button>
                )}

                <button
                  onClick={handleDismiss}
                  className="mt-2 w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
