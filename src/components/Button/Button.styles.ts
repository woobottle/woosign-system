/**
 * Button styles — WooBottle "Paper & Ink"
 *
 * Buttons are ALWAYS full-pill. Hierarchy comes from color role, not shape.
 * Press state is a tactile squeeze (scale 0.95), 200ms calm ease.
 */

import {createVariants} from '../../core/variants';
import {
  spacing,
  borderRadius,
  typography,
  shadowsCss,
  whiteAlpha,
} from '../../core/theme/tokens';
import type {Colors} from '../../core/theme/types';

/**
 * Button container variants
 *
 * Padding per spec: sm 8/16, default 10/18, lg 12/20.
 * All variants share the same pill radius.
 */
export const getButtonVariants = (c: Colors) =>
  createVariants({
    base: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.pill,
      borderWidth: 1,
      borderColor: 'transparent',
      gap: spacing[2],
    },
    variants: {
      variant: {
        default: {
          backgroundColor: c.actionPrimary,
          borderColor: c.actionPrimary,
        },
        destructive: {
          backgroundColor: c.actionDanger,
          borderColor: c.actionDanger,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: c.actionPrimary,
        },
        secondary: {
          backgroundColor: c.card,
          borderColor: c.borderDefault,
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        dark: {
          backgroundColor: c.actionDark,
          borderColor: c.actionDark,
        },
        inverse: {
          backgroundColor: 'transparent',
          borderColor: c.borderInverse,
        },
        link: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        forest: {
          backgroundColor: c.actionForest,
          borderColor: c.actionForest,
        },
      },
      size: {
        default: {
          height: 40,
          paddingLeft: 18,
          paddingRight: 18,
        },
        sm: {
          height: 36,
          paddingLeft: 16,
          paddingRight: 16,
        },
        lg: {
          height: 48,
          paddingLeft: 20,
          paddingRight: 20,
        },
        icon: {
          height: 40,
          width: 40,
          paddingLeft: 0,
          paddingRight: 0,
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
 *
 * Semibold label, tight tracking, sentence case (casing is copy-side only).
 */
export const getButtonTextVariants = (c: Colors) =>
  createVariants({
    base: {
      fontWeight: typography.fontWeight.semibold,
      fontSize: typography.fontSize.bodySm.size,
      lineHeight: typography.fontSize.bodySm.lineHeight,
      letterSpacing: typography.letterSpacing.tight,
      textAlign: 'center',
    },
    variants: {
      variant: {
        default: {
          color: c.textInverse,
        },
        destructive: {
          color: c.textInverse,
        },
        outline: {
          color: c.actionPrimary,
        },
        secondary: {
          color: c.textPrimary,
        },
        ghost: {
          color: c.actionPrimary,
        },
        dark: {
          color: c.textInverse,
        },
        inverse: {
          color: c.textInverse,
        },
        link: {
          color: c.actionPrimary,
          textDecorationLine: 'underline',
        },
        forest: {
          color: c.textInverse,
        },
      },
      size: {
        default: {
          fontSize: typography.fontSize.bodySm.size,
        },
        sm: {
          fontSize: typography.fontSize.caption.size,
        },
        lg: {
          fontSize: typography.fontSize.bodyMd.size,
        },
        icon: {
          fontSize: typography.fontSize.bodySm.size,
        },
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  });

/**
 * Hover styles (web only). "Hover is for promise, not drama" — no lift or scale.
 */
export const getHoverStyles = (
  c: Colors,
): Record<string, React.CSSProperties> => ({
  default: {
    backgroundColor: c.actionPrimaryHover,
    borderColor: c.actionPrimaryHover,
  },
  destructive: {opacity: 0.9},
  outline: {backgroundColor: c.successTint},
  secondary: {backgroundColor: c.section},
  ghost: {backgroundColor: c.successTint},
  dark: {backgroundColor: '#000000', borderColor: '#000000'},
  inverse: {backgroundColor: whiteAlpha[10]},
  link: {textDecoration: 'underline'},
  forest: {
    backgroundColor: c.actionForestHover,
    borderColor: c.actionForestHover,
  },
});

/**
 * Focus ring — ember 22% glow (matches wb-input:focus in colors_and_type.css)
 */
export const focusRingStyle: React.CSSProperties = {
  outline: 'none',
  boxShadow: shadowsCss.focusRing,
};

/**
 * Disabled style
 */
export const disabledStyle = {
  opacity: 0.5,
};

/**
 * Pressed style for native — a tactile squeeze per spec.
 */
export const pressedStyle = {
  opacity: 1,
  transform: [{scale: 0.95}],
};
