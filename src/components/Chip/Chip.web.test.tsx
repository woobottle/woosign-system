import {render, screen} from '@testing-library/react';
import {Chip} from './Chip';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Chip (web)', () => {
  it('renders its children', () => {
    render(<Chip>라벨</Chip>);
    expect(screen.getByText('라벨')).toBeInTheDocument();
  });

  it('uses the light surface without a provider', () => {
    render(<Chip testID="chip">라벨</Chip>);
    expect(screen.getByTestId('chip')).toHaveStyle({
      backgroundColor: colors.card,
    });
  });

  it('uses the dark surface inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Chip testID="chip">라벨</Chip>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('chip')).toHaveStyle({
      backgroundColor: darkColors.card,
    });
  });
});
