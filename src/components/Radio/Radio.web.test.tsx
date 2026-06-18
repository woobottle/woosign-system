/**
 * Web harness tests for RadioGroup + Radio. jsdom.
 */
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {RadioGroup, Radio} from './index';
import {ThemeProvider} from '../../core/theme/ThemeContext';
import {darkColors} from '../../core/theme/tokens';

describe('Radio (web)', () => {
  it('renders a radiogroup with radio options', () => {
    render(
      <RadioGroup value="a" onValueChange={() => {}}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('calls onValueChange with the clicked option value', async () => {
    const onChange = jest.fn();
    render(
      <RadioGroup value="a" onValueChange={onChange}>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByTestId('rb'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('marks only the selected option aria-checked', () => {
    render(
      <RadioGroup value="b" onValueChange={() => {}}>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    expect(screen.getByTestId('ra')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('rb')).toHaveAttribute('aria-checked', 'true');
  });

  it('does not call onValueChange when the group is disabled', async () => {
    const onChange = jest.fn();
    render(
      <RadioGroup value="a" onValueChange={onChange} disabled>
        <Radio value="a" label="A" testID="ra" />
        <Radio value="b" label="B" testID="rb" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByTestId('rb'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('uses the dark actionPrimary dot on the selected option in dark mode', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <RadioGroup value="a" onValueChange={() => {}}>
          <Radio value="a" label="A" testID="ra" />
        </RadioGroup>
      </ThemeProvider>,
    );
    // 선택된 라디오 버튼 내부의 점(span)의 backgroundColor.
    const dot = screen.getByTestId('ra').querySelector('span');
    expect(dot).toHaveStyle({backgroundColor: darkColors.actionPrimary});
  });
});
