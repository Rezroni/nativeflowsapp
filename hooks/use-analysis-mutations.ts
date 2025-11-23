/**
 * Analysis Mutation Hooks
 *
 * TanStack Query mutations with optimistic updates for instant UI feedback.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QueryKeys,
  optimisticCreateAnalysis,
  optimisticDeleteAnalysis,
} from '@/lib/tanstack/optimistic';
import { analyzeChart } from '@/actions/analysis';
import { deleteAnalysis as deleteAnalysisAction } from '@/actions/analysis';
import { toast } from 'sonner';

/**
 * Hook for creating an analysis with optimistic updates
 */
export function useCreateAnalysis(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      imageFile: File;
      timeframe: string;
      context?: string;
    }) => {
      const formData = new FormData();
      formData.append('image', data.imageFile);
      formData.append('timeframe', data.timeframe);
      if (data.context) {
        formData.append('context', data.context);
      }

      const result = await analyzeChart(formData);
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }
      return result;
    },
    onMutate: async (variables) => {
      // Create temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempImageUrl = URL.createObjectURL(variables.imageFile);

      // Optimistically add the analysis
      const rollback = optimisticCreateAnalysis(queryClient, userId, {
        id: tempId,
        imageUrl: tempImageUrl,
        result: 'Analyzing...',
        timeframe: variables.timeframe,
        context: variables.context,
        createdAt: new Date().toISOString(),
      });

      // Show loading toast
      toast.loading('Analyzing chart...', { id: 'analyze-chart' });

      return { rollback, tempImageUrl };
    },
    onSuccess: (data, variables, context) => {
      // Clean up temporary URL
      if (context?.tempImageUrl) {
        URL.revokeObjectURL(context.tempImageUrl);
      }

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: QueryKeys.analyses(userId) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.recentAnalyses() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.userUsage(userId) });

      // Show success toast
      toast.success('Analysis complete!', { id: 'analyze-chart' });
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
      toast.error(error instanceof Error ? error.message : 'Analysis failed', {
        id: 'analyze-chart',
      });
    },
  });
}

/**
 * Hook for deleting an analysis with optimistic updates
 */
export function useDeleteAnalysis(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (analysisId: string) => {
      const result = await deleteAnalysisAction(analysisId);
      if (!result.success) {
        throw new Error(result.error || 'Delete failed');
      }
      return result;
    },
    onMutate: async (analysisId) => {
      // Optimistically remove the analysis
      const rollback = optimisticDeleteAnalysis(queryClient, userId, analysisId);

      // Show loading toast
      toast.loading('Deleting analysis...', { id: 'delete-analysis' });

      return { rollback };
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: QueryKeys.analyses(userId) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.recentAnalyses() });

      // Show success toast
      toast.success('Analysis deleted', { id: 'delete-analysis' });
    },
    onError: (error, analysisId, context) => {
      // Rollback optimistic update
      if (context?.rollback) {
        context.rollback();
      }

      // Show error toast
      toast.error(error instanceof Error ? error.message : 'Delete failed', {
        id: 'delete-analysis',
      });
    },
  });
}

/**
 * Hook for updating analysis context
 */
export function useUpdateAnalysisContext(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      analysisId: string;
      context: string;
    }) => {
      // This would call a Server Action (to be created)
      // For now, return a mock response
      return { success: true };
    },
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QueryKeys.analysis(variables.analysisId),
      });

      // Snapshot previous value
      const previousAnalysis = queryClient.getQueryData(
        QueryKeys.analysis(variables.analysisId)
      );

      // Optimistically update
      queryClient.setQueryData(
        QueryKeys.analysis(variables.analysisId),
        (old: any) => {
          if (!old) return old;
          return { ...old, context: variables.context };
        }
      );

      return { previousAnalysis };
    },
    onSuccess: (data, variables) => {
      // Invalidate to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: QueryKeys.analysis(variables.analysisId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.analyses(userId) });

      toast.success('Context updated');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousAnalysis) {
        queryClient.setQueryData(
          QueryKeys.analysis(variables.analysisId),
          context.previousAnalysis
        );
      }

      toast.error('Failed to update context');
    },
  });
}
