/**
 * Native harness tests for Input. react-native preset(jest), .native.tsx 구현.
 * 테마 색 소비(다크 표면) + 포커스 보더 토큰 정합만 검증한다.
 */
import {StyleSheet, View} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {Input} from './Input.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

// Input의 최외곽 컨테이너 View(표면 배경/보더를 들고 있다). ThemeProvider는
// host를 렌더하지 않으므로 첫 번째 View가 컨테이너다.
function containerStyle() {
  return StyleSheet.flatten(screen.UNSAFE_getAllByType(View)[0].props.style);
}

describe('Input (native)', () => {
  it('uses the dark card surface on the container in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Input testID="name" />
      </ThemeProvider>,
    );
    expect(containerStyle().backgroundColor).toBe(darkColors.card);
  });

  it('applies the theme focus-border token when focused (not a hardcoded color)', () => {
    render(<Input testID="name" />);
    fireEvent(screen.getByTestId('name'), 'focus');
    expect(containerStyle().borderColor).toBe(colors.borderFocus);
  });
});
