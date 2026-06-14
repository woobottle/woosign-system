import {render, screen} from '@testing-library/react';
import {Divider} from './Divider';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Divider (web)', () => {
  it('renders', () => {
    render(<Divider testID="d" />);
    expect(screen.getByTestId('d')).toBeInTheDocument();
  });

  it('uses light token without a provider', () => {
    render(<Divider testID="d" />);
    expect(screen.getByTestId('d')).toHaveStyle({
      backgroundColor: colors.borderDefault,
    });
  });

  it('uses dark token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Divider testID="d" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('d')).toHaveStyle({
      backgroundColor: darkColors.borderDefault,
    });
  });
});
