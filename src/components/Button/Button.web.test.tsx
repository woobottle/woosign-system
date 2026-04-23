/**
 * Web harness tests for Button.
 * Uses the .web.tsx implementation (resolved via moduleFileExtensions).
 */

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button} from './Button';
import {colors, borderRadius} from '../../core/theme/tokens';

describe('Button (web)', () => {
  it('renders the label', () => {
    render(<Button>Order now</Button>);
    expect(screen.getByRole('button', {name: 'Order now'})).toBeInTheDocument();
  });

  it('defaults to the ember primary variant (pill + ember bg)', () => {
    render(<Button>Order now</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveStyle({
      backgroundColor: colors.actionPrimary,
      borderRadius: `${borderRadius.pill}px`,
    });
  });

  it('calls onPress when clicked', async () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Order</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    render(
      <Button disabled onPress={onPress}>
        Order
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders a spinner in loading state and blocks clicks', async () => {
    const onPress = jest.fn();
    const {container} = render(
      <Button loading onPress={onPress}>
        Saving
      </Button>,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('supports the dark variant (ink900 fill)', () => {
    render(<Button variant="dark">See benefits</Button>);
    expect(screen.getByRole('button')).toHaveStyle({
      backgroundColor: colors.actionDark,
    });
  });
});
