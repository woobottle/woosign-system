import React, {forwardRef, useState, useCallback} from 'react';
import type {ChipWebProps} from './types';
import {getChipStyles} from './Chip.styles';
import {duration, easing} from '../../core/theme/tokens';

export const Chip = forwardRef<HTMLElement, ChipWebProps>(function Chip(
  {
    tone = 'default',
    disabled = false,
    children,
    onPress,
    leftAdornment,
    rightAdornment,
    className,
    style,
    testID,
    type = 'button',
  },
  ref,
) {
  const [pressed, setPressed] = useState(false);
  const {container, text} = getChipStyles(tone);
  const interactive = Boolean(onPress);

  const handleClick = useCallback(() => {
    if (!disabled && onPress) onPress();
  }, [disabled, onPress]);

  const composedStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignSelf: 'center',
    cursor: interactive && !disabled ? 'pointer' : 'default',
    opacity: disabled ? 0.5 : 1,
    ...container,
    ...text,
    transform: pressed ? 'scale(0.96)' : 'none',
    transition: `all ${duration.normal}ms ${easing.standard}`,
    ...style,
  };

  if (interactive) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        onClick={handleClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        className={className}
        data-testid={testID}
        style={composedStyle}>
        {leftAdornment}
        {children}
        {rightAdornment}
      </button>
    );
  }

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={className}
      data-testid={testID}
      style={composedStyle}>
      {leftAdornment}
      {children}
      {rightAdornment}
    </span>
  );
});

Chip.displayName = 'Chip';
