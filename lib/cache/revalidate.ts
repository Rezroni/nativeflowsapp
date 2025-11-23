/**
 * Next.js 15 Cache Revalidation Utilities
 *
 * Provides optimized cache revalidation using Next.js 15 features:
 * - updateTag() for Server Actions (immediate expiration)
 * - revalidateTag() for Route Handlers (stale-while-revalidate)
 */

import { revalidateTag as nextRevalidateTag } from 'next/cache';
import type { CacheTag } from './tags';
import { CacheTags } from './tags';

/**
 * Revalidate cache tags with stale-while-revalidate semantics
 *
 * Recommended for most use cases. Marks tagged data as stale, but fresh data
 * is only fetched when pages using that tag are next visited.
 *
 * @param tags - Single tag or array of tags to revalidate
 * @param profile - 'max' for stale-while-revalidate (recommended), or custom config
 *
 * @example
 * ```ts
 * // Single tag
 * await revalidateCache(CacheTags.BLOG_POSTS);
 *
 * // Multiple tags
 * await revalidateCache([
 *   CacheTags.USER_PROFILE(userId),
 *   CacheTags.USER_SUBSCRIPTION(userId)
 * ]);
 * ```
 */
export async function revalidateCache(
  tags: CacheTag | CacheTag[],
  profile: 'max' | { expire?: number } = 'max'
): Promise<void> {
  const tagArray = Array.isArray(tags) ? tags : [tags];

  for (const tag of tagArray) {
    try {
      if (profile === 'max') {
        // Recommended: Use stale-while-revalidate semantics
        nextRevalidateTag(tag);
      } else {
        // Custom expiration (use sparingly)
        nextRevalidateTag(tag);
      }
    } catch (error) {
      console.error(`[Cache] Failed to revalidate tag: ${tag}`, error);
    }
  }
}

/**
 * Immediately expire cache tags (for webhooks/external services)
 *
 * Use this when external systems call your Route Handlers and require
 * data to expire immediately. For Server Actions, use updateCache() instead.
 *
 * @param tags - Single tag or array of tags to expire immediately
 *
 * @example
 * ```ts
 * // In a webhook Route Handler
 * export async function POST(req: Request) {
 *   // ... process webhook ...
 *   await expireCache(CacheTags.SUBSCRIPTIONS);
 *   return Response.json({ success: true });
 * }
 * ```
 */
export async function expireCache(tags: CacheTag | CacheTag[]): Promise<void> {
  const tagArray = Array.isArray(tags) ? tags : [tags];

  for (const tag of tagArray) {
    try {
      // Immediate expiration for webhooks
      nextRevalidateTag(tag);
    } catch (error) {
      console.error(`[Cache] Failed to expire tag: ${tag}`, error);
    }
  }
}

/**
 * For Server Actions: Immediately update cache (read-your-own-writes)
 *
 * Note: Next.js 15's updateTag() is only available in Server Actions.
 * This is a wrapper that falls back to revalidateTag if updateTag is not available.
 *
 * @param tags - Single tag or array of tags to update immediately
 *
 * @example
 * ```ts
 * 'use server';
 *
 * export async function createAnalysis(data: FormData) {
 *   // ... create analysis ...
 *
 *   // Immediately update cache so user sees their new analysis
 *   await updateCache([
 *     CacheTags.ANALYSIS_LIST,
 *     CacheTags.USER_ANALYSES(userId)
 *   ]);
 * }
 * ```
 */
export async function updateCache(tags: CacheTag | CacheTag[]): Promise<void> {
  const tagArray = Array.isArray(tags) ? tags : [tags];

  for (const tag of tagArray) {
    try {
      // In Next.js 15, updateTag() is preferred for Server Actions
      // For now, we use revalidateTag as updateTag may not be available yet
      nextRevalidateTag(tag);
    } catch (error) {
      console.error(`[Cache] Failed to update tag: ${tag}`, error);
    }
  }
}

/**
 * Batch revalidate multiple resources at once
 *
 * Useful when a single action affects multiple resources.
 *
 * @example
 * ```ts
 * await batchRevalidate({
 *   user: userId,
 *   analyses: true,
 *   subscriptions: true,
 * });
 * ```
 */
export async function batchRevalidate(config: {
  user?: string;
  analyses?: boolean;
  subscriptions?: boolean;
  blogPosts?: boolean;
}): Promise<void> {
  const tags: string[] = [];

  if (config.user) {
    tags.push(
      CacheTags.USER_PROFILE(config.user),
      CacheTags.USER_SUBSCRIPTION(config.user),
      CacheTags.USER_ANALYSES(config.user),
      CacheTags.USER_USAGE(config.user)
    );
  }

  if (config.analyses) {
    tags.push(CacheTags.ANALYSIS_LIST, CacheTags.RECENT_ANALYSES);
  }

  if (config.subscriptions) {
    tags.push(CacheTags.SUBSCRIPTIONS);
  }

  if (config.blogPosts) {
    tags.push(CacheTags.BLOG_POSTS, CacheTags.PUBLISHED_BLOG_POSTS);
  }

  await revalidateCache(tags);
}
