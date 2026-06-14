import {render, screen} from '@testing-library/react';
import {Toast} from './Toast';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Toast (web)', () => {
  it('renders its title', () => {
    render(<Toast title="저장됨" />);
    expect(screen.getByText('저장됨')).toBeInTheDocument();
  });

  it('uses the light surface without a provider', () => {
    render(<Toast title="저장됨" testID="toast" />);
    expect(screen.getByTestId('toast')).toHaveStyle({
      backgroundColor: colors.card,
    });
  });

  it('uses the dark surface inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Toast title="저장됨" testID="toast" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('toast')).toHaveStyle({
      backgroundColor: darkColors.card,
    });
  });
});
