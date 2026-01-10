/**
 * Button component - React Native implementation
 */

import { forwardRef, useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import type { ButtonNativeProps, ButtonVariant } from './types';
import {
  buttonVariants,
  buttonTextVariants,
  disabledStyle,
} from './Button.styles';
import { colors } from '../../core/theme/tokens';

/**
 * Get spinner color based on variant
 */
function getSpinnerColor(variant: ButtonVariant): string {
  switch (variant) {
    case 'default':
    case 'destructive':
      return colors.primaryForeground;
    default:
      return colors.foreground;
  }
}

/**
 * Button component for React Native
 */
export const Button = forwardRef<View, ButtonNativeProps>(
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
      style,
      textStyle,
      pressableProps,
      testID,
    },
    ref
  ) {
    const handlePress = useCallback(() => {
      if (!disabled && !loading && onPress) {
        onPress();
      }
    }, [disabled, loading, onPress]);

    // Get variant styles
    const containerStyles = buttonVariants({ variant, size });
    const labelStyles = buttonTextVariants({ variant, size });
    const spinnerColor = getSpinnerColor(variant);

    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={disabled || loading}
        testID={testID}
        style={({ pressed }) => [
          styles.base,
          containerStyles,
          fullWidth && styles.fullWidth,
          (disabled || loading) && disabledStyle,
          pressed && styles.pressed,
          style,
        ]}
        {...pressableProps}
      >
        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
          <View style={styles.content}>
            {leftIcon}
            {typeof children === 'string' ? (
              <Text style={[labelStyles, textStyle]}>{children}</Text>
            ) : (
              children
            )}
            {rightIcon}
          </View>
        )}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

Button.displayName = 'Button';
