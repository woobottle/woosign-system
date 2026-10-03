import {render, screen, fireEvent} from '@testing-library/react';
import {Pagination} from './Pagination.web';
it('clamps pages, disables boundaries and keeps large totals compact', () => {
  const onPageChange = jest.fn();
  render(<Pagination totalPages={10000} onPageChange={onPageChange} />);
  expect(screen.getByRole('button', {name: '이전'})).toBeDisabled();
  expect(screen.getAllByRole('button').length).toBeLessThan(10);
  fireEvent.click(screen.getByRole('button', {name: '다음'}));
  expect(onPageChange).toHaveBeenCalledWith(2);
  expect(screen.getByRole('button', {name: '2'})).toHaveAttribute(
    'aria-current',
    'page',
  );
});
