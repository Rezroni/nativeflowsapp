import * as Sentry from '@sentry/nextjs';

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
export function onRequestError(
  error: Error,
  request: {
    method?: string;
    url?: string;
    headers?: { get(key: string): string | null };
  },
  context: {
    routerKind?: 'Pages Router' | 'App Router';
    routePath?: string;
    routeType?: 'render' | 'route' | 'action' | 'middleware';
  }
) {
  Sentry.captureRequestError(error, request, context);
}
