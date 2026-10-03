import {useRef} from 'react';
import {Toggle} from '../Toggle';
import {useControllableState} from '../_shared/state';
import type {ToggleGroupWebProps} from './types';
export function ToggleGroup({
  items,
  value,
  defaultValue = [],
  onValueChange,
  multiple = false,
  disabled,
  label,
  testID,
  style,
  className,
}: ToggleGroupWebProps) {
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const container = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={container}
      role="group"
      aria-label={label}
      data-testid={testID}
      className={className}
      style={{display: 'flex', flexWrap: 'wrap', gap: 8, ...style}}
      onKeyDown={e => {
        const buttons = Array.from(
          container.current?.querySelectorAll<HTMLButtonElement>(
            'button:not(:disabled)',
          ) ?? [],
        );
        const i = buttons.indexOf(e.target as HTMLButtonElement);
        let next: number;
        if (e.key === 'ArrowRight') {
          next = (i + 1) % buttons.length;
        } else if (e.key === 'ArrowLeft') {
          next = (i - 1 + buttons.length) % buttons.length;
        } else if (e.key === 'Home') {
          next = 0;
        } else if (e.key === 'End') {
          next = buttons.length - 1;
        } else {
          return;
        }
        e.preventDefault();
        buttons[next]?.focus();
      }}>
      {items.map(item => (
        <Toggle
          key={item.value}
          label={item.label}
          disabled={disabled || item.disabled}
          pressed={selected.includes(item.value)}
          onPressedChange={active =>
            setSelected(
              active
                ? multiple
                  ? [...selected, item.value]
                  : [item.value]
                : selected.filter(v => v !== item.value),
            )
          }
        />
      ))}
    </div>
  );
}
