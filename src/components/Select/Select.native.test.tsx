import {render, screen, fireEvent} from '@testing-library/react-native';
import {Select} from './Select.native';
const options = [
  {value: 'a', label: 'A'},
  {value: 'b', label: 'B', disabled: true},
];
it('opens choices, blocks disabled options, selects and closes', () => {
  const onValueChange = jest.fn();
  render(
    <Select
      options={options}
      label="음료"
      testID="select"
      onValueChange={onValueChange}
    />,
  );
  fireEvent.press(screen.getByTestId('select'));
  fireEvent.press(screen.getByRole('radio', {name: 'B'}));
  expect(onValueChange).not.toHaveBeenCalled();
  fireEvent.press(screen.getByRole('radio', {name: 'A'}));
  expect(onValueChange).toHaveBeenCalledWith('a');
  expect(screen.getByTestId('select').props.accessibilityValue.text).toBe('A');
  expect(screen.queryByRole('radio')).toBeNull();
});
it('keeps controlled values and prevents opening disabled controls', () => {
  render(<Select options={options} value="a" disabled testID="select" />);
  fireEvent.press(screen.getByTestId('select'));
  expect(screen.queryByRole('radio')).toBeNull();
  expect(screen.getByTestId('select').props.accessibilityValue.text).toBe('A');
});

it('keeps the controlled value until the caller updates it', () => {
  const onValueChange = jest.fn();
  render(
    <Select
      options={[
        {value: 'a', label: 'A'},
        {value: 'c', label: 'C'},
      ]}
      value="a"
      onValueChange={onValueChange}
      testID="select"
    />,
  );
  fireEvent.press(screen.getByTestId('select'));
  fireEvent.press(screen.getByRole('radio', {name: 'C'}));
  expect(onValueChange).toHaveBeenCalledWith('c');
  expect(screen.getByTestId('select').props.accessibilityValue.text).toBe('A');
});
