import {render, screen, fireEvent} from '@testing-library/react';
import {ListItem} from './ListItem.web';
it('delegates row presses and blocks disabled rows', () => {
  const onPress = jest.fn();
  const {rerender} = render(
    <ListItem title="주문" description="오늘 주문" onPress={onPress} />,
  );
  fireEvent.click(screen.getByRole('button'));
  expect(onPress).toHaveBeenCalledTimes(1);
  rerender(<ListItem title="주문" onPress={onPress} disabled />);
  fireEvent.click(screen.getByRole('button'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
