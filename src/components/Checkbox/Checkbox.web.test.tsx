/**
 * Web harness tests for Checkbox. jsdom.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Checkbox} from './Checkbox';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Checkbox (web)', () => {
  it('renders the label with role=checkbox', () => {
    render(<Checkbox label="동의" testID="cb" />);
    expect(screen.getByText('동의')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('calls onCheckedChange with the toggled value on click', async () => {
    const onChange = jest.fn();
    const {rerender} = render(
      <Checkbox checked={false} onCheckedChange={onChange} testID="cb" />,
    );
    await userEvent.click(screen.getByTestId('cb'));
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Checkbox checked onCheckedChange={onChange} testID="cb" />);
    await userEvent.click(screen.getByTestId('cb'));
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('reflects checked state in aria-checked', () => {
    const {rerender} = render(<Checkbox checked={false} testID="cb" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'false',
    );
    rerender(<Checkbox checked testID="cb" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('renders indeterminate as aria-checked="mixed" with a dash glyph', () => {
    render(<Checkbox indeterminate testID="cb" />);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAttribute('aria-checked', 'mixed');
    expect(box).toHaveTextContent('–');
  });

  it('does not call onCheckedChange when disabled', async () => {
    const onChange = jest.fn();
    render(<Checkbox disabled onCheckedChange={onChange} testID="cb" />);
    await userEvent.click(screen.getByTestId('cb'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses the dark actionPrimary fill when checked in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Checkbox checked testID="cb" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('cb')).toHaveStyle({
      backgroundColor: darkColors.actionPrimary,
    });
  });
});
