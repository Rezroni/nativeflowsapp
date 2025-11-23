/**
 * Profile Mutation Hooks
 *
 * TanStack Query mutations with optimistic updates for user profile.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys, optimisticUpdateProfile } from '@/lib/tanstack/optimistic';
import { toast } from 'sonner';

/**
 * Hook for updating user profile with optimistic updates
 */
export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName?: string;
      email?: string;
      avatarUrl?: string;
    }) => {
      // This would call a Server Action (to be created)
      // For now, return a mock response
      return { success: true };
    },
    onMutate: async (variables) => {
      // Optimistically update the profile
      const rollback = optimisticUpdateProfile(queryClient, userId, variables);

      // Show loading toast
      toast.loading('Updating profile...', { id: 'update-profile' });

      return { rollback };
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: QueryKeys.userProfile(userId) });

      // Show success toast
      toast.success('Profile updated!', { id: 'update-profile' });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.rollback) {
        context.rollback();
      }

      // Show error toast
      toast.error(error instanceof Error ? error.message : 'Update failed', {
        id: 'update-profile',
      });
    },
  });
}

/**
 * Hook for uploading profile avatar with optimistic updates
 */
export function useUploadAvatar(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // This would call a Server Action to upload to Supabase Storage
      // For now, return a mock response
      const tempUrl = URL.createObjectURL(file);
      return {
        success: true,
        avatarUrl: tempUrl,
      };
    },
    onMutate: async (file) => {
      // Create temporary URL for immediate preview
      const tempUrl = URL.createObjectURL(file);

      // Optimistically update the avatar
      const rollback = optimisticUpdateProfile(queryClient, userId, {
        avatarUrl: tempUrl,
      });

      // Show loading toast
      toast.loading('Uploading avatar...', { id: 'upload-avatar' });

      return { rollback, tempUrl };
    },
    onSuccess: (data, file, context) => {
      // Clean up temporary URL
      if (context?.tempUrl) {
        URL.revokeObjectURL(context.tempUrl);
      }

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: QueryKeys.userProfile(userId) });

      // Show success toast
      toast.success('Avatar updated!', { id: 'upload-avatar' });
    },
    onError: (error, file, context) => {
      // Rollback optimistic update
      if (context?.rollback) {
        context.rollback();
      }

      // Clean up temporary URL
      if (context?.tempUrl) {
        URL.revokeObjectURL(context.tempUrl);
      }

      // Show error toast
      toast.error(error instanceof Error ? error.message : 'Upload failed', {
        id: 'upload-avatar',
      });
    },
  });
}

/**
 * Hook for updating user preferences with optimistic updates
 */
export function useUpdatePreferences(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: {
      emailNotifications?: boolean;
      pushNotifications?: boolean;
      theme?: 'light' | 'dark' | 'system';
      language?: string;
    }) => {
      // This would call a Server Action (to be created)
      // For now, return a mock response
      return { success: true };
    },
    onMutate: async (preferences) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QueryKeys.userProfile(userId),
      });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData(
        QueryKeys.userProfile(userId)
      );

      // Optimistically update preferences
      queryClient.setQueryData(
        QueryKeys.userProfile(userId),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            preferences: {
              ...old.preferences,
              ...preferences,
            },
          };
        }
      );

      return { previousProfile };
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: QueryKeys.userProfile(userId) });

      toast.success('Preferences updated');
    },
    onError: (error, preferences, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(
          QueryKeys.userProfile(userId),
          context.previousProfile
        );
      }

      toast.error('Failed to update preferences');
    },
  });
}
