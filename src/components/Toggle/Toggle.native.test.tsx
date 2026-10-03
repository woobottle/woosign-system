import {render, screen, fireEvent} from '@testing-library/react-native';
import {Toggle} from './Toggle.native';
it('toggles uncontrolled state and blocks disabled presses', () => {
  const onPressedChange = jest.fn();
  const {rerender} = render(
    <Toggle label="굵게" onPressedChange={onPressedChange} />,
  );
  fireEvent.press(screen.getByRole('button'));
  expect(screen.getByRole('button').props.accessibilityState.selected).toBe(
    true,
  );
  rerender(<Toggle label="굵게" disabled onPressedChange={onPressedChange} />);
  fireEvent.press(screen.getByRole('button'));
  expect(onPressedChange).toHaveBeenCalledTimes(1);
});
