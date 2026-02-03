/**
 * useApi Hook
 * 
 * Provides convenient methods for API calls with loading,
 * error handling, and automatic retries.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { ApiClient } from '../services/api/ApiClient';
import { ApiError, ApiResponse } from '../types/api';

interface UseApiOptions<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: ApiError) => void;
  retryCount?: number;
  retryDelay?: number;
}

interface UseApiState<TData> {
  data: TData | null;
  error: ApiError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseApiReturn<TData, TVariables = void> extends UseApiState<TData> {
  execute: (variables?: TVariables) => Promise<TData>;
  reset: () => void;
}

/**
 * Generic API hook for manual calls
 */
export function useApi<TData, TVariables = void>(
  apiCall: (variables: TVariables) => Promise<TData>,
  options: UseApiOptions<TData> = {}
): UseApiReturn<TData, TVariables> {
  const { onSuccess, onError, retryCount = 0, retryDelay = 1000 } = options;
  
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const retryRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (variables?: TVariables): Promise<TData> => {
    if (!mountedRef.current) {
      throw new Error('Component unmounted');
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
    }));

    try {
      const data = await apiCall(variables as TVariables);
      
      if (mountedRef.current) {
        setState({
          data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
        
        onSuccess?.(data);
        retryRef.current = 0;
      }
      
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      
      // Retry logic
      if (retryRef.current < retryCount) {
        retryRef.current++;
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryRef.current));
        return execute(variables);
      }

      if (mountedRef.current) {
        setState({
          data: null,
          error: apiError,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });
        
        onError?.(apiError);
      }
      
      throw apiError;
    }
  }, [apiCall, onSuccess, onError, retryCount, retryDelay]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
    retryRef.current = 0;
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for GET requests with caching
 */
export function useApiQuery<TData>(
  queryKey: string[],
  fetcher: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn: fetcher,
    ...options,
  });
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    ...options,
  });
}

/**
 * Optimistic update helper
 */
export function useOptimisticUpdate<TData>(queryKey: string[]) {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback((updateFn: (oldData: TData | undefined) => TData) => {
    const previousData = queryClient.getQueryData<TData>(queryKey);
    queryClient.setQueryData(queryKey, updateFn(previousData));
    return previousData;
  }, [queryClient, queryKey]);

  const rollback = useCallback((previousData: TData | undefined) => {
    queryClient.setQueryData(queryKey, previousData);
  }, [queryClient, queryKey]);

  return { optimisticUpdate, rollback };
}

/**
 * Infinite scroll hook
 */
export function useInfiniteApi<TData>(
  queryKey: string[],
  fetcher: (page: number) => Promise<{ items: TData[]; hasMore: boolean }>,
  options?: { pageSize?: number }
) {
  const [items, setItems] = useState<TData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetcher(page);
      setItems(prev => [...prev, ...response.items]);
      setHasMore(response.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, page, isLoading, hasMore]);

  const refresh = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    setItems([]);
    setError(null);
    
    setIsLoading(true);
    try {
      const response = await fetcher(1);
      setItems(response.items);
      setHasMore(response.hasMore);
      setPage(2);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  return {
    items,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

export default useApi;
