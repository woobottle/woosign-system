import {render, screen, fireEvent} from '@testing-library/react';
import {DropdownMenu} from './DropdownMenu.web';
const items = [
  {value: 'a', label: '편집', onSelect: jest.fn()},
  {value: 'b', label: '삭제', disabled: true},
  {value: 'c', label: '복사', onSelect: jest.fn()},
];
it('navigates enabled menu items, invokes actions and restores focus', () => {
  render(<DropdownMenu label="작업" trigger="작업" items={items} />);
  const trigger = screen.getByRole('button', {name: '작업'});
  fireEvent.keyDown(trigger, {key: 'ArrowDown'});
  expect(screen.getByRole('menuitem', {name: '편집'})).toHaveFocus();
  fireEvent.keyDown(screen.getByRole('menuitem', {name: '편집'}), {
    key: 'ArrowDown',
  });
  expect(screen.getByRole('menuitem', {name: '복사'})).toHaveFocus();
  fireEvent.click(screen.getByRole('menuitem', {name: '복사'}));
  expect(items[2].onSelect).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('menu')).toBeNull();
  expect(trigger).toHaveFocus();
});

it('opens on ArrowUp at the last enabled item and advances focus on Tab', () => {
  render(
    <>
      <DropdownMenu label="작업" trigger="작업" items={items} />
      <button>다음 작업</button>
    </>,
  );
  const trigger = screen.getByRole('button', {name: '작업'});
  fireEvent.keyDown(trigger, {key: 'ArrowUp'});
  expect(screen.getByRole('menuitem', {name: '복사'})).toHaveFocus();
  fireEvent.keyDown(screen.getByRole('menuitem', {name: '복사'}), {key: 'Tab'});
  expect(screen.queryByRole('menu')).toBeNull();
  expect(screen.getByRole('button', {name: '다음 작업'})).toHaveFocus();
});
