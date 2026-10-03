import {render, screen} from '@testing-library/react-native';
import {AvatarGroup} from './AvatarGroup.native';
it('limits avatars and exposes the overflow count', () => {
  render(
    <AvatarGroup max={1} items={[{name: 'A'}, {name: 'B'}, {name: 'C'}]} />,
  );
  expect(screen.getByText('+2')).toBeTruthy();
  expect(screen.queryByLabelText('B')).toBeNull();
});
