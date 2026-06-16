/**
 * Native harness tests for Toast. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Toast} from './Toast.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Toast (native)', () => {
  it('renders its title (light smoke)', () => {
    render(<Toast testID="toast" title="저장됨" />);
    expect(screen.getByText('저장됨')).toBeTruthy();
  });

  it('uses the dark card surface in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Toast testID="toast" title="저장됨" />
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('toast').props.style);
    expect(flat.backgroundColor).toBe(darkColors.card);
  });
});
