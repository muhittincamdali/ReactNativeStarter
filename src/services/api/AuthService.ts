/**
 * Auth Service
 * 
 * Handles all authentication-related API calls including
 * login, registration, and token management.
 */

import { ApiClient } from './ApiClient';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../../types/models';

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  me: '/auth/me',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  resendVerification: '/auth/resend-verification',
  google: '/auth/google',
  apple: '/auth/apple',
  facebook: '/auth/facebook',
};

export const AuthService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>(AUTH_ENDPOINTS.login, {
      email,
      password,
    });
    
    return response;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>(AUTH_ENDPOINTS.register, data);
    return response;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await ApiClient.post(AUTH_ENDPOINTS.logout);
    } catch (error) {
      // Ignore logout errors - clear local state anyway
      console.error('Logout error:', error);
    }
  },

  /**
   * Refresh access token
   */
  async refreshSession(refreshToken: string): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>(AUTH_ENDPOINTS.refresh, {
      refreshToken,
    });
    
    return response;
  },

  /**
   * Get current user
   */
  async getCurrentUser(accessToken?: string): Promise<User> {
    const headers: Record<string, string> = {};
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await ApiClient.request<User>('GET', AUTH_ENDPOINTS.me, {
      headers,
    });
    
    return response;
  },

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<void> {
    await ApiClient.post(AUTH_ENDPOINTS.forgotPassword, { email });
  },

  /**
   * Confirm password reset with token
   */
  async confirmResetPassword(token: string, newPassword: string): Promise<void> {
    await ApiClient.post(AUTH_ENDPOINTS.resetPassword, {
      token,
      password: newPassword,
    });
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    await ApiClient.post(AUTH_ENDPOINTS.verifyEmail, { token });
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<void> {
    await ApiClient.post(AUTH_ENDPOINTS.resendVerification, { email });
  },

  /**
   * Login with Google
   */
  async loginWithGoogle(): Promise<AuthResponse> {
    // This would typically use expo-auth-session or similar
    // For now, return mock implementation
    const response = await ApiClient.post<AuthResponse>(AUTH_ENDPOINTS.google, {
      // Google OAuth token would be sent here
    });
    
    return response;
  },

  /**
   * Login with Apple
   */
  async loginWithApple(): Promise<AuthResponse> {
    // This would use expo-apple-authentication
    const response = await ApiClient.post<AuthResponse>(AUTH_ENDPOINTS.apple, {
      // Apple identity token would be sent here
    });
    
    return response;
  },

  /**
   * Login with Facebook
   */
  async loginWithFacebook(): Promise<AuthResponse> {
    // This would use expo-facebook
    const response = await ApiClient.post<AuthResponse>(AUTH_ENDPOINTS.facebook, {
      // Facebook access token would be sent here
    });
    
    return response;
  },

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await ApiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Enable two-factor authentication
   */
  async enableTwoFactor(): Promise<{ secret: string; qrCode: string }> {
    const response = await ApiClient.post<{ secret: string; qrCode: string }>(
      '/auth/2fa/enable'
    );
    return response;
  },

  /**
   * Verify and confirm two-factor setup
   */
  async confirmTwoFactor(code: string): Promise<void> {
    await ApiClient.post('/auth/2fa/confirm', { code });
  },

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactor(code: string): Promise<void> {
    await ApiClient.post('/auth/2fa/disable', { code });
  },
};

export default AuthService;
