import {createRef} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Textarea} from './Textarea.web';
it('renders multiple rows, forwards refs and reports input', () => {
  const ref = createRef<HTMLTextAreaElement>();
  const onChangeText = jest.fn();
  render(
    <Textarea
      ref={ref}
      numberOfLines={5}
      onChangeText={onChangeText}
      testID="memo"
    />,
  );
  const input = screen.getByTestId('memo');
  expect(input.tagName).toBe('TEXTAREA');
  expect(input).toHaveAttribute('rows', '5');
  expect(input.parentElement).toHaveStyle({minHeight: '140px', height: 'auto'});
  expect(ref.current).toBe(input);
  fireEvent.change(input, {target: {value: '첫 줄\n둘째 줄'}});
  expect(onChangeText).toHaveBeenCalledWith('첫 줄\n둘째 줄');
});
it('preserves disabled and pass-through accessibility props', () => {
  render(<Textarea disabled inputProps={{'aria-label': '메모'}} />);
  expect(screen.getByRole('textbox', {name: '메모'})).toBeDisabled();
});
