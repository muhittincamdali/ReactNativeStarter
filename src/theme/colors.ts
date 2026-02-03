/**
 * Theme Colors
 * 
 * Defines the color palette for light and dark themes.
 * Based on a modern design system with semantic colors.
 */

/**
 * Color palette
 */
const palette = {
  // Primary
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Neutral
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Success
  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },

  // Warning
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  // Error
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  // Info
  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
  },

  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

/**
 * Theme colors interface
 */
export interface ThemeColors {
  // Backgrounds
  background: string;
  surface: string;
  surfaceVariant: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Brand
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;

  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;

  // UI Elements
  border: string;
  divider: string;
  disabled: string;
  placeholder: string;

  // Overlays
  overlay: string;
  backdrop: string;
}

/**
 * Light theme colors
 */
export const lightColors: ThemeColors = {
  // Backgrounds
  background: palette.white,
  surface: palette.white,
  surfaceVariant: palette.slate[100],

  // Text
  text: palette.slate[900],
  textSecondary: palette.slate[600],
  textTertiary: palette.slate[400],

  // Brand
  primary: palette.indigo[500],
  primaryVariant: palette.indigo[600],
  secondary: palette.slate[100],
  secondaryVariant: palette.slate[200],

  // Semantic
  success: palette.emerald[500],
  warning: palette.amber[500],
  error: palette.red[500],
  info: palette.sky[500],

  // UI Elements
  border: palette.slate[200],
  divider: palette.slate[100],
  disabled: palette.slate[300],
  placeholder: palette.slate[400],

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
};

/**
 * Dark theme colors
 */
export const darkColors: ThemeColors = {
  // Backgrounds
  background: palette.slate[950],
  surface: palette.slate[900],
  surfaceVariant: palette.slate[800],

  // Text
  text: palette.slate[50],
  textSecondary: palette.slate[400],
  textTertiary: palette.slate[500],

  // Brand
  primary: palette.indigo[400],
  primaryVariant: palette.indigo[300],
  secondary: palette.slate[800],
  secondaryVariant: palette.slate[700],

  // Semantic
  success: palette.emerald[500],
  warning: palette.amber[500],
  error: palette.red[500],
  info: palette.sky[500],

  // UI Elements
  border: palette.slate[700],
  divider: palette.slate[800],
  disabled: palette.slate[600],
  placeholder: palette.slate[500],

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

/**
 * Theme interface
 */
export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof import('./spacing').spacing;
  typography: typeof import('./typography').typography;
}

/**
 * Pre-built themes
 */
import { spacing } from './spacing';
import { typography } from './typography';

export const lightTheme: Theme = {
  isDark: false,
  colors: lightColors,
  spacing,
  typography,
};

export const darkTheme: Theme = {
  isDark: true,
  colors: darkColors,
  spacing,
  typography,
};

export { palette };
export default { lightTheme, darkTheme, palette };
