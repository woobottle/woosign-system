import {render, screen, fireEvent} from '@testing-library/react';
import {Toggle} from './Toggle.web';
it('toggles uncontrolled state and keeps controlled state authoritative', () => {
  const onPressedChange = jest.fn();
  const {rerender} = render(
    <Toggle label="굵게" onPressedChange={onPressedChange} />,
  );
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  rerender(
    <Toggle label="굵게" pressed={false} onPressedChange={onPressedChange} />,
  );
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  expect(onPressedChange).toHaveBeenCalledWith(true);
});
