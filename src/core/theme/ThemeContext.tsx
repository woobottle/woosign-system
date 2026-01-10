import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import type { Theme, ThemeContextValue, ColorScheme, ThemeProviderProps } from './types';
import {
  colors,
  darkColors,
  spacing,
  borderRadius,
  typography,
  shadows,
  duration,
  zIndex,
} from './tokens';

// Create context with null default
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * ThemeProvider component
 * Provides theme context to all children components
 */
export function ThemeProvider({
  children,
  defaultColorScheme = 'light',
}: ThemeProviderProps): React.ReactElement {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);

  const isDark = colorScheme === 'dark';

  const theme = useMemo<Theme>(
    () => ({
      colors: isDark ? darkColors : colors,
      spacing,
      borderRadius,
      typography,
      shadows,
      duration,
      zIndex,
      colorScheme,
      isDark,
    }),
    [colorScheme, isDark]
  );

  const toggleColorScheme = useCallback(() => {
    setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setColorScheme,
      toggleColorScheme,
    }),
    [theme, toggleColorScheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * useThemeContext hook
 * Internal hook to access theme context
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export { ThemeContext };
