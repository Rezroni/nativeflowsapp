import * as Sentry from '@sentry/nextjs';

/**
 * Logger instance from Sentry
 */
export const { logger } = Sentry;

/**
 * Capture an exception and send to Sentry
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Create a span for performance tracking
 */
export function startSpan<T>(
  options: {
    op: string;
    name: string;
    attributes?: Record<string, any>;
  },
  callback: (span: ReturnType<typeof Sentry.startSpan>) => T
): T {
  return Sentry.startSpan(
    {
      op: options.op,
      name: options.name,
      attributes: options.attributes,
    },
    callback
  );
}

/**
 * Pre-defined spans for common operations
 */
export const Monitoring = {
  /**
   * Track analysis operation
   */
  trackAnalysis: async <T>(
    userId: string,
    callback: () => Promise<T>
  ): Promise<T> => {
    return startSpan(
      {
        op: 'ai.analysis',
        name: 'Chart Analysis',
        attributes: { userId },
      },
      async (span) => {
        try {
          const result = await callback();
          span.setAttribute('status', 'success');
          return result;
        } catch (error) {
          span.setAttribute('status', 'error');
          span.setAttribute('error', error instanceof Error ? error.message : 'Unknown error');
          captureException(error instanceof Error ? error : new Error(String(error)), {
            userId,
            operation: 'analysis',
          });
          throw error;
        }
      }
    );
  },

  /**
   * Track payment operation
   */
  trackPayment: async <T>(
    paymentId: string,
    planId: string,
    callback: () => Promise<T>
  ): Promise<T> => {
    return startSpan(
      {
        op: 'payment.create',
        name: 'Create Payment',
        attributes: { paymentId, planId },
      },
      async (span) => {
        try {
          const result = await callback();
          span.setAttribute('status', 'success');
          return result;
        } catch (error) {
          span.setAttribute('status', 'error');
          span.setAttribute('error', error instanceof Error ? error.message : 'Unknown error');
          captureException(error instanceof Error ? error : new Error(String(error)), {
            paymentId,
            planId,
            operation: 'payment',
          });
          throw error;
        }
      }
    );
  },

  /**
   * Track API call
   */
  trackApiCall: async <T>(
    endpoint: string,
    method: string,
    callback: () => Promise<T>
  ): Promise<T> => {
    return startSpan(
      {
        op: 'http.client',
        name: `${method} ${endpoint}`,
        attributes: { endpoint, method },
      },
      async (span) => {
        try {
          const result = await callback();
          span.setAttribute('status', 'success');
          return result;
        } catch (error) {
          span.setAttribute('status', 'error');
          span.setAttribute('error', error instanceof Error ? error.message : 'Unknown error');
          captureException(error instanceof Error ? error : new Error(String(error)), {
            endpoint,
            method,
            operation: 'api_call',
          });
          throw error;
        }
      }
    );
  },

  /**
   * Track button click
   */
  trackButtonClick: (
    buttonName: string,
    metadata?: Record<string, any>
  ) => {
    startSpan(
      {
        op: 'ui.click',
        name: `${buttonName} Click`,
        attributes: metadata,
      },
      (span) => {
        span.setAttribute('button', buttonName);
        if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
            span.setAttribute(key, value);
          });
        }
      }
    );
  },
};

/**
 * Set user context for Sentry
 */
export function setUserContext(userId: string, email?: string, username?: string) {
  Sentry.setUser({
    id: userId,
    email,
    username,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

export default Sentry;
