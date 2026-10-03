import {render, screen, fireEvent} from '@testing-library/react-native';
import {Popover} from './Popover.native';
it('opens a sheet and closes without changing external state', () => {
  const onOpenChange = jest.fn();
  render(
    <Popover trigger="상세" label="상세 정보" onOpenChange={onOpenChange}>
      내용
    </Popover>,
  );
  fireEvent.press(screen.getByRole('button', {name: '상세 정보'}));
  expect(screen.getByText('내용')).toBeTruthy();
  expect(onOpenChange).toHaveBeenCalledWith(true);
  fireEvent.press(screen.getByRole('button', {name: '닫기'}));
  expect(screen.queryByText('내용')).toBeNull();
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});
