/**
 * Input component - Web implementation
 * Pure React + inline styles (no react-native-web)
 */

import React, {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import type {InputWebProps} from './types';
import {
  inputContainerVariants,
  inputTextVariants,
  placeholderColor,
  focusContainerStyle,
  disabledStyle,
} from './Input.styles';
import {mergeStyles} from '../../core/variants';
import {spacing, zIndex} from '../../core/theme/tokens';
import {Calendar} from './Calendar.web';

/**
 * Input component for web
 */
export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputWebProps
>(function Input(
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
  ref,
) {
  const [isFocused, setIsFocused] = useState(false);
  const isDateType = type === 'date';
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDateType || !isPickerOpen) {
      return;
    }
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isDateType, isPickerOpen]);

  const handleCalendarChange = useCallback(
    (newValue: string) => {
      onChangeText?.(newValue);
      setIsPickerOpen(false);
    },
    [onChangeText],
  );

  const userOnChange = inputProps?.onChange;
  const userOnKeyDown = inputProps?.onKeyDown;
  const userOnFocus = inputProps?.onFocus;
  const userOnBlur = inputProps?.onBlur;

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (isDateType) {
        setIsPickerOpen(true);
      }
      onFocus?.();
      (
        userOnFocus as
          | ((
              e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => void)
          | undefined
      )?.(e);
    },
    [isDateType, onFocus, userOnFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.();
      (
        userOnBlur as
          | ((
              e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => void)
          | undefined
      )?.(e);
    },
    [onBlur, userOnBlur],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChangeText?.(e.currentTarget.value);
      (
        userOnChange as
          | ((
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => void)
          | undefined
      )?.(e);
    },
    [onChangeText, userOnChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !multiline && onSubmitEditing) {
        onSubmitEditing();
      }
      (
        userOnKeyDown as
          | ((
              e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => void)
          | undefined
      )?.(e);
    },
    [multiline, onSubmitEditing, userOnKeyDown],
  );

  // Get variant styles
  const containerStyles = inputContainerVariants({
    variant,
    size,
  }) as React.CSSProperties;
  const textStyles = inputTextVariants({variant, size}) as React.CSSProperties;

  // Compose container styles
  const containerStyle = mergeStyles(
    containerStyles,
    fullWidth ? {width: '100%'} : undefined,
    disabled || readOnly ? disabledStyle : undefined,
    isFocused && !disabled ? focusContainerStyle : undefined,
    {transition: 'all 150ms ease'},
    isDateType ? {position: 'relative'} : undefined,
    style,
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
    <div ref={containerRef} className={className} style={containerStyle}>
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
          type={isDateType ? 'text' : type}
          pattern={pattern}
          min={isDateType ? undefined : min}
          max={isDateType ? undefined : max}
          step={step}
          {...commonProps}
        />
      )}
      {rightIcon && <span style={iconStyle}>{rightIcon}</span>}
      {isDateType && isPickerOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: spacing[1],
            zIndex: zIndex.popover,
          }}>
          <Calendar
            value={typeof value === 'string' ? value : undefined}
            onChange={handleCalendarChange}
            min={typeof min === 'string' ? min : undefined}
            max={typeof max === 'string' ? max : undefined}
          />
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
