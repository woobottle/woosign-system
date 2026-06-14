/**
 * Badge component - Web implementation
 * Pure React + inline styles (no react-native-web)
 */

import React, {forwardRef, useState, useMemo} from 'react';
import type {BadgeWebProps} from './types';
import {
  getBadgeVariants,
  getBadgeTextVariants,
  getHoverStyles,
} from './Badge.styles';
import {mergeStyles} from '../../core/variants';
import {cssifyWebStyles} from '../../core/utils/cssifyWebStyles';
import {useResolvedColors} from '../../core/hooks';

/**
 * Badge component for web
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeWebProps>(function Badge(
  {variant = 'default', children, className, style, testID},
  ref,
) {
  const [isHovered, setIsHovered] = useState(false);

  const colors = useResolvedColors();
  const badgeVariants = useMemo(() => getBadgeVariants(colors), [colors]);
  const badgeTextVariants = useMemo(
    () => getBadgeTextVariants(colors),
    [colors],
  );
  const hoverStyles = useMemo(() => getHoverStyles(colors), [colors]);

  // Get variant styles
  const containerStyles = badgeVariants({variant}) as React.CSSProperties;
  const textStyles = badgeTextVariants({variant}) as React.CSSProperties;

  // Compose final badge styles
  const badgeStyle = cssifyWebStyles(
    mergeStyles(
      containerStyles,
      textStyles,
      {
        display: 'inline-flex',
        alignSelf: 'center',
        width: 'fit-content',
        transition: 'all 150ms ease',
      },
      isHovered ? hoverStyles[variant] : undefined,
      style,
    ),
  ) as React.CSSProperties;

  return (
    <span
      ref={ref}
      className={className}
      style={badgeStyle}
      data-testid={testID}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
