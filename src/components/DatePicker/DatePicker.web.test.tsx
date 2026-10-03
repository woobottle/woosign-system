import {render, screen, fireEvent} from '@testing-library/react';
import {DatePicker} from './DatePicker.web';
it('selects a date, closes and preserves form values', () => {
  const onValueChange = jest.fn();
  render(
    <DatePicker
      label="날짜"
      defaultValue="2026-10-10"
      name="date"
      onValueChange={onValueChange}
    />,
  );
  fireEvent.click(screen.getByRole('button', {name: /날짜/}));
  fireEvent.click(screen.getByRole('button', {name: '2026-10-11'}));
  expect(onValueChange).toHaveBeenCalledWith('2026-10-11');
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByText('2026-10-11')).toBeInTheDocument();
  expect(document.querySelector('input[name="date"]')).toHaveValue(
    '2026-10-11',
  );
});

it('closes when the selected date is activated again', () => {
  render(<DatePicker label="날짜" defaultValue="2026-10-10" />);
  fireEvent.click(screen.getByRole('button', {name: /날짜/}));
  fireEvent.click(screen.getByRole('button', {name: '2026-10-10'}));
  expect(screen.queryByRole('button', {name: '2026-10-11'})).toBeNull();
});
