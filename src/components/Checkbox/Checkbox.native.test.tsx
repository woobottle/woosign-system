/**
 * Native harness tests for Checkbox. react-native preset.
 */
import {StyleSheet, View} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {Checkbox} from './Checkbox.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Checkbox (native)', () => {
  it('renders its label (light smoke)', () => {
    render(<Checkbox label="동의" testID="cb" />);
    expect(screen.getByText('동의')).toBeTruthy();
  });

  it('calls onCheckedChange with the toggled value on press', () => {
    const onChange = jest.fn();
    render(<Checkbox checked={false} onCheckedChange={onChange} testID="cb" />);
    fireEvent.press(screen.getByTestId('cb'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onCheckedChange when disabled', () => {
    const onChange = jest.fn();
    render(<Checkbox disabled onCheckedChange={onChange} testID="cb" />);
    fireEvent.press(screen.getByTestId('cb'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders the dash glyph and mixed a11y state when indeterminate', () => {
    render(<Checkbox indeterminate testID="cb" />);
    expect(screen.getByText('–')).toBeTruthy();
    expect(
      screen.getByTestId('cb').props.accessibilityState.checked,
    ).toBe('mixed');
  });

  it('uses the dark actionPrimary fill when checked in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Checkbox checked testID="cb" />
      </ThemeProvider>,
    );
    // 위치 인덱스 대신 채워진 박스(체크 fill)를 backgroundColor로 직접 찾는다 —
    // Pressable 호스트 View 등 다른 View 순서에 의존하지 않게.
    const box = screen
      .UNSAFE_getAllByType(View)
      .find(
        v =>
          StyleSheet.flatten(v.props.style)?.backgroundColor ===
          darkColors.actionPrimary,
      );
    expect(box).toBeTruthy();
  });
});
