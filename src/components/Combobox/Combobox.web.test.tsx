import {render, screen, fireEvent} from '@testing-library/react';
import {Combobox} from './Combobox.web';
const options = [
  {value: 'a', label: 'Apple'},
  {value: 'b', label: 'Apricot', disabled: true},
  {value: 'c', label: 'Coffee'},
];
it('filters options and selects using keyboard while skipping disabled options', () => {
  const onValueChange = jest.fn();
  render(
    <Combobox
      id="drink"
      label="음료"
      options={options}
      onValueChange={onValueChange}
    />,
  );
  const input = screen.getByRole('combobox');
  fireEvent.focus(input);
  fireEvent.change(input, {target: {value: 'Ap'}});
  expect(screen.getAllByRole('option')).toHaveLength(2);
  fireEvent.keyDown(input, {key: 'ArrowDown'});
  fireEvent.keyDown(input, {key: 'Enter'});
  expect(onValueChange).toHaveBeenCalledWith('a');
  expect(input).toHaveValue('Apple');
  expect(screen.queryByRole('listbox')).toBeNull();
});
it('keeps selection on Escape and handles empty results', () => {
  render(
    <Combobox id="drink" label="음료" options={options} defaultValue="c" />,
  );
  const input = screen.getByRole('combobox');
  fireEvent.focus(input);
  fireEvent.change(input, {target: {value: 'zz'}});
  expect(screen.getByRole('status')).toHaveTextContent('검색 결과가 없습니다');
  fireEvent.keyDown(input, {key: 'Escape'});
  expect(input).toHaveValue('Coffee');
});
