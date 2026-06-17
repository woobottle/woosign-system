/**
 * Unit tests for useFocusTrap (web). jsdom + userEvent.
 */
import {useRef} from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useFocusTrap} from './useFocusTrap';

function Harness({active}: {active: boolean}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div>
      <button>바깥</button>
      <div ref={ref} data-testid="container">
        <button>첫</button>
        <button>중간</button>
        <button>끝</button>
      </div>
    </div>
  );
}

function EmptyHarness({active}: {active: boolean}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} data-testid="container">
      <span>내용 없음</span>
    </div>
  );
}

describe('useFocusTrap (web)', () => {
  it('moves focus to the first focusable when activated', () => {
    render(<Harness active />);
    expect(screen.getByText('첫')).toHaveFocus();
  });

  it('focuses the container itself when there is no focusable child', () => {
    render(<EmptyHarness active />);
    expect(screen.getByTestId('container')).toHaveFocus();
  });

  it('cycles from the last element back to the first on Tab', async () => {
    render(<Harness active />);
    screen.getByText('끝').focus();
    await userEvent.tab();
    expect(screen.getByText('첫')).toHaveFocus();
  });

  it('cycles from the first element to the last on Shift+Tab', async () => {
    render(<Harness active />);
    screen.getByText('첫').focus();
    await userEvent.tab({shift: true});
    expect(screen.getByText('끝')).toHaveFocus();
  });

  it('restores focus to the previously focused element on deactivate', () => {
    const {rerender} = render(<Harness active={false} />);
    const trigger = screen.getByText('바깥');
    trigger.focus();
    expect(trigger).toHaveFocus();
    rerender(<Harness active />);
    expect(screen.getByText('첫')).toHaveFocus();
    rerender(<Harness active={false} />);
    expect(trigger).toHaveFocus();
  });
});
