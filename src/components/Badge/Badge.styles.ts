/**
 * Badge styles using the variant system
 * shadcn/ui inspired design
 */

import { createVariants } from '../../core/variants';
import { colors, spacing, borderRadius, typography } from '../../core/theme/tokens';

/**
 * Badge container variants
 */
export const badgeVariants = createVariants({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    paddingLeft: spacing[2.5],
    paddingRight: spacing[2.5],
    paddingTop: spacing[0.5],
    paddingBottom: spacing[0.5],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  variants: {
    variant: {
      default: {
        backgroundColor: colors.primary,
        borderColor: 'transparent',
      },
      secondary: {
        backgroundColor: colors.secondary,
        borderColor: 'transparent',
      },
      destructive: {
        backgroundColor: colors.destructive,
        borderColor: 'transparent',
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.border,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Badge text variants
 */
export const badgeTextVariants = createVariants({
  base: {
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.xs.size,
    lineHeight: typography.fontSize.xs.lineHeight,
  },
  variants: {
    variant: {
      default: {
        color: colors.primaryForeground,
      },
      secondary: {
        color: colors.secondaryForeground,
      },
      destructive: {
        color: colors.destructiveForeground,
      },
      outline: {
        color: colors.foreground,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Hover styles for web (mapped by variant)
 */
export const hoverStyles: Record<string, React.CSSProperties> = {
  default: { opacity: 0.8 },
  secondary: { opacity: 0.8 },
  destructive: { opacity: 0.8 },
  outline: { backgroundColor: colors.accent },
};
