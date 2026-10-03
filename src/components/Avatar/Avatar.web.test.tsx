import {render, screen, fireEvent} from '@testing-library/react';
import {Avatar} from './Avatar.web';
it('falls back on image error and retries when the source changes', () => {
  const {rerender} = render(<Avatar src="broken.png" name="Logan Woo" />);
  fireEvent.error(screen.getByAltText('Logan Woo'));
  expect(screen.getByText('LW')).toBeInTheDocument();
  rerender(<Avatar src="new.png" name="Logan Woo" />);
  expect(screen.getByAltText('Logan Woo')).toHaveAttribute('src', 'new.png');
});
