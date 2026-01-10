/**
 * Box component - Web implementation
 */

import React, { forwardRef } from 'react';
import type { BoxWebProps, BorderRadiusPreset } from './types';
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
 * Box component for web
 */
export const Box = forwardRef<HTMLDivElement, BoxWebProps>(function Box(
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
    flexDirection,
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
    className,
    style,
    as: Element = 'div',
    testID,
  },
  ref
) {
  const boxStyle: React.CSSProperties = {
    // Flexbox defaults
    display: 'flex',
    flexDirection: flexDirection || 'column',

    // Padding
    padding,
    paddingLeft: paddingLeft ?? paddingX,
    paddingRight: paddingRight ?? paddingX,
    paddingTop: paddingTop ?? paddingY,
    paddingBottom: paddingBottom ?? paddingY,

    // Margin
    margin,
    marginLeft: marginLeft ?? marginX,
    marginRight: marginRight ?? marginX,
    marginTop: marginTop ?? marginY,
    marginBottom: marginBottom ?? marginY,

    // Flexbox
    flex,
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
    borderStyle: borderWidth ? 'solid' : undefined,

    // Size
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,

    // Merge custom styles
    ...style,
  };

  // Remove undefined values
  const cleanStyle = Object.fromEntries(
    Object.entries(boxStyle).filter(([, v]) => v !== undefined)
  ) as React.CSSProperties;

  return React.createElement(
    Element,
    {
      ref,
      className,
      style: cleanStyle,
      'data-testid': testID,
    },
    children
  );
});

Box.displayName = 'Box';
