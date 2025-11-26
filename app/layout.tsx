import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster as Sonner } from "sonner"
import { AnalyticsProvider } from "@/components/common/analytics-provider"
import { PWAProvider } from "@/components/pwa/pwa-provider"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import NextDynamic from 'next/dynamic'

// Lazy load non-critical components for better FCP/LCP
const InstallPrompt = NextDynamic(() => import('@/components/pwa/install-prompt').then(m => ({ default: m.InstallPrompt })))
const NotificationPrompt = NextDynamic(() => import('@/components/pwa/notification-prompt').then(m => ({ default: m.NotificationPrompt })))

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'], // Only load needed weights
  fallback: ['system-ui', 'arial']
})

// Force dynamic rendering for all routes to avoid prerender issues
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
}

export const metadata: Metadata = {
  title: {
    template: "%s | Nativeflows",
    default: "Nativeflows - AI Trading Chart Analysis",
  },
  description:
    "Analyze trading charts with AI Vision and Smart Money Concepts. Learn institutional trading strategies while getting AI-powered insights.",
  keywords: [
    "trading",
    "chart analysis",
    "smart money concepts",
    "AI trading",
    "technical analysis",
    "forex",
    "stocks",
    "crypto",
  ],
  authors: [{ name: "Nativeflows" }],
  creator: "Nativeflows",
  applicationName: "Nativeflows",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nativeflows",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nativeflows.ai",
    title: "Nativeflows - AI Trading Chart Analysis",
    description:
      "Analyze trading charts with AI Vision and Smart Money Concepts",
    siteName: "Nativeflows",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nativeflows - AI Trading Chart Analysis",
    description:
      "Analyze trading charts with AI Vision and Smart Money Concepts",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use next-intl's server functions which are automatically configured by the plugin
  const locale = await getLocale()
  const messages = await getMessages()
  const isRTL = locale === 'ar'

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} data-scroll-behavior="smooth">
      <head>
        {/* Performance: DNS prefetch and preconnect for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Performance: Preload critical resources */}
        <link rel="preload" as="style" href="/globals.css" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme colors for native feel */}
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

        {/* Optimized viewport settings */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />

        {/* Apple PWA Settings */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nativeflows" />

        {/* Mobile web app settings */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Performance: Reduce layout shifts */}
        <style dangerouslySetInnerHTML={{__html: `
          /* Critical CSS for FCP optimization */
          body { margin: 0; background: hsl(265 85% 5%); color: hsl(265 15% 95%); }
          .glass-card-elevated {
            background: rgba(26, 20, 37, 0.6);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
          }
          /* Reserve space for bottom nav to prevent CLS */
          @media (max-width: 768px) {
            main { padding-bottom: 6rem; }
          }
        `}} />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <PWAProvider>
            <AnalyticsProvider>
              {children}
              <Sonner />
              <InstallPrompt />
              <NotificationPrompt />
            </AnalyticsProvider>
          </PWAProvider>
        </NextIntlClientProvider>
        {/* Vercel Analytics - Track page views and visitors */}
        <Analytics />
        {/* Vercel Speed Insights - Track Core Web Vitals and performance */}
        <SpeedInsights />
      </body>
    </html>
  )
}
