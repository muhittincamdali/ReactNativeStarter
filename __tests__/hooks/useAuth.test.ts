/**
 * useAuth Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';

// Mock the auth store
const mockSetAuth = jest.fn();
const mockClearAuth = jest.fn();
const mockSetLoading = jest.fn();

jest.mock('../../src/store/authSlice', () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    setAuth: mockSetAuth,
    clearAuth: mockClearAuth,
    setLoading: mockSetLoading,
  }),
}));

// Mock AuthService
jest.mock('../../src/services/api/AuthService', () => ({
  AuthService: {
    login: jest.fn().mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() + 3600000,
    }),
    logout: jest.fn().mockResolvedValue(undefined),
    refreshSession: jest.fn().mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresAt: Date.now() + 3600000,
    }),
    getCurrentUser: jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
    }),
  },
}));

// Mock SecureStorage
jest.mock('../../src/services/storage/SecureStorage', () => ({
  getSecureValue: jest.fn().mockResolvedValue(null),
  setSecureValue: jest.fn().mockResolvedValue(true),
  deleteSecureValue: jest.fn().mockResolvedValue(true),
}));

import { useAuth } from '../../src/hooks/useAuth';

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
  });

  it('provides login function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.login).toBe('function');
  });

  it('provides logout function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.logout).toBe('function');
  });

  it('provides refreshSession function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.refreshSession).toBe('function');
  });

  it('provides checkAuthStatus function', () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.checkAuthStatus).toBe('function');
  });
});
