/**
 * Native harness tests for Button. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Button} from './Button.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Button (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Button testID="btn">눌러</Button>);
    expect(screen.getByText('눌러')).toBeTruthy();
  });

  it('uses the dark actionPrimary background in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Button testID="btn">눌러</Button>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('btn').props.style);
    expect(flat.backgroundColor).toBe(darkColors.actionPrimary);
  });
});
