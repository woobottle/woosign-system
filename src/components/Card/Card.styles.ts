/**
 * Card styles — WooBottle surfaces
 *
 * Cards are 12px-rounded white islands on the cream canvas with a soft,
 * layered shadow. Borders are a last resort — prefer surface change + spacing
 * before reaching for a line.
 */

import {createVariants} from '../../core/variants';
import {
  spacing,
  borderRadius,
  shadows,
  typography,
} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

/**
 * Card container variants
 */
export const getCardVariants = (c: Colors) =>
  createVariants({
    base: {borderRadius: borderRadius.md, backgroundColor: c.card},
    variants: {
      variant: {
        default: {backgroundColor: c.card, ...shadows.card},
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: c.borderDefault,
        },
        ghost: {backgroundColor: 'transparent'},
        warm: {backgroundColor: c.reward, ...shadows.card},
        ceramic: {backgroundColor: c.section},
        inverse: {backgroundColor: c.inverse, borderRadius: borderRadius.lg},
        forest: {
          backgroundColor: c.actionForest,
          borderRadius: borderRadius.lg,
        },
      },
    },
    defaultVariants: {variant: 'default'},
  });

/**
 * Card header styles
 */
export const cardHeaderStyle = {
  display: 'flex' as const,
  flexDirection: 'column' as const,
  gap: spacing[1.5],
  padding: spacing[4],
  paddingBottom: 0,
};

/**
 * Card title styles — WooBottle heading-md, brand ink
 */
export const getCardTitleStyle = (c: Colors) => ({
  fontFamily: typography.fontFamily.sans,
  fontSize: typography.fontSize.headingMd.size,
  fontWeight: typography.fontWeight.semibold,
  lineHeight: typography.fontSize.headingMd.lineHeight,
  letterSpacing: typography.letterSpacing.tight,
  color: c.textBrand,
});

/**
 * Card description styles — secondary ink
 */
export const getCardDescriptionStyle = (c: Colors) => ({
  fontFamily: typography.fontFamily.sans,
  fontSize: typography.fontSize.bodySm.size,
  lineHeight: typography.fontSize.bodySm.lineHeight,
  letterSpacing: typography.letterSpacing.tight,
  color: c.textSecondary,
});

/**
 * Card content styles
 */
export const cardContentStyle = {
  padding: spacing[4],
};

/**
 * Card footer styles
 */
export const cardFooterStyle = {
  display: 'flex' as const,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  padding: spacing[4],
  paddingTop: 0,
};

/**
 * Hover styles for web (when interactive)
 */
export const hoverStyle: React.CSSProperties = {
  opacity: 0.95,
};

/**
 * Pressed style for native — tactile squeeze per spec
 */
export const pressedStyle = {
  transform: [{scale: 0.99}],
};

/**
 * Disabled style
 */
export const disabledStyle = {
  opacity: 0.5,
};
