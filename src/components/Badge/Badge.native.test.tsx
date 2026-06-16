/**
 * Native harness tests for Badge. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Badge} from './Badge.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Badge (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Badge testID="badge">라벨</Badge>);
    expect(screen.getByText('라벨')).toBeTruthy();
  });

  it('uses the dark actionPrimary background in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Badge testID="badge">라벨</Badge>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('badge').props.style);
    expect(flat.backgroundColor).toBe(darkColors.actionPrimary);
  });
});
