import {render, screen, fireEvent} from '@testing-library/react-native';
import {SegmentedControl} from './SegmentedControl.native';
const items = [
  {value: 'a', label: 'A'},
  {value: 'b', label: 'B'},
  {value: 'c', label: 'C', disabled: true},
];
it('selects one item and blocks disabled choices', () => {
  const onValueChange = jest.fn();
  render(
    <SegmentedControl
      label="옵션"
      items={items}
      onValueChange={onValueChange}
    />,
  );
  fireEvent.press(screen.getByRole('radio', {name: 'B'}));
  expect(onValueChange).toHaveBeenCalledWith('b');
  fireEvent.press(screen.getByRole('radio', {name: 'C'}));
  expect(onValueChange).toHaveBeenCalledTimes(1);
});
