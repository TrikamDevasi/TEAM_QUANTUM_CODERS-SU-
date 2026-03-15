import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { User, ApiResponse } from '../types/api';

const TOKEN_KEY = 'token';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    setUser(null);
    router.push('/auth');
  }, [router]);

  const verifyToken = useCallback(async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    try {
      // Optimistically decode token for immediate UI feedback if needed
      const decoded: any = jwtDecode(token);
      
      // Call backend to verify and get fresh user data
      const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshUser: verifyToken
  };
};
