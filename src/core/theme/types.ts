/**
 * Theme type definitions
 */

import type {
  colors,
  darkColors,
  spacing,
  borderRadius,
  typography,
  shadows,
  duration,
  zIndex,
} from './tokens';

// Color scheme type
export type ColorScheme = 'light' | 'dark' | 'system';

// Color tokens type
export type Colors = typeof colors;
export type DarkColors = typeof darkColors;

// Theme tokens interface
export interface ThemeTokens {
  colors: Colors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  shadows: typeof shadows;
  duration: typeof duration;
  zIndex: typeof zIndex;
}

// Full theme interface
export interface Theme extends ThemeTokens {
  colorScheme: ColorScheme;
  isDark: boolean;
}

// Theme context value
export interface ThemeContextValue {
  theme: Theme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

// Theme provider props
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultColorScheme?: ColorScheme;
}
