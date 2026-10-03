import {render, screen} from '@testing-library/react-native';
import {Skeleton} from './Skeleton.native';
import {StyleSheet} from 'react-native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';
it('hides decorative loading slots and consumes theme colors', () => {
  render(
    <ThemeProvider defaultColorScheme="dark">
      <Skeleton circle height={40} testID="slot" />
    </ThemeProvider>,
  );
  const slot = screen.getByTestId('slot', {includeHiddenElements: true});
  expect(slot.props.importantForAccessibility).toBe('no-hide-descendants');
  expect(StyleSheet.flatten(slot.props.style)).toMatchObject({
    width: 40,
    borderRadius: 20,
    backgroundColor: darkColors.section,
  });
});
