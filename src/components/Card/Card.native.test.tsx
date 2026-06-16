/**
 * Native harness tests for Card. 라이트 스모크 + 다크 테마 토큰 단언.
 */
import {StyleSheet, Text} from 'react-native';
import {render, screen} from '@testing-library/react-native';
import {Card} from './Card.native';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Card (native)', () => {
  it('renders its children (light smoke)', () => {
    render(
      <Card testID="card">
        <Text>본문</Text>
      </Card>,
    );
    expect(screen.getByText('본문')).toBeTruthy();
  });

  it('uses the dark card surface in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Card testID="card">
          <Text>본문</Text>
        </Card>
      </ThemeProvider>,
    );
    const flat = StyleSheet.flatten(screen.getByTestId('card').props.style);
    expect(flat.backgroundColor).toBe(darkColors.card);
  });
});
