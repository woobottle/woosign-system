/**
 * Native harness tests for FeatureBand. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet, Text} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {FeatureBand} from './FeatureBand.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('FeatureBand (native)', () => {
  it('renders its children (light smoke)', () => {
    render(
      <FeatureBand testID="band">
        <Text>본문</Text>
      </FeatureBand>,
    );
    expect(screen.getByText('본문')).toBeTruthy();
  });

  it('uses the dark inverse background (inverse tone) in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <FeatureBand testID="band">
          <Text>본문</Text>
        </FeatureBand>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('band').props.style);
    expect(flat.backgroundColor).toBe(darkColors.inverse);
  });
});
