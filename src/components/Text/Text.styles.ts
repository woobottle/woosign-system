/**
 * Text styles using the variant system
 * shadcn/ui Typography inspired
 */

import { createVariants } from '../../core/variants';
import { colors, typography } from '../../core/theme/tokens';

/**
 * Text variants
 * Based on shadcn/ui typography: https://ui.shadcn.com/docs/components/typography
 */
export const textVariants = createVariants({
  base: {
    color: colors.foreground,
    fontFamily: typography.fontFamily.sans,
  },
  variants: {
    variant: {
      h1: {
        fontSize: typography.fontSize['4xl'].size,
        lineHeight: typography.fontSize['4xl'].lineHeight,
        fontWeight: typography.fontWeight.extrabold,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: typography.fontSize['3xl'].size,
        lineHeight: typography.fontSize['3xl'].lineHeight,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: -0.25,
      },
      h3: {
        fontSize: typography.fontSize['2xl'].size,
        lineHeight: typography.fontSize['2xl'].lineHeight,
        fontWeight: typography.fontWeight.semibold,
      },
      h4: {
        fontSize: typography.fontSize.xl.size,
        lineHeight: typography.fontSize.xl.lineHeight,
        fontWeight: typography.fontWeight.semibold,
      },
      p: {
        fontSize: typography.fontSize.base.size,
        lineHeight: typography.fontSize.base.lineHeight,
        fontWeight: typography.fontWeight.normal,
      },
      lead: {
        fontSize: typography.fontSize.xl.size,
        lineHeight: typography.fontSize.xl.lineHeight,
        fontWeight: typography.fontWeight.normal,
        color: colors.mutedForeground,
      },
      large: {
        fontSize: typography.fontSize.lg.size,
        lineHeight: typography.fontSize.lg.lineHeight,
        fontWeight: typography.fontWeight.semibold,
      },
      small: {
        fontSize: typography.fontSize.sm.size,
        lineHeight: typography.fontSize.sm.lineHeight,
        fontWeight: typography.fontWeight.medium,
      },
      muted: {
        fontSize: typography.fontSize.sm.size,
        lineHeight: typography.fontSize.sm.lineHeight,
        fontWeight: typography.fontWeight.normal,
        color: colors.mutedForeground,
      },
    },
    weight: {
      normal: { fontWeight: typography.fontWeight.normal },
      medium: { fontWeight: typography.fontWeight.medium },
      semibold: { fontWeight: typography.fontWeight.semibold },
      bold: { fontWeight: typography.fontWeight.bold },
    },
    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

/**
 * Get default HTML element for variant
 */
export function getDefaultElement(
  variant: string
): 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'p':
    case 'lead':
      return 'p';
    default:
      return 'span';
  }
}
