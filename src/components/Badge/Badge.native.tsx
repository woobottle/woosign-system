/**
 * Badge component - React Native implementation
 */

import { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { BadgeNativeProps } from './types';
import { badgeVariants, badgeTextVariants } from './Badge.styles';

/**
 * Badge component for React Native
 */
export const Badge = forwardRef<View, BadgeNativeProps>(
  function Badge(
    {
      variant = 'default',
      children,
      style,
      textStyle,
      testID,
    },
    ref
  ) {
    // Get variant styles
    const containerStyles = badgeVariants({ variant });
    const labelStyles = badgeTextVariants({ variant });

    return (
      <View
        ref={ref}
        testID={testID}
        style={[styles.base, containerStyles, style]}
      >
        {typeof children === 'string' ? (
          <Text style={[labelStyles, textStyle]}>{children}</Text>
        ) : (
          children
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});

Badge.displayName = 'Badge';
