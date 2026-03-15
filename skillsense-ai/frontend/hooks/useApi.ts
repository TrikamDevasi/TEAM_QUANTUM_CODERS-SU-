import { useState, useCallback, useEffect } from 'react';
import api from '../lib/api';
import Cookies from 'js-cookie';
import { ApiResponse } from '../types/api';

interface UseApiOptions {
  manual?: boolean;
}

export const useApi = <T>(url: string, options: UseApiOptions = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(!options.manual);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get('token');
      const response = await api.get<ApiResponse<T>>(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'API request failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      // Global 401 handling is already in lib/api.ts interceptor, 
      // but we can add specific logic here if needed.
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!options.manual) {
      fetchData();
    }
  }, [fetchData, options.manual]);

  return { data, isLoading, error, refetch: fetchData };
};
