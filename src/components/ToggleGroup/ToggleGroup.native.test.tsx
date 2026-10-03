import {render, screen, fireEvent} from '@testing-library/react-native';
import {ToggleGroup} from './ToggleGroup.native';
const items = [
  {value: 'a', label: 'A'},
  {value: 'b', label: 'B'},
  {value: 'c', label: 'C', disabled: true},
];
it('supports multiple selection and disabled items', () => {
  const onValueChange = jest.fn();
  render(
    <ToggleGroup
      label="옵션"
      items={items}
      multiple
      onValueChange={onValueChange}
    />,
  );
  fireEvent.press(screen.getByRole('button', {name: 'A'}));
  fireEvent.press(screen.getByRole('button', {name: 'B'}));
  expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b']);
  fireEvent.press(screen.getByRole('button', {name: 'C'}));
  expect(onValueChange).toHaveBeenCalledTimes(2);
});
