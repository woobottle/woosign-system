import {render, screen, fireEvent} from '@testing-library/react-native';
import {DropdownMenu} from './DropdownMenu.native';
const items = [
  {value: 'a', label: '편집', onSelect: jest.fn()},
  {value: 'b', label: '삭제', disabled: true},
  {value: 'c', label: '복사', onSelect: jest.fn()},
];
it('blocks disabled actions and dismisses after selection', () => {
  render(<DropdownMenu label="작업" trigger="작업" items={items} />);
  fireEvent.press(screen.getByRole('button', {name: '작업'}));
  fireEvent.press(screen.getByRole('button', {name: '삭제'}));
  expect(screen.getByText('편집')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', {name: '편집'}));
  expect(items[0].onSelect).toHaveBeenCalledTimes(1);
  expect(screen.queryByText('편집')).toBeNull();
});
