'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
  isPushNotificationSupported,
  checkNotificationPermission,
} from '@/lib/pwa/push-notifications'
import { toast } from 'sonner'

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    const checkPermission = async () => {
      if (!isPushNotificationSupported()) {
        return
      }

      const permission = await checkNotificationPermission()

      // Don't show if already granted or denied
      if (permission !== 'default') {
        return
      }

      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem('notification-prompt-dismissed')
      const dismissedTime = dismissed ? parseInt(dismissed) : 0
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000

      // Show again after 3 days
      if (dismissedTime < threeDaysAgo) {
        // Show prompt after 2 minutes of engagement
        setTimeout(() => {
          setShowPrompt(true)
        }, 120000)
      }
    }

    checkPermission()
  }, [])

  const handleEnableNotifications = async () => {
    setIsSubscribing(true)

    try {
      // Request permission
      const permission = await requestNotificationPermission()

      if (permission !== 'granted') {
        toast.error('Notification permission denied')
        setShowPrompt(false)
        localStorage.setItem('notification-prompt-dismissed', Date.now().toString())
        return
      }

      // Subscribe to push notifications
      const subscription = await subscribeToPushNotifications()

      if (!subscription) {
        toast.error('Failed to subscribe to notifications')
        return
      }

      // Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: subscription.keys,
          deviceName: navigator.platform,
          userAgent: navigator.userAgent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save subscription')
      }

      toast.success('Notifications enabled!')
      setShowPrompt(false)
    } catch (error) {
      console.error('Failed to enable notifications:', error)
      toast.error('Failed to enable notifications')
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('notification-prompt-dismissed', Date.now().toString())
  }

  if (!showPrompt) {
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
        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-2xl">
          <div className="rounded-lg bg-white p-4">
            <button
              onClick={handleDismiss}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              disabled={isSubscribing}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>

              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-gray-900">
                  Stay Updated
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Get notified about analysis results, new features, and important updates.
                </p>

                <Button
                  onClick={handleEnableNotifications}
                  disabled={isSubscribing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  {isSubscribing ? 'Enabling...' : 'Enable Notifications'}
                </Button>

                <button
                  onClick={handleDismiss}
                  disabled={isSubscribing}
                  className="mt-2 w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
