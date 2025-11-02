'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useMobileDetect } from '@/hooks/use-mobile-detect'
import { useEffect, useState } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isMobile, isClient } = useMobileDetect()
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    if (!isClient) return

    // Check if running as PWA (standalone mode)
    const isPWAMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsPWA(isPWAMode)
  }, [isClient])

  const shouldShowBackButton = !isPWA || !isMobile

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center py-8">
        {shouldShowBackButton && (
          <Link
            href="/"
            className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        )}

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] animate-fade-in">
          <div className="flex flex-col space-y-3 text-center mb-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <h1 className="text-4xl font-bold tracking-tight gradient-text">Nativeflows</h1>
            </div>
            <p className="text-base text-muted-foreground">
              AI-Powered Trading Chart Analysis
            </p>
          </div>
          {children}
        </div>

        <p className="absolute bottom-4 text-center text-xs text-muted-foreground">
          Educational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  )
}
