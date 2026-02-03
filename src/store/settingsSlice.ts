/**
 * Settings Store Slice
 * 
 * Manages application settings including theme,
 * notifications, and preferences.
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { registerStoreReset } from './store';

type ThemePreference = 'light' | 'dark' | 'system';
type Language = 'en' | 'es' | 'fr' | 'de';

interface SettingsState {
  // State
  theme: ThemePreference;
  language: Language;
  pushNotifications: boolean;
  emailNotifications: boolean;
  biometricEnabled: boolean;
  hapticFeedback: boolean;
  autoPlayVideos: boolean;
  dataUsage: 'low' | 'normal' | 'high';

  // Actions
  setTheme: (theme: ThemePreference) => void;
  setLanguage: (language: Language) => void;
  setPushNotifications: (enabled: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setHapticFeedback: (enabled: boolean) => void;
  setAutoPlayVideos: (enabled: boolean) => void;
  setDataUsage: (usage: 'low' | 'normal' | 'high') => void;
  reset: () => void;
}

const initialState = {
  theme: 'system' as ThemePreference,
  language: 'en' as Language,
  pushNotifications: true,
  emailNotifications: true,
  biometricEnabled: false,
  hapticFeedback: true,
  autoPlayVideos: true,
  dataUsage: 'normal' as const,
};

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setTheme: (theme) => {
          set({ theme });
        },

        setLanguage: (language) => {
          set({ language });
        },

        setPushNotifications: (enabled) => {
          set({ pushNotifications: enabled });
        },

        setEmailNotifications: (enabled) => {
          set({ emailNotifications: enabled });
        },

        setBiometricEnabled: (enabled) => {
          set({ biometricEnabled: enabled });
        },

        setHapticFeedback: (enabled) => {
          set({ hapticFeedback: enabled });
        },

        setAutoPlayVideos: (enabled) => {
          set({ autoPlayVideos: enabled });
        },

        setDataUsage: (usage) => {
          set({ dataUsage: usage });
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'settings-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    ),
    { name: 'settings' }
  )
);

// Register reset function
registerStoreReset(() => useSettingsStore.getState().reset());

// Selectors
export const selectTheme = (state: SettingsState) => state.theme;
export const selectLanguage = (state: SettingsState) => state.language;

export default useSettingsStore;
