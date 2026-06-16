/**
 * Native harness tests for Eyebrow. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Eyebrow} from './Eyebrow.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Eyebrow (native)', () => {
  it('renders its text (light smoke)', () => {
    render(<Eyebrow testID="eb">THIS WEEK</Eyebrow>);
    expect(screen.getByText('THIS WEEK')).toBeTruthy();
  });

  it('uses the dark textSecondary color (default tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Eyebrow testID="eb">THIS WEEK</Eyebrow>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('eb').props.style);
    expect(flat.color).toBe(darkColors.textSecondary);
  });
});
