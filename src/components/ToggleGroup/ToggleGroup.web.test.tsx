import {render, screen, fireEvent} from '@testing-library/react';
import {ToggleGroup} from './ToggleGroup.web';
const items = [
  {value: 'a', label: 'A'},
  {value: 'b', label: 'B'},
  {value: 'c', label: 'C', disabled: true},
];
it('supports multiple selection and skips disabled buttons in keyboard navigation', () => {
  const onValueChange = jest.fn();
  render(
    <ToggleGroup
      label="옵션"
      items={items}
      multiple
      onValueChange={onValueChange}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: 'A'}));
  fireEvent.click(screen.getByRole('button', {name: 'B'}));
  expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b']);
  fireEvent.keyDown(screen.getByRole('button', {name: 'B'}), {
    key: 'ArrowRight',
  });
  expect(screen.getByRole('button', {name: 'A'})).toHaveFocus();
});
