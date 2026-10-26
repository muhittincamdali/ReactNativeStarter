/**
 * Appearance and language chosen in Settings, saved with AsyncStorage.
 *
 * Saved data is checked when it is read back: a value written by an older version, or edited by
 * hand, falls back to the default instead of reaching the UI.
 *
 * @module
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** `system` follows the device setting. */
export type AppearancePreference = 'system' | 'light' | 'dark';
/** `system` follows the device language when the app has it, English otherwise. */
export type LanguagePreference = 'system' | 'en' | 'tr';

/** State and actions of {@link usePreferences}. */
export interface PreferencesState {
  appearance: AppearancePreference;
  language: LanguagePreference;
  setAppearance(appearance: AppearancePreference): void;
  setLanguage(language: LanguagePreference): void;
}

const savedSchema = z.object({
  appearance: z.enum(['system', 'light', 'dark']).catch('system'),
  language: z.enum(['system', 'en', 'tr']).catch('system'),
});

/** Reads saved preferences, replacing anything unexpected with the default. */
export function parseSavedPreferences(
  saved: unknown,
): Pick<PreferencesState, 'appearance' | 'language'> {
  const parsed = savedSchema.safeParse(saved ?? {});
  return parsed.success ? parsed.data : { appearance: 'system', language: 'system' };
}

/** The preferences store. */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      appearance: 'system',
      language: 'system',
      setAppearance: (appearance) => set({ appearance }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'preferences.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ appearance, language }) => ({ appearance, language }),
      merge: (saved, current) => ({ ...current, ...parseSavedPreferences(saved) }),
    },
  ),
);
