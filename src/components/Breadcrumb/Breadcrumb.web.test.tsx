import {render, screen, fireEvent} from '@testing-library/react';
import {Breadcrumb} from './Breadcrumb.web';
it('navigates ancestor actions and identifies the current page', () => {
  const onPress = jest.fn();
  render(<Breadcrumb items={[{label: '홈', onPress}, {label: '주문'}]} />);
  fireEvent.click(screen.getByRole('button', {name: '홈'}));
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(screen.getByText('주문')).toHaveAttribute('aria-current', 'page');
});
