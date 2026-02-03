/**
 * useTheme Hook
 * 
 * Provides theme colors, typography, and spacing
 * throughout the application.
 */

import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useThemeContext } from '../app/providers';
import { useSettingsStore } from '../store/settingsSlice';
import { lightTheme, darkTheme, Theme } from '../theme/colors';
import { typography, Typography } from '../theme/typography';
import { spacing, Spacing } from '../theme/spacing';

interface UseThemeReturn {
  colors: Theme['colors'];
  isDark: boolean;
  theme: Theme;
  typography: Typography;
  spacing: Spacing;
}

/**
 * Main theme hook that uses context when available
 */
export function useTheme(): UseThemeReturn {
  try {
    // Try to use context first
    const context = useThemeContext();
    return {
      colors: context.colors,
      isDark: context.isDark,
      theme: context.theme,
      typography,
      spacing,
    };
  } catch {
    // Fallback when context is not available
    return useThemeFallback();
  }
}

/**
 * Fallback theme hook when context is not available
 */
function useThemeFallback(): UseThemeReturn {
  const systemColorScheme = useColorScheme();
  const { theme: themePreference } = useSettingsStore();

  const activeTheme = useMemo(() => {
    if (themePreference === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themePreference === 'dark' ? darkTheme : lightTheme;
  }, [themePreference, systemColorScheme]);

  return {
    colors: activeTheme.colors,
    isDark: activeTheme.isDark,
    theme: activeTheme,
    typography,
    spacing,
  };
}

/**
 * Hook to get specific color values
 */
export function useColors() {
  const { colors } = useTheme();
  return colors;
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDarkMode(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

export default useTheme;
