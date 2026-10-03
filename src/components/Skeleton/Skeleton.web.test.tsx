import {render, screen} from '@testing-library/react';
import {Skeleton} from './Skeleton.web';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';
it('hides decorative loading slots from assistive technology and follows the theme', () => {
  render(
    <ThemeProvider defaultColorScheme="dark">
      <Skeleton circle height={40} testID="slot" />
    </ThemeProvider>,
  );
  expect(screen.getByTestId('slot')).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByTestId('slot')).toHaveStyle({
    width: '40px',
    height: '40px',
    backgroundColor: darkColors.section,
  });
});
