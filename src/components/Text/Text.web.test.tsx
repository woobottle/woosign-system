/**
 * Web harness tests for Text — theme color consumption.
 */
import {render, screen} from '@testing-library/react';
import {Text} from './Text';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Text (web)', () => {
  it('renders its children', () => {
    render(<Text>안녕하세요</Text>);
    expect(screen.getByText('안녕하세요')).toBeInTheDocument();
  });

  it('uses the light foreground color without a provider', () => {
    render(<Text>밝게</Text>);
    expect(screen.getByText('밝게')).toHaveStyle({color: colors.foreground});
  });

  it('uses the dark foreground color inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Text>어둡게</Text>
      </ThemeProvider>,
    );
    expect(screen.getByText('어둡게')).toHaveStyle({
      color: darkColors.foreground,
    });
  });
});
