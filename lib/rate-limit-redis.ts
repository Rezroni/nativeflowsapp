import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest } from 'next/server'

// Initialize Redis client with Upstash
// If no Redis is configured, fall back to in-memory (dev only)
let redis: Redis | null = null
let rateLimiters: Record<string, Ratelimit> | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    // Create rate limiters for different endpoints
    rateLimiters = {
      auth: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '60 s'),
        analytics: true,
        prefix: '@ratelimit/auth',
      }),
      api: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '60 s'),
        analytics: true,
        prefix: '@ratelimit/api',
      }),
      read: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '60 s'),
        analytics: true,
        prefix: '@ratelimit/read',
      }),
      payment: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '60 s'),
        analytics: true,
        prefix: '@ratelimit/payment',
      }),
      analysis: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '60 s'),
        analytics: true,
        prefix: '@ratelimit/analysis',
      }),
      webhook: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, '60 s'),
        analytics: true,
        prefix: '@ratelimit/webhook',
      }),
    }
  }
} catch (error) {
  console.warn('Redis rate limiting not configured, using fallback')
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Get identifier from request (IP address or user ID)
 */
function getIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded
    ? forwarded.split(',')[0]
    : request.headers.get('x-real-ip') || 'anonymous'

  return ip
}

/**
 * Redis-based rate limiter with fallback to in-memory
 */
export async function rateLimitRedis(
  request: NextRequest,
  type: 'auth' | 'api' | 'read' | 'payment' | 'analysis' | 'webhook' = 'api'
): Promise<RateLimitResult> {
  const identifier = getIdentifier(request)

  // If Redis is configured, use Upstash rate limiter
  if (rateLimiters && redis) {
    const limiter = rateLimiters[type]
    const { success, limit, remaining, reset } = await limiter.limit(identifier)

    return {
      success,
      limit,
      remaining,
      reset,
    }
  }

  // Fallback to in-memory rate limiter (dev only)
  // Import dynamically to avoid circular dependency
  const { rateLimit, RateLimits } = await import('./rate-limit')
  const config = RateLimits[type]

  return await rateLimit(request, config)
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  }
}

/**
 * Helper to check rate limit and return error response if exceeded
 */
export async function checkRateLimit(
  request: NextRequest,
  type: 'auth' | 'api' | 'read' | 'payment' | 'analysis' | 'webhook' = 'api'
): Promise<{ allowed: boolean; headers: HeadersInit }> {
  const result = await rateLimitRedis(request, type)

  return {
    allowed: result.success,
    headers: createRateLimitHeaders(result),
  }
}
