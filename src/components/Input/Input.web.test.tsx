/**
 * Web harness tests for Input. jsdom 환경, .web.tsx 구현을 사용한다.
 * date picker(Calendar) 동작은 범위 밖 — 스토리에서만 시연한다.
 */
import {render, screen, fireEvent} from '@testing-library/react';
import {Input} from './Input';
import {colors, darkColors} from '../../core/theme/tokens';
import {ThemeProvider} from '../../core/theme/ThemeContext';

describe('Input (web)', () => {
  it('renders the placeholder', () => {
    render(<Input placeholder="이름을 입력하세요" testID="name" />);
    expect(
      screen.getByPlaceholderText('이름을 입력하세요'),
    ).toBeInTheDocument();
  });

  it('calls onChangeText with the typed value', () => {
    const onChangeText = jest.fn();
    render(<Input testID="name" onChangeText={onChangeText} />);
    fireEvent.change(screen.getByTestId('name'), {target: {value: '우병'}});
    expect(onChangeText).toHaveBeenCalledWith('우병');
  });

  it('reflects the disabled attribute on the input', () => {
    render(<Input testID="name" disabled />);
    expect(screen.getByTestId('name')).toBeDisabled();
  });

  it('reflects the readOnly attribute on the input', () => {
    render(<Input testID="name" readOnly />);
    expect(screen.getByTestId('name')).toHaveAttribute('readonly');
  });

  it('error variant uses the danger border on the container', () => {
    render(<Input testID="name" variant="error" />);
    const container = screen.getByTestId('name').parentElement as HTMLElement;
    expect(container).toHaveStyle({borderColor: colors.actionDanger});
  });

  it('sm size applies the smaller container height', () => {
    render(<Input testID="name" size="sm" />);
    const container = screen.getByTestId('name').parentElement as HTMLElement;
    expect(container).toHaveStyle({height: '36px'});
  });

  it('renders left and right icons', () => {
    render(
      <Input
        testID="name"
        leftIcon={<span>L</span>}
        rightIcon={<span>R</span>}
      />,
    );
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('uses the dark card surface on the container in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Input testID="name" />
      </ThemeProvider>,
    );
    const container = screen.getByTestId('name').parentElement as HTMLElement;
    expect(container).toHaveStyle({backgroundColor: darkColors.card});
  });
});

it('grows the container for multiline inputs', () => {
  render(<Input multiline numberOfLines={4} testID="memo" />);
  expect(screen.getByTestId('memo').parentElement).toHaveStyle({
    height: 'auto',
    minHeight: '116px',
  });
});

it('updates an uncontrolled date input from the calendar and closes on Escape', () => {
  render(<Input type="date" defaultValue="2026-10-10" testID="date" />);
  fireEvent.focus(screen.getByTestId('date'));
  fireEvent.click(screen.getByRole('button', {name: '2026-10-11'}));
  expect(screen.getByTestId('date')).toHaveValue('2026-10-11');
  fireEvent.focus(screen.getByTestId('date'));
  fireEvent.keyDown(screen.getByTestId('date'), {key: 'Escape'});
  expect(screen.queryByRole('grid')).toBeNull();
});
it('does not open a read-only date picker', () => {
  render(<Input type="date" readOnly testID="date" />);
  fireEvent.focus(screen.getByTestId('date'));
  expect(screen.queryByRole('grid')).toBeNull();
});
