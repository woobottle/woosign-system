/**
 * Native harness tests for Chip. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Chip} from './Chip.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Chip (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Chip testID="chip">칩</Chip>);
    expect(screen.getByText('칩')).toBeTruthy();
  });

  it('uses the dark card surface (default tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Chip testID="chip">칩</Chip>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('chip').props.style);
    expect(flat.backgroundColor).toBe(darkColors.card);
  });
});
