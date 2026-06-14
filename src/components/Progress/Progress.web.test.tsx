import {render, screen} from '@testing-library/react';
import {Progress} from './Progress';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Progress (web)', () => {
  it('renders', () => {
    render(<Progress testID="prog" value={0.5} tone="ink" />);
    expect(screen.getByTestId('prog')).toBeInTheDocument();
  });

  it('uses light token without a provider', () => {
    render(<Progress testID="prog" value={0.5} tone="ink" />);
    // The fill div is the first child of the rail
    const rail = screen.getByTestId('prog');
    const fill = rail.firstElementChild as HTMLElement;
    expect(fill).toHaveStyle({backgroundColor: colors.inverse});
  });

  it('uses dark token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Progress testID="prog" value={0.5} tone="ink" />
      </ThemeProvider>,
    );
    const rail = screen.getByTestId('prog');
    const fill = rail.firstElementChild as HTMLElement;
    expect(fill).toHaveStyle({backgroundColor: darkColors.inverse});
  });
});
