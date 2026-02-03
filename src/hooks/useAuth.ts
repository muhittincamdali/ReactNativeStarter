/**
 * useAuth Hook
 * 
 * Provides authentication state and actions throughout the app.
 * Handles login, logout, session refresh, and token management.
 */

import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useAuthStore } from '../store/authSlice';
import { AuthService } from '../services/api/AuthService';
import { getSecureValue, setSecureValue, deleteSecureValue } from '../services/storage/SecureStorage';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  checkAuthStatus: () => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const {
    isAuthenticated,
    isLoading,
    user,
    accessToken,
    refreshToken,
    setAuth,
    clearAuth,
    setLoading,
  } = useAuthStore();

  const [lastRefreshCheck, setLastRefreshCheck] = useState<number>(0);

  // Check if token needs refresh
  const shouldRefreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const expiryString = await getSecureValue(TOKEN_EXPIRY_KEY);
      if (!expiryString) return false;

      const expiry = parseInt(expiryString, 10);
      const now = Date.now();
      
      return expiry - now < REFRESH_THRESHOLD;
    } catch {
      return false;
    }
  }, []);

  // Refresh session
  const refreshSession = useCallback(async (): Promise<boolean> => {
    const currentRefreshToken = refreshToken || await getSecureValue(REFRESH_TOKEN_KEY);
    
    if (!currentRefreshToken) {
      clearAuth();
      return false;
    }

    try {
      const response = await AuthService.refreshSession(currentRefreshToken);
      
      // Save new tokens
      await setSecureValue(ACCESS_TOKEN_KEY, response.accessToken);
      await setSecureValue(REFRESH_TOKEN_KEY, response.refreshToken);
      await setSecureValue(TOKEN_EXPIRY_KEY, response.expiresAt.toString());

      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      return false;
    }
  }, [refreshToken, setAuth, clearAuth]);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);

    try {
      const response = await AuthService.login(email, password);

      // Save tokens securely
      await setSecureValue(ACCESS_TOKEN_KEY, response.accessToken);
      await setSecureValue(REFRESH_TOKEN_KEY, response.refreshToken);
      await setSecureValue(TOKEN_EXPIRY_KEY, response.expiresAt.toString());

      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading]);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored tokens
      await deleteSecureValue(ACCESS_TOKEN_KEY);
      await deleteSecureValue(REFRESH_TOKEN_KEY);
      await deleteSecureValue(TOKEN_EXPIRY_KEY);
      
      clearAuth();
    }
  }, [clearAuth]);

  // Check auth status on mount and app state changes
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    setLoading(true);

    try {
      const storedToken = await getSecureValue(ACCESS_TOKEN_KEY);
      const storedRefreshToken = await getSecureValue(REFRESH_TOKEN_KEY);

      if (!storedToken || !storedRefreshToken) {
        clearAuth();
        return false;
      }

      // Check if token needs refresh
      if (await shouldRefreshToken()) {
        return await refreshSession();
      }

      // Validate current token
      try {
        const userData = await AuthService.getCurrentUser(storedToken);
        
        setAuth({
          user: userData,
          accessToken: storedToken,
          refreshToken: storedRefreshToken,
        });
        
        return true;
      } catch {
        // Token invalid, try refresh
        return await refreshSession();
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      clearAuth();
      return false;
    } finally {
      setLoading(false);
    }
  }, [setAuth, clearAuth, setLoading, shouldRefreshToken, refreshSession]);

  // Handle app state changes for token refresh
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const now = Date.now();
        
        // Prevent too frequent checks
        if (now - lastRefreshCheck < 30000) return;
        setLastRefreshCheck(now);

        if (isAuthenticated && await shouldRefreshToken()) {
          await refreshSession();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isAuthenticated, shouldRefreshToken, refreshSession, lastRefreshCheck]);

  // Auto-refresh token periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAndRefresh = async () => {
      if (await shouldRefreshToken()) {
        await refreshSession();
      }
    };

    // Check every minute
    const interval = setInterval(checkAndRefresh, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, shouldRefreshToken, refreshSession]);

  return {
    isAuthenticated,
    isLoading,
    user,
    accessToken,
    login,
    logout,
    refreshSession,
    checkAuthStatus,
  };
}

export default useAuth;
