import {render, screen, fireEvent} from '@testing-library/react';
import {InputOTP} from './InputOTP.web';
it('accepts pasted codes, strips nondigits and completes only on changes', () => {
  const onComplete = jest.fn();
  const onChangeText = jest.fn();
  render(
    <InputOTP length={4} onComplete={onComplete} onChangeText={onChangeText} />,
  );
  const input = screen.getByRole('textbox', {name: '인증 코드'});
  fireEvent.change(input, {target: {value: '1a23 45'}});
  expect(input).toHaveValue('1234');
  expect(onChangeText).toHaveBeenCalledWith('1234');
  expect(onComplete).toHaveBeenCalledWith('1234');
  fireEvent.change(input, {target: {value: '1234'}});
  expect(onComplete).toHaveBeenCalledTimes(1);
});
