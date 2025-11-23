/**
 * Saved Setup Mutation Hooks
 *
 * TanStack Query mutations with optimistic updates for saved trading setups.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QueryKeys,
  optimisticSaveSetup,
  optimisticDeleteSetup,
} from '@/lib/tanstack/optimistic';
import { toast } from 'sonner';

/**
 * Hook for saving a trading setup with optimistic updates
 */
export function useSaveSetup(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      imageFile: File;
      analysisId?: string;
    }) => {
      // This would call a Server Action (to be created)
      // For now, return a mock response
      return {
        success: true,
        setupId: `setup-${Date.now()}`,
      };
    },
    onMutate: async (variables) => {
      // Create temporary ID and URL
      const tempId = `temp-${Date.now()}`;
      const tempImageUrl = URL.createObjectURL(variables.imageFile);

      // Optimistically add the setup
      const rollback = optimisticSaveSetup(queryClient, userId, {
        id: tempId,
        name: variables.name,
        imageUrl: tempImageUrl,
        createdAt: new Date().toISOString(),
      });

      // Show loading toast
      toast.loading('Saving setup...', { id: 'save-setup' });

      return { rollback, tempImageUrl };
    },
    onSuccess: (data, variables, context) => {
      // Clean up temporary URL
      if (context?.tempImageUrl) {
        URL.revokeObjectURL(context.tempImageUrl);
      }

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: QueryKeys.savedSetups(userId) });

      // Show success toast
      toast.success('Setup saved!', { id: 'save-setup' });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.rollback) {
        context.rollback();
      }

      // Clean up temporary URL
      if (context?.tempImageUrl) {
        URL.revokeObjectURL(context.tempImageUrl);
      }

      // Show error toast
      toast.error(error instanceof Error ? error.message : 'Failed to save setup', {
        id: 'save-setup',
      });
    },
  });
}

/**
 * Hook for deleting a saved setup with optimistic updates
 */
export function useDeleteSetup(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (setupId: string) => {
      // This would call a Server Action (to be created)
      // For now, return a mock response
      return { success: true };
    },
    onMutate: async (setupId) => {
      // Optimistically remove the setup
      const rollback = optimisticDeleteSetup(queryClient, userId, setupId);

      // Show loading toast
      toast.loading('Deleting setup...', { id: 'delete-setup' });

      return { rollback };
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: QueryKeys.savedSetups(userId) });

      // Show success toast
      toast.success('Setup deleted', { id: 'delete-setup' });
    },
    onError: (error, setupId, context) => {
      // Rollback optimistic update
      if (context?.rollback) {
        context.rollback();
      }

      // Show error toast
      toast.error(error instanceof Error ? error.message : 'Delete failed', {
        id: 'delete-setup',
      });
    },
  });
}

/**
 * Hook for updating a saved setup name
 */
export function useUpdateSetupName(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      setupId: string;
      name: string;
    }) => {
      // This would call a Server Action (to be created)
      // For now, return a mock response
      return { success: true };
    },
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QueryKeys.savedSetup(variables.setupId),
      });

      // Snapshot previous value
      const previousSetup = queryClient.getQueryData(
        QueryKeys.savedSetup(variables.setupId)
      );

      // Optimistically update
      queryClient.setQueryData(
        QueryKeys.savedSetup(variables.setupId),
        (old: any) => {
          if (!old) return old;
          return { ...old, name: variables.name };
        }
      );

      // Also update in the list
      queryClient.setQueryData(
        QueryKeys.savedSetups(userId),
        (old: any) => {
          if (!old) return old;
          return old.map((setup: any) =>
            setup.id === variables.setupId
              ? { ...setup, name: variables.name }
              : setup
          );
        }
      );

      return { previousSetup };
    },
    onSuccess: (data, variables) => {
      // Invalidate to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: QueryKeys.savedSetup(variables.setupId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.savedSetups(userId) });

      toast.success('Setup name updated');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousSetup) {
        queryClient.setQueryData(
          QueryKeys.savedSetup(variables.setupId),
          context.previousSetup
        );
      }

      toast.error('Failed to update name');
    },
  });
}
