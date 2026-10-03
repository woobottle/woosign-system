import {render, screen, fireEvent} from '@testing-library/react';
import {Tooltip} from './Tooltip.web';
it('opens on focus and dismisses on Escape with an accessible description', () => {
  render(<Tooltip id="help" trigger="도움말" content="도움말 내용" />);
  const trigger = screen.getByRole('button');
  fireEvent.focus(trigger);
  expect(screen.getByRole('tooltip')).toHaveTextContent('도움말 내용');
  expect(trigger).toHaveAttribute('aria-describedby', 'help');
  fireEvent.keyDown(document, {key: 'Escape'});
  expect(screen.queryByRole('tooltip')).toBeNull();
});
