import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "sonner"
import { AnalyticsProvider } from "@/components/common/analytics-provider"

const inter = Inter({ subsets: ["latin"] })

// Force dynamic rendering for all routes to avoid prerender issues
export const dynamic = 'force-dynamic'
export const dynamicParams = true

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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <AnalyticsProvider>
          {children}
          <Toaster />
          <Sonner />
        </AnalyticsProvider>
      </body>
    </html>
  )
}
