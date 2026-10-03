import {render, screen, fireEvent} from '@testing-library/react-native';
import {Combobox} from './Combobox.native';
const options = [
  {value: 'a', label: 'Apple'},
  {value: 'b', label: 'Apricot', disabled: true},
  {value: 'c', label: 'Coffee'},
];
it('filters choices, skips disabled options and selects', () => {
  const onValueChange = jest.fn();
  render(
    <Combobox
      id="drink"
      label="음료"
      options={options}
      onValueChange={onValueChange}
    />,
  );
  fireEvent.press(screen.getByRole('button', {name: '음료'}));
  fireEvent.changeText(screen.getByLabelText('검색'), 'Ap');
  expect(screen.getAllByRole('radio')).toHaveLength(2);
  fireEvent.press(screen.getByRole('radio', {name: 'Apricot'}));
  expect(onValueChange).not.toHaveBeenCalled();
  fireEvent.press(screen.getByRole('radio', {name: 'Apple'}));
  expect(onValueChange).toHaveBeenCalledWith('a');
  expect(screen.queryByRole('radio')).toBeNull();
});
