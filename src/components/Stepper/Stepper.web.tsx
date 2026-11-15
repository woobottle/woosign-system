import type {CSSProperties} from 'react';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import {
  INDICATOR_SIZE,
  currentIndexOf,
  getStepColors,
  statusOf,
  statusText,
} from './Stepper.styles';
import type {StepperWebProps} from './types';

const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
};

export function Stepper({
  steps,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  navigable = false,
  label,
  testID,
  style,
  className,
}: StepperWebProps) {
  const c = useResolvedColors();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue ?? steps[0]?.value ?? '',
    onValueChange,
  );
  const current = currentIndexOf(steps, selected);
  const vertical = orientation === 'vertical';
  return (
    <ol
      aria-label={label}
      data-testid={testID}
      className={className}
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        ...style,
      }}>
      {steps.map((step, i) => {
        const status = statusOf(i, current);
        const colors = getStepColors(c, status);
        const last = i === steps.length - 1;
        const clickable = navigable && status === 'complete' && !step.disabled;
        const content = (
          <>
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: INDICATOR_SIZE,
                height: INDICATOR_SIZE,
                borderRadius: 999,
                border: `2px solid ${colors.indicatorBorder}`,
                backgroundColor: colors.indicatorBackground,
                color: colors.indicatorText,
                fontWeight: 600,
                fontSize: 14,
                boxSizing: 'border-box',
              }}>
              {status === 'complete' ? '✓' : i + 1}
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                textAlign: 'left',
                wordBreak: 'keep-all',
              }}>
              <span style={{color: colors.label, fontWeight: 600}}>
                {step.label}
              </span>
              {step.description ? (
                <span style={{color: c.textSecondary, fontSize: 13}}>
                  {step.description}
                </span>
              ) : null}
              {status === 'complete' ? (
                <span style={visuallyHidden}>({statusText.complete})</span>
              ) : null}
            </span>
          </>
        );
        const contentStyle: CSSProperties = {
          display: 'flex',
          alignItems: vertical ? 'flex-start' : 'center',
          gap: 8,
          opacity: step.disabled ? 0.5 : 1,
        };
        return (
          <li
            key={step.value}
            aria-current={status === 'current' ? 'step' : undefined}
            style={{
              display: 'flex',
              flexDirection: vertical ? 'column' : 'row',
              alignItems: vertical ? 'stretch' : 'center',
              gap: 8,
              flex: last || vertical ? '0 0 auto' : '1 1 auto',
              position: 'relative',
            }}>
            {clickable ? (
              <button
                type="button"
                onClick={() => setSelected(step.value)}
                style={{
                  ...contentStyle,
                  border: 0,
                  padding: 0,
                  background: 'transparent',
                  cursor: 'pointer',
                  font: 'inherit',
                }}>
                {content}
              </button>
            ) : (
              <div style={contentStyle}>{content}</div>
            )}
            {last ? null : (
              <span
                aria-hidden
                style={
                  vertical
                    ? {
                        width: 2,
                        minHeight: 24,
                        marginLeft: INDICATOR_SIZE / 2 - 1,
                        backgroundColor: colors.connector,
                      }
                    : {
                        flex: 1,
                        height: 2,
                        minWidth: 16,
                        backgroundColor: colors.connector,
                      }
                }
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
