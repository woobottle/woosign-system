/**
 * Web harness tests for Badge — role-specific variants.
 */

import {render, screen} from '@testing-library/react';
import {Badge} from './Badge';
import {colors} from '../../core/theme/tokens';

describe('Badge (web)', () => {
  it('renders its label', () => {
    render(<Badge>Members</Badge>);
    expect(screen.getByText('Members')).toBeInTheDocument();
  });

  it('default variant uses ember (action-primary) background', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toHaveStyle({
      backgroundColor: colors.actionPrimary,
    });
  });

  it('gold variant is ceremonial (rewards-only)', () => {
    render(<Badge variant="gold">★ 125</Badge>);
    expect(screen.getByText('★ 125')).toHaveStyle({
      backgroundColor: colors.gold,
    });
  });

  it('outline variant uses the hairline border token', () => {
    render(<Badge variant="outline">Beta</Badge>);
    expect(screen.getByText('Beta')).toHaveStyle({
      borderColor: colors.borderDefault,
    });
  });
});
