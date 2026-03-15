'use client';
import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    body?: unknown
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await axios({
        method,
        url: `${API_BASE}${endpoint}`,
        data: body,
        withCredentials: true,
      });
      setState({ data: res.data, loading: false, error: null });
      return res.data;
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : 'Something went wrong';
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, []);

  return { ...state, request };
}
