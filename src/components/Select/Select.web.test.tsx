import {createRef} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {Select} from './Select.web';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';
const options = [
  {value: 'a', label: 'A'},
  {value: 'b', label: 'B', disabled: true},
];
it('supports uncontrolled selection, form attributes and forwarded ref', () => {
  const onValueChange = jest.fn();
  const ref = createRef<HTMLSelectElement>();
  render(
    <Select
      ref={ref}
      options={options}
      label="음료"
      name="drink"
      required
      onValueChange={onValueChange}
    />,
  );
  const select = screen.getByRole('combobox', {name: '음료'});
  fireEvent.change(select, {target: {value: 'a'}});
  expect(onValueChange).toHaveBeenCalledWith('a');
  expect(select).toHaveValue('a');
  expect(select).toHaveAttribute('name', 'drink');
  expect(select).toBeRequired();
  expect(ref.current).toBe(select);
  expect(screen.getByRole('option', {name: 'B'})).toBeDisabled();
});
it('keeps controlled value and consumes dark colors', () => {
  render(
    <ThemeProvider defaultColorScheme="dark">
      <Select options={options} value="a" disabled />
    </ThemeProvider>,
  );
  expect(screen.getByRole('combobox')).toHaveValue('a');
  expect(screen.getByRole('combobox')).toBeDisabled();
  expect(screen.getByRole('combobox')).toHaveStyle({
    backgroundColor: darkColors.card,
  });
});
