/**
 * Native harness tests for Fab. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet, Text} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Fab} from './Fab.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Fab (native)', () => {
  it('renders its child glyph (light smoke)', () => {
    render(
      <Fab testID="fab" accessibilityLabel="추가">
        <Text>＋</Text>
      </Fab>,
    );
    expect(screen.getByText('＋')).toBeTruthy();
  });

  it('uses the dark actionPrimary background (ember tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Fab testID="fab" accessibilityLabel="추가">
          <Text>＋</Text>
        </Fab>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('fab').props.style);
    expect(flat.backgroundColor).toBe(darkColors.actionPrimary);
  });
});
