/**
 * Native harness tests for RadioGroup + Radio. react-native preset.
 */
import {StyleSheet, View} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {RadioGroup} from './RadioGroup.native';
import {Radio} from './Radio.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Radio (native)', () => {
  it('renders its options (light smoke)', () => {
    render(
      <RadioGroup value="a" onValueChange={() => {}}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
  });

  it('calls onValueChange with the pressed option value', () => {
    const onChange = jest.fn();
    render(
      <RadioGroup value="a" onValueChange={onChange}>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    fireEvent.press(screen.getByTestId('rb'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onValueChange when the group is disabled', () => {
    const onChange = jest.fn();
    render(
      <RadioGroup value="a" onValueChange={onChange} disabled>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    fireEvent.press(screen.getByTestId('rb'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses the dark actionPrimary dot on the selected option in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <RadioGroup value="a" onValueChange={() => {}}>
          <Radio value="a" label="A" testID="ra" />
        </RadioGroup>
      </ThemeProvider>,
    );
    // 위치 인덱스 대신 채워진 점(actionPrimary)을 backgroundColor로 직접 찾는다 —
    // 외곽 View 배경은 card라 구분되고, View 순서 의존성을 피한다(Checkbox와 동일).
    const dot = screen
      .UNSAFE_getAllByType(View)
      .find(
        v =>
          StyleSheet.flatten(v.props.style)?.backgroundColor ===
          darkColors.actionPrimary,
      );
    expect(dot).toBeTruthy();
  });
});
