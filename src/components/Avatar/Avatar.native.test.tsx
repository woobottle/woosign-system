import {render, screen, fireEvent} from '@testing-library/react-native';
import {Avatar} from './Avatar.native';
import {Image} from 'react-native';
it('falls back on image error and retries on a new source', () => {
  const {rerender} = render(<Avatar src="broken.png" name="Logan Woo" />);
  fireEvent(screen.UNSAFE_getByType(Image), 'error');
  expect(screen.getByText('LW')).toBeTruthy();
  rerender(<Avatar src="new.png" name="Logan Woo" />);
  expect(screen.UNSAFE_getByType(Image).props.source.uri).toBe('new.png');
});
