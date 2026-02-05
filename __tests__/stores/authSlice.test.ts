/**
 * Auth Store Tests
 */

import { act, renderHook } from '@testing-library/react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

import { useAuthStore } from '../../src/store/authSlice';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useAuthStore.getState().reset();
    });
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets auth data correctly', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      useAuthStore.getState().setAuth({
        user: mockUser,
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      });
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe('access-token-123');
    expect(state.refreshToken).toBe('refresh-token-456');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('clears auth data correctly', () => {
    // First set some auth data
    act(() => {
      useAuthStore.getState().setAuth({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        accessToken: 'token',
        refreshToken: 'refresh',
      });
    });

    // Then clear it
    act(() => {
      useAuthStore.getState().clearAuth();
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('sets loading state', () => {
    act(() => {
      useAuthStore.getState().setLoading(true);
    });

    expect(useAuthStore.getState().isLoading).toBe(true);

    act(() => {
      useAuthStore.getState().setLoading(false);
    });

    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('sets error state', () => {
    act(() => {
      useAuthStore.getState().setError('Something went wrong');
    });

    expect(useAuthStore.getState().error).toBe('Something went wrong');

    act(() => {
      useAuthStore.getState().setError(null);
    });

    expect(useAuthStore.getState().error).toBeNull();
  });

  it('updates user data', () => {
    const updatedUser = {
      id: '1',
      email: 'updated@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      useAuthStore.getState().setUser(updatedUser);
    });

    expect(useAuthStore.getState().user).toEqual(updatedUser);
  });

  it('updates tokens', () => {
    act(() => {
      useAuthStore.getState().setTokens('new-access', 'new-refresh');
    });

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('new-access');
    expect(state.refreshToken).toBe('new-refresh');
  });

  it('resets to initial state', () => {
    // Set some data
    act(() => {
      useAuthStore.getState().setAuth({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        accessToken: 'token',
        refreshToken: 'refresh',
      });
      useAuthStore.getState().setError('error');
    });

    // Reset
    act(() => {
      useAuthStore.getState().reset();
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
  });

  it('initializes correctly with existing tokens', async () => {
    // Set tokens first
    act(() => {
      useAuthStore.getState().setTokens('existing-access', 'existing-refresh');
    });

    // Reset initialized flag
    act(() => {
      useAuthStore.getState().setInitialized(false);
    });

    // Initialize
    await act(async () => {
      await useAuthStore.getState().initialize();
    });

    const state = useAuthStore.getState();
    expect(state.isInitialized).toBe(true);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('initializes correctly without tokens', async () => {
    // Ensure no tokens
    act(() => {
      useAuthStore.getState().reset();
    });

    // Initialize
    await act(async () => {
      await useAuthStore.getState().initialize();
    });

    const state = useAuthStore.getState();
    expect(state.isInitialized).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });
});
