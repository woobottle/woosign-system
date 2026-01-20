/**
 * Input component - React Native implementation
 */

import { forwardRef, useState, useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import type { InputNativeProps } from './types';
import {
  inputContainerVariants,
  inputTextVariants,
  placeholderColor,
  disabledStyle,
} from './Input.styles';

/**
 * Input component for React Native
 */
export const Input = forwardRef<TextInput, InputNativeProps>(
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
      style,
      inputStyle,
      textInputProps,
      testID,
      type = 'text',
      autoCapitalize,
      autoCorrect,
      autoFocus,
      keyboardType,
      returnKeyType,
      maxLength,
      multiline = false,
      numberOfLines,
      secureTextEntry,
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    // Get variant styles
    const containerStyles = inputContainerVariants({ variant, size });
    const textStyles = inputTextVariants({ variant, size });

    // Determine keyboard type based on input type
    const resolvedKeyboardType = keyboardType ?? getKeyboardType(type);

    // Determine if secure text entry
    const isSecure = secureTextEntry ?? type === 'password';

    return (
      <View
        style={[
          styles.container,
          containerStyles,
          fullWidth && styles.fullWidth,
          (disabled || readOnly) && disabledStyle,
          isFocused && styles.focused,
          style,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          ref={ref}
          style={[styles.input, textStyles, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          defaultValue={defaultValue}
          editable={!disabled && !readOnly}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={autoCapitalize ?? (type === 'email' ? 'none' : undefined)}
          autoCorrect={autoCorrect ?? (type === 'email' || type === 'password' ? false : undefined)}
          autoFocus={autoFocus}
          keyboardType={resolvedKeyboardType}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={isSecure}
          testID={testID}
          {...textInputProps}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
    );
  }
);

/**
 * Get keyboard type based on input type
 */
function getKeyboardType(
  type: string
): 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'url' {
  switch (type) {
    case 'email':
      return 'email-address';
    case 'number':
      return 'numeric';
    case 'tel':
      return 'phone-pad';
    case 'url':
      return 'url';
    default:
      return 'default';
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  focused: {
    borderColor: '#0F172A',
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Input.displayName = 'Input';
