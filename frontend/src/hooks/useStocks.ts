import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api.client';

export interface StockData {
  id: number;
  code: string;
  name: string;
  sector: string;
  pe_ratio: number;
  roe: number;
  der: number;
  dividend_yield: number;
  createdAt?: string;
  updatedAt?: string;
}

export function useStocks() {
  const queryClient = useQueryClient();

  // 1. Fetch all stocks
  const stocksQuery = useQuery<StockData[]>({
    queryKey: ['stocks'],
    queryFn: async () => {
      const response = await apiClient.get('/stocks');
      return response.data.data;
    }
  });

  // 2. Create stock alternative
  const createStockMutation = useMutation({
    mutationFn: async (newStock: Omit<StockData, 'id'>) => {
      const response = await apiClient.post('/stocks', newStock);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    }
  });

  // 3. Update stock alternative
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<StockData> }) => {
      const response = await apiClient.put(`/stocks/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    }
  });

  // 4. Delete stock alternative
  const deleteStockMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/stocks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    }
  });

  // 5. Bulk Import stock data (Excel/CSV)
  const importStocksMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post('/stocks/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    }
  });

  // 6. Sync Financial Data otomatis
  const syncStocksMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/stocks/sync');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    }
  });

  return {
    stocks: stocksQuery.data || [],
    isLoading: stocksQuery.isLoading,
    error: stocksQuery.error,
    refetch: stocksQuery.refetch,
    createStock: createStockMutation.mutateAsync,
    isCreating: createStockMutation.isPending,
    updateStock: updateStockMutation.mutateAsync,
    isUpdating: updateStockMutation.isPending,
    deleteStock: deleteStockMutation.mutateAsync,
    isDeleting: deleteStockMutation.isPending,
    importStocks: importStocksMutation.mutateAsync,
    isImporting: importStocksMutation.isPending,
    syncStocks: syncStocksMutation.mutateAsync,
    isSyncing: syncStocksMutation.isPending,
  };
}
