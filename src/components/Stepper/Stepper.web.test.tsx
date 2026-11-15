import {render, screen, fireEvent, within} from '@testing-library/react';
import {Stepper} from './Stepper.web';
const steps = [
  {value: 'cart', label: '장바구니'},
  {value: 'address', label: '배송지', description: '받는 분 정보'},
  {value: 'pay', label: '결제'},
];

it('marks steps before the current one as complete', () => {
  render(<Stepper label="주문 단계" steps={steps} defaultValue="address" />);
  const list = screen.getByRole('list', {name: '주문 단계'});
  const items = within(list).getAllByRole('listitem');
  expect(items).toHaveLength(3);
  expect(items[0]).toHaveTextContent('✓');
  expect(items[0]).toHaveTextContent('(완료)');
  expect(items[1]).toHaveAttribute('aria-current', 'step');
  expect(items[1]).toHaveTextContent('받는 분 정보');
  expect(items[2]).not.toHaveAttribute('aria-current');
  expect(items[2]).toHaveTextContent('3');
});

it('defaults to the first step and is not interactive unless navigable', () => {
  render(<Stepper label="주문 단계" steps={steps} />);
  expect(screen.getAllByRole('listitem')[0]).toHaveAttribute(
    'aria-current',
    'step',
  );
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
  const buttons = screen.getAllByRole('button');
  expect(buttons).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', {name: /장바구니/}));
  expect(onValueChange).toHaveBeenCalledWith('cart');
  expect(screen.getAllByRole('listitem')[0]).toHaveAttribute(
    'aria-current',
    'step',
  );
});

it('keeps disabled completed steps and controlled value fixed', () => {
  const onValueChange = jest.fn();
  render(
    <Stepper
      label="주문 단계"
      steps={[{...steps[0], disabled: true}, steps[1], steps[2]]}
      value="pay"
      navigable
      onValueChange={onValueChange}
    />,
  );
  expect(screen.queryByRole('button', {name: /장바구니/})).toBeNull();
  fireEvent.click(screen.getByRole('button', {name: /배송지/}));
  expect(onValueChange).toHaveBeenCalledWith('address');
  expect(screen.getAllByRole('listitem')[2]).toHaveAttribute(
    'aria-current',
    'step',
  );
});
