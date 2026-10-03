import {render, screen} from '@testing-library/react';
import {AvatarGroup} from './AvatarGroup.web';
it('limits avatars and exposes the overflow count', () => {
  render(
    <AvatarGroup max={1} items={[{name: 'A'}, {name: 'B'}, {name: 'C'}]} />,
  );
  expect(screen.getByRole('img', {name: 'A'})).toBeInTheDocument();
  expect(screen.getByText('+2')).toBeInTheDocument();
  expect(screen.queryByRole('img', {name: 'B'})).toBeNull();
});
