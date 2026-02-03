/**
 * Auth Store Slice
 * 
 * Manages authentication state including user data,
 * tokens, and auth status.
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { User } from '../types/models';
import { registerStoreReset } from './store';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (isInitialized: boolean) => void;
  initialize: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setAuth: (data) => {
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        },

        clearAuth: () => {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        },

        setUser: (user) => {
          set({ user });
        },

        setTokens: (accessToken, refreshToken) => {
          set({
            accessToken,
            refreshToken,
          });
        },

        setLoading: (isLoading) => {
          set({ isLoading });
        },

        setError: (error) => {
          set({ error });
        },

        setInitialized: (isInitialized) => {
          set({ isInitialized });
        },

        initialize: async () => {
          const { isInitialized, accessToken, refreshToken } = get();
          
          if (isInitialized) return;

          set({ isLoading: true });

          try {
            // Check if we have valid tokens
            if (accessToken && refreshToken) {
              // Tokens exist, user is authenticated
              set({ isAuthenticated: true });
            } else {
              set({ isAuthenticated: false });
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            set({ isAuthenticated: false });
          } finally {
            set({ isLoading: false, isInitialized: true });
          }
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth' }
  )
);

// Register reset function
registerStoreReset(() => useAuthStore.getState().reset());

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectAccessToken = (state: AuthState) => state.accessToken;

export default useAuthStore;
