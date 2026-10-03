import {render, screen, fireEvent} from '@testing-library/react-native';
import {Calendar} from './Calendar.native';
it('enforces date bounds and disabled dates and selects an allowed date', () => {
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
  fireEvent.press(screen.getByRole('button', {name: '2026-10-03'}));
  expect(onValueChange).not.toHaveBeenCalled();
  fireEvent.press(screen.getByRole('button', {name: '2026-10-04'}));
  expect(onValueChange).toHaveBeenCalledWith('2026-10-04');
  fireEvent.press(screen.getByRole('button', {name: 'Next month'}));
  expect(
    screen.getByRole('button', {name: '2026-11-04'}).props.accessibilityState
      .disabled,
  ).toBe(true);
});
