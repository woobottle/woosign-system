import {useContext} from 'react';
import {useThemeContext, ThemeContext} from '../theme/ThemeContext';
import {colors as lightColors} from '../theme/tokens';
import type {Theme, ThemeContextValue} from '../theme/types';
import type {Colors} from '../theme/types';

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
  const {theme} = useThemeContext();
  return theme.colors;
}

/**
 * useSpacing hook
 * Shorthand to access only the spacing tokens
 */
export function useSpacing(): Theme['spacing'] {
  const {theme} = useThemeContext();
  return theme.spacing;
}

/**
 * useIsDark hook
 * Check if the current theme is dark mode
 */
export function useIsDark(): boolean {
  const {theme} = useThemeContext();
  return theme.isDark;
}

/**
 * 컴포넌트용 색 접근자. ThemeProvider가 있으면 현재 테마 색(light/dark)을,
 * 없으면 정적 light colors로 폴백한다(throw하지 않음 — 기존 무-Provider 사용처
 * 하위 호환). 컴포넌트 스타일은 이 hook이 반환한 colors로 만든다.
 */
export function useResolvedColors(): Colors {
  const ctx = useContext(ThemeContext);
  return ctx ? ctx.theme.colors : lightColors;
}
