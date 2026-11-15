import {render, screen, fireEvent} from '@testing-library/react-native';
import {Stepper} from './Stepper.native';
const steps = [
  {value: 'cart', label: '장바구니'},
  {value: 'address', label: '배송지', description: '받는 분 정보'},
  {value: 'pay', label: '결제'},
];

it('announces each step position and status', () => {
  render(<Stepper label="주문 단계" steps={steps} defaultValue="address" />);
  expect(screen.getByLabelText('장바구니, 1/3, 완료')).toBeTruthy();
  expect(screen.getByLabelText('배송지, 2/3, 현재 단계')).toHaveProp(
    'accessibilityState',
    expect.objectContaining({selected: true}),
  );
  expect(screen.getByLabelText('결제, 3/3, 예정')).toBeTruthy();
  expect(screen.getByText('받는 분 정보')).toBeTruthy();
  expect(screen.getByText('✓')).toBeTruthy();
  expect(screen.queryByRole('button')).toBeNull();
});

it('lets people go back to completed steps when navigable', () => {
  const onValueChange = jest.fn();
  render(
    <Stepper
      label="주문 단계"
      steps={steps}
      defaultValue="pay"
      navigable
      onValueChange={onValueChange}
    />,
  );
  expect(screen.getAllByRole('button')).toHaveLength(2);
  fireEvent.press(screen.getByLabelText('결제, 3/3, 현재 단계'));
  expect(onValueChange).not.toHaveBeenCalled();
  fireEvent.press(screen.getByRole('button', {name: '장바구니, 1/3, 완료'}));
  expect(onValueChange).toHaveBeenCalledWith('cart');
  expect(screen.getByLabelText('장바구니, 1/3, 현재 단계')).toBeTruthy();
});
