import * as Sentry from '@sentry/nextjs';
import type { Instrumentation } from 'next';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }

  // Client-side initialization (replaces sentry.client.config.ts for Turbopack)
  if (process.env.NEXT_RUNTIME === 'browser') {
    await import('./instrumentation-client');
  }
}

// Capture errors from nested React Server Components
export const onRequestError: Instrumentation.onRequestError = (...args) => {
  Sentry.captureRequestError(...args);
};
