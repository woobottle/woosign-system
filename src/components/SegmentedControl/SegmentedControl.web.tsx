import {useResolvedColors} from '../../core/hooks';
import {useRef} from 'react';
import {useControllableState} from '../_shared/state';
import type {SegmentedControlWebProps} from './types';
export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  disabled,
  label,
  testID,
  style,
  className,
}: SegmentedControlWebProps) {
  const c = useResolvedColors();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue ?? items.find(item => !item.disabled)?.value ?? '',
    onValueChange,
  );
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const first = items.find(item => !item.disabled)?.value;
  return (
    <div
      role="radiogroup"
      aria-label={label}
      data-testid={testID}
      className={className}
      style={{
        display: 'inline-flex',
        backgroundColor: c.section,
        padding: 4,
        borderRadius: 999,
        gap: 4,
        ...style,
      }}>
      {items.map((item, i) => {
        const active = selected === item.value;
        return (
          <button
            key={item.value}
            ref={el => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled || item.disabled}
            tabIndex={
              active ||
              (!items.some(v => v.value === selected && !v.disabled) &&
                item.value === first)
                ? 0
                : -1
            }
            onClick={() => setSelected(item.value)}
            onKeyDown={event => {
              const eligible = refs.current.filter(
                (el): el is HTMLButtonElement => !!el && !el.disabled,
              );
              const index = eligible.indexOf(event.currentTarget);
              let next;
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                next = (index + 1) % eligible.length;
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                next = (index - 1 + eligible.length) % eligible.length;
              } else if (event.key === 'Home') {
                next = 0;
              } else if (event.key === 'End') {
                next = eligible.length - 1;
              } else {
                return;
              }
              event.preventDefault();
              const target = eligible[next];
              target?.focus();
              target?.click();
            }}
            style={{
              border: 0,
              borderRadius: 999,
              padding: '10px 16px',
              backgroundColor: active ? c.card : 'transparent',
              color: c.textPrimary,
              opacity: disabled || item.disabled ? 0.5 : 1,
            }}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
