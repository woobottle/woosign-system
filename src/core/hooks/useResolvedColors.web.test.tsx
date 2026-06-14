/**
 * useResolvedColors(): Provider 있으면 테마 색, 없으면 정적 light 폴백.
 */
import {renderHook} from '@testing-library/react';
import {useResolvedColors} from './useTheme';
import {ThemeProvider} from '../theme/ThemeContext';
import {colors, darkColors} from '../theme/tokens';

describe('useResolvedColors', () => {
  it('falls back to static light colors when no ThemeProvider', () => {
    const {result} = renderHook(() => useResolvedColors());
    expect(result.current).toBe(colors);
  });

  it('returns light colors inside a light ThemeProvider', () => {
    const {result} = renderHook(() => useResolvedColors(), {
      wrapper: ({children}) => (
        <ThemeProvider defaultColorScheme="light">{children}</ThemeProvider>
      ),
    });
    expect(result.current.card).toBe(colors.card);
  });

  it('returns dark colors inside a dark ThemeProvider', () => {
    const {result} = renderHook(() => useResolvedColors(), {
      wrapper: ({children}) => (
        <ThemeProvider defaultColorScheme="dark">{children}</ThemeProvider>
      ),
    });
    expect(result.current.card).toBe(darkColors.card);
  });
});
