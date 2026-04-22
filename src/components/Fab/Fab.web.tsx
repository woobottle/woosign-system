import {forwardRef, useState, useCallback} from 'react';
import type {FabWebProps} from './types';
import {getFabStyle} from './Fab.styles';
import {shadowsCss, duration, easing} from '../../core/theme/tokens';

export const Fab = forwardRef<HTMLButtonElement, FabWebProps>(function Fab(
  {
    tone = 'ember',
    size = 'default',
    disabled = false,
    onPress,
    children,
    accessibilityLabel,
    className,
    style,
    testID,
  },
  ref,
) {
  const [pressed, setPressed] = useState(false);
  const base = getFabStyle(tone, size);
  const handleClick = useCallback(() => {
    if (!disabled && onPress) onPress();
  }, [disabled, onPress]);

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-label={accessibilityLabel}
      onClick={handleClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={className}
      data-testid={testID}
      style={{
        display: 'inline-flex',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: '#FFFFFF',
        opacity: disabled ? 0.5 : 1,
        width: base.width,
        height: base.height,
        borderRadius: base.borderRadius,
        background: base.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: shadowsCss.floating,
        transform: pressed ? 'scale(0.95)' : 'none',
        transition: `all ${duration.normal}ms ${easing.standard}`,
        ...style,
      }}>
      {children}
    </button>
  );
});

Fab.displayName = 'Fab';
