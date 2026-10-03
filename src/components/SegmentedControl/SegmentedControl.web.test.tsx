import {render, screen, fireEvent} from '@testing-library/react';
import {SegmentedControl} from './SegmentedControl.web';
const items = [
  {value: 'a', label: 'A'},
  {value: 'b', label: 'B'},
  {value: 'c', label: 'C', disabled: true},
];
it('selects one item and changes selection using arrow keys', () => {
  const onValueChange = jest.fn();
  render(
    <SegmentedControl
      label="옵션"
      items={items}
      onValueChange={onValueChange}
    />,
  );
  expect(screen.getByRole('radio', {name: 'A'})).toBeChecked();
  fireEvent.keyDown(screen.getByRole('radio', {name: 'A'}), {
    key: 'ArrowRight',
  });
  expect(screen.getByRole('radio', {name: 'B'})).toHaveFocus();
  expect(screen.getByRole('radio', {name: 'B'})).toBeChecked();
  expect(onValueChange).toHaveBeenCalledWith('b');
});
