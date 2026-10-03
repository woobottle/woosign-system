import {render, screen, fireEvent} from '@testing-library/react';
import {Calendar} from './Calendar.web';
it('enforces date bounds, disabled dates and month navigation', () => {
  const onValueChange = jest.fn();
  render(
    <Calendar
      defaultMonth="2026-10-01"
      min="2026-10-02"
      max="2026-10-20"
      isDateDisabled={date => date === '2026-10-03'}
      onValueChange={onValueChange}
    />,
  );
  expect(screen.getByRole('button', {name: '2026-10-01'})).toBeDisabled();
  expect(screen.getByRole('button', {name: '2026-10-03'})).toBeDisabled();
  fireEvent.click(screen.getByRole('button', {name: '2026-10-04'}));
  expect(onValueChange).toHaveBeenCalledWith('2026-10-04');
  fireEvent.click(screen.getByRole('button', {name: 'Next month'}));
  expect(screen.getByRole('button', {name: '2026-11-04'})).toBeDisabled();
});
it('moves keyboard focus across disabled dates', () => {
  render(
    <Calendar
      defaultMonth="2026-10-01"
      min="2026-10-02"
      max="2026-10-20"
      isDateDisabled={date => date === '2026-10-03'}
    />,
  );
  fireEvent.keyDown(screen.getByRole('button', {name: '2026-10-02'}), {
    key: 'ArrowRight',
  });
  expect(screen.getByRole('button', {name: '2026-10-04'})).toHaveFocus();
});
