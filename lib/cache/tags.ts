/**
 * Next.js 15 Cache Tags Configuration
 *
 * Centralized cache tags for consistent revalidation across the app.
 * Tags must not exceed 256 characters and are case-sensitive.
 *
 * Best Practices:
 * - Use updateTag() in Server Actions for immediate cache expiration (read-your-own-writes)
 * - Use revalidateTag() in Route Handlers for webhook-based revalidation
 * - Use profile="max" for stale-while-revalidate semantics (recommended for most cases)
 */

export const CacheTags = {
  // User-related data
  USER_PROFILE: (userId: string) => `user-profile-${userId}`,
  USER_SUBSCRIPTION: (userId: string) => `user-subscription-${userId}`,
  USER_ANALYSES: (userId: string) => `user-analyses-${userId}`,
  USER_SAVED_SETUPS: (userId: string) => `user-saved-setups-${userId}`,
  USER_USAGE: (userId: string) => `user-usage-${userId}`,

  // Analysis-related data
  ANALYSIS: (analysisId: string) => `analysis-${analysisId}`,
  ANALYSIS_LIST: 'analysis-list',
  RECENT_ANALYSES: 'recent-analyses',

  // Subscription-related data
  SUBSCRIPTIONS: 'subscriptions',
  SUBSCRIPTION: (subscriptionId: string) => `subscription-${subscriptionId}`,

  // Blog-related data
  BLOG_POSTS: 'blog-posts',
  BLOG_POST: (slug: string) => `blog-post-${slug}`,
  PUBLISHED_BLOG_POSTS: 'published-blog-posts',

  // Admin-related data
  ADMIN_USERS: 'admin-users',
  ADMIN_ROLES: 'admin-roles',
  ADMIN_ANALYTICS: 'admin-analytics',

  // Static/semi-static data
  PRICING_PLANS: 'pricing-plans',
  APP_SETTINGS: 'app-settings',
} as const;

/**
 * Helper type for cache tag values
 */
export type CacheTag = string;

/**
 * Helper to create multiple tags for a resource
 */
export function createResourceTags(resource: 'analysis' | 'user' | 'subscription', id: string): string[] {
  switch (resource) {
    case 'analysis':
      return [
        CacheTags.ANALYSIS(id),
        CacheTags.ANALYSIS_LIST,
        CacheTags.RECENT_ANALYSES,
      ];
    case 'user':
      return [
        CacheTags.USER_PROFILE(id),
        CacheTags.USER_SUBSCRIPTION(id),
        CacheTags.USER_ANALYSES(id),
      ];
    case 'subscription':
      return [
        CacheTags.SUBSCRIPTION(id),
        CacheTags.SUBSCRIPTIONS,
      ];
    default:
      return [];
  }
}
