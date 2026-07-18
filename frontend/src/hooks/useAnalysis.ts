import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api.client';

export interface AnalysisPayload {
  title?: string;
  stock_ids?: number[];
  weights: {
    pe_ratio: number;
    roe: number;
    der: number;
    dividend_yield: number;
  };
}

export function useAnalysis() {
  const queryClient = useQueryClient();

  const runAnalysisMutation = useMutation({
    mutationFn: async (payload: AnalysisPayload) => {
      const response = await apiClient.post('/analysis', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    }
  });

  return {
    runAnalysis: runAnalysisMutation.mutateAsync,
    isAnalyzing: runAnalysisMutation.isPending,
    error: runAnalysisMutation.error
  };
}
