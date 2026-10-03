import {render, screen, fireEvent} from '@testing-library/react-native';
import {InputOTP} from './InputOTP.native';
it('accepts pasted codes and enforces the configured length', () => {
  const onComplete = jest.fn();
  const onChangeText = jest.fn();
  render(
    <InputOTP length={4} onComplete={onComplete} onChangeText={onChangeText} />,
  );
  const input = screen.getByLabelText('인증 코드');
  fireEvent.changeText(input, '1a23 45');
  expect(input.props.value).toBe('1234');
  expect(onChangeText).toHaveBeenCalledWith('1234');
  expect(onComplete).toHaveBeenCalledWith('1234');
  fireEvent.changeText(input, '1234');
  expect(onComplete).toHaveBeenCalledTimes(1);
});
