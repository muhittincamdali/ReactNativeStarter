/**
 * Colours, spacing and type sizes, and the hook that picks the light or dark palette.
 *
 * @module
 */
import { useColorScheme } from 'react-native';

import { usePreferences, type AppearancePreference } from '@/lib/preferences';

/** One palette. Text colours meet WCAG AA (4.5:1) on `background` and `surface`. */
export interface Palette {
  background: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
  danger: string;
}

/** The light and dark palettes. */
export const palettes: Record<'light' | 'dark', Palette> = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F9FF',
    border: '#D0E2F7',
    text: '#0B1F33',
    muted: '#5A6B80',
    accent: '#0058D4',
    onAccent: '#FFFFFF',
    accentSoft: '#EAF4FF',
    danger: '#C4122F',
  },
  dark: {
    background: '#0D1117',
    surface: '#0B1626',
    border: '#1C3557',
    text: '#E6EDF3',
    muted: '#8FA3BC',
    accent: '#64D2FF',
    onAccent: '#04111F',
    accentSoft: '#0B2E5C',
    danger: '#FF8A8A',
  },
};

/** Spacing steps in points. */
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

/** Font sizes in points; they scale with the system text size. */
export const fontSize = { caption: 13, body: 16, title: 22, largeTitle: 30 } as const;

/** Corner radius of fields, buttons and cards. */
export const radius = 12;

/** The colour scheme to use for a preference and the device setting. */
export function resolveScheme(
  preference: AppearancePreference,
  device: string | null | undefined,
): 'light' | 'dark' {
  if (preference !== 'system') return preference;
  return device === 'dark' ? 'dark' : 'light';
}

/** The active scheme and its palette. */
export function useTheme(): { scheme: 'light' | 'dark'; colors: Palette } {
  const preference = usePreferences((state) => state.appearance);
  const scheme = resolveScheme(preference, useColorScheme());
  return { scheme, colors: palettes[scheme] };
}
