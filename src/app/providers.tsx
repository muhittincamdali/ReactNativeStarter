/**
 * Application Providers
 * 
 * Centralizes all context providers and global state management
 * for the application. Providers are ordered by dependency.
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { ColorSchemeName } from 'react-native';
import { Theme } from '../theme/colors';

/**
 * Theme Context
 * Provides theme colors and utilities throughout the app
 */
interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  colors: Theme['colors'];
  spacing: Theme['spacing'];
  typography: Theme['typography'];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  theme: Theme;
  children: ReactNode;
}

function ThemeProvider({ theme, children }: ThemeProviderProps): React.JSX.Element {
  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    isDark: theme.isDark,
    colors: theme.colors,
    spacing: theme.spacing,
    typography: theme.typography,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Toast/Notification Context
 * Provides toast notifications throughout the app
 */
interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

function ToastProvider({ children }: ToastProviderProps): React.JSX.Element {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const showToast = React.useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after duration
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const hideToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo<ToastContextValue>(() => ({
    toasts,
    showToast,
    hideToast,
    clearToasts,
  }), [toasts, showToast, hideToast, clearToasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * App Providers
 * Combines all providers in the correct order
 */
interface AppProvidersProps {
  theme: Theme;
  children: ReactNode;
}

export function AppProviders({ theme, children }: AppProvidersProps): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}

export { ThemeContext, ToastContext };
