/**
 * Box component - React Native implementation
 */

import { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import type { BoxNativeProps, BorderRadiusPreset } from './types';
import { borderRadius as radiusTokens } from '../../core/theme/tokens';

/**
 * Convert border radius preset to number
 */
function resolveBorderRadius(
  value: number | BorderRadiusPreset | undefined
): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;

  const presetMap: Record<BorderRadiusPreset, number> = {
    none: radiusTokens.none,
    sm: radiusTokens.sm,
    md: radiusTokens.md,
    lg: radiusTokens.lg,
    xl: radiusTokens.xl,
    '2xl': radiusTokens['2xl'],
    full: radiusTokens.full,
  };

  return presetMap[value];
}

/**
 * Box component for React Native
 */
export const Box = forwardRef<View, BoxNativeProps>(function Box(
  {
    // Padding
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    // Margin
    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    // Flexbox
    flex,
    flexDirection = 'column',
    alignItems,
    justifyContent,
    flexWrap,
    gap,
    rowGap,
    columnGap,
    // Appearance
    backgroundColor,
    borderRadius,
    borderWidth,
    borderColor,
    // Size
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    // Other
    children,
    style,
    testID,
  },
  ref
) {
  const boxStyle = StyleSheet.flatten([
    styles.base,
    {
      // Padding
      padding,
      paddingHorizontal: paddingX,
      paddingVertical: paddingY,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,

      // Margin
      margin,
      marginHorizontal: marginX,
      marginVertical: marginY,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,

      // Flexbox
      flex,
      flexDirection,
      alignItems,
      justifyContent,
      flexWrap,
      gap,
      rowGap,
      columnGap,

      // Appearance
      backgroundColor,
      borderRadius: resolveBorderRadius(borderRadius),
      borderWidth,
      borderColor,

      // Size
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
    },
    style,
  ]);

  return (
    <View ref={ref} style={boxStyle} testID={testID}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    // No default styles needed
  },
});

Box.displayName = 'Box';
