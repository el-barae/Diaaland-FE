'use client'
import { useState, useCallback, useRef, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface UseAPIOptions {
  cacheTime?: number;
  refetchOnMount?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const globalCache = new Map<string, CacheEntry<any>>();
const pendingRequests = new Map<string, Promise<any>>();

// ✅ NEW: useAPIQuery Hook for GET requests
export function useAPIQuery<T = any>(
  url: string,
  options: {
    cacheKey?: string;
    enabled?: boolean;
    cacheTime?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {}
) {
  const {
    cacheKey = url,
    enabled = true,
    cacheTime = 5 * 60 * 1000,
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    const cached = globalCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      return cached.data;
    }

    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const requestPromise = axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const responseData = response.data;
        globalCache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now()
        });
        setData(responseData);
        setLoading(false);
        onSuccess?.(responseData);
        pendingRequests.delete(cacheKey);
        return responseData;
      })
      .catch(err => {
        setError(err);
        setLoading(false);
        onError?.(err);
        pendingRequests.delete(cacheKey);
        throw err;
      });

    pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }, [url, cacheKey, enabled, cacheTime, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Original useOptimizedAPI hook
export function useOptimizedAPI<T = any>(options: UseAPIOptions = {}) {
  const {
    cacheTime = 5 * 60 * 1000,
    refetchOnMount = false,
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getCacheKey = (url: string, config?: AxiosRequestConfig) => {
    return `${url}_${JSON.stringify(config?.params || {})}`;
  };

  const isCacheValid = (cacheKey: string): boolean => {
    const cached = globalCache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < cacheTime;
  };

  const fetchData = useCallback(async (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const cacheKey = getCacheKey(url, config);

    if (isCacheValid(cacheKey)) {
      const cached = globalCache.get(cacheKey);
      setData(cached!.data);
      return cached!.data;
    }

    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey)!;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    const requestPromise = axios({
      ...config,
      url,
      signal: abortControllerRef.current.signal
    })
      .then(response => {
        const responseData = response.data;
        globalCache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now()
        });
        setData(responseData);
        setLoading(false);
        onSuccess?.(responseData);
        pendingRequests.delete(cacheKey);
        return responseData;
      })
      .catch(err => {
        if (err.name !== 'CanceledError') {
          setError(err);
          setLoading(false);
          onError?.(err);
          pendingRequests.delete(cacheKey);
        }
        throw err;
      });

    pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }, [cacheTime, onSuccess, onError]);

  const mutate = useCallback(async (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const cacheKey = getCacheKey(url, config);
    globalCache.delete(cacheKey);
    return fetchData(url, config);
  }, [fetchData]);

  const invalidateCache = useCallback((pattern?: string) => {
    if (pattern) {
      const keys = Array.from(globalCache.keys());
      keys.forEach(key => {
        if (key.includes(pattern)) {
          globalCache.delete(key);
        }
      });
    } else {
      globalCache.clear();
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    mutate,
    invalidateCache
  };
}

export function useAPIMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: any, variables: TVariables) => void;
    invalidatePatterns?: string[];
  } = {}
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      setData(result);
      setLoading(false);

      if (options.invalidatePatterns) {
        options.invalidatePatterns.forEach(pattern => {
          const keys = Array.from(globalCache.keys());
          keys.forEach(key => {
            if (key.includes(pattern)) {
              globalCache.delete(key);
            }
          });
        });
      }

      options.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      options.onError?.(err, variables);
      throw err;
    }
  }, [mutationFn, options]);

  return {
    data,
    loading,
    error,
    mutate
  };
}

export function usePaginatedAPI<T = any>(
  baseUrl: string,
  options: {
    pageSize?: number;
    initialPage?: number;
  } = {}
) {
  const { pageSize = 10, initialPage = 1 } = options;
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, error, fetchData } = useOptimizedAPI<T[]>({
    cacheTime: 2 * 60 * 1000
  });

  const loadPage = useCallback(async (pageNum: number) => {
    const result = await fetchData(baseUrl, {
      params: { page: pageNum, size: pageSize }
    });

    if (Array.isArray(result) && result.length < pageSize) {
      setHasMore(false);
    }

    return result;
  }, [baseUrl, pageSize, fetchData]);

  const nextPage = useCallback(() => {
    if (!loading && hasMore) {
      const nextPageNum = page + 1;
      setPage(nextPageNum);
      loadPage(nextPageNum);
    }
  }, [page, loading, hasMore, loadPage]);

  const previousPage = useCallback(() => {
    if (!loading && page > 1) {
      const prevPageNum = page - 1;
      setPage(prevPageNum);
      loadPage(prevPageNum);
    }
  }, [page, loading, loadPage]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    loadPage(initialPage);
  }, [initialPage, loadPage]);

  return {
    data,
    loading,
    error,
    page,
    hasMore,
    nextPage,
    previousPage,
    reset,
    loadPage
  };
}