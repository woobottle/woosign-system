import {render, screen, fireEvent} from '@testing-library/react-native';
import {StyleSheet, View} from 'react-native';
import {Textarea} from './Textarea.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';
it('uses multiline height, top alignment and reports text', () => {
  const onChangeText = jest.fn();
  render(
    <Textarea testID="memo" numberOfLines={5} onChangeText={onChangeText} />,
  );
  const input = screen.getByTestId('memo');
  expect(input.props.multiline).toBe(true);
  expect(StyleSheet.flatten(input.props.style)).toMatchObject({
    minHeight: 120,
    textAlignVertical: 'top',
  });
  expect(
    StyleSheet.flatten(screen.UNSAFE_getAllByType(View)[0].props.style),
  ).toMatchObject({minHeight: 140});
  fireEvent.changeText(input, '메모');
  expect(onChangeText).toHaveBeenCalledWith('메모');
});
it('preserves disabled state and dark theme', () => {
  render(
    <ThemeProvider defaultColorScheme="dark">
      <Textarea disabled testID="memo" />
    </ThemeProvider>,
  );
  expect(screen.getByTestId('memo').props.editable).toBe(false);
  expect(
    StyleSheet.flatten(screen.UNSAFE_getAllByType(View)[0].props.style)
      .backgroundColor,
  ).toBe(darkColors.section);
});
