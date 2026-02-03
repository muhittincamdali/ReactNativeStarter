/**
 * User Store Slice
 * 
 * Manages user profile data, preferences,
 * and user-related state.
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { User, UserStats, UpdateProfileRequest } from '../types/models';
import { UserService } from '../services/api/UserService';
import { registerStoreReset } from './store';

interface UserState {
  // State
  profile: User | null;
  stats: UserStats | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  // Actions
  setProfile: (profile: User) => void;
  setStats: (stats: UserStats) => void;
  setLoading: (isLoading: boolean) => void;
  setUpdating: (isUpdating: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  uploadAvatar: (imageUri: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  profile: null,
  stats: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setProfile: (profile) => {
          set({ profile });
        },

        setStats: (stats) => {
          set({ stats });
        },

        setLoading: (isLoading) => {
          set({ isLoading });
        },

        setUpdating: (isUpdating) => {
          set({ isUpdating });
        },

        setError: (error) => {
          set({ error });
        },

        fetchProfile: async () => {
          set({ isLoading: true, error: null });

          try {
            const [profile, stats] = await Promise.all([
              UserService.getCurrentProfile(),
              UserService.getStats('me'),
            ]);

            set({ profile, stats, isLoading: false });
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch profile';
            set({ error: message, isLoading: false });
          }
        },

        updateProfile: async (data) => {
          set({ isUpdating: true, error: null });

          try {
            const updatedProfile = await UserService.updateProfile(data);
            set({ profile: updatedProfile, isUpdating: false });
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update profile';
            set({ error: message, isUpdating: false });
            throw error;
          }
        },

        uploadAvatar: async (imageUri) => {
          set({ isUpdating: true, error: null });

          try {
            const { avatarUrl } = await UserService.uploadAvatar(imageUri);
            const { profile } = get();
            
            if (profile) {
              set({
                profile: { ...profile, avatar: avatarUrl },
                isUpdating: false,
              });
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to upload avatar';
            set({ error: message, isUpdating: false });
            throw error;
          }
        },

        refreshProfile: async () => {
          await get().fetchProfile();
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          profile: state.profile,
          stats: state.stats,
        }),
      }
    ),
    { name: 'user' }
  )
);

// Register reset function
registerStoreReset(() => useUserStore.getState().reset());

// Selectors
export const selectProfile = (state: UserState) => state.profile;
export const selectStats = (state: UserState) => state.stats;
export const selectIsLoading = (state: UserState) => state.isLoading;
export const selectIsUpdating = (state: UserState) => state.isUpdating;

export default useUserStore;
