/**
 * Native harness tests for Divider. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Divider} from './Divider.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Divider (native)', () => {
  it('renders (light smoke)', () => {
    render(<Divider testID="div" />);
    expect(screen.getByTestId('div')).toBeTruthy();
  });

  it('uses the dark borderDefault color (default tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Divider testID="div" />
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('div').props.style);
    expect(flat.backgroundColor).toBe(darkColors.borderDefault);
  });
});
