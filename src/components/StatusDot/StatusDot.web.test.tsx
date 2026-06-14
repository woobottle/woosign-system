import {render, screen} from '@testing-library/react';
import {StatusDot} from './StatusDot';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('StatusDot (web)', () => {
  it('renders', () => {
    render(<StatusDot testID="dot" tone="neutral" />);
    expect(screen.getByTestId('dot')).toBeInTheDocument();
  });

  it('uses light token without a provider', () => {
    render(<StatusDot testID="dot" tone="neutral" />);
    expect(screen.getByTestId('dot')).toHaveStyle({
      backgroundColor: colors.section,
    });
  });

  it('uses dark token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <StatusDot testID="dot" tone="neutral" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('dot')).toHaveStyle({
      backgroundColor: darkColors.section,
    });
  });
});
