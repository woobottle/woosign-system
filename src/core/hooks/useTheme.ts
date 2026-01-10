import { useThemeContext } from '../theme/ThemeContext';
import type { Theme, ThemeContextValue } from '../theme/types';

/**
 * useTheme hook
 * Access the current theme and theme utilities
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleColorScheme } = useTheme();
 *
 *   return (
 *     <View style={{ backgroundColor: theme.colors.background }}>
 *       <Button onPress={toggleColorScheme}>Toggle Theme</Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  return useThemeContext();
}

/**
 * useColors hook
 * Shorthand to access only the color tokens
 */
export function useColors(): Theme['colors'] {
  const { theme } = useThemeContext();
  return theme.colors;
}

/**
 * useSpacing hook
 * Shorthand to access only the spacing tokens
 */
export function useSpacing(): Theme['spacing'] {
  const { theme } = useThemeContext();
  return theme.spacing;
}

/**
 * useIsDark hook
 * Check if the current theme is dark mode
 */
export function useIsDark(): boolean {
  const { theme } = useThemeContext();
  return theme.isDark;
}
