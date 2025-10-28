import { NextRequest } from 'next/server';

// Simple in-memory rate limiter (for development/small scale)
// For production, consider using Redis with @upstash/ratelimit

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number;
  /**
   * Time window in seconds
   */
  window: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limiter using in-memory storage
 *
 * For production use with Redis:
 * ```ts
 * import { Ratelimit } from "@upstash/ratelimit";
 * import { Redis } from "@upstash/redis";
 *
 * const redis = new Redis({
 *   url: process.env.UPSTASH_REDIS_REST_URL!,
 *   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
 * });
 *
 * export const ratelimit = new Ratelimit({
 *   redis,
 *   limiter: Ratelimit.slidingWindow(10, "10 s"),
 * });
 * ```
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Get identifier (IP address or user ID from headers)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] :
    request.headers.get('x-real-ip') ||
    'anonymous';

  const identifier = `rate-limit:${ip}`;
  const now = Date.now();
  const windowMs = config.window * 1000;

  // Get or create rate limit entry
  let entry = store[identifier];

  if (!entry || entry.resetAt < now) {
    // Create new entry
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
    store[identifier] = entry;
  }

  // Increment count
  entry.count++;

  const success = entry.count <= config.limit;
  const remaining = Math.max(0, config.limit - entry.count);
  const reset = Math.ceil(entry.resetAt / 1000);

  return {
    success,
    limit: config.limit,
    remaining,
    reset,
  };
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}

/**
 * Common rate limit configurations
 */
export const RateLimits = {
  // Strict limits for authentication endpoints
  auth: { limit: 5, window: 60 }, // 5 requests per minute

  // Moderate limits for API endpoints
  api: { limit: 30, window: 60 }, // 30 requests per minute

  // Generous limits for read operations
  read: { limit: 100, window: 60 }, // 100 requests per minute

  // Very strict for payment operations
  payment: { limit: 3, window: 60 }, // 3 requests per minute

  // Strict for analysis operations (resource intensive)
  analysis: { limit: 10, window: 60 }, // 10 requests per minute
};
