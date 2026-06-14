import {render, screen} from '@testing-library/react';
import {Fab} from './Fab';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Fab (web)', () => {
  it('renders', () => {
    render(<Fab testID="fab" tone="ink" />);
    expect(screen.getByTestId('fab')).toBeInTheDocument();
  });

  it('uses light token without a provider', () => {
    render(<Fab testID="fab" tone="ink" />);
    expect(screen.getByTestId('fab')).toHaveStyle({
      background: colors.inverse,
    });
  });

  it('uses dark token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Fab testID="fab" tone="ink" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('fab')).toHaveStyle({
      background: darkColors.inverse,
    });
  });
});
