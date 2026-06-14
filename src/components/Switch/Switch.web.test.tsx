/**
 * Web harness tests for Switch. jsdom 환경, .web.tsx 구현을 사용한다.
 */
import {render, screen} from '@testing-library/react';
import {Switch} from './Switch';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {colors, darkColors} from '../../core/theme/tokens';

describe('Switch (web)', () => {
  it('renders its label', () => {
    render(<Switch label="알림" />);
    expect(screen.getByText('알림')).toBeInTheDocument();
  });

  it('uses the light label color without a provider', () => {
    render(<Switch label="알림" />);
    expect(screen.getByText('알림')).toHaveStyle({color: colors.foreground});
  });

  it('uses the dark label color inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Switch label="알림" />
      </ThemeProvider>,
    );
    expect(screen.getByText('알림')).toHaveStyle({
      color: darkColors.foreground,
    });
  });
});
