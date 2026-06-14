import {render, screen} from '@testing-library/react';
import {FeatureBand} from './FeatureBand';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('FeatureBand (web)', () => {
  it('renders', () => {
    render(<FeatureBand testID="fb">content</FeatureBand>);
    expect(screen.getByTestId('fb')).toBeInTheDocument();
  });

  it('uses light token without a provider', () => {
    render(<FeatureBand testID="fb">content</FeatureBand>);
    expect(screen.getByTestId('fb')).toHaveStyle({
      backgroundColor: colors.inverse,
    });
  });

  it('uses dark token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <FeatureBand testID="fb">content</FeatureBand>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('fb')).toHaveStyle({
      backgroundColor: darkColors.inverse,
    });
  });
});
