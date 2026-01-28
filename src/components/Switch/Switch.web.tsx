/**
 * Switch component - Web implementation
 * Pure React + inline styles (no react-native-web)
 */

import React, { forwardRef, useState, useCallback } from 'react';
import type { SwitchWebProps } from './types';
import {
  switchTrackVariants,
  switchThumbVariants,
  switchLabelVariants,
  trackColors,
  trackDimensions,
  disabledStyle,
  focusRingStyle,
  containerGap,
} from './Switch.styles';
import { mergeStyles } from '../../core/variants';

/**
 * Switch component for web
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchWebProps>(
  function Switch(
    {
      checked = false,
      onCheckedChange,
      size = 'default',
      disabled = false,
      label,
      className,
      style,
      testID,
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);

    const handleClick = useCallback(() => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    }, [disabled, checked, onCheckedChange]);

    // Get variant styles
    const trackStyles = switchTrackVariants({ size }) as React.CSSProperties;
    const thumbStyles = switchThumbVariants({ size }) as React.CSSProperties;
    const labelStyles = switchLabelVariants({ size }) as React.CSSProperties;

    const dims = trackDimensions[size];
    const thumbTranslateX = checked
      ? dims.width - dims.thumbSize - dims.thumbOffset
      : dims.thumbOffset;

    // Compose track style
    const trackStyle = mergeStyles(
      trackStyles,
      {
        position: 'relative' as const,
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: checked ? trackColors.checked : trackColors.unchecked,
        transition: 'background-color 150ms ease',
        border: 'none',
        padding: 0,
      },
      disabled && disabledStyle,
      isFocused && !disabled ? focusRingStyle : undefined,
    ) as React.CSSProperties;

    // Compose thumb style
    const thumbStyle = mergeStyles(
      thumbStyles,
      {
        position: 'absolute' as const,
        left: 0,
        transform: `translateX(${thumbTranslateX}px)`,
        transition: 'transform 150ms ease',
        pointerEvents: 'none' as const,
      },
    ) as React.CSSProperties;

    // Container style
    const containerStyle = mergeStyles(
      {
        display: 'inline-flex',
        alignItems: 'center',
        gap: containerGap,
      },
      style,
    ) as React.CSSProperties;

    return (
      <div style={containerStyle} className={className}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={handleClick}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={trackStyle}
          data-testid={testID}
        >
          <span style={thumbStyle} />
        </button>
        {label && (
          <span
            style={{
              ...labelStyles,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={disabled ? undefined : handleClick}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
