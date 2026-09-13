import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://@o4510268078489600.ingest.de.sentry.io/4510268082421840',

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Logs Integration
  _experiments: {
    enableLogs: true,
  },

  integrations: [
    // Send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],

  // Environment
  environment: process.env.NODE_ENV,

  // Filter out sensitive data
  beforeSend(event) {
    // Remove sensitive information from request bodies
    if (event.request?.data && typeof event.request.data === 'string') {
      try {
        const data = JSON.parse(event.request.data);
        delete data.password;
        delete data.token;
        delete data.api_key;
        event.request.data = JSON.stringify(data);
      } catch (e) {
        // Not JSON, skip
      }
    }
    return event;
  },
});
