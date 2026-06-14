/**
 * Web harness tests for Card. jsdom 환경, .web.tsx 구현을 사용한다.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Card} from './Card';
import {colors, darkColors} from '../../core/theme/tokens';
import {ThemeProvider} from '../../core/theme/ThemeContext';

describe('Card (web)', () => {
  it('renders its children', () => {
    render(<Card>섬 콘텐츠</Card>);
    expect(screen.getByText('섬 콘텐츠')).toBeInTheDocument();
  });

  it('default variant uses the card surface token', () => {
    render(
      <Card testID="card">
        <span>본문</span>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: colors.card,
    });
  });

  it('inverse variant uses the ink feature-band surface', () => {
    render(
      <Card variant="inverse" testID="card">
        <span>본문</span>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: colors.inverse,
    });
  });

  it('forest variant uses the evergreen surface', () => {
    render(
      <Card variant="forest" testID="card">
        <span>본문</span>
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: colors.actionForest,
    });
  });

  it('becomes a button and calls onPress when interactive', async () => {
    const onPress = jest.fn();
    render(
      <Card onPress={onPress} testID="card">
        <span>본문</span>
      </Card>,
    );
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    await userEvent.click(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    render(
      <Card onPress={onPress} disabled testID="card">
        <span>본문</span>
      </Card>,
    );
    await userEvent.click(screen.getByTestId('card'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('is not a button when no onPress is given', () => {
    render(
      <Card testID="card">
        <span>본문</span>
      </Card>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('uses dark surface token inside a dark ThemeProvider', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Card testID="card">
          <span>본문</span>
        </Card>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: darkColors.card,
    });
  });
});
