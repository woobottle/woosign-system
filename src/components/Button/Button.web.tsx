/**
 * Button component - Web implementation
 * Pure React + inline styles (no react-native-web)
 */

import React, { forwardRef, useState, useCallback } from 'react';
import type { ButtonWebProps } from './types';
import {
  buttonVariants,
  buttonTextVariants,
  hoverStyles,
  focusRingStyle,
  disabledStyle,
} from './Button.styles';
import { mergeStyles } from '../../core/variants';

/**
 * Simple loading spinner for web
 */
function LoadingSpinner({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      style={{
        animation: 'wds-spin 1s linear infinite',
      }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>
        {`
          @keyframes wds-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </svg>
  );
}

/**
 * Button component for web
 */
export const Button = forwardRef<HTMLButtonElement, ButtonWebProps>(
  function Button(
    {
      variant = 'default',
      size = 'default',
      children,
      disabled = false,
      loading = false,
      onPress,
      fullWidth = false,
      leftIcon,
      rightIcon,
      type = 'button',
      className,
      style,
      testID,
    },
    ref
  ) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = useCallback(() => {
      if (!disabled && !loading && onPress) {
        onPress();
      }
    }, [disabled, loading, onPress]);

    // Get variant styles
    const containerStyles = buttonVariants({ variant, size }) as React.CSSProperties;
    const textStyles = buttonTextVariants({ variant, size }) as React.CSSProperties;

    // Determine spinner color
    const spinnerColor = ['default', 'destructive'].includes(variant)
      ? '#F8FAFC'
      : '#0F172A';

    // Compose final button styles
    const buttonStyle = mergeStyles(
      containerStyles,
      fullWidth ? { width: '100%' } : undefined,
      (disabled || loading) ? { ...disabledStyle, cursor: 'not-allowed' } : { cursor: 'pointer' },
      isHovered && !disabled && !loading ? hoverStyles[variant] : undefined,
      isFocused && !disabled ? focusRingStyle : undefined,
      isPressed && !disabled ? { transform: 'scale(0.98)' } : undefined,
      { transition: 'all 150ms ease' },
      style
    ) as React.CSSProperties;

    // Text style
    const labelStyle: React.CSSProperties = {
      ...textStyles,
      margin: 0,
      padding: 0,
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={className}
        style={buttonStyle}
        data-testid={testID}
      >
        {loading ? (
          <LoadingSpinner color={spinnerColor} />
        ) : (
          <>
            {leftIcon}
            {children && <span style={labelStyle}>{children}</span>}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
