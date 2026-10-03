import {render, screen, fireEvent} from '@testing-library/react-native';
import {DatePicker} from './DatePicker.native';
it('selects an allowed date and closes', () => {
  const onValueChange = jest.fn();
  render(
    <DatePicker
      label="날짜"
      defaultValue="2026-10-10"
      onValueChange={onValueChange}
    />,
  );
  fireEvent.press(screen.getByRole('button', {name: /날짜/}));
  fireEvent.press(screen.getByRole('button', {name: '2026-10-11'}));
  expect(onValueChange).toHaveBeenCalledWith('2026-10-11');
  expect(screen.queryByRole('button', {name: '2026-10-12'})).toBeNull();
  expect(screen.getByText('2026-10-11')).toBeTruthy();
});

it('closes when the selected date is activated again', () => {
  render(<DatePicker label="날짜" defaultValue="2026-10-10" />);
  fireEvent.press(screen.getByRole('button', {name: /날짜/}));
  fireEvent.press(
    screen.getByRole('button', {name: '2026-10-10', selected: true}),
  );
  expect(screen.queryByRole('button', {name: '2026-10-11'})).toBeNull();
});
