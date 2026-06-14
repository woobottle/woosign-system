import {render, screen} from '@testing-library/react';
import {Eyebrow} from './Eyebrow';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Eyebrow (web)', () => {
  it('renders its children', () => {
    render(<Eyebrow>라벨</Eyebrow>);
    expect(screen.getByText('라벨')).toBeInTheDocument();
  });

  it('uses the light secondary text color without a provider', () => {
    render(<Eyebrow testID="eyebrow">라벨</Eyebrow>);
    expect(screen.getByTestId('eyebrow')).toHaveStyle({
      color: colors.textSecondary,
    });
  });

  it('uses the dark secondary text color inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Eyebrow testID="eyebrow">라벨</Eyebrow>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('eyebrow')).toHaveStyle({
      color: darkColors.textSecondary,
    });
  });
});
