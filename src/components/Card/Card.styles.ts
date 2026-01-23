/**
 * Card styles using the variant system
 * shadcn/ui inspired design
 */

import { createVariants } from '../../core/variants';
import { colors, spacing, borderRadius, shadows, typography } from '../../core/theme/tokens';

/**
 * Card container variants
 */
export const cardVariants = createVariants({
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    ...shadows.DEFAULT,
  },
  variants: {
    variant: {
      default: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
        shadowOpacity: 0,
        elevation: 0,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Card header styles
 */
export const cardHeaderStyle = {
  display: 'flex' as const,
  flexDirection: 'column' as const,
  gap: spacing[1.5],
  padding: spacing[6],
  paddingBottom: 0,
};

/**
 * Card title styles
 */
export const cardTitleStyle = {
  fontSize: typography.fontSize['2xl'].size,
  fontWeight: typography.fontWeight.semibold,
  lineHeight: typography.fontSize['2xl'].lineHeight,
  color: colors.cardForeground,
};

/**
 * Card description styles
 */
export const cardDescriptionStyle = {
  fontSize: typography.fontSize.sm.size,
  lineHeight: typography.fontSize.sm.lineHeight,
  color: colors.mutedForeground,
};

/**
 * Card content styles
 */
export const cardContentStyle = {
  padding: spacing[6],
};

/**
 * Card footer styles
 */
export const cardFooterStyle = {
  display: 'flex' as const,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  padding: spacing[6],
  paddingTop: 0,
};

/**
 * Hover styles for web (when interactive)
 */
export const hoverStyle: React.CSSProperties = {
  opacity: 0.95,
};

/**
 * Pressed style for native
 */
export const pressedStyle = {
  opacity: 0.9,
  transform: [{ scale: 0.99 }],
};

/**
 * Disabled style
 */
export const disabledStyle = {
  opacity: 0.5,
};
