/**
 * Native harness tests for StatusDot. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {StatusDot} from './StatusDot.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('StatusDot (native)', () => {
  it('renders its glyph (light smoke)', () => {
    render(
      <StatusDot testID="dot" tone="neutral">
        ·
      </StatusDot>,
    );
    expect(screen.getByTestId('dot')).toBeTruthy();
  });

  it('uses the dark section background (neutral tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <StatusDot testID="dot" tone="neutral">
          ·
        </StatusDot>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('dot').props.style);
    expect(flat.backgroundColor).toBe(darkColors.section);
  });
});
