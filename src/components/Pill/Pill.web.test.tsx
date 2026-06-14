import {render, screen} from '@testing-library/react';
import {Pill} from './Pill';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Pill (web)', () => {
  it('renders its children', () => {
    render(<Pill>라벨</Pill>);
    expect(screen.getByText('라벨')).toBeInTheDocument();
  });

  it('uses the light surface without a provider (inactive)', () => {
    render(<Pill testID="pill">라벨</Pill>);
    expect(screen.getByTestId('pill')).toHaveStyle({
      backgroundColor: colors.card,
    });
  });

  it('uses the dark surface inside a dark ThemeProvider (inactive)', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Pill testID="pill">라벨</Pill>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('pill')).toHaveStyle({
      backgroundColor: darkColors.card,
    });
  });
});
