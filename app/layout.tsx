import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "sonner"
import { AnalyticsProvider } from "@/components/common/analytics-provider"
import { PWAProvider } from "@/components/pwa/pwa-provider"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { NotificationPrompt } from "@/components/pwa/notification-prompt"
import { PageTransition } from "@/components/animations/page-transition"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'

const inter = Inter({ subsets: ["latin"] })

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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nativeflows" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <PWAProvider>
            <AnalyticsProvider>
              <PageTransition type="fade">
                {children}
              </PageTransition>
              <Toaster />
              <Sonner />
              <InstallPrompt />
              <NotificationPrompt />
            </AnalyticsProvider>
          </PWAProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
