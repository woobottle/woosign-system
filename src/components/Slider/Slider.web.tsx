import {useResolvedColors} from '../../core/hooks';
import {useControllableState, normalizeRange} from '../_shared/state';
import type {SliderWebProps} from './types';
export function Slider({
  value,
  defaultValue = 0,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  label,
  testID,
  style,
  className,
}: SliderWebProps) {
  const c = useResolvedColors();
  const lower = Number.isFinite(min) ? min : 0;
  const upper = Number.isFinite(max) ? Math.max(lower, max) : 100;
  const increment = Number.isFinite(step) && step > 0 ? step : 1;
  const [raw, setValue] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const current = normalizeRange(raw, lower, upper, increment);
  return (
    <input
      type="range"
      aria-label={label}
      min={lower}
      max={upper}
      step={increment}
      value={current}
      disabled={disabled || lower === upper}
      onChange={event =>
        setValue(
          normalizeRange(
            Number(event.currentTarget.value),
            lower,
            upper,
            increment,
          ),
        )
      }
      onPointerUp={event => onValueCommit?.(Number(event.currentTarget.value))}
      onKeyUp={event => {
        if (
          [
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Home',
            'End',
            'PageUp',
            'PageDown',
          ].includes(event.key)
        ) {
          onValueCommit?.(Number(event.currentTarget.value));
        }
      }}
      data-testid={testID}
      className={className}
      style={{
        width: '100%',
        accentColor: c.actionPrimary,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    />
  );
}
