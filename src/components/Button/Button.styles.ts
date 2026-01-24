/**
 * Button styles using the variant system
 * shadcn/ui inspired design
 */

import { createVariants } from '../../core/variants';
import { colors, spacing, borderRadius, typography } from '../../core/theme/tokens';

/**
 * Button container variants
 */
export const buttonVariants = createVariants({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 0,
    gap: spacing[2],
  },
  variants: {
    variant: {
      default: {
        backgroundColor: colors.primary,
      },
      destructive: {
        backgroundColor: colors.destructive,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.input,
      },
      secondary: {
        backgroundColor: colors.secondary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      link: {
        backgroundColor: 'transparent',
      },
    },
    size: {
      default: {
        height: 40,
        paddingLeft: spacing[4],
        paddingRight: spacing[4],
        paddingTop: spacing[2],
        paddingBottom: spacing[2],
      },
      sm: {
        height: 36,
        paddingLeft: spacing[3],
        paddingRight: spacing[3],
        borderRadius: borderRadius.sm,
      },
      lg: {
        height: 44,
        paddingLeft: spacing[8],
        paddingRight: spacing[8],
      },
      icon: {
        height: 40,
        width: 40,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * Button text variants
 */
export const buttonTextVariants = createVariants({
  base: {
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.sm.size,
    textAlign: 'center',
  },
  variants: {
    variant: {
      default: {
        color: colors.primaryForeground,
      },
      destructive: {
        color: colors.destructiveForeground,
      },
      outline: {
        color: colors.foreground,
      },
      secondary: {
        color: colors.secondaryForeground,
      },
      ghost: {
        color: colors.foreground,
      },
      link: {
        color: colors.primary,
        textDecorationLine: 'underline',
      },
    },
    size: {
      default: {
        fontSize: typography.fontSize.sm.size,
      },
      sm: {
        fontSize: typography.fontSize.xs.size,
      },
      lg: {
        fontSize: typography.fontSize.base.size,
      },
      icon: {
        fontSize: typography.fontSize.sm.size,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * Hover styles for web (mapped by variant)
 */
export const hoverStyles: Record<string, React.CSSProperties> = {
  default: { opacity: 0.9 },
  destructive: { opacity: 0.9 },
  outline: { backgroundColor: colors.accent },
  secondary: { opacity: 0.8 },
  ghost: { backgroundColor: colors.accent },
  link: { textDecoration: 'underline' },
};

/**
 * Focus ring style for web
 */
export const focusRingStyle: React.CSSProperties = {
  outline: 'none',
  boxShadow: `0 0 0 2px ${colors.background}, 0 0 0 4px ${colors.ring}`,
};

/**
 * Disabled style
 */
export const disabledStyle = {
  opacity: 0.5,
};

/**
 * Pressed style for native
 */
export const pressedStyle = {
  opacity: 0.9,
  transform: [{ scale: 0.98 }],
};
