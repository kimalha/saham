import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api.client';

export interface HistorySummary {
  id: number;
  title: string;
  weight_pe: number;
  weight_roe: number;
  weight_der: number;
  weight_div: number;
  created_at: string;
}

export interface HistoryDetail extends HistorySummary {
  ranking: Array<{
    id: number;
    code: string;
    preference_score: number;
    rank: number;
  }>;
  calculation_steps: {
    matrix_d: number[][];
    matrix_r: number[][];
    matrix_y: number[][];
    ideal_solutions: {
      positive: number[];
      negative: number[];
    };
    distances: Array<{
      id: number;
      d_plus: number;
      d_minus: number;
    }>;
  };
}

export function useHistory() {
  const queryClient = useQueryClient();

  // 1. Fetch ringkasan riwayat
  const historyQuery = useQuery<HistorySummary[]>({
    queryKey: ['history'],
    queryFn: async () => {
      const response = await apiClient.get('/history');
      return response.data.data;
    }
  });

  // 2. Fetch detail riwayat berdasarkan ID
  const fetchHistoryDetail = async (id: number): Promise<HistoryDetail> => {
    const response = await apiClient.get(`/history/${id}`);
    return response.data.data;
  };

  // 3. Delete riwayat
  const deleteHistoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/history/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    }
  });

  return {
    historyList: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    error: historyQuery.error,
    refetch: historyQuery.refetch,
    getHistoryDetail: fetchHistoryDetail,
    deleteHistory: deleteHistoryMutation.mutateAsync,
    isDeleting: deleteHistoryMutation.isPending
  };
}
