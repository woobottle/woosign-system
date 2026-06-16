/**
 * Native harness tests for Progress. 라이트 스모크 + 다크 테마 토큰 단언.
 * fill View(두 번째 View)의 backgroundColor가 다크 토큰을 쓰는지 본다(width만 동적).
 */
import {StyleSheet, View} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Progress} from './Progress.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Progress (native)', () => {
  it('renders rail and fill (light smoke)', () => {
    render(<Progress value={50} />);
    expect(screen.UNSAFE_getAllByType(View).length).toBeGreaterThanOrEqual(2);
  });

  it('uses the dark gold fill (default tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Progress value={50} />
      </ThemeProvider>,
    );
    const fill = screen.UNSAFE_getAllByType(View)[1];
    const flat = StyleSheet.flatten(fill.props.style);
    expect(flat.backgroundColor).toBe(darkColors.gold);
  });
});
