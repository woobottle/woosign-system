/**
 * Card component - React Native implementation
 */

import { forwardRef, useCallback } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import type {
  CardNativeProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './types';
import {
  cardVariants,
  cardHeaderStyle,
  cardTitleStyle,
  cardDescriptionStyle,
  cardContentStyle,
  cardFooterStyle,
  pressedStyle,
  disabledStyle,
} from './Card.styles';

/**
 * Card component for React Native
 */
export const Card = forwardRef<View, CardNativeProps>(
  function Card(
    {
      variant = 'default',
      children,
      fullWidth = false,
      onPress,
      disabled = false,
      style,
      testID,
    },
    ref
  ) {
    const handlePress = useCallback(() => {
      if (!disabled && onPress) {
        onPress();
      }
    }, [disabled, onPress]);

    // Get variant styles
    const containerStyles = cardVariants({ variant });

    // If interactive (has onPress), wrap in Pressable
    if (onPress) {
      return (
        <Pressable
          ref={ref}
          onPress={handlePress}
          disabled={disabled}
          testID={testID}
          style={({ pressed }) => [
            containerStyles,
            fullWidth && styles.fullWidth,
            disabled && disabledStyle,
            pressed && pressedStyle,
            style,
          ]}
        >
          {children}
        </Pressable>
      );
    }

    return (
      <View
        ref={ref}
        testID={testID}
        style={[
          containerStyles,
          fullWidth && styles.fullWidth,
          disabled && disabledStyle,
          style,
        ]}
      >
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader component
 */
export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[cardHeaderStyle, style as ViewStyle]}>{children}</View>;
}

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component
 */
export function CardTitle({ children, style }: CardTitleProps) {
  return (
    <Text style={[cardTitleStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component
 */
export function CardDescription({ children, style }: CardDescriptionProps) {
  return (
    <Text style={[cardDescriptionStyle, style as TextStyle]}>
      {children}
    </Text>
  );
}

CardDescription.displayName = 'CardDescription';

/**
 * CardContent component
 */
export function CardContent({ children, style }: CardContentProps) {
  return <View style={[cardContentStyle, style as ViewStyle]}>{children}</View>;
}

CardContent.displayName = 'CardContent';

/**
 * CardFooter component
 */
export function CardFooter({ children, style }: CardFooterProps) {
  return <View style={[cardFooterStyle, style as ViewStyle]}>{children}</View>;
}

CardFooter.displayName = 'CardFooter';

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
});
