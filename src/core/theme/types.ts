/**
 * Theme type definitions
 */

import type {
  spacing,
  borderRadius,
  typography,
  shadows,
  duration,
  zIndex,
} from './tokens';

// Color scheme type
export type ColorScheme = 'light' | 'dark' | 'system';

// Color tokens type - use base structure for compatibility
export type Colors = {
  readonly background: string;
  readonly foreground: string;
  readonly card: string;
  readonly cardForeground: string;
  readonly popover: string;
  readonly popoverForeground: string;
  readonly primary: string;
  readonly primaryForeground: string;
  readonly secondary: string;
  readonly secondaryForeground: string;
  readonly muted: string;
  readonly mutedForeground: string;
  readonly accent: string;
  readonly accentForeground: string;
  readonly destructive: string;
  readonly destructiveForeground: string;
  readonly border: string;
  readonly input: string;
  readonly ring: string;
};

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
