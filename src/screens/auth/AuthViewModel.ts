/**
 * Auth View Model
 * 
 * Manages authentication state and business logic.
 * Handles login, registration, social auth, and biometrics.
 */

import { useState, useCallback, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

import { useAuthStore } from '../../store/authSlice';
import { AuthService } from '../../services/api/AuthService';
import { getSecureValue, setSecureValue, deleteSecureValue } from '../../services/storage/SecureStorage';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UseAuthViewModelReturn {
  // State
  isLoading: boolean;
  error: string | null;
  hasBiometrics: boolean;
  
  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithSocial: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
  loginWithBiometrics: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';
const REMEMBER_ME_KEY = 'remember_me_email';

export function useAuthViewModel(): UseAuthViewModelReturn {
  const {
    setAuth,
    clearAuth,
    setLoading: setAuthLoading,
    setError: setAuthError,
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasBiometrics, setHasBiometrics] = useState(false);

  // Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const hasStoredCredentials = await getSecureValue(BIOMETRIC_CREDENTIALS_KEY);
      
      setHasBiometrics(compatible && enrolled && !!hasStoredCredentials);
    } catch (err) {
      console.error('Error checking biometrics:', err);
      setHasBiometrics(false);
    }
  };

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    setAuthError(null);
  }, [setAuthError]);

  // Login with email/password
  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    setIsLoading(true);
    setAuthLoading(true);
    clearError();

    try {
      const response = await AuthService.login(email, password);
      
      // Store auth data
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      // Handle remember me
      if (rememberMe) {
        await setSecureValue(REMEMBER_ME_KEY, email);
        // Also enable biometric login for next time
        await setSecureValue(BIOMETRIC_CREDENTIALS_KEY, JSON.stringify({
          email,
          refreshToken: response.refreshToken,
        }));
        setHasBiometrics(true);
      } else {
        await deleteSecureValue(REMEMBER_ME_KEY);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setAuthError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  }, [setAuth, setAuthLoading, setAuthError, clearError]);

  // Register new user
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setAuthLoading(true);
    clearError();

    try {
      const response = await AuthService.register(data);
      
      // Auto-login after registration
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      setAuthError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  }, [setAuth, setAuthLoading, setAuthError, clearError]);

  // Social login
  const loginWithSocial = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    setIsLoading(true);
    setAuthLoading(true);
    clearError();

    try {
      let response;

      switch (provider) {
        case 'google':
          response = await AuthService.loginWithGoogle();
          break;
        case 'apple':
          response = await AuthService.loginWithApple();
          break;
        case 'facebook':
          response = await AuthService.loginWithFacebook();
          break;
        default:
          throw new Error('Unsupported provider');
      }

      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      // Enable biometric login
      await setSecureValue(BIOMETRIC_CREDENTIALS_KEY, JSON.stringify({
        email: response.user.email,
        refreshToken: response.refreshToken,
      }));
      setHasBiometrics(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `${provider} login failed`;
      setError(errorMessage);
      setAuthError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  }, [setAuth, setAuthLoading, setAuthError, clearError]);

  // Biometric login
  const loginWithBiometrics = useCallback(async () => {
    setIsLoading(true);
    setAuthLoading(true);
    clearError();

    try {
      // Get stored credentials
      const credentialsJson = await getSecureValue(BIOMETRIC_CREDENTIALS_KEY);
      if (!credentialsJson) {
        throw new Error('No biometric credentials found');
      }

      const credentials = JSON.parse(credentialsJson);
      
      // Use refresh token to get new session
      const response = await AuthService.refreshSession(credentials.refreshToken);

      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      // Update stored refresh token
      await setSecureValue(BIOMETRIC_CREDENTIALS_KEY, JSON.stringify({
        ...credentials,
        refreshToken: response.refreshToken,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Biometric login failed';
      setError(errorMessage);
      setAuthError(errorMessage);
      
      // Clear invalid biometric credentials
      await deleteSecureValue(BIOMETRIC_CREDENTIALS_KEY);
      setHasBiometrics(false);
      
      throw err;
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  }, [setAuth, setAuthLoading, setAuthError, clearError]);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      await deleteSecureValue(BIOMETRIC_CREDENTIALS_KEY);
      setHasBiometrics(false);
      setIsLoading(false);
    }
  }, [clearAuth]);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    clearError();

    try {
      await AuthService.resetPassword(email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  return {
    isLoading,
    error,
    hasBiometrics,
    login,
    register,
    loginWithSocial,
    loginWithBiometrics,
    logout,
    clearError,
    resetPassword,
  };
}
