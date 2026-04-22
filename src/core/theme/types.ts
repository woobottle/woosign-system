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
  wbSpace,
  outerGutter,
  easing,
  containers,
  shadowsCss,
} from './tokens';

// Color scheme type
export type ColorScheme = 'light' | 'dark' | 'system';

/**
 * Color tokens type.
 *
 * Includes both shadcn-compat aliases (primary/secondary/muted/…) and the
 * WooBottle semantic tokens (canvas/section/reward/ink/ember/gold/…).
 */
export type Colors = {
  // Shadcn-compat surface + semantic aliases
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

  // WooBottle surface tokens
  readonly canvas: string;
  readonly section: string;
  readonly reward: string;
  readonly inverse: string;
  readonly inverseForeground: string;
  readonly inverseForegroundSecondary: string;

  // Roles
  readonly brand: string;
  readonly actionPrimary: string;
  readonly actionPrimaryHover: string;
  readonly actionDark: string;
  readonly actionDanger: string;

  // Accents
  readonly gold: string;
  readonly successTint: string;
  readonly errorTint: string;

  // Text ladder
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textTertiary: string;
  readonly textInverse: string;
  readonly textInverseSecondary: string;
  readonly textBrand: string;

  // Borders
  readonly borderDefault: string;
  readonly borderStrong: string;
  readonly borderInverse: string;
  readonly borderFocus: string;
};

// Theme tokens interface
export interface ThemeTokens {
  colors: Colors;
  spacing: typeof spacing;
  wbSpace: typeof wbSpace;
  outerGutter: typeof outerGutter;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  shadows: typeof shadows;
  shadowsCss: typeof shadowsCss;
  duration: typeof duration;
  easing: typeof easing;
  containers: typeof containers;
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
