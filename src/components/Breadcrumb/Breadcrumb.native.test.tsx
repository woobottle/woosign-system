import {render, screen, fireEvent} from '@testing-library/react-native';
import {Breadcrumb} from './Breadcrumb.native';
it('navigates ancestor actions and identifies the current page', () => {
  const onPress = jest.fn();
  render(<Breadcrumb items={[{label: '홈', onPress}, {label: '주문'}]} />);
  fireEvent.press(screen.getByRole('link', {name: '홈'}));
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText('주문, 현재 페이지')).toBeTruthy();
});
