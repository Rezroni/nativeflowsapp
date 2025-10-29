const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization to prevent Sentry instrumentation issues during prerender
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  eslint: {
    // Only run ESLint on these directories during production builds
    dirs: ['app', 'components', 'lib'],
    // Don't fail production builds on ESLint errors
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Don't fail production builds on TypeScript errors
    ignoreBuildErrors: false,
  },
}

// Sentry configuration options
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: false, // Disabled to prevent prerender issues
  },
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  autoInstrumentServerFunctions: false, // Disable automatic server instrumentation
  autoInstrumentMiddleware: false, // Disable middleware instrumentation
  autoInstrumentAppDirectory: false, // Disable app directory instrumentation
};

// Temporarily disable Sentry wrapping to fix build issues
// TODO: Re-enable Sentry after resolving prerender instrumentation issues
module.exports = nextConfig;

// module.exports = process.env.NODE_ENV === 'production'
//   ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
//   : nextConfig;
