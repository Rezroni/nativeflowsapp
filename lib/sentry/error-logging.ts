/**
 * Sentry Error Logging Utilities
 *
 * Comprehensive error tracking for Server Actions and API routes.
 * Automatically captures context, user info, and performance data.
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Error context for better debugging
 */
export interface ErrorContext {
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
  tags?: Record<string, string>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
}

/**
 * Log an error to Sentry with context
 */
export function logError(
  error: Error | unknown,
  context?: ErrorContext
): string {
  const errorId = Sentry.captureException(error, {
    level: context?.level || 'error',
    user: context?.userId ? { id: context?.userId } : undefined,
    tags: {
      action: context?.action || 'unknown',
      ...context?.tags,
    },
    extra: context?.metadata,
  });

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Sentry Error]', {
      errorId,
      error,
      context,
    });
  }

  return errorId;
}

/**
 * Log a message to Sentry (not an error)
 */
export function logMessage(
  message: string,
  context?: ErrorContext
): void {
  Sentry.captureMessage(message, {
    level: context?.level || 'info',
    user: context?.userId ? { id: context?.userId } : undefined,
    tags: {
      action: context?.action || 'unknown',
      ...context?.tags,
    },
    extra: context?.metadata,
  });

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Sentry Message]', {
      message,
      context,
    });
  }
}

/**
 * Wrap a Server Action with automatic error logging
 */
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  actionName: string,
  action: T
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const startTime = Date.now();

    return Sentry.withServerActionInstrumentation(
      actionName,
      {
        recordResponse: true,
      },
      async () => {
        try {
          const result = await action(...args);

          // Log successful action execution time
          const duration = Date.now() - startTime;
          if (duration > 3000) {
            // Warn if action takes more than 3 seconds
            logMessage(`Slow action: ${actionName} took ${duration}ms`, {
              action: actionName,
              level: 'warning',
              metadata: {
                duration,
                args: JSON.stringify(args).substring(0, 200), // First 200 chars
              },
            });
          }

          // If result contains an error, log it
          if (result && typeof result === 'object' && 'error' in result) {
            logError(new Error(result.error as string), {
              action: actionName,
              level: 'error',
              metadata: {
                args: JSON.stringify(args).substring(0, 200),
                result,
              },
            });
          }

          return result;
        } catch (error) {
          // Log the error with full context
          const errorId = logError(error, {
            action: actionName,
            level: 'error',
            metadata: {
              args: JSON.stringify(args).substring(0, 200),
              duration: Date.now() - startTime,
            },
          });

          // Return error response
          return {
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
            errorId,
          } as any;
        }
      }
    );
  }) as T;
}

/**
 * Set user context for Sentry
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  username?: string;
}): void {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, any>,
  category?: string
): void {
  Sentry.addBreadcrumb({
    message,
    data,
    category: category || 'custom',
    level: 'info',
  });
}

/**
 * Track a performance metric
 */
export function trackPerformance(
  name: string,
  duration: number,
  tags?: Record<string, string>
): void {
  // Log performance metrics to Sentry as breadcrumbs
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${name}: ${duration}ms`,
    level: 'info',
    data: {
      duration,
      ...tags,
    },
  });

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration}ms`, tags);
  }
}

/**
 * Log a database query error
 */
export function logDatabaseError(
  error: Error | unknown,
  query: string,
  userId?: string
): string {
  return logError(error, {
    userId,
    action: 'database_query',
    level: 'error',
    tags: {
      type: 'database',
    },
    metadata: {
      query: query.substring(0, 500), // First 500 chars
    },
  });
}

/**
 * Log an API error
 */
export function logAPIError(
  error: Error | unknown,
  endpoint: string,
  method: string,
  userId?: string
): string {
  return logError(error, {
    userId,
    action: 'api_request',
    level: 'error',
    tags: {
      type: 'api',
      endpoint,
      method,
    },
  });
}

/**
 * Log a payment error
 */
export function logPaymentError(
  error: Error | unknown,
  paymentProvider: 'stripe',
  userId?: string,
  metadata?: Record<string, any>
): string {
  return logError(error, {
    userId,
    action: 'payment_processing',
    level: 'error',
    tags: {
      type: 'payment',
      provider: paymentProvider,
    },
    metadata,
  });
}

/**
 * Log an authentication error
 */
export function logAuthError(
  error: Error | unknown,
  authMethod: string,
  userId?: string
): string {
  return logError(error, {
    userId,
    action: 'authentication',
    level: 'error',
    tags: {
      type: 'auth',
      method: authMethod,
    },
  });
}

/**
 * Log a file upload error
 */
export function logUploadError(
  error: Error | unknown,
  fileName: string,
  fileSize: number,
  userId?: string
): string {
  return logError(error, {
    userId,
    action: 'file_upload',
    level: 'error',
    tags: {
      type: 'upload',
    },
    metadata: {
      fileName,
      fileSize,
      fileSizeMB: Math.round(fileSize / 1024 / 1024 * 100) / 100,
    },
  });
}

/**
 * Log an AI analysis error
 */
export function logAIError(
  error: Error | unknown,
  provider: 'openai' | 'anthropic' | 'openrouter',
  userId?: string,
  metadata?: Record<string, any>
): string {
  return logError(error, {
    userId,
    action: 'ai_analysis',
    level: 'error',
    tags: {
      type: 'ai',
      provider,
    },
    metadata,
  });
}
