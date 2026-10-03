import {render, screen, fireEvent} from '@testing-library/react-native';
import {Pagination} from './Pagination.native';
it('clamps pages and disables boundaries', () => {
  const onPageChange = jest.fn();
  render(<Pagination totalPages={10000} onPageChange={onPageChange} />);
  fireEvent.press(screen.getByRole('button', {name: '이전'}));
  expect(onPageChange).not.toHaveBeenCalled();
  fireEvent.press(screen.getByRole('button', {name: '다음'}));
  expect(onPageChange).toHaveBeenCalledWith(2);
  expect(screen.getAllByRole('button').length).toBeLessThan(10);
});
