import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import type {ToggleWebProps} from './types';
export function Toggle({
  children,
  label,
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled,
  testID,
  style,
  className,
}: ToggleWebProps) {
  const c = useResolvedColors();
  const [active, setActive] = useControllableState(
    pressed,
    defaultPressed,
    onPressedChange,
  );
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={() => setActive(!active)}
      data-testid={testID}
      className={className}
      style={{
        padding: '10px 16px',
        borderRadius: 999,
        border: `1px solid ${c.borderDefault}`,
        backgroundColor: active ? c.actionPrimary : c.card,
        color: active ? c.primaryForeground : c.textPrimary,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}>
      {children ?? label}
    </button>
  );
}
