import {render, screen, fireEvent} from '@testing-library/react';
import {Popover} from './Popover.web';
it('opens, focuses content, dismisses with Escape and restores trigger focus', () => {
  render(
    <Popover trigger="詳細" label="詳細">
      <button>内部アクション</button>
    </Popover>,
  );
  const trigger = screen.getByRole('button', {name: '詳細'});
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog', {name: '詳細'})).toBeInTheDocument();
  expect(screen.getByRole('button', {name: '内部アクション'})).toHaveFocus();
  fireEvent.keyDown(document, {key: 'Escape'});
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(trigger).toHaveFocus();
  fireEvent.click(trigger);
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole('dialog')).toBeNull();
});
