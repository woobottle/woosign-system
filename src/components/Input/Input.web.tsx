/**
 * Input component - Web implementation
 * Pure React + inline styles (no react-native-web)
 */

import React, { forwardRef, useState, useCallback } from 'react';
import type { InputWebProps } from './types';
import {
  inputContainerVariants,
  inputTextVariants,
  placeholderColor,
  focusContainerStyle,
  disabledStyle,
} from './Input.styles';
import { mergeStyles } from '../../core/variants';

/**
 * Input component for web
 */
export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputWebProps>(
  function Input(
    {
      variant = 'default',
      size = 'default',
      placeholder,
      value,
      defaultValue,
      disabled = false,
      readOnly = false,
      onChangeText,
      onFocus,
      onBlur,
      onSubmitEditing,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      style,
      testID,
      type = 'text',
      name,
      id,
      required,
      pattern,
      min,
      max,
      step,
      autoCapitalize,
      autoCorrect,
      autoFocus,
      maxLength,
      multiline = false,
      numberOfLines,
      inputProps,
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);

    const userOnChange = inputProps?.onChange;
    const userOnKeyDown = inputProps?.onKeyDown;
    const userOnFocus = inputProps?.onFocus;
    const userOnBlur = inputProps?.onBlur;

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocused(true);
        onFocus?.();
        (userOnFocus as ((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | undefined)?.(e);
      },
      [onFocus, userOnFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsFocused(false);
        onBlur?.();
        (userOnBlur as ((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | undefined)?.(e);
      },
      [onBlur, userOnBlur]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChangeText?.(e.currentTarget.value);
        (userOnChange as ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | undefined)?.(e);
      },
      [onChangeText, userOnChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !multiline && onSubmitEditing) {
          onSubmitEditing();
        }
        (userOnKeyDown as ((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | undefined)?.(e);
      },
      [multiline, onSubmitEditing, userOnKeyDown]
    );

    // Get variant styles
    const containerStyles = inputContainerVariants({ variant, size }) as React.CSSProperties;
    const textStyles = inputTextVariants({ variant, size }) as React.CSSProperties;

    // Compose container styles
    const containerStyle = mergeStyles(
      containerStyles,
      fullWidth ? { width: '100%' } : undefined,
      (disabled || readOnly) ? disabledStyle : undefined,
      isFocused && !disabled ? focusContainerStyle : undefined,
      { transition: 'all 150ms ease' },
      style
    ) as React.CSSProperties;

    // Input styles
    const inputStyle: React.CSSProperties = {
      ...textStyles,
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      padding: 0,
      margin: 0,
      width: '100%',
      fontFamily: 'inherit',
    };

    // Icon container styles
    const iconStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: placeholderColor,
    };

    // Common props for input/textarea.
    // `inputProps` is spread first so user-provided pass-through props
    // (onPaste, onCompositionStart, data-*, aria-*, ...) apply, then internal
    // props/handlers override to keep variant behavior intact. The four
    // chained handlers above already invoke the user-supplied versions.
    const commonProps = {
      ...inputProps,
      placeholder,
      value,
      defaultValue,
      disabled,
      readOnly,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      name,
      id,
      required,
      maxLength,
      autoFocus,
      autoCapitalize,
      autoCorrect: autoCorrect ? 'on' : 'off',
      style: inputStyle,
      'data-testid': testID,
    };

    return (
      <div className={className} style={containerStyle}>
        {leftIcon && <span style={iconStyle}>{leftIcon}</span>}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={numberOfLines ?? 3}
            {...commonProps}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            pattern={pattern}
            min={min}
            max={max}
            step={step}
            {...commonProps}
          />
        )}
        {rightIcon && <span style={iconStyle}>{rightIcon}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
