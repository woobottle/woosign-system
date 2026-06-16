/**
 * Native harness tests for Text. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Text} from './Text.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Text (native)', () => {
  it('renders its content (light smoke)', () => {
    render(<Text testID="txt">안녕</Text>);
    expect(screen.getByText('안녕')).toBeTruthy();
  });

  it('uses the dark foreground color (default variant) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Text testID="txt">안녕</Text>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('txt').props.style);
    expect(flat.color).toBe(darkColors.foreground);
  });
});
