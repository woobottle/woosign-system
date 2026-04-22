import {forwardRef, useState, useCallback} from 'react';
import type {PillWebProps} from './types';
import {getPillStyles} from './Pill.styles';
import {duration, easing} from '../../core/theme/tokens';

export const Pill = forwardRef<HTMLButtonElement, PillWebProps>(function Pill(
  {
    active = false,
    disabled = false,
    children,
    onPress,
    className,
    style,
    testID,
    type = 'button',
  },
  ref,
) {
  const [pressed, setPressed] = useState(false);
  const {container, text} = getPillStyles(active);

  const handleClick = useCallback(() => {
    if (!disabled && onPress) onPress();
  }, [disabled, onPress]);

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={className}
      data-testid={testID}
      style={{
        display: 'inline-flex',
        alignSelf: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...container,
        ...text,
        transform: pressed ? 'scale(0.95)' : 'none',
        transition: `all ${duration.normal}ms ${easing.standard}`,
        ...style,
      }}>
      {children}
    </button>
  );
});

Pill.displayName = 'Pill';
