/**
 * TanStack Query Optimistic Updates
 *
 * Provides instant UI feedback with automatic rollback on errors.
 * Follows the read-your-own-writes pattern for consistency.
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query Keys for TanStack Query
 */
export const QueryKeys = {
  // User data
  userProfile: (userId: string) => ['user', 'profile', userId],
  userSubscription: (userId: string) => ['user', 'subscription', userId],
  userUsage: (userId: string) => ['user', 'usage', userId],

  // Analysis data
  analyses: (userId: string) => ['analyses', userId],
  analysis: (analysisId: string) => ['analysis', analysisId],
  recentAnalyses: () => ['analyses', 'recent'],

  // Saved setups
  savedSetups: (userId: string) => ['saved-setups', userId],
  savedSetup: (setupId: string) => ['saved-setup', setupId],

  // Blog posts
  blogPosts: () => ['blog-posts'],
  blogPost: (slug: string) => ['blog-post', slug],
  publishedBlogPosts: () => ['blog-posts', 'published'],
} as const;

/**
 * Optimistic update for creating an analysis
 */
export function optimisticCreateAnalysis(
  queryClient: QueryClient,
  userId: string,
  newAnalysis: {
    id: string;
    imageUrl: string;
    result: string;
    timeframe: string;
    context?: string;
    createdAt: string;
  }
) {
  // Cancel outgoing refetches
  queryClient.cancelQueries({ queryKey: QueryKeys.analyses(userId) });

  // Snapshot previous value
  const previousAnalyses = queryClient.getQueryData(QueryKeys.analyses(userId));

  // Optimistically update
  queryClient.setQueryData(QueryKeys.analyses(userId), (old: any) => {
    if (!old) return [newAnalysis];
    return [newAnalysis, ...old];
  });

  // Return rollback function
  return () => {
    queryClient.setQueryData(QueryKeys.analyses(userId), previousAnalyses);
  };
}

/**
 * Optimistic update for deleting an analysis
 */
export function optimisticDeleteAnalysis(
  queryClient: QueryClient,
  userId: string,
  analysisId: string
) {
  // Cancel outgoing refetches
  queryClient.cancelQueries({ queryKey: QueryKeys.analyses(userId) });

  // Snapshot previous value
  const previousAnalyses = queryClient.getQueryData(QueryKeys.analyses(userId));

  // Optimistically update
  queryClient.setQueryData(QueryKeys.analyses(userId), (old: any) => {
    if (!old) return [];
    return old.filter((analysis: any) => analysis.id !== analysisId);
  });

  // Return rollback function
  return () => {
    queryClient.setQueryData(QueryKeys.analyses(userId), previousAnalyses);
  };
}

/**
 * Optimistic update for updating user profile
 */
export function optimisticUpdateProfile(
  queryClient: QueryClient,
  userId: string,
  updates: Partial<{
    fullName: string;
    email: string;
    avatarUrl: string;
  }>
) {
  // Cancel outgoing refetches
  queryClient.cancelQueries({ queryKey: QueryKeys.userProfile(userId) });

  // Snapshot previous value
  const previousProfile = queryClient.getQueryData(QueryKeys.userProfile(userId));

  // Optimistically update
  queryClient.setQueryData(QueryKeys.userProfile(userId), (old: any) => {
    if (!old) return updates;
    return { ...old, ...updates };
  });

  // Return rollback function
  return () => {
    queryClient.setQueryData(QueryKeys.userProfile(userId), previousProfile);
  };
}

/**
 * Optimistic update for saving a setup
 */
export function optimisticSaveSetup(
  queryClient: QueryClient,
  userId: string,
  newSetup: {
    id: string;
    name: string;
    imageUrl: string;
    createdAt: string;
  }
) {
  // Cancel outgoing refetches
  queryClient.cancelQueries({ queryKey: QueryKeys.savedSetups(userId) });

  // Snapshot previous value
  const previousSetups = queryClient.getQueryData(QueryKeys.savedSetups(userId));

  // Optimistically update
  queryClient.setQueryData(QueryKeys.savedSetups(userId), (old: any) => {
    if (!old) return [newSetup];
    return [newSetup, ...old];
  });

  // Return rollback function
  return () => {
    queryClient.setQueryData(QueryKeys.savedSetups(userId), previousSetups);
  };
}

/**
 * Optimistic update for deleting a saved setup
 */
export function optimisticDeleteSetup(
  queryClient: QueryClient,
  userId: string,
  setupId: string
) {
  // Cancel outgoing refetches
  queryClient.cancelQueries({ queryKey: QueryKeys.savedSetups(userId) });

  // Snapshot previous value
  const previousSetups = queryClient.getQueryData(QueryKeys.savedSetups(userId));

  // Optimistically update
  queryClient.setQueryData(QueryKeys.savedSetups(userId), (old: any) => {
    if (!old) return [];
    return old.filter((setup: any) => setup.id !== setupId);
  });

  // Return rollback function
  return () => {
    queryClient.setQueryData(QueryKeys.savedSetups(userId), previousSetups);
  };
}

/**
 * Generic optimistic update helper
 */
export function createOptimisticUpdate<T>(
  queryClient: QueryClient,
  queryKey: any[],
  updater: (old: T | undefined) => T
): () => void {
  // Cancel outgoing refetches
  queryClient.cancelQueries({ queryKey });

  // Snapshot previous value
  const previousData = queryClient.getQueryData<T>(queryKey);

  // Optimistically update
  queryClient.setQueryData<T>(queryKey, updater);

  // Return rollback function
  return () => {
    queryClient.setQueryData<T>(queryKey, previousData);
  };
}

/**
 * Batch invalidate multiple queries
 */
export async function invalidateQueries(
  queryClient: QueryClient,
  queryKeys: any[][]
): Promise<void> {
  await Promise.all(
    queryKeys.map(queryKey =>
      queryClient.invalidateQueries({ queryKey })
    )
  );
}
