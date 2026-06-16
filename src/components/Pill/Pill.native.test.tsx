/**
 * Native harness tests for Pill. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Pill} from './Pill.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Pill (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Pill testID="pill">전체</Pill>);
    expect(screen.getByText('전체')).toBeTruthy();
  });

  it('uses the dark card surface (inactive) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Pill testID="pill">전체</Pill>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('pill').props.style);
    expect(flat.backgroundColor).toBe(darkColors.card);
  });
});
